import React from 'react';
import {Card, Col, Divider, Row, Statistic} from 'antd';
import {observer} from 'mobx-react-lite';

import './DashboardTodayOrders.less';
import formatNumber from '../../../shared/utils/FormatNumber';

type Prop = {
  labels: any[];
  data: any;
};

const DasboardTodayOrders = observer((props: Prop) => {
  const {labels, data} = props;

  return (
    <Card className="dasboard-today-orders dasboard-today-orders--margin-bottom">
      <div className="dasboard-today-orders__main-statistics">
        <div className="dasboard-today-orders__main-statistics-title">
          <span>{labels[0]}</span>
        </div>
        <div className="dasboard-today-orders__main-statistics-content">
          <Row gutter={15}>
            <Col xs={12} sm={12} md={12} lg={8} xl={8}>
              <Statistic value={data.booked || 0} valueStyle={{color: '#0275d8'}} />
              <span className="dasboard-today-orders__today-orders--booked">{labels[1]}</span>
            </Col>
            <Col xs={12} sm={12} md={12} lg={8} xl={8}>
              <Statistic value={data.unpaid} valueStyle={{color: '#e33244'}} />
              <span className="dasboard-today-orders__today-orders--unpaid">{labels[2]}</span>
            </Col>
            <Col xs={12} sm={12} md={12} lg={8} xl={8}>
              <Statistic value={data.paid} valueStyle={{color: '#1aae88'}} />
              <span className="dasboard-today-orders__today-orders--paid">{labels[3]}</span>
            </Col>
          </Row>
        </div>
      </div>
      <Divider />
      <div className="dasboard-today-orders__main-statistics-total">
        <span className="dasboard-today-orders__main-statistics-total--left">
          {formatNumber.formatFloat(data.paidPercent) || 0}% {labels[3]}
        </span>
        <span className="dasboard-today-orders__main-statistics-total--right">
          $ {formatNumber.formatFloat(data.amountPaid) || 0}
        </span>
      </div>
    </Card>
  );
});

export default DasboardTodayOrders;
