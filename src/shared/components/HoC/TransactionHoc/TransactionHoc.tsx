import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Col, Divider, Form, Input, Row, Tabs, DatePicker, Select} from 'antd';
import {useTranslation} from 'react-i18next';

import HeadTitle from '../../HeadTitle/HeadTitle';

import AppStore from '../../../stores/App.store';

import './TransactionHoc.less';
import moment from 'moment';
import appModel from '../../../models/App.model';
import openNotificationWithIcon from '../../OpenNotificationWithIcon/OpenNotificationWithIcon';

type dataComponentType = {
  headIcon: string;
  headTitle: string;
  createPermissions: any[];
  linkToCreate: string;
  labelAdd: string;
  labelItem: string;
  isUseFilter?: boolean;
};

const transactionHoC = ({WrappedComponent}, dataComponent: dataComponentType) => () => {
  const appStore = useContext(AppStore);
  const {t} = useTranslation('app');
  const [companies, setCompanies] = useState([]);
  const [config, setConfig] = useState({
    pageSize: 10,
    page: 1,
    orderBy: [{field: 'id', orderType: 'DESC'}],
    where: [{field: 'keyword', value: '', op: 'CONTAIN'}, {field: 'status', value: ['STATUS_PENDING'], op: 'IN'}],
    tab: 'pending',
  });
  const [countList, setCountList] = useState(0);

  const Option = Select.Option;
  const {RangePicker} = DatePicker;
  const {TabPane} = Tabs;
  const {headIcon, headTitle, isUseFilter} = dataComponent;

  const updateConfig = data => {
    setConfig({...config, ...data});
  };
  useEffect(() => {
    // get data for the form
    isUseFilter && getData();
  }, []);

  const getData = async () => {
    try {
      appStore.setIsLoading(true);
      const companyList: any = await appModel.getCompanyList({
        page: 1,
        pageSize: 60,
      });
      const mappedCompanies = companyList.data.CompanyList.items.map(st => {
        return {
          id: st.id,
          name: st.name,
        };
      });
      setCompanies(mappedCompanies);
      appStore.setIsLoading(false);
    } catch (e) {
      appStore.setIsLoading(false);
    }
  };

  const drawItems = () => {
    return companies.map((item: any) => (
      <Option value={item.id} key={item.id}>
        {item.name}
      </Option>
    ));
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

  const onSelect = e => {
    const onSelectFilter = {field: 'companyId', value: `${e}`, op: 'EQ', isPk: true};
    const whereFilter = config.where.filter(element => element.field !== 'companyId');
    whereFilter.push(onSelectFilter);
    setConfig({...config, ...{page: 1, where: whereFilter}});
  };

  const setTab = key => {
    let onTab;
    switch (key) {
      case 'open': {
        onTab = {
          field: 'status',
          value: ['STATUS_OPEN'],
          op: 'IN',
        };
        break;
      }
      case 'paid': {
        onTab = {
          field: 'status',
          value: ['STATUS_TRANSFER'],
          op: 'IN',
        };
        break;
      }
      default: {
        onTab = {field: 'status', value: ['STATUS_PENDING'], op: 'IN'};
        break;
      }
    }
    const whereFilter = config.where.filter(element => element.field !== 'status');
    whereFilter.push(onTab);
    setConfig({...config, ...{page: 1, where: whereFilter, tab: key}});
  };

  const onChangeRange = range => {
    const startDate = range[0]
      ? range[0]
      : moment()
          .utc()
          .startOf('month');
    const endDate = range[1] ? range[1] : moment().utc();
    const onChangePeriodStartAt = {field: 'periodStartAt', op: 'GTE', value: startDate};
    const onChangePeriodEndAt = {field: 'periodEndAt', op: 'LTE', value: endDate};
    const whereFilter = config.where.filter(element => element.field !== 'periodStartAt');
    const whereFilterNew = whereFilter.filter(element => element.field !== 'periodEndAt');
    whereFilterNew.push(onChangePeriodStartAt);
    whereFilterNew.push(onChangePeriodEndAt);
    setConfig({...config, ...{page: 1, where: whereFilterNew}});
  };

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

  return (
    <div className="manage-transaction-hoc">
      <Row type="flex" justify="space-between" align="middle" style={{marginBottom: '13px'}}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Card bordered={false} className="gutter-row">
            <Row type="flex" justify="space-between" align="middle" style={{marginBottom: '13px'}}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <HeadTitle icon={headIcon} title={t(`${headTitle}`)} />
              </Col>
            </Row>
            <Divider />
            <React.Fragment>
              <Tabs defaultActiveKey="pending" onChange={setTab}>
                <TabPane tab={t('labelOpen')} key="open"></TabPane>
                <TabPane tab={t('labelPending')} key="pending"></TabPane>
                <TabPane tab={t('labelPaid')} key="paid"></TabPane>
              </Tabs>
              <React.Fragment>
                {dataComponent.isUseFilter ? (
                  <Row type="flex" justify="start" align="top" style={{marginBottom: 10}}>
                    <Col xs={24} sm={24} md={12} lg={10} xl={8}>
                      {appStore.hasRole(appStore.roles, ['TYPE_SUPER_ADMIN']) && (
                        <FormItem {...formStartItemLayout} label={`${t('labelCompany')}`} style={{marginBottom: 0}}>
                          <Select
                            style={{width: '100%'}}
                            showSearch
                            defaultValue={''}
                            filterOption={(input, option) =>
                              String(option.props.children)
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            onSelect={e => {
                              onSelect && onSelect(e);
                            }}
                          >
                            <Option value="">-{`${t('labelPlaceHolderSelectCompanyName')}`}-</Option>
                            {drawItems()}
                          </Select>
                        </FormItem>
                      )}
                    </Col>
                    <Col xs={24} sm={24} md={10} lg={12} xl={12}>
                      <FormItem {...formStartItemLayout} label={`${t('labelDateRange')}`}>
                        <RangePicker format="MM/DD/YYYY" onOk={onChangeRange} />
                      </FormItem>
                    </Col>
                  </Row>
                ) : null}
              </React.Fragment>
            </React.Fragment>
            <Row type="flex" justify="start" align="top" style={{marginTop: 5}}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <WrappedComponent config={config} updateConfig={updateConfig} setCountList={setCountList} />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default transactionHoC;
