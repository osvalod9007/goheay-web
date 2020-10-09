import React, {useContext, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import gql from 'graphql-tag';
import {Col, Icon, Modal, Pagination, Popconfirm, Row, Table, Tooltip} from 'antd';
import {RiftLink} from 'rift-router';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-apollo-hooks';

import AppStore from '../../../../shared/stores/App.store';
import {SortTypesEnum} from '../../../../shared/enums/SortType.enum';
import accountManagerModel from '../../../../shared/models/AccountManager.model';
import PaginateInfo from '../../../../shared/components/PaginateInfo/PaginateInfo';
import openNotificationWithIcon from '../../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';
import {RolesEnum} from '../../../../shared/enums/Roles.enum';
import appModel from '../../../../shared/models/App.model';
import formatPhone from '../../../../shared/utils/formatPhone';

import './AccountManagerListTable.less';
import {FormatPhoneTypeEnum} from '../../../../shared/enums/FormatPhoneType.enum';

const GET_LIST = gql`
  query($input: GenericFilterInput) {
    AccountManagerList(input: $input) {
      total
      items {
        id
        role
        basicProfile {
          fullName
          email
          mobilePhone
          mobilePhoneCode
          createdAt
        }
      }
    }
  }
`;
const confirm = Modal.confirm;

const AccountManagerListTable = observer((props: any) => {
  const appStore = useContext(AppStore);
  const {t} = useTranslation('app');
  const [mappedData, setMappedData] = useState([]);
  const [count, setCount] = useState(0);
  const {pageSize, page, where, orderBy} = props.input;
  const keywordIncluded = where && where[0].value !== '' ? true : false;
  const convertOrder = [
    {key: 'fullName', value: 'fullName'},
    {key: 'role', value: 'role'},
    {key: 'email', value: 'basicProfile.email'},
    {key: 'mobile', value: 'fullMobilePhone'},
    {key: 'created', value: 'basicProfile.createdAt'},
  ];

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
      const itemToDelete: any = await accountManagerModel.delete({where: [{field: 'id', value: id, isPk: true}]});
      if (itemToDelete && itemToDelete.data.AccountManagerDelete.isSuccess) {
        const msg = `${t('labelA')} ${t('labelAccountManager')} ${t('labelWasDeleted')}`;
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
      const {items, total} = result.AccountManagerList;
      let number = (page - 1) * pageSize;
      const mappedDataTmp = items.map(item => {
        number += 1;
        const {id, role, basicProfile} = item;
        return {
          id,
          key: number,
          role: role === RolesEnum.ROLE_ADMINISTRATOR ? t('labelAdmin') : t('labelDispatcher'),
          fullName: basicProfile.fullName || '',
          email: basicProfile.email || '',
          mobile: basicProfile.mobilePhone
            ? formatPhone.formatsGeneral(basicProfile.mobilePhone, true, '1', FormatPhoneTypeEnum.NATIONAL)
            : '',
          created: appStore.getCreatedAtDate(basicProfile.createdAt),
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
      title: t('labelRole'),
      dataIndex: 'role',
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
      title: t('labelCreatedDate'),
      dataIndex: 'created',
      width: '11%',
      sorter: true,
    },
    {
      title: t('labelAction'),
      width: '7%',
      render: item => (
        <span>
          {appStore.hasPermissions(appStore.permissions, ['AccountManagerUpdate']) && (
            <React.Fragment>
              <RiftLink to={`/admin/accountmanager/${item.id}`} className="account-manager-list-table__pointer">
                <Tooltip title={t('labelEdit')}>
                  <Icon type="edit" style={{fontSize: '18px'}} theme="twoTone" twoToneColor="#0275d8" />
                </Tooltip>
              </RiftLink>
            </React.Fragment>
          )}
          {appStore.hasPermissions(appStore.permissions, ['AccountManagerDelete']) && (
            <React.Fragment>
              <Tooltip title={t('labelDelete')}>
                <Popconfirm
                  icon={<Icon type="question-circle-o" style={{color: '#e33244'}} />}
                  placement="topRight"
                  title={`${t('msgConfirmDeleteElem')} ${t('labelAccountManager')}?`}
                  onConfirm={() => deleteElem(item.id)}
                  okText={t('Yes')}
                  cancelText={t('No')}
                  okType="danger"
                >
                  <Icon
                    type="delete"
                    style={{fontSize: '18px'}}
                    className="account-manager-list-table__pointer"
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
    <div style={{overflow: 'hidden', overflowX: 'auto'}} className="account-manager-list-table">
      <div style={{minWidth: 1070}}>
        <Table
          className={'table'}
          pagination={false}
          columns={columns}
          dataSource={mappedData}
          onChange={handleChange}
          size="middle"
          locale={{
            emptyText: <span>{`${t('msgThereAreNo')} ${t('labelAccountManagers')} ${t('msgToDisplay')}.`}</span>,
          }}
        />
        <Row type="flex" justify="start" align="top" style={{marginBottom: 10}}>
          <Col xs={24} sm={24} md={12} lg={16} xl={16} className="account-manager-list-table__pagination-info">
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

export default AccountManagerListTable;
