import React, {useContext, useEffect, useState} from 'react';
import {Avatar, Card, Col, Icon, List, message, Row, Spin, Tooltip} from 'antd';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import gql from 'graphql-tag';
import {useQuery} from 'react-apollo-hooks';
import InfiniteScroll from 'react-infinite-scroller';
import {useRouter} from 'rift-router';

import AppStore from '../../../shared/stores/App.store';
import appModel from '../../../shared/models/App.model';
import formatPhone from '../../../shared/utils/formatPhone';
import OrderStore from '../../../shared/stores/Order.store';
import MapStore from '../../../shared/stores/Map.store';

import avatar from '../male-avatar.svg';
import './DasboardPendingOrders.less';
import {FormatPhoneTypeEnum} from '../../../shared/enums/FormatPhoneType.enum';

const GET_LIST = gql`
  query($input: GenericFilterInput) {
    OrderList(input: $input) {
      page
      pageSize
      total
      items {
        id
        customerId
        customerFullName
        customerEmail
        customerMobilePhoneNumber
        customer {
          basicProfile {
            avatar {
              publicUrl
            }
          }
        }
        pickUpLocationPoint
      }
    }
  }
`;

const DasboardPendingOrders = observer(() => {
  const appStore = useContext(AppStore);
  const orderStore = useContext(OrderStore);
  const mapStore = useContext(MapStore);
  const router = useRouter();
  const {t} = useTranslation('app');
  const [mappedData, setMappedData] = useState([]);
  const [count, setCount] = useState(0);
  const [config, setConfig] = useState({
    pageSize: 10,
    page: 1,
    orderBy: [{field: 'deliveryStartAt', orderType: 'DESC'}, {field: 'createdAt', orderType: 'DESC'}],
    where: [{field: 'status', value: ['STATUS_BOOKED'], op: 'IN'}],
  });

  const {data, error, loading, refetch} = useQuery(GET_LIST, {
    suspend: false,
    variables: {
      input: {
        page: config.page,
        pageSize: config.pageSize,
        order: config.orderBy,
        where: config.where,
      },
    },
    fetchPolicy: 'network-only',
  });

  const updateConfig = dat => {
    setConfig({...config, ...dat});
  };

  useEffect(() => {
    // appStore.setIsLoading(true);
    const onCompleted = result => {
      // appStore.setIsLoading(false);
      // const {items, total} = dataToShow;
      const {items, total} = result.OrderList;
      let number = (config.page - 1) * config.pageSize;
      const mappedDataTmp: any = items.map(item => {
        number += 1;
        const {
          id,
          customerId,
          customerFullName,
          customerEmail,
          customerMobilePhoneNumber,
          customer,
          pickUpLocationPoint,
        } = item;
        return {
          id,
          key: number,
          customerId,
          customerFullName,
          customerEmail,
          mobile: customerMobilePhoneNumber
            ? formatPhone.formatsGeneral(customerMobilePhoneNumber, true, '1', FormatPhoneTypeEnum.NATIONAL)
            : '',
          avatar:
            customer && customer.basicProfile && customer.basicProfile.avatar
              ? customer.basicProfile.avatar.publicUrl
              : '',
          pickUpLocationPoint,
        };
      });
      const newItems = mappedData.concat(mappedDataTmp);
      setMappedData(newItems);
      setCount(total);
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
    refetch({
      input: {
        page: config.page,
        pageSize: config.pageSize,
        order: config.orderBy,
        where: config.where,
      },
    });
  };

  const handleInfiniteOnLoad = () => {
    const fetchdata = mappedData;
    appStore.setIsLoading(true);
    if (fetchdata.length >= count) {
      appStore.setIsLoading(false);
      appStore.setHasMore(false);
      return;
    }
    const pageNumber = config.page + 1;
    const pSize = 10;
    updateConfig({page: pageNumber, pageSize: pSize});
    appStore.setIsLoading(false);
  };

  const onAssign = elem => {
    orderStore.setOrderId(elem.id);
    orderStore.setOrderSelect(elem);
    orderStore.setIsDriverAvailableList(true);
    const points = elem.pickUpLocationPoint ? elem.pickUpLocationPoint.split(',')[0].split(' ') : [-87.65, 41.85];
    const location = {lat: +points[1], lng: +points[0]};
    setTimeout(() => {
      mapStore.addMarker(location, elem, false, false);
    }, 300);
    router.to('/admin/dispatcher');
  };

  return (
    <div className="dashboard-pending-orders mb-15">
      <Card>
        <h3 className="dashboard-pending-orders__title">{t('labelPendingordersList')}</h3>
        <div className="dashboard-pending-orders__infinite-container">
          <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            loadMore={handleInfiniteOnLoad}
            hasMore={!appStore.isLoading && appStore.hasMore}
            useWindow={false}
          >
            <List
              locale={{
                emptyText: <span>{`${t('msgThereAreNo')} ${t('labelMessPendingOrders')} ${t('msgToDisplay')}.`}</span>,
              }}
              dataSource={mappedData}
              renderItem={(item: any) => (
                <List.Item key={item.id}>
                  <Row type={'flex'} className="dashboard-pending-orders__row" gutter={8}>
                    <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                      <Row type={'flex'} justify={'center'}>
                        <Avatar size="large" src={item.avatar} />
                      </Row>
                    </Col>
                    <Col xs={16} sm={16} md={16} lg={16} xl={16}>
                      <Row type={'flex'} justify={'center'}>
                        <div className="dashboard-pending-orders__info">
                          <b>{item.customerFullName}</b>
                          <div className="dashboard-pending-orders__row--info">
                            <small>{item.customerEmail}</small>
                          </div>
                          <div className="dashboard-pending-orders__row--info">
                            <small>{item.mobile}</small>
                          </div>
                        </div>
                      </Row>
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                      <Row type={'flex'} justify={'center'}>
                        <Tooltip title={t('labelAssign')}>
                          <Icon
                            type="check-square"
                            style={{fontSize: '18px'}}
                            className="dashboard-pending-orders__pointer"
                            theme="twoTone"
                            twoToneColor="#0275d8"
                            onClick={() => onAssign(item)}
                          />
                        </Tooltip>
                      </Row>
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
          </InfiniteScroll>
        </div>
      </Card>
    </div>
  );
});

export default DasboardPendingOrders;
