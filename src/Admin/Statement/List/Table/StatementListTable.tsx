import React, {useContext, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import gql from 'graphql-tag';
import {Col, Icon, Table, Tag, Pagination, Rate, Row, Tooltip, Button} from 'antd';
import {RiftLink, useRouter} from 'rift-router';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-apollo-hooks';

import AppStore from '../../../../shared/stores/App.store';
import {SortTypesEnum} from '../../../../shared/enums/SortType.enum';
import PaginateInfo from '../../../../shared/components/PaginateInfo/PaginateInfo';
import appModel from '../../../../shared/models/App.model';

import './StatementListTable.less';
import {OrderStatusEnum} from '../../../../shared/enums/OrderStatus.enum';

const GET_LIST = gql`
  query($input: GenericFilterInput) {
    OrderList(input: $input) {
      page
      pageSize
      total
      items {
        id
        customerFullName
        createdAt
        status
        driverFullName
        bookingId
        driver {
          company {
            id
            name
          }
        }
        fare {
          measureTotalPrice {
            amount
            currency
          }
          measureCommissionFleetOwner {
            amount
            currency
          }
          measureTip {
            amount
            currency
          }
        }
      }
    }
  }
`;
const StatementsListTable = observer((props: any) => {
  const appStore = useContext(AppStore);
  const {t} = useTranslation('app');
  const router = useRouter();
  const [mappedData, setMappedData] = useState([]);
  const [count, setCount] = useState(0);
  const {pageSize, page, where, orderBy} = props.input;
  const filter: any = [];
  where && where[0].value !== '' && filter.push(where[0]);
  where && where[1] && filter.push(where[1]);

  const convertOrder = [
    {key: 'customerFullName', value: 'customerFullName'},
    {key: 'driverFullName', value: 'driverFullName'},
    {key: 'company', value: 'driver.company.name'},
    {key: 'status', value: 'status'},
    {key: 'amount', value: 'fare.totalPrice'},
    {key: 'createdAt', value: 'createdAt'},
  ];

  useEffect(() => {
    const params: any = router;
    if (params && params.search && params.search.from) {
      if (appStore.hasRole(appStore.roles, ['TYPE_SUPER_ADMIN', 'TYPE_FLEET_OWNER'])) {
        appStore.setIsAdminFromManageTransaction(true);
      }

      props.updateConfig({
        where: [...where, {field: 'fleetOwnerTransactionId', value: `${params.search.from}`, op: 'EQ', isPk: true}],
      });
    } else {
      props.updateConfig({
        where: [...where],
      });
    }

    return () => {
      appStore.setIsAdminFromManageTransaction(false);
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

  useEffect(() => {
    appStore.setIsLoading(true);
    const onCompleted = result => {
      appStore.setIsLoading(false);
      const {items, total} = result.OrderList;
      let number = (page - 1) * pageSize;
      const mappedDataTmp: any = items.map(item => {
        number += 1;
        const {id, customerFullName, createdAt, status, driverFullName, driver, fare, bookingId} = item;
        return {
          id,
          bookingId,
          key: number,
          customerFullName,
          createdAt: appStore.getCreatedAtDate(createdAt),
          status,
          driverFullName: driverFullName || '-',
          company: (driver && driver.company && driver.company.name) || '-',
          fleetCommissionTips:
            fare && fare.measureCommissionFleetOwner && fare.measureTip
              ? `$${parseFloat(fare.measureCommissionFleetOwner.amount).toFixed(2)} + $${parseFloat(
                  fare.measureTip.amount,
                ).toFixed(2)}`
              : '-',
          amount:
            fare && fare.measureTotalPrice && fare.measureTotalPrice.amount
              ? `$${parseFloat(fare.measureTotalPrice.amount).toFixed(2)}`
              : '-',
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
        where: filter,
      },
    });
  };

  useEffect(() => {
    reFetchData();
  }, [props.input]);

  let columns = [
    {
      title: t('labelNoDot'),
      dataIndex: 'key',
      width: '5%',
    },
    {
      title: t('labelBookingId'),
      dataIndex: 'bookingId',
      width: '11%',
    },
    {
      title: t('labelCustomerName'),
      dataIndex: 'customerFullName',
      width: '11%',
      sorter: true,
    },
    {
      title: t('labelDriverName'),
      dataIndex: 'driverFullName',
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
      title: t('labelStatus'),
      dataIndex: 'status',
      width: '11%',
      sorter: true,
      render: (status: OrderStatusEnum) => {
        switch (status) {
          case OrderStatusEnum.STATUS_ARRIVED:
            return <Tag color="blue">{t('labelArrived')}</Tag>;
          case OrderStatusEnum.STATUS_BOOKED:
            return <Tag color="red">{t('labelBooked')}</Tag>;
          case OrderStatusEnum.STATUS_STARTED:
            return <Tag color="green">{t('labelStarted')}</Tag>;
          case OrderStatusEnum.STATUS_CHECKED:
            return <Tag color="green">{t('labelChecked')}</Tag>;
          case OrderStatusEnum.STATUS_LOADING:
            return <Tag color="green">{t('labelLoading')}</Tag>;
          case OrderStatusEnum.STATUS_LOADED:
            return <Tag color="green">{t('labelLoaded')}</Tag>;
          case OrderStatusEnum.STATUS_PICKED_UP:
            return <Tag color="green">{t('labelPickedUp')}</Tag>;
          case OrderStatusEnum.STATUS_REACHED:
            return <Tag color="green">{t('labelReached')}</Tag>;
          case OrderStatusEnum.STATUS_UNLOADING:
            return <Tag color="green">{t('labelUnLoading')}</Tag>;
          case OrderStatusEnum.STATUS_UNLOADED:
            return <Tag color="green">{t('labelUnLoaded')}</Tag>;
          case OrderStatusEnum.STATUS_CLIENT_PAID:
            return <Tag color="green">{t('labelClientPaid')}</Tag>;
          case OrderStatusEnum.STATUS_PAID:
            return <Tag color="green">{t('labelPaid')}</Tag>;
          case OrderStatusEnum.STATUS_CANCELED:
            return <Tag color="green">{t('labelCanceled')}</Tag>;
          case OrderStatusEnum.STATUS_ASSIGNED:
            return <Tag color="green">{t('labelAssigned')}</Tag>;
          default:
            return <Tag color="green">{t('labelComplete')}</Tag>;
        }
      },
    },
    {
      title: t('labelAmount'),
      dataIndex: 'amount',
      width: '11%',
      sorter: true,
    },
    {
      title: t('labelFleetCommissionTips'),
      dataIndex: 'fleetCommissionTips',
      width: '11%',
    },
    {
      title: t('labelCreatedDate'),
      dataIndex: 'createdAt',
      width: '11%',
      sorter: true,
    },
    {
      title: t('labelAction'),
      width: '10%',
      render: item => (
        <span>
          {appStore.hasPermissions(appStore.permissions, ['OrderList']) && (
            <React.Fragment>
              <RiftLink to={`/admin/dispatcher/${item.id}`} className="statement-list-table__pointer">
                <Tooltip title={t('labelOrderDetails')}>
                  <Icon type="eye" style={{fontSize: '24px'}} theme="twoTone" twoToneColor="#0275d8" />
                </Tooltip>
              </RiftLink>
            </React.Fragment>
          )}
        </span>
      ),
    },
  ];
  columns = appStore.hasRole(appStore.roles, ['TYPE_FLEET_OWNER'])
    ? columns.filter(elem => elem.dataIndex !== 'company')
    : columns;

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
    <div style={{overflow: 'hidden', overflowX: 'auto'}} className="statement-list-table">
      <div style={{minWidth: 1070}}>
        <Table
          className={'table'}
          pagination={false}
          columns={!appStore.isAdminFromManageTransaction ? columns : columns.slice(0, -2)}
          dataSource={mappedData}
          onChange={handleChange}
          size="middle"
          locale={{emptyText: <span>{`${t('msgThereAreNo')} ${t('labelOrders')} ${t('msgToDisplay')}.`}</span>}}
        />
        <Row type="flex" justify="start" align="top" style={{marginBottom: 10}}>
          <Col xs={24} sm={24} md={12} lg={16} xl={16} className="statement-list-table__pagination-info">
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

export default StatementsListTable;
