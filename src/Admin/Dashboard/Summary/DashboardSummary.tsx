import React from 'react';
import {Card, Divider} from 'antd';
import {observer} from 'mobx-react-lite';

import './DashboardSummary.less';
import formatNumber from '../../../shared/utils/FormatNumber';

type Prop = {
  labels: any[];
  part: any;
  total: any;
  percent: any;
};

const DashboardSummary = observer((props: Prop) => {
  const {labels, part, total, percent} = props;

  return (
    <Card className="dashboard-summary dashboard-summary--margin-bottom">
      <div className="dashboard-summary__main-statistics">
        <div className="dashboard-summary__main-statistics-title">
          <span>{labels[0]}</span>
        </div>
        <div className="dashboard-summary__main-statistics-content dashboard-summary__main-statistics-content--margin-top">
          <span className="dashboard-summary__main-statistics-main-percent">
            {part}/{total}
          </span>
        </div>
      </div>
      <Divider />
      <div className="dashboard-summary__main-statistics-total">
        <span className="dashboard-summary__main-statistics-total--left">
          {formatNumber.formatFloat(percent) || 0}%
        </span>
      </div>
    </Card>
  );
});

export default DashboardSummary;
