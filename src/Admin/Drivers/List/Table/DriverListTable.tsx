import React, {useContext, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import gql from 'graphql-tag';
import {Col, Icon, Modal, Pagination, Popconfirm, Rate, Row, Table, Tag, Tooltip} from 'antd';
import {RiftLink, useRouter} from 'rift-router';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-apollo-hooks';

import AppStore from '../../../../shared/stores/App.store';
import {SortTypesEnum} from '../../../../shared/enums/SortType.enum';
import driverModel from '../../../../shared/models/Driver.model';
import PaginateInfo from '../../../../shared/components/PaginateInfo/PaginateInfo';
import openNotificationWithIcon from '../../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';
import {DriverStatusEnum} from '../../../../shared/enums/DriverStatus.enum';
import appModel from '../../../../shared/models/App.model';
import formatPhone from '../../../../shared/utils/formatPhone';

import './DriverListTable.less';
import {FormatPhoneTypeEnum} from '../../../../shared/enums/FormatPhoneType.enum';

const GET_LIST = gql`
  query($input: GenericFilterInput) {
    DriverList(input: $input) {
      total
      items {
        id
        status
        rating
        basicProfile {
          fullName
          email
          mobilePhone
          createdAt
        }
        vehicle {
          vin
        }
        company {
          id
          name
          type
        }
        ordersInProgress
      }
    }
  }
`;
const confirm = Modal.confirm;

const DriverListTable = observer((props: any) => {
  const appStore = useContext(AppStore);
  const {t} = useTranslation('app');
  const router = useRouter();
  const [mappedData, setMappedData] = useState([]);
  const [count, setCount] = useState(0);
  const [fromCompany, setFromCompany] = useState('');
  const {pageSize, page, where, orderBy} = props.input;
  const filter: any = [];

  const convertOrder = [
    {key: 'fullName', value: 'fullName'},
    {key: 'email', value: 'basicProfile.email'},
    {key: 'mobile', value: 'fullMobilePhone'},
    {key: 'company', value: 'company.name'},
    {key: 'vin', value: 'vehicle.vin'},
    {key: 'status', value: 'status'},
    {key: 'rating', value: 'rating'},
    {key: 'created', value: 'createdAt'},
  ];

  useEffect(() => {
    const params: any = router;
    if (params && params.search && params.search.from) {
      appStore.setIsAdminFromFleetOwnerToDriver(true);
      appStore.setFromFleetOwnerCompany(params.search.from);
      setFromCompany(params.search.from);
      props.updateConfig({
        where: [...where, {field: 'company.id', value: `${params.search.from}`, op: 'EQ', isPk: true}],
      });
    } else {
      const ENV = `${process.env.REACT_APP_ENV}`;
      const STORE_VAR = `jwtGoHeavy-${ENV}`;
      localStorage.removeItem(STORE_VAR);
      window.location.pathname = '/admin/login';
      // props.updateConfig({
      //   where: [...where],
      // });
    }

    return () => {
      appStore.setIsAdminFromFleetOwnerToDriver(false);
    };
  }, []);

  const {data, error, loading, refetch} = useQuery(GET_LIST, {
    suspend: false,
    variables: {
      input: {
        page,
        pageSize,
        order: orderBy,
        where: filter,
      },
    },
    fetchPolicy: 'network-only',
  });

  const deleteElem = async (id: any) => {
    try {
      appStore.setIsLoading(true);
      const itemToDelete: any = await driverModel.deleteDriver({where: [{field: 'id', value: id, isPk: true}]});
      if (itemToDelete && itemToDelete.data.DriverDelete.isSuccess) {
        const msg = `${t('labelA')} ${t('labelDriver')} ${t('labelWasDeleted')}.`;
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
      const {items, total} = result.DriverList;
      let number = (page - 1) * pageSize;
      const mappedDataTmp = items.map(item => {
        number += 1;
        const {id, rating, status, basicProfile, company, vehicle, ordersInProgress} = item;
        return {
          id,
          key: number,
          fullName: (basicProfile && basicProfile.fullName) || '',
          email: (basicProfile && basicProfile.email) || '',
          mobile:
            basicProfile && basicProfile.mobilePhone
              ? formatPhone.formatsGeneral(basicProfile.mobilePhone, false, '1', FormatPhoneTypeEnum.NATIONAL)
              : '',
          company: company ? company.name : '',
          vin: vehicle && vehicle.vin ? vehicle.vin : '',
          status: status || '',
          rating: rating || 0,
          created: appStore.getCreatedAtDate(basicProfile.createdAt),
          companyId: company ? company.id : '',
          companyType: company ? company.type : '',
          ordersInProgress: ordersInProgress > 0 ? true : false,
        };
      });
      setMappedData(mappedDataTmp);
      setCount(total);
      props.updateCountList(total);
    };

    const onError = paramError => {
      appStore.setIsLoading(false);
      if (paramError && paramError.networkError && paramError.networkError.statusCode === 403) {
        // appModel.logout();
        // window.location.href = '/admin/login';
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
    if (where && where[0].value !== '') {
      filter.push(where[0]);
    }
    if (where && where[1]) {
      filter.push(where[1]);
    }
    refetch({
      input: {
        page,
        pageSize,
        order: orderBy,
        where: filter,
      },
    });
  };

  useEffect(() => {
    reFetchData();
  }, [props.input]);

  const routeToEdit = () => {
    return appStore.isAdminFromFleetOwnerToDriver && fromCompany !== '';
  };

  let columns = [
    {
      title: t('labelNoDot'),
      dataIndex: 'key',
      width: '4%',
    },
    {
      title: t('labelFullName'),
      dataIndex: 'fullName',
      width: '15%',
      sorter: true,
    },
    {
      title: t('labelEmail'),
      dataIndex: 'email',
      width: '15%',
      sorter: true,
    },
    {
      title: t('labelMobile'),
      dataIndex: 'mobile',
      width: '10%',
      sorter: true,
    },
    {
      title: t('labelCompany'),
      dataIndex: 'company',
      width: '10%',
      sorter: true,
    },
    {
      title: t('labelVehicleIdNo'),
      dataIndex: 'vin',
      width: '10%',
      sorter: true,
    },
    {
      title: t('labelStatus'),
      dataIndex: 'status',
      width: '10%',
      sorter: true,
      render: (status: DriverStatusEnum) => {
        switch (status) {
          case DriverStatusEnum.STATUS_ON_BOARDING:
            return <Tag color="blue">{t('labelOnBoarding')}</Tag>;
          case DriverStatusEnum.STATUS_ALERT:
            return <Tag color="red">{t('labelAlert')}</Tag>;
          case DriverStatusEnum.STATUS_CLEAR:
            return <Tag color="green">{t('labelClear')}</Tag>;
          default:
            return <Tag color="geekblue">{t('labelGoHeavyReady')}</Tag>;
        }
      },
    },
    {
      title: t('labelRating'),
      width: '11%',
      sorter: true,
      dataIndex: 'rating',
      render: rating => (
        <React.Fragment>
          <Rate disabled defaultValue={+rating} />
        </React.Fragment>
      ),
    },
    {
      title: t('labelCreatedDate'),
      dataIndex: 'created',
      width: '8%',
      sorter: true,
    },
    {
      title: t('labelAction'),
      width: '7%',
      render: item => (
        <span>
          {appStore.hasPermissions(appStore.permissions, ['DocumentDriverGet']) && (
            <React.Fragment>
              {!item.ordersInProgress ? (
                <RiftLink to={`/admin/document/driver/${item.id}`} className="driver-list-table__pointer">
                  <Tooltip title={t('labelDocuments')}>
                    <Icon type="file-text" style={{fontSize: '18px'}} theme="twoTone" twoToneColor="#0275d8" />
                  </Tooltip>
                </RiftLink>
              ) : (
                <Tooltip title={t('labelNoAction')} className={'driver-list-table__not-allowed'}>
                  <Icon type="file-text" style={{fontSize: '18px'}} theme="twoTone" twoToneColor="gray" />
                </Tooltip>
              )}
            </React.Fragment>
          )}
          {!appStore.isAdminFromFleetOwnerToDriver &&
            appStore.hasPermissions(appStore.permissions, ['VehicleList']) &&
            item.companyType === 'TYPE_MAIN' && (
              <React.Fragment>
                <RiftLink
                  onClick={() => appStore.setIsAdminFromDriverToVehicle(true)}
                  to={routeToEdit() ? `/admin/vehicleinsurance?from=${fromCompany}` : `/admin/vehicleinsurance`}
                  className="driver-list-table__pointer"
                >
                  <Tooltip title={t('labelVehicles')}>
                    <Icon type="car" style={{fontSize: '18px'}} theme="twoTone" twoToneColor="#0275d8" />
                  </Tooltip>
                </RiftLink>
              </React.Fragment>
            )}
          {appStore.hasPermissions(appStore.permissions, ['DriverUpdate']) && (
            <React.Fragment>
              {!item.ordersInProgress ? (
                <RiftLink
                  to={routeToEdit() ? `/admin/driver/${item.id}?from=${fromCompany}` : `/admin/driver/${item.id}`}
                  className="driver-list-table__pointer"
                >
                  <Tooltip title={t('labelEdit')}>
                    <Icon type="edit" style={{fontSize: '18px'}} theme="twoTone" twoToneColor="#0275d8" />
                  </Tooltip>
                </RiftLink>
              ) : (
                <Tooltip title={t('labelNoAction')} className={'driver-list-table__not-allowed'}>
                  <Icon type="edit" style={{fontSize: '18px'}} theme="twoTone" twoToneColor="gray" />
                </Tooltip>
              )}
            </React.Fragment>
          )}
          {appStore.hasPermissions(appStore.permissions, ['DriverDelete']) && (
            <React.Fragment>
              <Tooltip title={t('labelDelete')}>
                <Popconfirm
                  icon={<Icon type="question-circle-o" style={{color: '#e33244'}} />}
                  placement="topRight"
                  title={`${t('msgConfirmDeleteElem')} ${t('labelDriver')}?`}
                  onConfirm={() => deleteElem(item.id)}
                  okText={t('Yes')}
                  cancelText={t('No')}
                  okType="danger"
                >
                  <Icon
                    type="delete"
                    style={{fontSize: '18px'}}
                    className="driver-list-table__pointer"
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
  columns = role === 'TYPE_FLEET_OWNER' ? columns.filter(e => e.title !== t('labelCompany')) : columns;

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
    <div style={{overflow: 'hidden', overflowX: 'auto'}} className="driver-list-table">
      <div style={{minWidth: 1070}}>
        <Table
          className={'table'}
          pagination={false}
          columns={columns}
          dataSource={mappedData}
          onChange={handleChange}
          size="middle"
          locale={{emptyText: <span>{`${t('msgThereAreNo')} ${t('labelDrivers')} ${t('msgToDisplay')}.`}</span>}}
        />
        <Row type="flex" justify="start" align="top" style={{marginBottom: 10}}>
          <Col xs={24} sm={24} md={12} lg={16} xl={16} className="driver-list-table__pagination-info">
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

export default DriverListTable;
