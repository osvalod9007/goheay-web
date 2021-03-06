import React, {useContext, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import gql from 'graphql-tag';
import {Col, Icon, Modal, Pagination, Popconfirm, Rate, Row, Table, Tooltip} from 'antd';
import {RiftLink} from 'rift-router';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-apollo-hooks';

import AppStore from '../../../../shared/stores/App.store';
import {SortTypesEnum} from '../../../../shared/enums/SortType.enum';
import customerModel from '../../../../shared/models/Customer.model';
import PaginateInfo from '../../../../shared/components/PaginateInfo/PaginateInfo';
import openNotificationWithIcon from '../../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';
import appModel from '../../../../shared/models/App.model';
import formatPhone from '../../../../shared/utils/formatPhone';

import './CustomersListTable.less';
import {FormatPhoneTypeEnum} from '../../../../shared/enums/FormatPhoneType.enum';

const GET_LIST = gql`
  query($input: GenericFilterInput) {
    CustomerList(input: $input) {
      total
      items {
        id
        rating
        basicProfile {
          fullName
          email
          mobilePhone
          mobilePhoneCode
          createdAt
        }
        ordersInProgress
      }
    }
  }
`;
const confirm = Modal.confirm;

const convertOrder = [
  {key: 'fullName', value: 'fullName'},
  {key: 'email', value: 'basicProfile.email'},
  {key: 'mobile', value: 'fullMobilePhone'},
  {key: 'rating', value: 'rating'},
  {key: 'created', value: 'createdAt'},
];

const CustomersListTable = observer((props: any) => {
  const appStore = useContext(AppStore);
  const {t} = useTranslation('app');
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

  const deleteElem = async (id: any) => {
    try {
      appStore.setIsLoading(true);
      const itemToDelete: any = await customerModel.deleteCustomer({where: [{field: 'id', value: id, isPk: true}]});
      if (itemToDelete && itemToDelete.data.CustomerDelete.isSuccess) {
        const msg = `${t('labelA')} ${t('labelCustomer')} ${t('labelWasDeleted')}`;
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
      const {items, total} = result.CustomerList;
      let number = (page - 1) * pageSize;
      const mappedDataTmp = items.map(item => {
        number += 1;
        const {id, rating, basicProfile, ordersInProgress} = item;
        return {
          id,
          key: number,
          fullName: basicProfile ? basicProfile.fullName : '-',
          email: basicProfile ? basicProfile.email : '-',
          mobile: basicProfile.mobilePhone
            ? formatPhone.formatsGeneral(basicProfile.mobilePhone, true, '1', FormatPhoneTypeEnum.NATIONAL)
            : '',
          rating,
          created: appStore.getCreatedAtDate(basicProfile.createdAt),
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

  const columns = [
    {
      title: t('labelNoDot'),
      dataIndex: 'key',
      width: '5%',
    },
    {
      title: t('labelFullName'),
      dataIndex: 'fullName',
      width: '20%',
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
      width: '11%',
      sorter: true,
    },
    {
      title: t('labelRating'),
      width: '11%',
      dataIndex: 'rating',
      sorter: true,
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
          {appStore.hasPermissions(appStore.permissions, ['CustomerUpdate']) && (
            <React.Fragment>
              {!item.ordersInProgress ? (
                <RiftLink to={`/admin/customer/${item.id}`} className="customers-list-table__pointer">
                  <Tooltip title={t('labelEdit')}>
                    <Icon type="edit" style={{fontSize: '18px'}} theme="twoTone" twoToneColor="#0275d8" />
                  </Tooltip>
                </RiftLink>
              ) : (
                <Tooltip title={t('labelNoAction')} className={'customers-list-table__not-allowed'}>
                  <Icon type="edit" style={{fontSize: '18px'}} theme="twoTone" twoToneColor="gray" />
                </Tooltip>
              )}
            </React.Fragment>
          )}
          {appStore.hasPermissions(appStore.permissions, ['CustomerDelete']) && (
            <React.Fragment>
              <Tooltip title={t('labelDelete')}>
                <Popconfirm
                  icon={<Icon type="question-circle-o" style={{color: '#e33244'}} />}
                  placement="topRight"
                  title={`${t('msgConfirmDeleteElem')} ${t('labelCustomer')}?`}
                  onConfirm={() => deleteElem(item.id)}
                  okText={t('Yes')}
                  cancelText={t('No')}
                  okType="danger"
                >
                  <Icon
                    type="delete"
                    style={{fontSize: '18px'}}
                    className="customers-list-table__pointer"
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
    <div style={{overflow: 'hidden', overflowX: 'auto'}} className="customers-list-table">
      <div style={{minWidth: 1070}}>
        <Table
          className={'table'}
          pagination={false}
          columns={columns}
          dataSource={mappedData}
          onChange={handleChange}
          size="middle"
          locale={{emptyText: <span>{`${t('msgThereAreNo')} ${t('labelCustomer')} ${t('msgToDisplay')}.`}</span>}}
        />
        <Row type="flex" justify="start" align="top" style={{marginBottom: 10}}>
          <Col xs={24} sm={24} md={12} lg={16} xl={16} className="customers-list-table__pagination-info">
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

export default CustomersListTable;
