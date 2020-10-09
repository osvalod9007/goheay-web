import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Col, DatePicker, Divider, Row} from 'antd';
import {observer} from 'mobx-react-lite';

import AppStore from '../../../stores/App.store';
import LineChart from '../LineChart/LineChart';

import './ChartFilterByDates.less';

type Prop = {
  data: any[];
  filterType: string;
  rangeFilter: any[];
  onChangeDatesByUser: (date, dateString) => void;
  onChangeFilterDates: (filterDate) => void;
};

const ChartFilterByDates = observer((props: Prop) => {
  const {t} = useTranslation('app');

  const [config, setConfig] = useState({
    pageSize: 10,
    page: 1,
    // orderBy: [{field: 'id', orderType: 'DESC'}],
    // where: [{field: 'keyword', value: '', op: 'CONTAIN'}],
  });
  const {RangePicker} = DatePicker;
  const {data, filterType, rangeFilter} = props;

  return (
    <div className="chart-filter-by-dates">
      <div className="chart-filter-by-dates__main-statistics-title">
        <span>{t('labelOrdersStatistics')}</span>
      </div>
      <div className="chart-filter-by-dates__dates-to-right">
        <Row type="flex" justify="space-between" align="top" style={{marginBottom: '13px'}}>
          <Col xs={24} sm={24} md={10} lg={10} xl={10}>
            <span className="chart-filter-by-dates__filter-dates">
              <a
                className={`chart-filter-by-dates__filter-into-dates ${
                  filterType === 'allWeek' ? 'chart-filter-by-dates__filter-into-dates--current-date' : ''
                }`}
                onClick={() => props.onChangeFilterDates('allWeek')}
              >
                {t('labelAllWeek')}
              </a>
              <a
                className={`chart-filter-by-dates__filter-into-dates ${
                  filterType === 'allMonth' ? 'chart-filter-by-dates__filter-into-dates--current-date' : ''
                }`}
                onClick={() => props.onChangeFilterDates('allMonth')}
              >
                {t('labelAllMonth')}
              </a>
              <a
                className={`chart-filter-by-dates__filter-into-dates ${
                  filterType === 'allYear' ? 'chart-filter-by-dates__filter-into-dates--current-date' : ''
                }`}
                onClick={() => props.onChangeFilterDates('allYear')}
              >
                {t('labelAllYear')}
              </a>
            </span>
          </Col>
          <Col xs={24} sm={24} md={14} lg={14} xl={14}>
            <RangePicker
              onChange={props.onChangeDatesByUser}
              defaultValue={rangeFilter}
              value={rangeFilter}
              format="MM/DD/YYYY"
            />
          </Col>
        </Row>
      </div>
      <div className="chart-filter-by-dates__graph">
        <LineChart data={data} dataX={'date'} dataY={'count'} dataLine={'orderType'} />
      </div>
    </div>
  );
});

export default ChartFilterByDates;
