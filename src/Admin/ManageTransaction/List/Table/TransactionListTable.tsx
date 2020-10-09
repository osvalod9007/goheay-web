import React, {useContext, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import gql from 'graphql-tag';
import {Col, Icon, Table, Pagination, Row, Tooltip, Popconfirm} from 'antd';
import {RiftLink, useRouter} from 'rift-router';
import {useTranslation} from 'react-i18next';
import {useQuery, useMutation} from 'react-apollo-hooks';

import AppStore from '../../../../shared/stores/App.store';
import {SortTypesEnum} from '../../../../shared/enums/SortType.enum';
import PaginateInfo from '../../../../shared/components/PaginateInfo/PaginateInfo';
import appModel from '../../../../shared/models/App.model';

import './TransactionListTable.less';
import openNotificationWithIcon from '../../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';
import moment from 'moment';

const GET_LIST = gql`
  query($input: GenericFilterInput) {
    FleetOwnerTransactionList(input: $input) {
      page
      pageSize
      total
      items {
        id
        periodStartAt
        periodEndAt
        periodToString
        companyName
        fleetOwnerFullName
        orderCount
        moneyAmountCurrency {
          amount
          currency
        }
        status
        fleetOwner {
          basicProfile {
            isConfigurePaymentStripeAccount
          }
        }
      }
    }
  }
`;
const TRANSFER_MUTATION = gql`
  mutation($input: FleetOwnerTransactionTransferCreateInput!) {
    FleetOwnerTransactionTransferCreate(input: $input) {
      id
      measureAmount {
        amount
        currency
      }
    }
  }
`;
const TransactionsListTable = observer((props: any) => {
  const appStore = useContext(AppStore);
  const {t} = useTranslation('app');
  const router = useRouter();
  const [mappedData, setMappedData] = useState([]);
  const [count, setCount] = useState(0);
  const {pageSize, page, where, orderBy, tab} = props.input;
  const filter: any = [];
  where && where[0].value !== '' && filter.push(where[0]);
  where && where[1] && filter.push(where[1]);
  where && where[2] && filter.push(where[2]);
  where && where[3] && filter.push(where[3]);

  const convertOrder = [
    {key: 'range', value: 'periodToString'},
    {key: 'companyName', value: 'companyName'},
    {key: 'fleetOwnerFullName', value: 'fleetOwnerFullName'},
    {key: 'orderCount', value: 'orderCount'},
    {key: 'amountToString', value: 'amountToString'},
  ];

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

  const handleTransfer = fleetOwnerTransactionId => {
    appStore.setIsLoading(true);
    appStore.setUserAction({...appStore.userAction, ...{typeOfElem: 'labelPaid'}});
    transferMutation({
      variables: {
        input: {
          fleetOwnerTransactionId,
        },
      },
    }).catch(err => {
      handleCatch(err, {}, '');
      appStore.setIsLoading(false);
    });
  };

  const handleCatch = (err, values, textType) => {
    if (err && err.networkError && err.networkError.statusCode === 403) {
      appModel.logout();
      window.location.href = '/admin/login';
    } else {
      const {validation} = err.graphQLErrors[0];
      if (typeof validation === 'object') {
        Object.entries(validation).forEach(([key, value]) => {
          let msg = '';
          switch (value) {
            default: {
              msg = `${value}`;
              break;
            }
          }
          openNotificationWithIcon('error', t('lavelSaveFailed'), msg);
        });
      } else {
        openNotificationWithIcon('error', t('lavelSaveFailed'), err.message);
      }
    }
  };

  const transferMutation = useMutation(TRANSFER_MUTATION, {
    update: (proxy, result) => {
      /* your custom update logic */
      setTimeout(() => {
        appStore.setIsLoading(true);
        const {errors} = result;
        if (!errors) {
          appStore.setUserAction({
            ...appStore.userAction,
            ...{isSaved: true, action: 'created'},
          });
          reFetchData();
          appStore.setIsLoading(false);
        } else {
          const messages = [];
          for (const e of errors) {
            const obj = JSON.parse(e.message);
            for (const key in obj) {
              // messages.push(obj[key]);
            }
          }
          openNotificationWithIcon('error', t('lavelSaveFailed'), messages[0]);
        }
      });
    },
  });

  useEffect(() => {
    appStore.setIsLoading(true);
    const onCompleted = result => {
      appStore.setIsLoading(false);
      const {items, total} = result.FleetOwnerTransactionList;
      let number = (page - 1) * pageSize;
      const mappedDataTmp: any = items.map(item => {
        number += 1;
        const {
          id,
          periodStartAt,
          periodEndAt,
          periodToString,
          companyName,
          fleetOwnerFullName,
          orderCount,
          moneyAmountCurrency,
          status,
          fleetOwner,
        } = item;
        return {
          id,
          key: number,
          periodStartAt,
          periodEndAt,
          periodToString,
          companyName,
          fleetOwnerFullName,
          orderCount,
          status,
          moneyAmountCurrency,
          isConfigurePaymentStripeAccount:
            (fleetOwner && fleetOwner.basicProfile && fleetOwner.basicProfile.isConfigurePaymentStripeAccount) || false,
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
      title: t('labelRange'),
      width: '15%',
      render: item => {
        const [start] = item.periodStartAt.split('T');
        const [end] = item.periodEndAt.split('T');
        return (
          <span>
            {item.periodStartAt && item.periodEndAt
              ? `${moment(start).format('MM/DD/YYYY')} - ${moment(end).format('MM/DD/YYYY')}`
              : null}
          </span>
        );
      },
    },
    {
      title: t('labelCompany'),
      dataIndex: 'companyName',
      width: '15%',
      // sorter: true,
    },
    {
      title: t('labelFleetOwner'),
      dataIndex: 'fleetOwnerFullName',
      width: '15%',
      // sorter: true,
    },
    {
      title: t('labelNoOrders'),
      dataIndex: 'orderCount',
      width: '11%',
      // sorter: true,
    },
    {
      title: t('labelTotalAmount'),
      width: '11%',
      render: item =>
        item.moneyAmountCurrency && item.moneyAmountCurrency.amount ? (
          <span>$ {item.moneyAmountCurrency.amount.toFixed(2)}</span>
        ) : (
          <span>$ {(0).toFixed(2)}</span>
        ),
      // sorter: true,
    },
    {
      title: t('labelAction'),
      width: '10%',
      render: item => (
        <span>
          {appStore.hasRole(appStore.roles, ['TYPE_SUPER_ADMIN']) && item.status === 'STATUS_PENDING' && (
            <React.Fragment>
              <Tooltip
                title={`${item.isConfigurePaymentStripeAccount ? t('labelTransfer') : t('labelPaymentMethodRequired')}`}
              >
                <Popconfirm
                  disabled={!item.isConfigurePaymentStripeAccount}
                  icon={<Icon type="retweet" style={{color: '#0275d8'}} />}
                  placement="topRight"
                  title={`${t('msgConfirmTransfer')} \$${
                    item.moneyAmountCurrency && item.moneyAmountCurrency.amount
                      ? item.moneyAmountCurrency.amount.toFixed(2)
                      : (0).toFixed(2)
                  } ${t('msgTo')} ${item.companyName} ?`}
                  onConfirm={() => handleTransfer(item.id)}
                  okText={t('Yes')}
                  cancelText={t('No')}
                  okType="danger"
                >
                  <Icon
                    type={'retweet'}
                    style={{fontSize: '22px', color: item.isConfigurePaymentStripeAccount ? '#0275d8' : 'gray'}}
                  />
                </Popconfirm>
              </Tooltip>
            </React.Fragment>
          )}
          <React.Fragment>
            <RiftLink to={`/admin/statement?from=${item.id}`} className="transaction-list-table__pointer">
              <Tooltip title={`${t('labelOrdersDetails')}`}>
                <Icon type={'audit'} style={{fontSize: '18px', color: '#0275d8'}} />
              </Tooltip>
            </RiftLink>
          </React.Fragment>
        </span>
      ),
    },
  ];
  columns = appStore.hasRole(appStore.roles, ['TYPE_FLEET_OWNER'])
    ? columns.filter(column => column.dataIndex !== 'companyName')
    : columns;
  columns = appStore.hasRole(appStore.roles, ['TYPE_FLEET_OWNER'])
    ? columns.filter(column => column.dataIndex !== 'fleetOwnerFullName')
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
    <div style={{overflow: 'hidden', overflowX: 'auto'}} className="transaction-list-table">
      <div style={{minWidth: 1070}}>
        <Table
          className={'table'}
          pagination={false}
          columns={columns}
          dataSource={mappedData}
          onChange={handleChange}
          size="middle"
          locale={{
            emptyText: (
              <span>{`${t('msgThereAreNo')}  ${
                props.input.tab === 'pending'
                  ? `${t('labelPending')} ${t('labelTransactions')}`
                  : props.input.tab === 'open'
                  ? `${t('labelOpen')} ${t('labelTransactions')}`
                  : `${t('labelPaid')} ${t('labelTransactions')}`
              } ${t('msgToDisplay')}.`}</span>
            ),
          }}
        />
        <Row type="flex" justify="start" align="top" style={{marginBottom: 10}}>
          <Col xs={24} sm={24} md={12} lg={16} xl={16} className="transaction-list-table__pagination-info">
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

export default TransactionsListTable;
