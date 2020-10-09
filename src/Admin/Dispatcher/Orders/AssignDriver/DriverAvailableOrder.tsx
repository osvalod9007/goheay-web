import React, {useContext, useEffect, useState} from 'react';
import {render} from 'react-dom';
import {observer} from 'mobx-react-lite';
import gql from 'graphql-tag';
import {Button, Col, List, message, Row, Spin} from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import {useTranslation} from 'react-i18next';
import {useMutation, useQuery} from 'react-apollo-hooks';

import AppStore from '../../../../shared/stores/App.store';
import appModel from '../../../../shared/models/App.model';

import './DriverAvailableOrder.less';
import DriverAvailableOrderCard from './Card/DriverAvailableOrderCard';
import openNotificationWithIcon from '../../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';
import OrderStore from '../../../../shared/stores/Order.store';
import MapStore from '../../../../shared/stores/Map.store';
import InfoWindowMap from '../../../../shared/components/InfoWindowMap/InfoWindowMap';
import formatPhone from '../../../../shared/utils/formatPhone';
import {useRouter} from 'rift-router';
import {FormatPhoneTypeEnum} from '../../../../shared/enums/FormatPhoneType.enum';

const GET_LIST = gql`
  query($input: DriverAvailabilityListInput!) {
    DriverAvailabilityList(input: $input) {
      page
      pageSize
      total
      items {
        id
        driver {
          basicProfile {
            avatar {
              publicUrl
            }
            fullName
            email
            mobilePhone
          }
          vehicle {
            vehicleType {
              type
            }
          }
          location
        }
      }
    }
  }
`;

const ASSIGN_MUTATION = gql`
  mutation($input: OrderAssignDriverUpdateInput!) {
    OrderAssignDriverUpdate(input: $input) {
      id
    }
  }
`;

const DriverAvailableOrder = observer((props: any) => {
  const appStore = useContext(AppStore);
  const orderStore = useContext(OrderStore);
  const mapStore = useContext(MapStore);
  const router = useRouter();
  const {t} = useTranslation('app');
  const [mappedData, setMappedData] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState();
  const [isScroll, setIsScroll] = useState(false);
  const [count, setCount] = useState(0);
  const {pageSize, page} = props.input;

  const {data, error, loading, refetch} = useQuery(GET_LIST, {
    suspend: false,
    variables: {
      input: {
        orderId: orderStore.orderId,
        page,
        pageSize,
      },
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    mapStore.removePolyLine();
    return () => {
      orderStore.setIsDriverAvailableList(false);
      props.updateConfig({page: 1, pageSize: 10});
      appStore.setHasMore(true);
    };
  }, []);

  const assignMutation = useMutation(ASSIGN_MUTATION, {
    update: (proxy, result) => {
      /* your custom update logic */
      setTimeout(() => {
        appStore.setIsLoading(true);
        const {errors} = result;
        if (!errors) {
          appStore.setUserAction({
            ...appStore.userAction,
            ...{isSaved: true, action: 'assigned'},
          });
          appStore.setIsLoading(false);
          appStore.setIsEditing(false);
          orderStore.setIsDriverAvailableList(false);
          mapStore.removePolyLine();
          mapStore.resetMapAllMarkers();
        } else {
          const messages = [];
          for (const err of errors) {
            const obj = JSON.parse(err.message);
            for (const key in obj) {
              // messages.push(obj[key]);
            }
          }
          openNotificationWithIcon('error', t('lavelSaveFailed'), messages[0]);
        }
      });
    },
  });
  const assignDriver = id => {
    appStore.setIsLoading(true);
    appStore.setUserAction({...appStore.userAction, ...{typeOfElem: 'labelDriver'}});
    assignMutation({
      variables: {
        input: {
          id,
        },
      },
    }).catch(err => {
      appStore.setIsLoading(false);
      handleCatch(err, '', '');
    });
  };

  const handleCatch = (err, values, textType) => {
    if (err && err.networkError && err.networkError.statusCode === 403) {
      appModel.logout();
      window.location.href = '/admin/login';
    } else {
      const {validation, ...others} = err.graphQLErrors[0];
      if (typeof validation === 'object') {
        Object.entries(validation).forEach(([key, value]) => {
          const obj = {};
          let msg = '';
          const splitted = key.split('.');
          const [keysplit] = splitted.slice(-1);
          switch (value) {
            default: {
              msg = `${value}`;
              break;
            }
          }

          if (keysplit === 'id') {
            msg = `${t('errorMsgValidOrderAlreadyProcessed')}`;
            openNotificationWithIcon('error', t('lavelSaveFailed'), msg);
            orderStore.setIsDriverAvailableList(false);
            mapStore.removePolyLine();
            mapStore.resetMapAllMarkers();
          } else {
            openNotificationWithIcon('error', t('lavelSaveFailed'), msg);
          }
        });
      } else {
        openNotificationWithIcon('error', t('lavelSaveFailed'), err.message);
      }
    }
  };

  useEffect(() => {
    appStore.setIsLoading(true);
    const onCompleted = result => {
      appStore.setIsLoading(false);
      const {items, total} = result.DriverAvailabilityList;
      let number = (page - 1) * pageSize;
      const mappedDataTmp: any = items.map(item => {
        if (item.driver && item.driver.location) {
          window.google && drawMarkers(item);
          number += 1;
          const {id, driver} = item;
          return {
            id,
            key: number,
            fullName: (driver.basicProfile && driver.basicProfile.fullName) || '',
            fullMobilePhone:
              driver.basicProfile && driver.basicProfile.mobilePhone
                ? formatPhone.formatsGeneral(driver.basicProfile.mobilePhone, false, '1', FormatPhoneTypeEnum.NATIONAL)
                : '',
            email: (driver.basicProfile && driver.basicProfile.email) || '',
            avatar: (driver.basicProfile && driver.basicProfile.avatar && driver.basicProfile.avatar.publicUrl) || '',
            vehicleType: (driver.vehicle && driver.vehicle.vehicleType && driver.vehicle.vehicleType.type) || '',
          };
        }
      });
      const newItems = isScroll ? mappedData.concat(mappedDataTmp) : mappedDataTmp;
      isScroll && setIsScroll(false);
      setMappedData(newItems);
      setCount(total);
      props.updateCountList(total);
    };

    const onError = paramError => {
      appStore.setIsLoading(false);
      if (paramError && paramError.networkError && paramError.networkError.statusCode === 403) {
        appModel.logout();
        window.location.href = '/admin/login';
      }
      return <div>{paramError}</div>;
    };

    if (onCompleted || onError) {
      if (onCompleted && !loading && !error) {
        onCompleted(data);
      } else if (onError && !loading && error) {
        onError(error);
      }
    }
  }, [loading, data, error]);

  const handleInfiniteOnLoad = () => {
    const fetchData = mappedData;
    setIsScroll(true);
    if (fetchData.length >= count) {
      appStore.setIsLoading(false);
      appStore.setHasMore(false);
      setIsScroll(false);
      return;
    }
    const pageNumber = !appStore.isLoading && appStore.hasMore ? page + 1 : page;
    const pSize = 10;
    !appStore.isLoading && appStore.hasMore && props.updateConfig({page: pageNumber, pageSize: pSize});
  };

  const onSelectDriver = id => {
    assignDriver(id);
  };

  const reFetchData = () => {
    refetch({
      input: {
        orderId: orderStore.orderId,
        page,
        pageSize,
      },
    }).finally(() => {
      setTimeout(() => {
        appStore.setIsLoading(false);
      }, 300);
    });
  };

  useEffect(() => {
    appStore.setIsLoading(true);
    mapStore.removePolyLine();
    mappedData.forEach((element: any) => {
      mapStore.removeMarker(element.id);
    });
    reFetchData();
  }, [props.input]);

  const drawMarkers = item => {
    const points = item.driver && item.driver.location.split(',')[0].split(' ');
    const location = {lat: +points[1], lng: +points[0]};
    const driverObj = {
      driverId: item.id,
      fullName:
        item && item.driver && item.driver.basicProfile && item.driver.basicProfile.fullName
          ? item.driver.basicProfile.fullName
          : '',
      email:
        item && item.driver && item.driver.basicProfile && item.driver.basicProfile.email
          ? item.driver.basicProfile.email
          : '',
      fullMobilePhone:
        item && item.driver && item.driver.basicProfile && item.driver.basicProfile.fullMobilePhone
          ? item.driver.basicProfile.fullMobilePhone
          : '',
      avatar:
        item && item.driver && item.driver.basicProfile && item.driver.basicProfile.avatar
          ? item.driver.basicProfile.avatar.publicUrl
          : '',
    };
    addMarker(location, driverObj, true, true);
  };

  const addMarker = (
    location: {lat: number; lng: number},
    dataObj: any,
    withAssign: boolean = false,
    isDriver: boolean = false,
    labelAssign: string = '',
  ) => {
    if (location.lat && location.lng) {
      const latLong = new window.google.maps.LatLng(location.lat, location.lng);

      const {id, pickUpLocationAddress, driverId, fullName, email, fullMobilePhone, avatar} = dataObj;
      const dataId = isDriver ? driverId : id;
      const marker: any = mapStore.markers.length > 0 && mapStore.markers.find(e => e.dataId === dataId);

      if (marker && marker.position !== latLong) {
        const pos = mapStore.markers.indexOf(marker);
        mapStore.markers[pos].newMarker.setPosition(location);
      } else if (marker && marker.position === latLong) {
        return;
      } else {
        const img = {
          url: require(`../../../../images/map/${isDriver ? 'driver' : 'pickup'}.png`),
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
        infoWindow.addListener('domready', () => {
          render(
            <InfoWindowMap withAssign={withAssign} data={dataObj} onAssign={onSelectDriver} />,
            document.getElementById('infoWindow'),
          );
        });

        newMarker.addListener('click', () => {
          infoWindow.open(mapStore.map, newMarker);
        });

        mapStore.markers.push({dataId, newMarker});
      }
    }
  };

  return (
    <div style={{overflow: 'hidden', overflowX: 'auto'}} className="driver-available-orders">
      <div className="demo-infinite-container">
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={handleInfiniteOnLoad}
          hasMore={!appStore.isLoading && appStore.hasMore}
          useWindow={false}
        >
          <List
            locale={{
              emptyText: <span>{`${t('msgThereAreNo')} ${t('labelDrivers')} ${t('msgToDisplay')}.`}</span>,
            }}
            dataSource={mappedData}
            renderItem={(item: any) => (
              <List.Item key={item.title}>
                <DriverAvailableOrderCard item={item} onSelectDriver={onSelectDriver} selectedDriver={selectedDriver} />
              </List.Item>
            )}
          ></List>
        </InfiniteScroll>
      </div>
      <Row style={{textAlign: 'left'}}>
        <Col>
          <div className="driver-available-orders__steps-action">
            <Button
              style={{marginRight: 5}}
              onClick={() => {
                orderStore.setOrderId('');
                orderStore.setIsDriverAvailableList(false);
                mapStore.removePolyLine();
                mapStore.resetMapAllMarkers();
              }}
            >
              {t('labelCancel')}
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
});

export default DriverAvailableOrder;
