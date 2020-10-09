import React from 'react';
import {observer} from 'mobx-react-lite';
import {Avatar, Col, Row, Button} from 'antd';
import {useTranslation} from 'react-i18next';

import './DriverAvailableOrderCard.less';

const DriverAvailableOrderCard = observer((props: any) => {
  const {t} = useTranslation('app');
  const handleSelectedItem = id => {
    props.onSelectDriver(id);
  };

  const {item, selectedDriver} = props;

  return (
    <div
      className={
        selectedDriver === item.id
          ? `driver-available-order-card-${item.id} driver-available-order-card driver-available-order-card__selected-order`
          : `driver-available-order-card-${item.id} driver-available-order-card`
      }
      id={item.id}
    >
      {/* SECTION DETAILS */}
      <div className="driver-available-order-card__flexcontainer">
        <React.Fragment>
          <div className="driver-available-order-card__item">
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Row type="flex" align={'top'}>
                <Col xs={6} sm={4} md={4} lg={2} xl={2}>
                  <Avatar size={64} src={item.avatar} />
                </Col>
                <Col xs={18} sm={14} md={14} lg={17} xl={17}>
                  <Row>
                    <p style={{fontWeight: 'bold'}}>
                      {t('labelDriver')}: {item.fullName || ''}
                    </p>
                  </Row>
                  <Row type="flex" align={'top'}>
                    <p>{item.email || ''}</p>
                    <p>{item.fullMobilePhone || ''}</p>
                  </Row>
                  <Row>
                    <p>{item.vehicleType || ''}</p>
                  </Row>
                </Col>
                {/* SECTION ACTIONS */}
                <Col xs={4} sm={4} md={4} lg={2} xl={2}>
                  <Button type="primary" onClick={() => handleSelectedItem(item.id)}>
                    {t('labelAssign')}
                  </Button>
                </Col>
              </Row>
            </Col>
          </div>
        </React.Fragment>
      </div>
    </div>
  );
});

export default DriverAvailableOrderCard;
