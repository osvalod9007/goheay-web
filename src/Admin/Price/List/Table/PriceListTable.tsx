import React, {useContext, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import gql from 'graphql-tag';
import {Col, Icon, Modal, Table, Tag, Tooltip, Pagination, Rate, Row} from 'antd';
import {RiftLink} from 'rift-router';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-apollo-hooks';
import moment from 'moment';

import AppStore from '../../../../shared/stores/App.store';
import {SortTypesEnum} from '../../../../shared/enums/SortType.enum';
import PriceModel from '../../../../shared/models/Price.model';
import PaginateInfo from '../../../../shared/components/PaginateInfo/PaginateInfo';
import openNotificationWithIcon from '../../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';

import './PriceListTable.less';
import {VehicleTypeStatusEnum} from '../../../../shared/enums/VehicleTypeStatus.enum';

const GET_LIST = gql`
  query($input: GenericFilterInput) {
    VehicleTypeList(input: $input) {
      total
      items {
        id
        type
        statusPricing
        createdAt
      }
    }
  }
`;
const confirm = Modal.confirm;

const PriceListTable = observer((props: any) => {
  const appStore = useContext(AppStore);
  const {t} = useTranslation('app');
  const [mappedData, setMappedData] = useState([]);
  const [count, setCount] = useState(0);
  const {pageSize, page, orderBy} = props.input;
  let {where} = props.input;
  const convertOrder = [
    {key: 'type', value: 'type'},
    {key: 'status', value: 'statusPricing'},
    {key: 'created', value: 'createdAt'},
  ];
  const [fieldKeyWord] = where.filter(element => element.field === 'keyword');
  where = where.filter(element => element.field !== 'keyword');
  where.push({field: 'keywordPricing', value: fieldKeyWord.value, op: fieldKeyWord.op});
  const keywordIncluded = where && where[0] && where[0].value !== '' ? true : false;
  useEffect(() => {
    orderBy.unshift({field: 'statusPricing', orderType: SortTypesEnum.ASC});
  }, []);

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

  const onDelete = id => {
    confirm({
      title: `${t('msgConfirmDeleteElem')} ${t('labelPrice')}?`,
      okText: t('Yes'),
      okType: 'danger',
      cancelText: t('No'),
      onOk: () => {
        deleteElem(id);
      },
    });
  };

  const deleteElem = async (id: any) => {
    try {
      appStore.setIsLoading(true);
      const itemToDelete: any = await PriceModel.delete({where: [{field: 'id', value: id, isPk: true}]});
      if (itemToDelete) {
        const msg = `${t('labelA')} ${t('labelPrice')} ${t('labelWasDeleted')}`;
        openNotificationWithIcon('success', msg, '');
        reFetchData();
      }
      appStore.setIsLoading(false);
    } catch (e) {
      appStore.setIsLoading(false);
      openNotificationWithIcon('error', t('lavelDeleteFailed'), e);
    }
  };

  useEffect(() => {
    appStore.setIsLoading(true);
    const onCompleted = result => {
      appStore.setIsLoading(false);
      const {items, total} = result.VehicleTypeList;
      let number = (page - 1) * pageSize;
      const mappedDataTmp = items.map(item => {
        number += 1;
        const {id, type, createdAt, statusPricing} = item;
        return {
          id,
          key: number,
          type: type || '',
          created: moment(createdAt).format('MM/DD/YYYY'),
          status: statusPricing || '',
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
        data.VehicleTypeList && onCompleted(data);
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
      title: t('labelVehicleType'),
      dataIndex: 'type',
      width: '20%',
      sorter: true,
    },
    {
      title: t('labelStatus'),
      width: '20%',
      sorter: true,
      render: item => {
        switch (item.status) {
          case VehicleTypeStatusEnum.PRICING_PENDING:
            return <Tag color="red">{t('labelPending')}</Tag>;
          default:
            return <Tag color="green">{t('labelClear')}</Tag>;
        }
      },
    },
    {
      title: t('labelCreatedDate'),
      dataIndex: 'created',
      width: '20%',
      sorter: true,
    },
    {
      title: t('labelAction'),
      width: '10%',
      render: item => (
        <span>
          {appStore.hasPermissions(appStore.permissions, ['PriceProductSizeUpdate']) && (
            <React.Fragment>
              <RiftLink to={`/admin/price/${item.id}`} className="price-list-table__pointer">
                <Tooltip title={t('labelEdit')}>
                  <Icon type="edit" style={{fontSize: '18px'}} theme="twoTone" twoToneColor="#0275d8" />
                </Tooltip>
              </RiftLink>
            </React.Fragment>
          )}
          {appStore.hasPermissions(appStore.permissions, ['PriceProductSizeDelete']) && (
            <React.Fragment>
              <Tooltip title={t('labelDelete')}>
                <Icon
                  type="delete"
                  style={{fontSize: '18px'}}
                  onClick={() => onDelete(item.id)}
                  className="price-list-table__pointer"
                  theme="twoTone"
                  twoToneColor="#e33244"
                />
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
    <div style={{overflow: 'hidden', overflowX: 'auto'}} className="price-list-table">
      <div style={{minWidth: 1070}}>
        <Table
          className={'table'}
          pagination={false}
          columns={columns}
          dataSource={mappedData}
          onChange={handleChange}
          size="middle"
          locale={{emptyText: <span>{`${t('msgThereAreNo')} ${t('labelPricing')} ${t('msgToDisplay')}.`}</span>}}
        />
        <Row type="flex" justify="start" align="top" style={{marginBottom: 10}}>
          <Col xs={24} sm={24} md={12} lg={16} xl={16} className="price-list-table__pagination-info">
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

export default PriceListTable;
