import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Col, Divider, Form, Input, Row, Tabs} from 'antd';
import {useTranslation} from 'react-i18next';

import HeadTitle from '../../HeadTitle/HeadTitle';

import AppStore from '../../../stores/App.store';

import OrderStore from '../../../stores/Order.store';
import MapStore from '../../../stores/Map.store';

import './DispatcherHoc.less';
import openNotificationWithIcon from '../../OpenNotificationWithIcon/OpenNotificationWithIcon';

type dataComponentType = {
  headIcon: string;
  headTitle: string;
  createPermissions: any[];
  linkToCreate: string;
  labelAdd: string;
  labelItem: string;
  isFormModal: boolean;
  isUseKeyword?: boolean;
  isRefresh?: boolean;
};

const dispatcherHoc = ({WrappedComponent, WrappedMapComponent}, dataComponent: dataComponentType) => () => {
  const appStore = useContext(AppStore);
  const orderStore = useContext(OrderStore);
  const mapStore = useContext(MapStore);
  const {t} = useTranslation('app');
  const [config, setConfig] = useState({
    pageSize: 10,
    page: 1,
    orderBy: [{field: 'id', orderType: 'DESC'}],
    where: [{field: 'keyword', value: '', op: 'CONTAIN'}, {field: 'status', value: ['STATUS_BOOKED'], op: 'IN'}],
    tab: 'pendingOrders',
    isRefresh: false,
  });
  const [countList, setCountList] = useState(0);
  const [orderSelected, setOrderSelected] = useState();

  const updateConfig = data => {
    setConfig({...config, ...data});
  };

  const onSearch = keyword => {
    const filter =
      config.where && config.where[1]
        ? [{field: 'keyword', value: keyword, op: 'CONTAIN'}, config.where[1]]
        : [{field: 'keyword', value: keyword, op: 'CONTAIN'}];
    keyword && config.where && config.where[1] && orderStore.setIsFilterBy(true);
    setConfig({...config, ...{page: 1, where: filter}});
  };

  useEffect(() => {
    // cause effect when create or update elem
    let msg = '';
    if (appStore.userAction.isSaved) {
      msg = `${
        appStore.userAction.action === 'created'
          ? t('labelANew')
          : appStore.userAction.isUndefinedArticle
          ? t('labelAn')
          : t('labelA')
      } ${t(appStore.userAction.typeOfElem)} ${
        appStore.userAction.action === 'created'
          ? t('labelWasCreated')
          : appStore.userAction.action === 'unassigned'
          ? t('labelWasUnAssigned')
          : appStore.userAction.action === 'assigned'
          ? t('labelWasAssigned')
          : t('labelWasUpdated')
      }.`;
      openNotificationWithIcon('success', msg, '');
      appStore.setUserAction({isSaved: false, action: '', typeOfElem: ''});
    }
  }, [appStore.userAction]);

  // Trigger changes in config object
  useEffect(() => {
    // code here
  }, [config]);

  useEffect(() => {
    // delete from map and reset selected order
    updateOrderSelected({});
    mapStore.removePolyLine();
  }, [orderStore.isDriverAvailableList]);

  const setTab = key => {
    // delete polyline of route
    mapStore.removePolyLine();
    // delete all markers
    mapStore.resetMapAllMarkers();
    let onTab;
    switch (key) {
      case 'ongoingOrders': {
        onTab = {
          field: 'status',
          value: [
            'STATUS_STARTED',
            'STATUS_ARRIVED',
            'STATUS_CHECKED',
            'STATUS_LOADING',
            'STATUS_LOADED',
            'STATUS_PICKED_UP',
            'STATUS_UNLOADING',
            'STATUS_UNLOADED',
          ],
          op: 'IN',
        };
        break;
      }
      default: {
        mapStore.setIsConnectSocket(false);
        onTab = {field: 'status', value: ['STATUS_BOOKED'], op: 'IN'};
        break;
      }
    }
    const filter = [config.where[0], onTab];
    appStore.setHasMore(true);
    setConfig({...config, ...{page: 1, where: filter, tab: key}});
  };

  const updateOrderSelected = data => {
    setOrderSelected(data);
  };

  const {TabPane} = Tabs;

  const Search = Input.Search;
  const FormItem = Form.Item;
  const formStartItemLayout = {
    labelCol: {
      xs: {span: 24},
      sm: {span: 24},
      md: {span: 7},
      lg: {span: 6},
      xl: {span: 5},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 24},
      md: {span: 16},
      lg: {span: 17},
      xl: {span: 15},
    },
  };

  const onRefreshData = () => {
    setConfig({...config, ...{isRefresh: !config.isRefresh}});
  };

  return (
    <div className="dispatcher-hoc">
      <Row type="flex" justify="space-between" align="middle" style={{marginBottom: '13px'}}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Card bordered={false} className="gutter-row">
            <Row type="flex" justify="space-between" align="middle" style={{marginBottom: '13px'}}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <HeadTitle
                  icon={!orderStore.isDriverAvailableList ? 'control' : 'idcard'}
                  title={!orderStore.isDriverAvailableList ? t('labelDispatcher') : `${t('labelDriversAvailable')}`}
                />
              </Col>
            </Row>
            <Divider />
            {!orderStore.isDriverAvailableList ? (
              <React.Fragment>
                <Tabs defaultActiveKey="pendingOrders" onChange={setTab}>
                  <TabPane tab={t('labelPendingOrders')} key="pendingOrders">
                    {/* Content of Tab Pane 1 */}
                  </TabPane>
                  <TabPane tab={t('labelOngoingOrders')} key="ongoingOrders">
                    {/*  */}
                  </TabPane>
                </Tabs>
                <React.Fragment>
                  {dataComponent.isUseKeyword ? (
                    <Row type="flex" justify="start" align="top" style={{marginBottom: 10}}>
                      <Col xs={24} sm={24} md={12} lg={10} xl={8}>
                        <FormItem {...formStartItemLayout} label={`${t('labelKeyword')}`} style={{marginBottom: 0}}>
                          <Search placeholder={`${t('labelSearch')}...`} onSearch={onSearch} />
                        </FormItem>
                      </Col>
                      <Col xs={24} sm={4} md={10} lg={12} xl={12}>
                        {dataComponent.isRefresh && (
                          <Row type="flex" justify="start" align="middle" style={{marginTop: 3}}>
                            <Button type="primary" onClick={() => onRefreshData()}>
                              {t('labelRefresh')}
                            </Button>
                          </Row>
                        )}
                      </Col>
                    </Row>
                  ) : null}
                </React.Fragment>
              </React.Fragment>
            ) : (
              <Row type="flex" justify="start" align="top" style={{marginBottom: 5}}>
                <Col xs={24} sm={4} md={10} lg={12} xl={12}>
                  {dataComponent.isRefresh && (
                    <Row type="flex" justify="start" align="middle">
                      <Button type="primary" onClick={() => onRefreshData()} className="dispatcher-hoc__action">
                        {t('labelRefresh')}
                      </Button>
                    </Row>
                  )}
                </Col>
              </Row>
            )}
            <Row type="flex" justify="start" align="top" style={{marginBottom: 10}}>
              <Col xs={24} sm={24} md={12} lg={13} xl={13}>
                <WrappedComponent
                  config={config}
                  updateConfig={updateConfig}
                  setCountList={setCountList}
                  updateOrderSelected={updateOrderSelected}
                />
              </Col>
              <Col xs={24} sm={4} md={12} lg={11} xl={11}>
                {/* <h1>map here</h1> */}
                <WrappedMapComponent config={config} orderSelected={orderSelected} />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default dispatcherHoc;
