import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Col, Divider, Form, Input, Row, Select} from 'antd';
import {useTranslation} from 'react-i18next';
import {RiftLink} from 'rift-router';

import HeadTitle from '../../HeadTitle/HeadTitle';

import AppStore from '../../../stores/App.store';
import openNotificationWithIcon from '../../../components/OpenNotificationWithIcon/OpenNotificationWithIcon';

import './ListHoc.less';
import {StatementDateEnum} from '../../../enums/StatementDate.enum';
import moment from 'moment';

type dataComponentType = {
  headIcon: string;
  headTitle: string;
  createPermissions: any[];
  linkToCreate: string;
  labelAdd: string;
  labelItem: string;
  isFormModal: boolean;
  isUseKeyword?: boolean;
  isUseFilterBy?: boolean;
};

const listHoc = ({WrappedComponent, WrappedExportComponent}, dataComponent: dataComponentType) => () => {
  const appStore = useContext(AppStore);
  const {t} = useTranslation('app');
  const [config, setConfig] = useState({
    pageSize: 10,
    page: 1,
    orderBy: [{field: 'id', orderType: 'DESC'}],
    where: [{field: 'keyword', value: '', op: 'CONTAIN'}],
  });
  const [countList, setCountList] = useState(0);
  const [visibleExportModal, setVisibleExportModal] = useState(false);

  const updateConfig = data => {
    setConfig({...config, ...data});
  };

  const setExportModal = (data: boolean) => {
    setVisibleExportModal(data);
  };

  const onSearch = keyword => {
    const filter =
      config.where && config.where[1]
        ? [{field: 'keyword', value: keyword, op: 'CONTAIN'}, config.where[1]]
        : [{field: 'keyword', value: keyword, op: 'CONTAIN'}];
    setConfig({...config, ...{page: 1, where: filter}});
  };

  const onSelect = e => {
    let onSelectFilter;
    let startDate;
    const endDate = moment().utc();
    switch (e) {
      case StatementDateEnum.TYPE_DAILY:
        startDate = moment()
          .subtract(1, 'days')
          .utc();
        break;
      case StatementDateEnum.TYPE_MONTHLY:
        startDate = moment()
          .subtract(1, 'months')
          .utc();
        break;
      case StatementDateEnum.TYPE_YEARLY:
        startDate = moment()
          .subtract(1, 'years')
          .utc();
        break;
      default:
        break;
    }
    onSelectFilter = {field: 'createdAt', op: 'BETWEEN', fieldType: 'DATETIME', value: [startDate, endDate]};
    const filter = StatementDateEnum.TYPE_OVERALL === e ? [config.where[0]] : [config.where[0], onSelectFilter];
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

  const Search = Input.Search;
  const Option = Select.Option;
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

  /**
   * 1- Have permission to create
   * 2- Its Admin from Fleet Owner To Driver (not show)
   * 3- Its Admin To Driver (show)
   */

  const showAddButton = () => {
    const fromFleetOwner = appStore.isAdminFromFleetOwnerToDriver || appStore.isAdminFromFleetOwnerToVehicle;
    return (
      appStore.hasPermissions(appStore.permissions, dataComponent.createPermissions) &&
      ((!fromFleetOwner && appStore.hasRole(appStore.roles, ['TYPE_SUPER_ADMIN'])) ||
        (fromFleetOwner && appStore.hasRole(appStore.roles, ['TYPE_FLEET_OWNER'])))
    );
  };

  const routeToAdd = () => {
    const addRoute = dataComponent.linkToCreate;
    const fromFleetOwner = appStore.isAdminFromFleetOwnerToDriver || appStore.isAdminFromFleetOwnerToVehicle;
    if (fromFleetOwner && appStore.hasRole(appStore.roles, ['TYPE_FLEET_OWNER'])) {
      return addRoute.concat(`?from=${appStore.fromFleetOwnerCompany}`);
    }
    return addRoute;
  };
  const onCancelForm = () => {
    appStore.setIsAdminFromManageTransaction(false);
    appStore.setIsAdminFromFleetOwnerToDriver(false);
    appStore.setIsAdminFromFleetOwnerToVehicle(false);
    // change later for router.goBack..
    window.history.back();
  };

  return (
    <div className="list-hoc">
      <Row type="flex" justify="space-between" align="middle" style={{marginBottom: '13px'}}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Card bordered={false} className="gutter-row">
            <Row type="flex" justify="space-between" align="middle" style={{marginBottom: '13px'}}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <HeadTitle icon={dataComponent.headIcon} title={t(`${dataComponent.headTitle}`)} />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <div style={{textAlign: 'right'}}>
                  {showAddButton() && (
                    <React.Fragment>
                      {dataComponent.isFormModal ? (
                        <Button type="primary" onClick={() => appStore.setIsOpenModalForm(true)}>
                          {t(`${dataComponent.labelAdd}`)}
                        </Button>
                      ) : (
                        <RiftLink to={routeToAdd()}>
                          <Button type="primary">{t(`${dataComponent.labelAdd}`)}</Button>
                        </RiftLink>
                      )}
                    </React.Fragment>
                  )}
                  <React.Fragment>
                    {countList > 0 ? (
                      <Button onClick={() => setExportModal(true)} style={{marginLeft: '10px'}}>
                        {t('labelExport')}
                      </Button>
                    ) : null}
                  </React.Fragment>
                </div>
              </Col>
            </Row>
            <Divider />
            <React.Fragment>
              {dataComponent.isUseKeyword ? (
                <Row type="flex" justify="start" align="top" style={{marginBottom: 10}}>
                  <Col xs={24} sm={24} md={12} lg={10} xl={8}>
                    <FormItem {...formStartItemLayout} label={`${t('labelKeyword')}`} style={{marginBottom: 0}}>
                      <Search placeholder={`${t('labelSearch')}...`} onSearch={onSearch} />
                    </FormItem>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={10} xl={8}>
                    {dataComponent.isUseFilterBy &&
                    !appStore.isAdminFromManageTransaction &&
                    appStore.hasRole(appStore.roles, ['TYPE_SUPER_ADMIN']) ? (
                      <FormItem {...formStartItemLayout} label={`${t('labelFilterBy')}`} style={{marginBottom: 0}}>
                        <Select
                          style={{width: '100%'}}
                          showSearch
                          defaultValue={StatementDateEnum.TYPE_OVERALL}
                          filterOption={(input, option) =>
                            String(option.props.children)
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          onSelect={e => {
                            onSelect && onSelect(e);
                          }}
                        >
                          {[
                            {id: StatementDateEnum.TYPE_OVERALL, name: `${t('labelOverall')}`},
                            {id: StatementDateEnum.TYPE_DAILY, name: `${t('labelDaily')}`},
                            {id: StatementDateEnum.TYPE_MONTHLY, name: `${t('labelMonthly')}`},
                            {id: StatementDateEnum.TYPE_YEARLY, name: `${t('labelYearly')}`},
                          ].map(item => (
                            <Option value={item.id} key={item.id}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      </FormItem>
                    ) : null}
                  </Col>
                </Row>
              ) : null}
            </React.Fragment>
            <WrappedComponent config={config} updateConfig={updateConfig} setCountList={setCountList} />
            {(appStore.isAdminFromFleetOwnerToDriver ||
              appStore.isAdminFromFleetOwnerToVehicle ||
              appStore.isAdminFromDriverToVehicle ||
              appStore.isAdminFromManageTransaction) && (
              <Button type="primary" className="list-hoc__button-back" onClick={() => onCancelForm()}>
                {t('labelBack')}
              </Button>
            )}
            <WrappedExportComponent
              config={config}
              visibleExportModal={visibleExportModal}
              setExportModal={setExportModal}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default listHoc;
