import {createContext} from 'react';
import {decorate, observable, action} from 'mobx';
import openNotificationWithIcon from '../components/OpenNotificationWithIcon/OpenNotificationWithIcon';

class MapStore {
  mapApiKey: string;
  map: any;
  routePath: any;
  directionsDisplay: any;
  directionsService: any;
  markers: any[];
  markersTwo: any[];
  myIo: any;
  localizationDriver: any;
  isConnectSocket: boolean;

  constructor() {
    this.mapApiKey = '';
    this.map = null;
    this.routePath = null;
    this.directionsDisplay = null;
    this.directionsService = null;
    this.markers = [];
    this.markersTwo = [];
    this.localizationDriver = undefined;
    this.isConnectSocket = false;
  }

  setMapApiKey(key) {
    this.mapApiKey = key;
  }

  setMap(map) {
    this.map = map;
  }

  setRoutePath(newRoute) {
    this.routePath = newRoute;
  }

  setMarkers(markers) {
    this.markers = markers;
  }

  setLocalizationDriver(loc) {
    this.localizationDriver = loc;
  }

  setIsConnectSocket(isConnect) {
    this.isConnectSocket = isConnect;
  }

  drawMap = () => {
    if (!window.google) {
      const script: any = document.createElement(`script`);
      script.type = `text/javascript`;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.mapApiKey}&  libraries=places`;
      const headScript: any = document.getElementsByTagName(`script`)[0];
      headScript && (headScript as any).parentNode.insertBefore(script, headScript);
      script.addEventListener(`load`, this.initMap);
    } else {
      this.initMap();
    }
    if (window.google === undefined) {
      // openNotificationWithIcon('error', 'Services Error', 'Google services are not available. Try again.');
      return;
    }
  };

  initMap = () => {
    const mapElement = document.getElementById('google-map-test');
    if (!mapElement || typeof window.google === 'undefined') {
      console.log('Google map libraries have not been loaded yet');
      openNotificationWithIcon('error', 'Services Error', 'Google services are not available. Try again.');
      return;
    }
    const pos = {lat: 41.85, lng: -87.65};
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        pos.lat = position.coords.latitude;
        pos.lng = position.coords.longitude;
      });
    }
    this.setMap(
      new window.google.maps.Map(document.getElementById('google-map-test'), {
        zoom: 12,
        center: pos,
      }),
    );
  };

  mapCenter = (location: {lat: number; lng: number}) => {
    this.map.setCenter(location);
  };

  createPolyLine = (coordinates: any[], invert: boolean = false) => {
    const initLineSymbol = {
      path: window.google.maps.SymbolPath.CIRCLE,
    };
    const endLineSymbol = {
      path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    };
    this.removePolyLine();
    this.setRoutePath(
      new window.google.maps.Polyline({
        path: coordinates,
        icons: [
          {
            icon: initLineSymbol,
            offset: '0%',
          },
          {
            icon: endLineSymbol,
            offset: '100%',
          },
        ],
        geodesic: true,
        strokeColor: '#0275d8',
        strokeOpacity: 1.0,
        strokeWeight: 2,
      }),
    );

    this.addPolyLine();
    this.mapCenter(coordinates[0]);
  };

  addPolyLine() {
    this.routePath.setMap(this.map);
  }

  removePolyLine() {
    this.routePath && this.routePath.setMap(null);
  }

  createPolygon = (coordinates: [[number, number]], invert: boolean = false) => {
    const poly = new window.google.maps.Polygon({
      paths: coordinates.map(c => ({lat: invert ? c[1] : c[0], lng: invert ? c[0] : c[1]})),
      strokeColor: '#FF0000', // #FF0000 #0000FF
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: '#FF0000',
      fillOpacity: 0.26, // 0.35
      clickable: true,
      editable: true,
    });
    poly.setMap(this.map);
  };

  addMarker = (
    location: {lat: number; lng: number},
    data: any,
    withAssign: boolean = false,
    isDriver: boolean = false,
    labelAssign: string = '',
  ) => {
    const notMap = !window.google;
    if (notMap) {
      this.drawMap();
    }

    setTimeout(
      () => {
        if (location.lat && location.lng && window.google) {
          console.log(`draw`);
          const latLong = new window.google.maps.LatLng(location.lat, location.lng);

          const {id, pickUpLocationAddress, driverId, fullName, email, fullMobilePhone, avatar} = data;
          const dataId = isDriver ? driverId : id;
          const marker: any = this.markers.length > 0 && this.markers.find(e => e.dataId === dataId);

          if (navigator.geolocation) {
            const posi = {lat: 41.85, lng: -87.65};
            navigator.geolocation.getCurrentPosition(position => {
              posi.lat = position.coords.latitude;
              posi.lng = position.coords.longitude;
            });
            this.map.setCenter(location);
          } else {
            this.map.setCenter(location);
          }

          if (marker && marker.position !== latLong) {
            const pos = this.markers.indexOf(marker);
            this.markers[pos].newMarker.setPosition(location);
          } else if (marker && marker.position === latLong) {
            return;
          } else {
            const img = {
              url: require(`../../images/map/${isDriver ? 'driver' : 'pickup'}.png`),
              size: new window.google.maps.Size(50, 60),
              scaledSize: new window.google.maps.Size(50, 60),
            };
            const newMarker = new window.google.maps.Marker({
              position: latLong,
              map: this.map,
              draggable: false,
              icon: img,
              title: `${isDriver ? fullName : pickUpLocationAddress}`,
            });

            this.markers.push({dataId, newMarker});
          }
        }
      },
      notMap ? 300 : 0,
    );
  };

  removeMarker = dataId => {
    if (this.markers.length > 0 && this.markers.find(e => e.dataId === dataId)) {
      const marker = this.markers.find(e => e.dataId === dataId);
      marker.newMarker.setMap(null);
    }
  };

  resetMapAllMarkers = () => {
    this.markers.forEach(marker => marker.newMarker.setMap(null));
    this.markers = [];
  };
}

decorate(MapStore, {
  mapApiKey: observable,
  map: observable,
  markers: observable,
  localizationDriver: observable,
  isConnectSocket: observable,
  setMapApiKey: action,
  setMap: action,
  setMarkers: action,
  setLocalizationDriver: action,
  setIsConnectSocket: action,
});

export default createContext(new MapStore());
