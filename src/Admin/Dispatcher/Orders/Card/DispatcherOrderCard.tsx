import React, {useContext} from 'react';
import {observer} from 'mobx-react-lite';
import {Avatar, Icon, Popconfirm, Tag, Tooltip} from 'antd';
import {RiftLink} from 'rift-router';
import {useTranslation} from 'react-i18next';

import AppStore from '../../../../shared/stores/App.store';
import {OrderStatusEnum} from '../../../../shared/enums/OrderStatus.enum';
import OrderStore from '../../../../shared/stores/Order.store';
import MapStore from '../../../../shared/stores/Map.store';
import openNotificationWithIcon from '../../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';
import appModel from '../../../../shared/models/App.model';
import formatPhone from '../../../../shared/utils/formatPhone';

import './DispatcherOrderCard.less';
import {FormatPhoneTypeEnum} from '../../../../shared/enums/FormatPhoneType.enum';

type Props = {
  item: any;
  tab: any;
  onSelectOrder: (order) => void;
  selectedOrder: any;
  onCancel: (id) => void;
  updateConfig: (data) => void;
};

const DispatcherOrderCard = observer((props: Props) => {
  const appStore = useContext(AppStore);
  const mapStore = useContext(MapStore);
  const orderStore = useContext(OrderStore);
  const {t} = useTranslation('app');

  const {item, selectedOrder, tab} = props;
  const isPending: boolean = tab === 'pendingOrders' ? true : false;

  const onView = () => {
    orderStore.setOrderSelect(props.item);
  };

  const onAssign = elem => {
    orderStore.setOrderId(elem.id);
    orderStore.setOrderSelect(elem);
    orderStore.setIsDriverAvailableList(true);
    props.updateConfig({page: 1, pageSize: 10});
    const points = item.pickUpLocationPoint.split(',')[0].split(' ');
    const location = {lat: +points[1], lng: +points[0]};
    mapStore.addMarker(location, elem, false, false);
  };

  const onCancel = id => {
    props.onCancel(id);
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

  const handleSelectedItem = it => {
    props.onSelectOrder(it);
  };

  const getStatus = status => {
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
  };

  return (
    <div
      className={
        selectedOrder === item.id
          ? `dispatcher-order-card-${item.id} dispatcher-order-card dispatcher-order-card__selected-order`
          : `dispatcher-order-card-${item.id} dispatcher-order-card`
      }
      onClick={() => handleSelectedItem(item)}
      id={item.id}
    >
      {/* SECTION ACTIONS */}
      <div className="dispatcher-order-card__flexcontainer-top dispatcher-order-card__right-align">
        <div
          className={
            isPending
              ? 'dispatcher-order-card__item-flex-status--with-actions'
              : 'dispatcher-order-card__item-flex-status--without-actions'
          }
        >
          {getStatus(item.status)}
        </div>
        <div
          className={
            isPending
              ? 'dispatcher-order-card__item-flex-actions--with-actions'
              : 'dispatcher-order-card__item-flex-actions--without-actions'
          }
        >
          {isPending ? (
            <React.Fragment>
              <RiftLink to={`/admin/dispatcher/${item.id}`}>
                <Tooltip title={t('labelView')}>
                  <Icon
                    type="eye"
                    style={{fontSize: '24px'}}
                    onClick={() => onView()}
                    theme="twoTone"
                    twoToneColor="#0275d8"
                  />
                </Tooltip>
              </RiftLink>
              <Tooltip title={t('labelAssign')}>
                <Icon
                  type="check-square"
                  style={{fontSize: '24px'}}
                  onClick={() => onAssign(item)}
                  theme="twoTone"
                  twoToneColor="#0275d8"
                />
              </Tooltip>
            </React.Fragment>
          ) : null}
          <Tooltip title={t('labelCancel')}>
            <Popconfirm
              icon={<Icon type="question-circle-o" style={{color: '#e33244'}} />}
              placement="topRight"
              title={`${t('msgConfirmCancelElem')} ${t('labelOrderMinus')}?`}
              onConfirm={() => onCancel(item.id)}
              okText={t('Yes')}
              cancelText={t('No')}
              okType="danger"
            >
              <Icon type="close-square" style={{fontSize: '24px'}} theme="twoTone" twoToneColor="#e33244" />
            </Popconfirm>
          </Tooltip>
        </div>
      </div>
      {/* SECTION DETAILS */}
      <div className="dispatcher-order-card__flexcontainer">
        <div className="dispatcher-order-card__item">
          <div className="dispatcher-order-card__flex-basic">
            <div className="dispatcher-order-card__user-avatar">
              {item.customer && item.customer.basicProfile && item.customer.basicProfile.avatar ? (
                <React.Fragment>
                  <Avatar size={64} src={item.customer.basicProfile.avatar.publicUrl} />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Avatar size={64} icon="user" />
                </React.Fragment>
              )}
            </div>
            <div className="dispatcher-order-card__user-data">
              <strong>Customer:</strong>
              <br></br>
              <span>{item.customerFullName ? item.customerFullName : '-'}</span>
              <br></br>
              <span>{item.customerEmail ? item.customerEmail : '-'}</span>
              <br></br>
              <span>
                {item.customerMobilePhoneNumber
                  ? formatPhone.formatsGeneral(item.customerMobilePhoneNumber, true, '1', FormatPhoneTypeEnum.NATIONAL)
                  : '-'}
              </span>
            </div>
          </div>
        </div>
        {/* Show if is On Going */}
        {!isPending ? (
          <React.Fragment>
            <div className="dispatcher-order-card__item">
              <div className="dispatcher-order-card__flex-basic">
                <div className="dispatcher-order-card__user-avatar">
                  {item.driverImage ? (
                    <React.Fragment>
                      <Avatar size={64} src={item.driverImage} />
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Avatar size={64} icon="user" />
                    </React.Fragment>
                  )}
                </div>
                <div className="dispatcher-order-card__user-data">
                  <strong>Driver:</strong>
                  <br></br>
                  <span>{item.driverFullName ? item.driverFullName : '-'}</span>
                  <br></br>
                  <span>{item.driverEmail ? item.driverEmail : '-'}</span>
                  <br></br>
                  <span>
                    {item.driverMobilePhoneNumber
                      ? formatPhone.formatsGeneral(
                          item.driverMobilePhoneNumber,
                          true,
                          '1',
                          FormatPhoneTypeEnum.NATIONAL,
                        )
                      : '-'}
                  </span>
                </div>
              </div>
            </div>
          </React.Fragment>
        ) : null}
      </div>
      {/* SECTION LOCATIONS */}
      <strong>Locations:</strong>
      <br></br>
      <span className="dispatcher-order-card__pickup">
        <strong>Pickup</strong>: <span>{item.pickUpLocationAddress ? item.pickUpLocationAddress : '-'}</span>
      </span>
      <br></br>
      <strong>Dropoff</strong>: <span>{item.dropOffLocationAddress ? item.dropOffLocationAddress : '-'}</span>
    </div>
  );
});

export default DispatcherOrderCard;
