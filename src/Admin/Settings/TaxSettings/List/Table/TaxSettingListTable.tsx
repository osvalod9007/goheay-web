import React, {useContext, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import gql from 'graphql-tag';
import {Icon, Modal, Table, Tooltip, Pagination, Popconfirm, Row, Col} from 'antd';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-apollo-hooks';

import AppStore from '../../../../../shared/stores/App.store';
import TaxStore from '../../../../../shared/stores/Tax.store';
import {SortTypesEnum} from '../../../../../shared/enums/SortType.enum';
import taxSettingModel from '../../../../../shared/models/TaxSetting.model';
import PaginateInfo from '../../../../../shared/components/PaginateInfo/PaginateInfo';
import openNotificationWithIcon from '../../../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';
import appModel from '../../../../../shared/models/App.model';
// import TaxSettingsForm from '../../Form/TaxSettingsForm';

import './TaxSettingListTable.less';
import formatNumber from '../../../../../shared/utils/FormatNumber';

const TaxSettingsForm = React.lazy(() => import('../../Form/TaxSettingsForm'));

const GET_LIST = gql`
  query($input: GenericFilterInput) {
    SettingTaxList(input: $input) {
      page
      pageSize
      total
      items {
        id
        state {
          id
          name
        }
        tax
      }
    }
  }
`;
const confirm = Modal.confirm;

const convertOrder = [{key: 'state', value: 'state.name'}, {key: 'tax', value: 'tax'}];

const TaxSettingListTable = observer((props: any) => {
  const appStore = useContext(AppStore);
  const taxStore = useContext(TaxStore);
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
      const itemToDelete: any = await taxSettingModel.deleteTaxSetting({
        where: [{field: 'id', value: id, isPk: true}],
      });
      reFetchData();
      if (itemToDelete && itemToDelete.data.SettingTaxDelete.isSuccess) {
        const msg = `${t('labelA')} ${t('labelTaxSetting')} ${t('labelWasDeleted')}.`;
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

  const handleCatch = (err, values, textType) => {
    if (err && err.networkError && err.networkError.statusCode === 403) {
      appModel.logout();
      window.location.href = '/admin/login';
    } else {
      const {validation, ...others} = err.graphQLErrors[0];
      if (typeof validation === 'object') {
        Object.entries(validation).forEach(([key, value]) => {
          const obj = {};
          let msg = '';
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
              msg = `${value}`;
              break;
            }
          }
          if (msg !== '') {
            openNotificationWithIcon('error', msg, '');
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
      const {items, total} = result.SettingTaxList;
      let number = (page - 1) * pageSize;
      const usedStates: any[] = [];
      const mappedDataTmp = items.map(item => {
        number += 1;
        const {id, tax, state} = item;
        usedStates.push(state.id);
        return {
          id,
          key: number,
          tax: formatNumber.formatFloat(tax) || 0,
          state: state ? state.name : '',
        };
      });
      taxStore.setUsedStates(usedStates);
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
    taxStore.setShouldUpdateTable(false);
    refetch({
      input: {
        page,
        pageSize,
        order: orderBy,
        ...(keywordIncluded && {where}),
      },
    });
  };

  const openEditForm = id => {
    taxStore.setIdToEdit(id);
    appStore.setIsOpenModalForm(true);
  };

  useEffect(() => {
    reFetchData();
  }, [props.input, taxStore.shouldUpdateTable]);

  const columns = [
    {
      title: t('labelNoDot'),
      dataIndex: 'key',
      width: '5%',
    },
    {
      title: t('labelState'),
      dataIndex: 'state',
      width: '20%',
      sorter: true,
    },
    {
      title: t('labelTaxSettingPercent'),
      dataIndex: 'tax',
      width: '15%',
      sorter: true,
    },
    {
      title: t('labelAction'),
      width: '7%',
      render: item => (
        <span>
          {appStore.hasPermissions(appStore.permissions, ['SettingTaxUpdate']) && (
            <React.Fragment>
              <Tooltip title={t('labelEdit')}>
                <Icon
                  onClick={() => openEditForm(item.id)}
                  type="edit"
                  style={{fontSize: '18px'}}
                  className="tax-setting-list-table__pointer"
                  theme="twoTone"
                  twoToneColor="#0275d8"
                />
              </Tooltip>
            </React.Fragment>
          )}
          {appStore.hasPermissions(appStore.permissions, ['SettingTaxDelete']) && (
            <React.Fragment>
              <Tooltip title={t('labelDelete')}>
                <Popconfirm
                  icon={<Icon type="question-circle-o" style={{color: '#e33244'}} />}
                  placement="topRight"
                  title={`${t('msgConfirmDeleteElem')} ${t('labelTaxSetting')}?`}
                  onConfirm={() => deleteElem(item.id)}
                  okText={t('Yes')}
                  cancelText={t('No')}
                  okType="danger"
                >
                  <Icon
                    type="delete"
                    style={{fontSize: '18px'}}
                    className="tax-setting-list-table__pointer"
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
    <div style={{overflow: 'hidden', overflowX: 'auto'}} className="tax-setting-list-table">
      <div style={{minWidth: 1070}}>
        <Table
          className={'table'}
          pagination={false}
          columns={columns}
          dataSource={mappedData}
          onChange={handleChange}
          size="middle"
          locale={{emptyText: <span>{`${t('msgThereAreNo')} ${t('labelTaxes')} ${t('msgToDisplay')}.`}</span>}}
        />
        <Row type="flex" justify="start" align="top" style={{marginBottom: 10}}>
          <Col xs={24} sm={24} md={12} lg={16} xl={16} className="tax-setting-list-table__pagination-info">
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
      {appStore.isOpenModalForm ? <TaxSettingsForm /> : null}
    </div>
  );
});

export default TaxSettingListTable;
