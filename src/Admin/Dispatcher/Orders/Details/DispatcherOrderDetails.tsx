import React, {useContext, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, Card, Col, Divider, Row, Tag} from 'antd';
import {useRouter} from 'rift-router';
import {useTranslation} from 'react-i18next';

import AppStore from '../../../../shared/stores/App.store';
import HeadTitle from '../../../../shared/components/HeadTitle/HeadTitle';
import OrderStore from '../../../../shared/stores/Order.store';
import {Order} from '../../../../shared/cs/order.cs';
import GoogleMapRoute from '../../../../shared/components/Map/GoogleMapRoute';
import {OrderStatusEnum} from '../../../../shared/enums/OrderStatus.enum';

import './DispatcherOrderDetails.less';
import orderModel from '../../../../shared/models/Order.model';

const DispatcherOrderDetails = observer((props: any) => {
  const appStore = useContext(AppStore);
  const {t} = useTranslation('app');
  const orderStore = useContext(OrderStore);
  const router = useRouter();
  const [item, setItem] = useState(new Order());

  useEffect(() => {
    // get data for the details
    getData();
  }, []);

  const getData = async () => {
    try {
      appStore.setIsLoading(true);
      const params: any = router;
      if (params && params.params && params.params.id) {
        appStore.setIsEditing(true);
        const input = {
          id: params.params.id,
        };
        const itemToEdit: any = await orderModel.get(input);
        setItem({...new Order(itemToEdit.data.OrderGet)});
      }
      appStore.setIsLoading(false);
    } catch (e) {
      appStore.setIsLoading(false);
      // handleCatch(e, {}, {});
    }
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
    <div className="dispatcher-order-details">
      <Card bordered={false} className="gutter-row">
        <Row type="flex" justify="start" align="middle" style={{marginBottom: '13px'}}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <HeadTitle icon="control" title={t('labelDispatcherOrderDetails')} />
          </Col>
        </Row>
        <Divider />
        <Row type="flex" justify="start" align="top" style={{marginBottom: 10}}>
          <Col xs={24} sm={24} md={12} lg={13} xl={13}>
            <Row>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <strong>{t('labelCustomerName')}:</strong>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                {item.customerFullName}
              </Col>
            </Row>
            <Row>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <strong>{t('labelDriverName')}:</strong>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                {item.driverFullName || '-'}
              </Col>
            </Row>
            <Row>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <strong>{t('labelStatus')}:</strong>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                {getStatus(item.status)}
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <strong>{t('labelTravelDistance')}:</strong>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                {item.route ? parseFloat(item.route.measureTotalDistance.amount).toFixed(2) : '-'} mi
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <strong>{t('labelRideStartTime')}:</strong>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                {`${appStore.getCreatedAtDateAndTime(item.deliveryStartAt)}`}
              </Col>
            </Row>
            <Row>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <strong>{t('labelRideEndTime')}:</strong>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                {`${appStore.getCreatedAtDateAndTime(item.deliveryEndAt)}`}
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <strong>{t('labelPickupAddress')}:</strong>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                {item.pickUpLocationAddress}
              </Col>
            </Row>
            <Row>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <strong>{t('labelDropoffAddress')}:</strong>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                {item.dropOffLocationAddress}
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <strong>{t('labelDeliveryFare')}:</strong>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                {item.measureBaseFarePrice !== '-'
                  ? `$${parseFloat(item.measureBaseFarePrice).toFixed(2)}`
                  : `${item.measureBaseFarePrice}`}
              </Col>
            </Row>
            <Row>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <strong>{t('labelDistanceCharge')}:</strong>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                {item.measureDistanceChargePrice !== '-'
                  ? `$${parseFloat(item.measureDistanceChargePrice).toFixed(2)}`
                  : `${item.measureDistanceChargePrice}`}
              </Col>
            </Row>
            <Row>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <strong>{t('labelLaborCharge')}:</strong>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                {item.measureLaborChargePrice !== '-'
                  ? `$${parseFloat(item.measureLaborChargePrice).toFixed(2)}`
                  : `${item.measureLaborChargePrice}`}
              </Col>
            </Row>
            <Row>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <strong>{t('labelServiceFees')}:</strong>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                {item.measureServiceFeePrice !== '-'
                  ? `$${parseFloat(item.measureServiceFeePrice).toFixed(2)}`
                  : `${item.measureServiceFeePrice}`}
              </Col>
            </Row>
            <Row>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <strong>{t('labelEveningDelivery')}:</strong>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                {item.measureEveningDeliveryPrice !== '-'
                  ? `$${parseFloat(item.measureEveningDeliveryPrice).toFixed(2)}`
                  : `${item.measureEveningDeliveryPrice}`}
              </Col>
            </Row>
            <Row>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <strong>{t('labelTax')}:</strong>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                {item.measureTaxPrice !== '-'
                  ? `$${parseFloat(item.measureTaxPrice).toFixed(2)}`
                  : `${item.measureTaxPrice}`}
              </Col>
            </Row>
            <Row>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <strong>{t('labelHandlingSurcharge')}:</strong>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                {item.measureHandlingSurchargesTotalPiecesPrice !== '-'
                  ? `$${parseFloat(item.measureHandlingSurchargesTotalPiecesPrice).toFixed(2)}`
                  : `${item.measureHandlingSurchargesTotalPiecesPrice}`}
              </Col>
            </Row>
            <Row>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <strong>{t('labelTotalEstimatedPrice')}:</strong>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                {item.measureTotalPrice !== '-'
                  ? `$${parseFloat(item.measureTotalPrice).toFixed(2)}`
                  : `${item.measureTotalPrice}`}
              </Col>
            </Row>
            <Divider />
            <Button onClick={() => window.history.back()}>{t('labelBack')}</Button>
          </Col>
          <Col xs={24} sm={4} md={12} lg={11} xl={11}>
            <GoogleMapRoute mapId="google-map-test" orderSelected={item} config={props.config} />
          </Col>
        </Row>
      </Card>
    </div>
  );
});

export default DispatcherOrderDetails;
