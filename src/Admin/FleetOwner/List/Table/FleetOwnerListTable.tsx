import React, {useContext, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import gql from 'graphql-tag';
import {Col, Icon, Modal, Pagination, Popconfirm, Row, Table, Tooltip} from 'antd';
import {RiftLink, useRouter} from 'rift-router';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-apollo-hooks';

import AppStore from '../../../../shared/stores/App.store';
import {SortTypesEnum} from '../../../../shared/enums/SortType.enum';
import fleetOwnerModel from '../../../../shared/models/FleetOwner.model';
import PaginateInfo from '../../../../shared/components/PaginateInfo/PaginateInfo';
import openNotificationWithIcon from '../../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';
import appModel from '../../../../shared/models/App.model';
import formatPhone from '../../../../shared/utils/formatPhone';

import './FleetOwnerListTable.less';
import {FormatPhoneTypeEnum} from '../../../../shared/enums/FormatPhoneType.enum';

const GET_LIST = gql`
  query($input: GenericFilterInput) {
    FleetOwnerList(input: $input) {
      total
      items {
        id
        basicProfile {
          fullName
          firstName
          lastName
          email
          mobilePhone
          createdAt
          isConfigurePaymentStripeAccount
        }
        company {
          id
          name
        }
      }
    }
  }
`;
const confirm = Modal.confirm;

const convertOrder = [
  {key: 'fullName', value: 'fullName'},
  {key: 'company', value: 'company.name'},
  {key: 'email', value: 'basicProfile.email'},
  {key: 'mobile', value: 'fullMobilePhone'},
  {key: 'createdAt', value: 'basicProfile.createdAt'},
];

const WEB = `${process.env.REACT_APP_WEB}`;
const CLIENT_ID_STRIPE = `${process.env.REACT_APP_CLIENT_ID_STRIPE}`;

const FleetOwnerListTable = observer((props: any) => {
  const appStore = useContext(AppStore);
  const {t} = useTranslation('app');
  const router = useRouter();
  const [mappedData, setMappedData] = useState([]);
  const [count, setCount] = useState(0);
  const {pageSize, page, where, orderBy} = props.input;
  const keywordIncluded = where[0].value !== '' ? true : false;

  const {data, error, loading, refetch} = useQuery(GET_LIST, {
    suspend: false,
    variables: {
      input: {
        page,
        pageSize,
        order: orderBy,
        ...(keywordIncluded && {where}),
      },
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    const params: any = router;
    if (params && params.search && params.search.code) {
      stripeExpressAccountCreate(params.search.code);
      console.log(`code of stripe to backend: ${params.search.code}`);
    }
  }, []);

  const stripeExpressAccountCreate = async (code: any) => {
    try {
      appStore.setIsLoading(true);
      const input = {
        code,
      };
      const stripeCreateResponse: any = await fleetOwnerModel.stripeExpressAccountCreate(input);
      reFetchData();
      if (stripeCreateResponse && stripeCreateResponse.data.StripeExpressAccountCreate.isSuccess) {
        const msg = `${t('msgCardStored')}`;
        openNotificationWithIcon('success', msg, '');
      } else {
        openNotificationWithIcon('error', t('lavelSaveFailed'), '');
      }
      appStore.setIsLoading(false);
    } catch (e) {
      appStore.setIsLoading(false);
      handleCatch(e, '', '');
    }
  };

  const deleteElem = async (id: any) => {
    try {
      appStore.setIsLoading(true);
      const itemToDelete: any = await fleetOwnerModel.delete({where: [{field: 'id', value: id, isPk: true}]});
      if (itemToDelete && itemToDelete.data.FleetOwnerDelete.isSuccess) {
        const msg = `${t('labelA')} ${t('labelFleetOwner')} ${t('labelWasDeleted')}.`;
        openNotificationWithIcon('success', msg, '');
        reFetchData();
      } else {
        openNotificationWithIcon('error', t('lavelDeleteFailed'), '');
      }
      appStore.setIsLoading(false);
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
        Object.entries(validation).forEach(([key, value]: any) => {
          const obj = {};
          let msg = '';
          const arrayMsg: any = [];
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
              value.length > 1 &&
                value.forEach(v => {
                  arrayMsg.push(v);
                });
              msg = `${value}`;
              break;
            }
          }
          if (msg !== '') {
            if (arrayMsg.length > 0) {
              for (const iterator of arrayMsg) {
                openNotificationWithIcon('error', iterator, '');
              }
            } else {
              openNotificationWithIcon('error', msg, '');
            }
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
      const {items, total} = result.FleetOwnerList;
      let number = (page - 1) * pageSize;
      const mappedDataTmp = items.map(item => {
        number += 1;
        const {id, basicProfile, company} = item;
        return {
          id,
          key: number,
          fullName: basicProfile.fullName || '',
          company: company ? company.name : '',
          email: basicProfile.email || '',
          mobile: basicProfile.mobilePhone
            ? formatPhone.formatsGeneral(basicProfile.mobilePhone, true, '1', FormatPhoneTypeEnum.NATIONAL)
            : '',
          createdAt: appStore.getCreatedAtDate(basicProfile.createdAt),
          companyId: company ? company.id : '',
          isConfigurePaymentStripeAccount: basicProfile.isConfigurePaymentStripeAccount,
          phoneNumber: basicProfile.mobilePhone,
          firstName: basicProfile.firstName,
          lastName: basicProfile.lastName,
        };
      });
      setMappedData(mappedDataTmp);
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
    refetch({
      input: {
        page,
        pageSize,
        order: orderBy,
        ...(keywordIncluded && {where}),
      },
    });
  };

  useEffect(() => {
    reFetchData();
  }, [props.input]);

  const stripeAccountExpressDashboardGet = async (isConfigurePaymentStripeAccount: boolean, item: any) => {
    try {
      let url = '';
      if (isConfigurePaymentStripeAccount) {
        appStore.setIsLoading(true);
        const response: any = await fleetOwnerModel.stripeAccountExpressDashboardGet();
        url =
          response.data &&
          response.data.StripeAccountExpressDashboardGet &&
          response.data.StripeAccountExpressDashboardGet.url;
        appStore.setIsLoading(false);
      } else {
        url = `https://connect.stripe.com/express/oauth/authorize?redirect_uri=${WEB}/admin/fleetowner&client_id=${CLIENT_ID_STRIPE}&state=${item.id}&stripe_user[email]=${item.email}&stripe_user[phone_number]=${item.phoneNumber}&stripe_user[first_name]=${item.firstName}&stripe_user[last_name]=${item.lastName}`;
      }
      isConfigurePaymentStripeAccount ? window.open(url, '_blank') : (window.location.href = url);
    } catch (e) {
      appStore.setIsLoading(false);
      handleCatch(e, '', '');
    }
  };

  const columnsAll = [
    {
      title: t('labelNoDot'),
      dataIndex: 'key',
      width: '5%',
    },
    {
      title: t('labelFullName'),
      dataIndex: 'fullName',
      width: '25%',
      sorter: true,
    },
    {
      title: t('labelEmail'),
      dataIndex: 'email',
      width: '20%',
      sorter: true,
    },
    {
      title: t('labelMobile'),
      dataIndex: 'mobile',
      width: '11%',
      sorter: true,
    },
    {
      title: t('labelCompany'),
      dataIndex: 'company',
      width: '11%',
      sorter: true,
    },
    {
      title: t('labelCreatedDate'),
      dataIndex: 'createdAt',
      width: '11%',
      sorter: true,
    },
    {
      title: t('labelAction'),
      width: '9%',
      render: item => (
        <span>
          {appStore.hasRole(appStore.roles, ['TYPE_FLEET_OWNER']) && (
            <React.Fragment>
              <span className="fleetowner-list-table__pointer">
                <Tooltip title={t('labelPaymentMethods')}>
                  <Icon
                    type="credit-card"
                    style={{fontSize: '18px'}}
                    theme="twoTone"
                    twoToneColor="#0275d8"
                    onClick={() => stripeAccountExpressDashboardGet(item.isConfigurePaymentStripeAccount, item)}
                  />
                </Tooltip>
              </span>
            </React.Fragment>
          )}
          {appStore.hasPermissions(appStore.permissions, ['DriverList']) && (
            <React.Fragment>
              <RiftLink to={`/admin/driver?from=${item.companyId}`} className="fleetowner-list-table__pointer">
                <Tooltip title={t('labelDrivers')}>
                  <Icon type="idcard" style={{fontSize: '18px'}} theme="twoTone" twoToneColor="#0275d8" />
                </Tooltip>
              </RiftLink>
            </React.Fragment>
          )}
          {appStore.hasPermissions(appStore.permissions, ['FleetOwnerUpdate']) && (
            <React.Fragment>
              <RiftLink
                to={`/admin/vehicleinsurance?from=${item.companyId}`}
                className="fleetowner-list-table__pointer"
              >
                <Tooltip title={t('labelVehicles')}>
                  <Icon type="car" style={{fontSize: '18px'}} theme="twoTone" twoToneColor="#0275d8" />
                </Tooltip>
              </RiftLink>
            </React.Fragment>
          )}
          {appStore.hasPermissions(appStore.permissions, ['FleetOwnerUpdate']) &&
            appStore.hasRole(appStore.roles, ['TYPE_SUPER_ADMIN']) && (
              <React.Fragment>
                <RiftLink to={`/admin/fleetowner/${item.id}`} className="fleetowner-list-table__pointer">
                  <Tooltip title={t('labelEdit')}>
                    <Icon type="edit" style={{fontSize: '18px'}} theme="twoTone" twoToneColor="#0275d8" />
                  </Tooltip>
                </RiftLink>
              </React.Fragment>
            )}
          {appStore.hasPermissions(appStore.permissions, ['FleetOwnerDelete']) && (
            <React.Fragment>
              <Tooltip title={t('labelDelete')}>
                <Popconfirm
                  icon={<Icon type="question-circle-o" style={{color: '#e33244'}} />}
                  placement="topRight"
                  title={`${t('msgConfirmDeleteElem')} ${t('labelFleetOwner')}?`}
                  onConfirm={() => deleteElem(item.id)}
                  okText={t('Yes')}
                  cancelText={t('No')}
                  okType="danger"
                >
                  <Icon
                    type="delete"
                    style={{fontSize: '18px'}}
                    className="fleetowner-list-table__pointer"
                    theme="twoTone"
                    twoToneColor="#e33244"
                  />
                </Popconfirm>
              </Tooltip>
            </React.Fragment>
          )}
        </span>
      ),
    },
  ];

  const role = appStore.getMainRoleUserAuth();
  const columnsFilter =
    role === 'TYPE_FLEET_OWNER' ? columnsAll.filter(e => e.title !== t('labelCompany')) : columnsAll;

  const onPageChange = newPage => {
    props.updateConfig({page: newPage});
  };

  const handleChange = (pagination, filters, sorter) => {
    if (sorter) {
      if (!sorter.field) {
        sorter.field = 'id';
      }
      sort(sorter);
    }
  };

  const sort = sorter => {
    const {field, order} = sorter;
    const orderValue: any = convertOrder.find(v => v.key === field);
    props.updateConfig({
      pageNumber: 0,
      orderBy: [{field: orderValue.value, orderType: order === 'ascend' ? SortTypesEnum.ASC : SortTypesEnum.DESC}],
    });
  };

  return (
    <div style={{overflow: 'hidden', overflowX: 'auto'}} className="fleetowner-list-table">
      <div style={{minWidth: 1070}}>
        <Table
          className={'table'}
          pagination={false}
          columns={columnsFilter}
          dataSource={mappedData}
          onChange={handleChange}
          size="middle"
          locale={{emptyText: <span>{`${t('msgThereAreNo')} ${t('labelFleetOwners')} ${t('msgToDisplay')}.`}</span>}}
        />
        <Row type="flex" justify="start" align="top" style={{marginBottom: 10}}>
          <Col xs={24} sm={24} md={12} lg={16} xl={16} className="fleetowner-list-table__pagination-info">
            {count > 0 ? <PaginateInfo page={page} pageSize={pageSize} count={count} /> : null}
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            {count > pageSize ? (
              <Pagination
                className="ant-table-pagination"
                total={count}
                current={page}
                pageSize={pageSize}
                onChange={onPageChange}
              />
            ) : null}
          </Col>
        </Row>
      </div>
    </div>
  );
});

export default FleetOwnerListTable;
