import React, {useContext, useEffect, useRef, useState} from 'react';
import {render} from 'react-dom';
import {notification} from 'antd';
import io from 'socket.io-client';
import MapStore from '../../../shared/stores/Map.store';
import OrderStore from '../../../shared/stores/Order.store';
import GoogleMap from '../../../shared/components/Map/GoogleMap';
import {useTranslation} from 'react-i18next';

import InfoWindowMap from '../../../shared/components/InfoWindowMap/InfoWindowMap';

import './GoogleMapRoute.less';

const AnyReactComponent = ({text}: any) => <div>{text}</div>;

declare global {
  interface Window {
    google: any;
  }
}

const openNotificationWithIcon = (type, message, description) => {
  notification[type]({
    message,
    description,
  });
};

type Prop = {
  mapId: string;
  orderSelected: any;
  config: any;
};

const GoogleMapRoute = (props: Prop): JSX.Element => {
  const mapStore = useContext(MapStore);
  const orderStore = useContext(OrderStore);
  const {t} = useTranslation('app');
  const GOOGLE_MAP = `${process.env.REACT_APP_GOOGLE_MAP}`;
  const [route, setRoute]: any = useState([]);
  let myIo;

  useEffect(() => {
    mapStore.setMapApiKey(GOOGLE_MAP);
    mapStore.drawMap();
  }, []);

  const activeSocket = () => {
    const {mapId} = props;
    const APP_SOCKET = `${process.env.REACT_APP_SOCKET}`;
    const ENV = `${process.env.REACT_APP_ENV}`;
    const STORE_VAR = `jwtGoHeavy-${ENV}`;
    const storage: any = localStorage.getItem(STORE_VAR);
    const data = JSON.parse(storage);

    myIo = io(`${APP_SOCKET}`, {
      query: {
        token: `${data.token}`,
      },
      reconnection: true,
      reconnectionDelay: 5000,
      reconnectionDelayMax: 20000,
      reconnectionAttempts: Infinity,
    });

    myIo.on('connect', onConnect);

    myIo.on('disconnect', onDisconnect);
  };

  const addMarker = (
    location: {lat: number; lng: number},
    data: any,
    withAssign: boolean = false,
    isDriver: boolean = false,
    labelAssign: string = '',
  ) => {
    if (location.lat && location.lng) {
      const latLong = new window.google.maps.LatLng(location.lat, location.lng);

      const {id, pickUpLocationAddress, driverId, fullName, email, fullMobilePhone, avatar} = data;
      const dataId = isDriver ? driverId : id;
      const marker: any = mapStore.markers.length > 0 && mapStore.markers.find(e => e.dataId === dataId);

      if (marker && marker.position !== latLong) {
        const pos = mapStore.markers.indexOf(marker);
        mapStore.markers[pos].newMarker.setPosition(location);
      } else if (marker && marker.position === latLong) {
        return;
      } else {
        const img = {
          url: require(`../../../images/map/${isDriver ? 'driver' : 'pickup'}.png`),
          size: new window.google.maps.Size(50, 60),
          scaledSize: new window.google.maps.Size(50, 60),
        };
        const newMarker = new window.google.maps.Marker({
          position: latLong,
          map: mapStore.map,
          draggable: false,
          icon: img,
          title: `${isDriver ? fullName : pickUpLocationAddress}`,
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: '<div id="infoWindow" />',
        });
        const infoComp = <InfoWindowMap withAssign={withAssign} data={data} />;
        infoWindow.addListener('domready', () => {
          render(infoComp, document.getElementById('infoWindow'));
        });

        newMarker.addListener('click', () => {
          infoWindow.open(mapStore.map, newMarker);
        });

        mapStore.markers.push({dataId, newMarker});
      }
    }
  };

  const onDriversCurrentLocation = dat => {
    if (JSON.parse(dat).message && JSON.parse(dat).message.position && JSON.parse(dat).message.driverObj) {
      const lat = parseFloat(JSON.parse(dat).message.position.coordinates[1]);
      const lng = parseFloat(JSON.parse(dat).message.position.coordinates[0]);
      const driverObj = JSON.parse(dat).message.driverObj;
      const localization: any = {lat, lng};
      mapStore.setLocalizationDriver(localization);
      if (props.orderSelected.driverId === driverObj.driverId) {
        mapStore.isConnectSocket && addMarker(localization, driverObj, false, true);
      }
    }
  };

  const onConnect = () => {
    mapStore.setIsConnectSocket(true);
    myIo.on('MESSAGE', data => {
      onDriversCurrentLocation(data);
    });
  };

  const onDisconnect = () => {
    mapStore.setIsConnectSocket(false);
    myIo && myIo.disconnect(true);
    // myIo && myIo.close();
  };

  useEffect(() => {
    const points =
      props.orderSelected && props.orderSelected.route && props.orderSelected.route.data
        ? props.orderSelected.route.data.split(',')
        : [];
    const routeTmp: any = [];
    // Build Polyline array
    points.forEach(item => {
      const point = item.split(' ');
      routeTmp.push({lat: +point[1], lng: +point[0]});
    });
    setRoute(route);

    if (routeTmp.length > 0) {
      if (typeof window.google !== 'undefined') {
        // Create Polyline
        mapStore.createPolyLine(routeTmp);
      }
    }
    // Add marker
    if (props.config) {
      if (
        props.config.tab === 'ongoingOrders' &&
        props.orderSelected !== undefined &&
        JSON.stringify(props.orderSelected) !== JSON.stringify({}) &&
        props.orderSelected !== 0
      ) {
        // Call socket
        activeSocket();
      } else {
        onDisconnect();
      }
    }
  }, [props.orderSelected]);

  return <GoogleMap id={props.mapId} />;
};

export default GoogleMapRoute;
