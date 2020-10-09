import React from 'react';
import {Card} from 'antd';
import {observer} from 'mobx-react-lite';

import './DashboardResume.less';

type Prop = {
  labels: any[];
  part: any;
  total: any;
  percent: any;
};

const DashboardResume = observer((props: Prop) => {
  const {labels, part, total, percent} = props;

  return (
    <Card className="dashboard-resume dashboard-resume--margin-bottom">
      <div className="dashboard-resume__main-statistics">
        <div className="stats__main-statistics-title">
          <span>{labels[0]}</span>
        </div>
        <div className="dashboard-resume__main-statistics-content dashboard-resume__main-statistics-content--margin-top">
          <span className="dashboard-resume__main-statistics-main-percent">
            {part}/{total}
          </span>
        </div>
      </div>
      <div className="dashboard-resume__main-statistics-total">
        <span className="dashboard-resume__main-statistics-total--left">
          {(percent && parseFloat(String(percent)).toFixed(2)) || 0}%
        </span>
      </div>
    </Card>
  );
});

export default DashboardResume;
