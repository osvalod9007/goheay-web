import React, {useContext, useState, useEffect} from 'react';
import {Form, Icon, Modal, Spin, Input, AutoComplete, List} from 'antd';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import AppStore from '../../stores/App.store';

import './UniqueUserModal.less';
import UniqueUserModalStore from '../../stores/UniqueUserModal.store';
import MergeUser from './MergeUserList';
import {useQuery} from 'react-apollo-hooks';
import gql from 'graphql-tag';

type Props = {
  handleSubmit?: any;
};

const GET_LIST = gql`
  query($input: BasicProfileListExistFilterInput!) {
    BasicProfileListExist(input: $input) {
      total
      items {
        id
        fullName
        email
        fullMobilePhone
        mobilePhone
        mobilePhoneCode
        avatar {
          publicUrl
        }
        roles {
          name
        }
      }
    }
  }
`;

export const UniqueUserModal = observer(
  (props: Props): JSX.Element => {
    const appStore = useContext(AppStore);
    const uniqueUserModalStore = useContext(UniqueUserModalStore);
    const [itemsView, setItemsView] = useState([]);
    const {t} = useTranslation('app');

    const config = {
      pageSize: 1000,
      page: 1,
      email: uniqueUserModalStore.email,
      mobilePhoneCode: uniqueUserModalStore.mobilePhoneCode,
      mobilePhone: uniqueUserModalStore.mobilePhone,
      checkUserConvert: uniqueUserModalStore.type,
    };
    const {data, error, loading} = useQuery(GET_LIST, {
      suspend: false,
      variables: {
        input: config,
      },
      fetchPolicy: 'network-only',
    });

    useEffect(() => {
      appStore.setIsLoading(true);
      const onCompleted = result => {
        appStore.setIsLoading(false);
        const {items, total} = result.BasicProfileListExist;
        const mappedDataTmp = items.map(element => {
          const {id, fullName, email, fullMobilePhone, mobilePhone, mobilePhoneCode, avatar, roles} = element;
          return {
            id,
            fullName,
            email,
            fullMobilePhone,
            mobilePhone,
            mobilePhoneCode,
            avatar,
            roles,
          };
        });
        setItemsView(mappedDataTmp);
      };

      const onError = paramError => {
        appStore.setIsLoading(false);
        return <div>{paramError}</div>;
      };

      if (onCompleted || onError) {
        if (onCompleted && !loading && !error) {
          uniqueUserModalStore.isOpenModalView && onCompleted(data);
        } else if (onError && !loading && error) {
          onError(error);
        }
      }
    }, [loading, data, error]);

    const handleSubmit = e => {
      setItemsView([]);
      uniqueUserModalStore.setIsOpenModalView(false);
      handleSubmit && props.handleSubmit();
    };

    const setSelectedItem = item => {
      uniqueUserModalStore.setUserId(item.id);
    };

    return (
      <div className="unique-user-view-modal">
        <Modal
          title={
            <React.Fragment>
              <Icon type="team" /> {t('labelMergeUsers')}
            </React.Fragment>
          }
          visible={uniqueUserModalStore.isOpenModalView}
          onCancel={() => {
            uniqueUserModalStore.setUserId('');
            setItemsView([]);
            uniqueUserModalStore.setIsOpenModalView(false);
            uniqueUserModalStore.setIsUserConvert(false);
          }}
          okText={t('labelContinue')}
          cancelText={t('labelCancel')}
          width={'617px'}
          onOk={handleSubmit}
          destroyOnClose={true}
          okButtonProps={{disabled: uniqueUserModalStore.userId === ''}}
        >
          <Spin spinning={appStore.isLoading} size="large">
            <h4>{uniqueUserModalStore.message}</h4>
            {itemsView.length > 0 ? (
              <List
                dataSource={itemsView}
                renderItem={(item: any) => (
                  <List.Item key={item.key}>
                    <MergeUser item={item} setSelectedItem={setSelectedItem} />
                  </List.Item>
                )}
              />
            ) : null}
          </Spin>
        </Modal>
      </div>
    );
  },
);

export default UniqueUserModal;
