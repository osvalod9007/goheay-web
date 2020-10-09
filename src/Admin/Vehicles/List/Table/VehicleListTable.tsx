import React, {useContext, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import gql from 'graphql-tag';
import {Col, Icon, Table, Tooltip, Pagination, Popconfirm, Row, Tag} from 'antd';
import {RiftLink, useRouter} from 'rift-router';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-apollo-hooks';

import AppStore from '../../../../shared/stores/App.store';
import {SortTypesEnum} from '../../../../shared/enums/SortType.enum';
import vehicleModel from '../../../../shared/models/Vehicle.model';
import PaginateInfo from '../../../../shared/components/PaginateInfo/PaginateInfo';
import openNotificationWithIcon from '../../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';

import './VehicleListTable.less';
import {VehicleStatusEnum} from '../../../../shared/enums/VehicleStatus.enum';
import VehicleStore from '../../../../shared/stores/Vehicle.store';
import AssignVehicle from '../../Assign/AssignVehicle';
import appModel from '../../../../shared/models/App.model';

const GET_LIST = gql`
  query($input: GenericFilterInput) {
    VehicleList(input: $input) {
      total
      items {
        id
        make
        year
        model
        licensePlateNo
        insuranceCertificateCompany
        insuranceExpirationDate
        status
        vehicleType {
          type
        }
        createdAt
        company {
          name
        }
        driver {
          id
          basicProfile {
            fullName
          }
        }
        ordersInProgress
      }
    }
  }
`;

const VehicleListTable = observer((props: any) => {
  const appStore = useContext(AppStore);
  const router = useRouter();
  const {t} = useTranslation('app');
  const vehicleStore = useContext(VehicleStore);
  const [mappedData, setMappedData] = useState([]);
  const [count, setCount] = useState(0);
  const {pageSize, page, where, orderBy} = props.input;
  const filter: any = [];

  const convertOrder = [
    {key: 'vehicleMake', value: 'make'},
    {key: 'vehicleModel', value: 'model'},
    {key: 'vehicleYear', value: 'year'},
    {key: 'vehicleType', value: 'vehicleType.type'},
    {key: 'licensePlateNo', value: 'licensePlateNo'},
    {key: 'insuranceCertificateCompany', value: 'insuranceCertificateCompany'},
    {key: 'insuranceExpirationDate', value: 'insuranceExpirationDateExport'},
    {key: 'company', value: 'company.name'},
    {key: 'driverName', value: 'fullName'},
    {key: 'status', value: 'status'},
    {key: 'created', value: 'createdAt'},
  ];

  const {data, error, loading, refetch} = useQuery(GET_LIST, {
    suspend: false,
    variables: {
      input: {
        page,
        pageSize,
        order: orderBy,
        ...(filter.length > 0 && {where: filter}),
      },
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    changeParams();
    return () => {
      appStore.setIsAdminFromFleetOwnerToVehicle(false);
      appStore.setIsAdminFromDriverToVehicle(false);
    };
  }, []);

  const changeParams = () => {
    const params: any = router;
    if (params && params.search && params.search.from) {
      appStore.setIsAdminFromFleetOwnerToVehicle(true);
      appStore.setFromFleetOwnerCompany(params.search.from);
      props.updateConfig({
        where: [...where, {field: 'company.id', value: `${params.search.from}`, op: 'EQ', isPk: true}],
      });
    } else {
      props.updateConfig({
        where: [...where],
      });
    }
  };

  useEffect(() => {
    reFetchData();
  }, [props.input]);

  useEffect(() => {
    reFetchData();
  }, [vehicleStore.isUpdateList]);

  const deleteElem = async (id: any) => {
    try {
      appStore.setIsLoading(true);
      const itemToDelete: any = await vehicleModel.deleteVehicle({where: [{field: 'id', value: id, isPk: true}]});
      if (itemToDelete && itemToDelete.data.VehicleDelete.isSuccess) {
        const msg = `${t('labelA')} ${t('labelVehicle')} ${t('labelWasDeleted')}.`;
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
      const {items, total} = result.VehicleList;
      let number = (page - 1) * pageSize;
      const mappedDataTmp = items.map(item => {
        number += 1;
        const {
          id,
          make,
          year,
          vehicleType,
          model,
          licensePlateNo,
          insuranceCertificateCompany,
          company,
          insuranceExpirationDate,
          status,
          createdAt,
          driver,
          ordersInProgress,
        } = item;
        return {
          id,
          key: number,
          vehicleMake: make || '',
          vehicleModel: model || '',
          vehicleYear: year || '',
          vehicleType: (vehicleType && vehicleType.type) || '',
          company: (company && company.name) || '',
          licensePlateNo,
          insuranceCertificateCompany,
          insuranceExpirationDate: appStore.getCreatedAtDate(insuranceExpirationDate),
          status: status || '',
          created: appStore.getCreatedAtDate(createdAt),
          driver,
          driverName: driver && driver.basicProfile ? driver.basicProfile.fullName : '',
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
    where && where[0].value !== '' && filter.push(where[0]);
    where && where[1] && filter.push(where[1]);
    refetch({
      input: {
        page,
        pageSize,
        order: orderBy,
        ...(filter.length > 0 && {where: filter}),
      },
    });
  };

  let columns = [
    {
      title: t('labelNoDot'),
      dataIndex: 'key',
      width: '4%',
    },
    {
      title: t('labelVehicleMake'),
      width: '8%',
      dataIndex: 'vehicleMake',
      sorter: true,
    },
    {
      title: t('labelVehicleModel'),
      width: '8%',
      dataIndex: 'vehicleModel',
      sorter: true,
    },
    {
      title: t('labelVehicleYear'),
      width: '8%',
      dataIndex: 'vehicleYear',
      sorter: true,
    },
    {
      title: t('labelVehicleType'),
      dataIndex: 'vehicleType',
      width: '8%',
      sorter: true,
    },
    {
      title: t('labelLicensePlateNo'),
      width: '8%',
      dataIndex: 'licensePlateNo',
      sorter: true,
    },
    {
      title: t('labelInsuranceCertificateCompany'),
      width: '8%',
      dataIndex: 'insuranceCertificateCompany',
      sorter: true,
    },
    {
      title: t('labelInsuranceExpirationDate'),
      width: '8%',
      dataIndex: 'insuranceExpirationDate',
      sorter: true,
    },
    {
      title: t('labelCompany'),
      width: '8%',
      dataIndex: 'company',
      sorter: true,
    },
    {
      title: t('labelDriverName'),
      width: '8%',
      dataIndex: 'driverName',
      sorter: true,
    },
    {
      title: t('labelStatus'),
      dataIndex: 'status',
      width: '8%',
      sorter: true,
      render: (status: VehicleStatusEnum) => {
        switch (status) {
          case VehicleStatusEnum.STATUS_ON_BOARDING:
            return <Tag color="blue">{t('labelOnBoarding')}</Tag>;
          case VehicleStatusEnum.STATUS_ALERT:
            return <Tag color="red">{t('labelAlert')}</Tag>;
          case VehicleStatusEnum.STATUS_CLEAR:
            return <Tag color="green">{t('labelClear')}</Tag>;
          default:
            return <Tag color="geekblue">{t('labelGoHeavyReady')}</Tag>;
        }
      },
    },
    {
      title: t('labelCreatedDate'),
      dataIndex: 'created',
      width: '8%',
      sorter: true,
    },
    {
      title: t('labelAction'),
      width: '8%',
      render: item => (
        <span>
          {appStore.hasPermissions(appStore.permissions, ['VehicleAssign']) &&
            (item.status === VehicleStatusEnum.STATUS_READY || item.status === VehicleStatusEnum.STATUS_CLEAR) &&
            appStore.hasRole(appStore.roles, ['TYPE_FLEET_OWNER']) && (
              <Tooltip title={!item.ordersInProgress ? t('labelAssign') : t('labelNoAction')}>
                <Icon
                  type="check-square"
                  style={{fontSize: '18px'}}
                  className={!item.ordersInProgress ? 'vehicle-list-table__pointer' : 'vehicle-list-table__not-allowed'}
                  theme="twoTone"
                  twoToneColor={!item.ordersInProgress ? '#0275d8' : 'gray'}
                  onClick={() => !item.ordersInProgress && openAssignVehicle(item)}
                />
              </Tooltip>
            )}
          {appStore.hasPermissions(appStore.permissions, ['VehicleGet']) && (
            <React.Fragment>
              {!item.ordersInProgress ? (
                <RiftLink to={`/admin/document/vehicle/${item.id}`} className={'vehicle-list-table__pointer'}>
                  <Tooltip title={t('labelDocuments')}>
                    <Icon type="file-text" style={{fontSize: '18px'}} theme="twoTone" twoToneColor="#0275d8" />
                  </Tooltip>
                </RiftLink>
              ) : (
                <Tooltip title={t('labelNoAction')} className={'vehicle-list-table__not-allowed'}>
                  <Icon type="file-text" style={{fontSize: '18px'}} theme="twoTone" twoToneColor="gray" />
                </Tooltip>
              )}
            </React.Fragment>
          )}
          {appStore.hasPermissions(appStore.permissions, ['VehicleUpdate']) && (
            <React.Fragment>
              {!item.ordersInProgress ? (
                <RiftLink to={`/admin/vehicleinsurance/${item.id}`} className="vehicle-list-table__pointer">
                  <Tooltip title={t('labelEdit')}>
                    <Icon type="edit" style={{fontSize: '18px'}} theme="twoTone" twoToneColor={'#0275d8'} />
                  </Tooltip>
                </RiftLink>
              ) : (
                <Tooltip title={t('labelNoAction')} className={'vehicle-list-table__not-allowed'}>
                  <Icon type="edit" style={{fontSize: '18px'}} theme="twoTone" twoToneColor={'gray'} />
                </Tooltip>
              )}
            </React.Fragment>
          )}
          {appStore.hasPermissions(appStore.permissions, ['VehicleDelete']) && (
            <React.Fragment>
              <Tooltip title={t('labelDelete')}>
                <Popconfirm
                  icon={<Icon type="question-circle-o" style={{color: '#e33244'}} />}
                  placement="topRight"
                  title={`${t('msgConfirmDeleteElem')} ${t('labelVehicle')}?`}
                  onConfirm={() => deleteElem(item.id)}
                  okText={t('Yes')}
                  cancelText={t('No')}
                  okType="danger"
                >
                  <Icon
                    type="delete"
                    style={{fontSize: '18px'}}
                    className="vehicle-list-table__pointer"
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

  const openAssignVehicle = Vehicle => {
    vehicleStore.setIdParent(Vehicle.id);
    vehicleStore.setDriverAssigned(Vehicle.driver && Vehicle.driver.id);
    vehicleStore.setIsUpdateList(false);
    appStore.setIsOpenModalForm(true);
  };

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
    <div style={{overflow: 'hidden', overflowX: 'auto'}} className="vehicle-list-table">
      <div style={{minWidth: 1370}}>
        <Table
          className={'table'}
          pagination={false}
          columns={columns}
          dataSource={mappedData}
          onChange={handleChange}
          size="middle"
          locale={{emptyText: <span>{`${t('msgThereAreNo')} ${t('labelVehicles')} ${t('msgToDisplay')}.`}</span>}}
        />
        <Row type="flex" justify="start" align="top" style={{marginBottom: 10}}>
          <Col xs={24} sm={24} md={12} lg={16} xl={16} className="vehicle-list-table__pagination-info">
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
      <AssignVehicle />
    </div>
  );
});

export default VehicleListTable;
