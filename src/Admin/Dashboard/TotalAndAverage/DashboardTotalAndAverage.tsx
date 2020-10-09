import React from 'react';
import {Card, Statistic, Row, Col} from 'antd';
import {observer} from 'mobx-react-lite';

import './DashboardTotalAndAverage.less';

type Prop = {
  labels: any[];
  orders: any;
  canceled: any;
  revenues: any;
  totalPrecision: number;
  canceledPrecision: number;
  revenuePrecision: number;
};

const DashboardTotalAndAverage = observer((props: Prop) => {
  const {labels, orders, canceled, revenues, totalPrecision, canceledPrecision, revenuePrecision} = props;

  return (
    <Card className="dashboard-total-and-average dashboard-total-and-average--margin-bottom mb-15">
      <div className="dashboard-total-and-average__main-statistics">
        <div className="dashboard-total-and-average__main-statistics-title">
          <span>{labels[0]}</span>
        </div>
        <Row type="flex" justify="space-between" align="middle" style={{marginBottom: '13px'}}>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Statistic
              title={labels[1]}
              value={orders}
              precision={totalPrecision || 0}
              valueStyle={{color: '#0275d8'}}
            />
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Statistic
              title={labels[2]}
              value={canceled}
              precision={canceledPrecision || 0}
              valueStyle={{color: '#e33244'}}
            />
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Statistic
              prefix={'$'}
              title={labels[3]}
              value={revenues.amount}
              precision={revenuePrecision || 0}
              valueStyle={{color: '#1aae88'}}
            />
          </Col>
        </Row>
      </div>
    </Card>
  );
});

export default DashboardTotalAndAverage;
