import React, {useContext, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Card, Row, Col, Radio, Avatar} from 'antd';
import avatars from '../../../Admin/male-avatar.svg';
import './UniqueUserModal.less';
import UniqueUserModalStore from '../../stores/UniqueUserModal.store';
import {useTranslation} from 'react-i18next';
type Props = {
  item: any;
  setSelectedItem: any;
};
export const MergeUser = observer(
  (props: Props): JSX.Element => {
    const {t} = useTranslation('app');
    const uniqueUserModalStore = useContext(UniqueUserModalStore);
    let rol: any;
    const {fullName, email, fullMobilePhone, avatar, id, roles} = props.item;
    const handleSelectedItem = () => {
      props.setSelectedItem(props.item);
    };

    if (roles && roles[1]) {
      switch (roles[1].name) {
        case 'TYPE_FLEET_OWNER':
          rol = t('labelFleetOwnerUpper');
          break;
        case 'TYPE_DRIVER':
          rol = t('labelDriver');
          break;
        case 'TYPE_ACCOUNT_MANAGER':
          rol = t('labelAccountManager');
          break;
        default:
          rol = t('labelCustomer');
          break;
      }
    }

    return (
      <div className={'unique-user-view-modal'}>
        <Card
          className={
            id === uniqueUserModalStore.userId
              ? ['style-card-merge-users-available', 'selected'].join(' ')
              : 'style-card-merge-users-available'
          }
          onClick={handleSelectedItem}
        >
          <div className="style-card-merge-users-content">
            <Row type="flex">
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Row type="flex" align={'middle'}>
                  <Col xs={24} sm={2} md={2} lg={2} xl={2}>
                    <Avatar size="large" src={avatar ? avatar.publicUrl : avatars} />
                  </Col>
                  <Col xs={24} sm={22} md={22} lg={22} xl={22}>
                    <Row>
                      <p style={{marginLeft: '2%', fontWeight: 'bold'}}>
                        {fullName} / {rol}
                      </p>
                    </Row>
                    <Row>
                      <p style={{marginLeft: '2%'}}>
                        {email} / {fullMobilePhone}
                      </p>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Card>
      </div>
    );
  },
);

export default MergeUser;
