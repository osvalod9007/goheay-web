import React, {useContext, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import gql from 'graphql-tag';
import {List, Modal, message, Spin} from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-apollo-hooks';

import AppStore from '../../../shared/stores/App.store';
import openNotificationWithIcon from '../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';
import appModel from '../../../shared/models/App.model';
import DispatcherOrderCard from './Card/DispatcherOrderCard';
import OrderStore from '../../../shared/stores/Order.store';
import DriverAvailableOrder from './AssignDriver/DriverAvailableOrder';
import {OrderStatusEnum} from '../../../shared/enums/OrderStatus.enum';
import orderModel from '../../../shared/models/Order.model';

import './DispatcherOrders.less';

const GET_LIST = gql`
  query($input: GenericFilterInput) {
    OrderList(input: $input) {
      page
      pageSize
      total
      items {
        id
        receiptNo
        totalPieces
        totalSmallSize
        totalMediumSize
        totalLargeSize
        totalHugeSize
        route {
          data
          measureTotalDistance {
            amount(unit: miles)
          }
          measureTotalDuration {
            amount(unit: hours)
          }
          gMapPolyline
        }
        totalWeightMeasure {
          amount(unit: pounds)
        }
        totalCubicDimensionMeasure {
          amount(unit: cubicFeet)
        }
        note
        pickUpContactName
        pickUpContactMobileNumberCode
        pickUpContactMobileNumber
        dropOffContactName
        dropOffContactMobileNumberCode
        dropOffContactMobileNumber
        products {
          quantity
          items {
            id
            productImage {
              publicUrl
            }
          }
        }
        customerId
        customerFullName
        customerEmail
        customerMobilePhoneNumberCode
        customerMobilePhoneNumber
        customer {
          basicProfile {
            avatar {
              publicUrl
            }
          }
        }
        pickUpLocationAddress
        pickUpGooglePlaceId
        pickUpLocationPoint
        pickUpTimeZone
        dropOffLocationAddress
        dropOffGooglePlaceId
        dropOffLocationPoint
        dropOffTimeZone
        deliveryStartAt
        deliveryEndAt
        createdAt
        status
        vehicleType {
          image {
            publicUrl
          }
        }
        driverFullName
        driverEmail
        driverMobilePhoneNumber
        driver {
          id
          basicProfile {
            avatar {
              publicUrl
            }
          }
        }
        route {
          data
        }
      }
    }
  }
`;
const confirm = Modal.confirm;

const DispatcherOrders = observer((props: any) => {
  const appStore = useContext(AppStore);
  const orderStore = useContext(OrderStore);
  const {t} = useTranslation('app');
  const [mappedData, setMappedData] = useState([]);
  const [selectedOrder, setselectedOrder] = useState();
  const [actuallyTab, setActuallyTab] = useState('pendingOrders');
  const [count, setCount] = useState(0);
  const [isScroll, setIsScroll] = useState(false);
  const {pageSize, page, where, orderBy, tab} = props.input;
  // const keywordIncluded = where[0].value !== '' ? true : false;
  const filter: any = [];
  if (where && where[0].value !== '') {
    filter.push(where[0]);
  }
  if (where && where[1]) {
    filter.push(where[1]);
  }

  const {data, error, loading, refetch} = useQuery(GET_LIST, {
    suspend: false,
    variables: {
      input: {
        page,
        pageSize,
        order:
          props.input.tab === 'pendingOrders'
            ? [{field: 'deliveryStartAt', orderType: 'DESC'}, {field: 'createdAt', orderType: 'DESC'}]
            : orderBy,
        where: filter,
      },
    },
    fetchPolicy: 'network-only',
  });

  const onCancel = async id => {
    try {
      appStore.setIsLoading(true);
      const obj = {
        input: {status: OrderStatusEnum.STATUS_CANCELED},
        id,
      };
      const idOrderUpdated: any = await orderModel.cancel({...obj});
      if (idOrderUpdated && idOrderUpdated.data.OrderUpdate.id) {
        const isPending: boolean = tab === 'pendingOrders' ? true : false;
        const msg = `${t('labelA')} ${isPending ? t('labelPending') : t('labelOngoing')} ${t('labelOrder')} ${t(
          'labelWasCanceled',
        )}.`;
        openNotificationWithIcon('success', msg, '');
        setMappedData([]);
        reFetchData();
      } else {
        openNotificationWithIcon('error', t('lavelCancelFailed'), '');
      }
      // appStore.setIsLoading(false);
    } catch (e) {
      appStore.setIsLoading(false);
      handleCatch(e, '', '');
    }
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
            case 'DUPLICITY': {
              msg = `${textType}` + keysplit + t('labelExistsPleaseChoose');
              break;
            }
            case 'INSTANCE_ALREADY_EXIST': {
              msg = `${textType}` + keysplit + t('labelExistsPleaseChoose');
              break;
            }
            case 'DOES_NOT_EXIST': {
              openNotificationWithIcon('error', `The ${textType} ${t('labelDontExist')}`, '');
              break;
            }
            case 'EMPTY_VALUE': {
              msg = `${textType}` + keysplit + t('labelNotBeEmpty');
              break;
            }
            case 'INVALID_VALUE': {
              msg = `${textType}` + keysplit + t('labelHaveInvalid');
              break;
            }
            default: {
              msg = `${value}`;
              break;
            }
          }
          if (msg !== '') {
            openNotificationWithIcon('error', msg, '');
          }
        });
      } else {
        openNotificationWithIcon('error', err.message, '');
      }
    }

    appStore.setIsLoading(false);
  };
  useEffect(() => {
    appStore.setIsLoading(true);
    const onCompleted = result => {
      appStore.setIsLoading(false);
      // const {items, total} = dataToShow;
      const {items, total} = result.OrderList;
      let number = (page - 1) * pageSize;
      const mappedDataTmp: any = items.map(item => {
        number += 1;
        const {
          id,
          receiptNo,
          totalPieces,
          totalSmallSize,
          totalMediumSize,
          totalLargeSize,
          totalHugeSize,
          totalWeight,
          totalCubicDimension,
          note,
          pickUpContactName,
          pickUpContactMobileNumberCode,
          pickUpContactMobileNumber,
          dropOffContactName,
          dropOffContactMobileNumberCode,
          dropOffContactMobileNumber,
          products,
          customerId,
          customerFullName,
          customerEmail,
          customerMobilePhoneNumberCode,
          customerMobilePhoneNumber,
          customer,
          pickUpLocationAddress,
          pickUpGooglePlaceId,
          pickUpLocationPoint,
          pickUpTimeZone,
          dropOffLocationAddress,
          dropOffGooglePlaceId,
          dropOffLocationPoint,
          dropOffTimeZone,
          deliveryDateTimeStartReal,
          deliveryDateTimeEndReal,
          createdAt,
          status,
          vehicleType,
          driverFullName,
          driverEmail,
          driverMobilePhoneNumber,
          driver,
          route,
        } = item;
        return {
          id,
          key: number,
          receiptNo,
          totalPieces,
          totalSmallSize,
          totalMediumSize,
          totalLargeSize,
          totalHugeSize,
          totalWeight,
          totalCubicDimension,
          note,
          pickUpContactName,
          pickUpContactMobileNumberCode,
          pickUpContactMobileNumber,
          dropOffContactName,
          dropOffContactMobileNumberCode,
          dropOffContactMobileNumber,
          products,
          customerId,
          customerFullName,
          customerEmail,
          customerMobilePhoneNumberCode,
          customerMobilePhoneNumber,
          customer,
          pickUpLocationAddress,
          pickUpGooglePlaceId,
          pickUpLocationPoint,
          pickUpTimeZone,
          dropOffLocationAddress,
          dropOffGooglePlaceId,
          dropOffLocationPoint,
          dropOffTimeZone,
          deliveryDateTimeStartReal,
          deliveryDateTimeEndReal,
          createdAt,
          status,
          vehicleType,
          driverFullName,
          driverEmail,
          driverMobilePhoneNumber,
          driverImage: (driver && driver.basicProfile.avatar && driver.basicProfile.avatar.publicUrl) || '',
          driverId: (driver && driver.id) || '',
          route: route ? route : '',
        };
      });
      const actuallyItems = actuallyTab === tab ? (isScroll ? mappedData : []) : [];
      isScroll && setIsScroll(false);
      const newItems = actuallyItems.concat(mappedDataTmp);
      setActuallyTab(tab);
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

  // to re-fetch data
  const reFetchData = () => {
    setselectedOrder(0); // reset selected order...
    props.updateOrderSelected(0);
    refetch({
      input: {
        page,
        pageSize,
        order:
          props.input.tab === 'pendingOrders'
            ? [{field: 'deliveryStartAt', orderType: 'DESC'}, {field: 'createdAt', orderType: 'DESC'}]
            : orderBy,
        where: filter,
      },
    }).finally(() => {
      setTimeout(() => {
        appStore.setIsLoading(false);
      }, 300);
    });
  };

  useEffect(() => {
    !orderStore.isDriverAvailableList && reFetchData();
  }, [orderStore.isDriverAvailableList]);

  useEffect(() => {
    orderStore.isFilterBy && setMappedData([]);
    orderStore.isFilterBy && orderStore.setIsFilterBy(false);
  }, [orderStore.isFilterBy]);

  useEffect(() => {
    !orderStore.isDriverAvailableList && appStore.setIsLoading(true);
    !orderStore.isDriverAvailableList && reFetchData();
  }, [props.input]);

  const handleInfiniteOnLoad = () => {
    const fetchdata = mappedData;
    setIsScroll(true);
    if (fetchdata.length >= count) {
      appStore.setIsLoading(false);
      appStore.setHasMore(false);
      setIsScroll(false);
      return;
    }
    const pageNumber = !appStore.isLoading && appStore.hasMore ? page + 1 : page;
    const pSize = 10;
    !appStore.isLoading && appStore.hasMore && props.updateConfig({page: pageNumber, pageSize: pSize});
  };

  const onselectOrder = item => {
    setselectedOrder(item.id);
    props.updateOrderSelected(item);
  };

  return !orderStore.isDriverAvailableList ? (
    <div style={{overflow: 'hidden', overflowX: 'auto'}} className="dispatcher-orders">
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
              emptyText: (
                <span>{`${t('msgThereAreNo')} ${
                  props.input.tab === 'pendingOrders' ? t('labelMessPendingOrders') : t('labelMessOngoingOrders')
                } ${t('msgToDisplay')}.`}</span>
              ),
            }}
            dataSource={mappedData}
            renderItem={(item: any) => (
              <List.Item key={item.title}>
                <DispatcherOrderCard
                  item={item}
                  tab={tab}
                  onSelectOrder={onselectOrder}
                  selectedOrder={selectedOrder}
                  updateConfig={props.updateConfig}
                  onCancel={onCancel}
                />
              </List.Item>
            )}
          >
            {appStore.isLoading && appStore.hasMore && (
              <div className="demo-loading-container">
                <Spin />
              </div>
            )}
          </List>
        </InfiniteScroll>
      </div>
    </div>
  ) : (
    <DriverAvailableOrder
      input={props.input}
      updateConfig={props.updateConfig}
      updateCountList={props.updateCountList}
    />
  );
});

export default DispatcherOrders;
