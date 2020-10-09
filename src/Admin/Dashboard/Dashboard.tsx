import React, {useContext, useEffect, useState} from 'react';
import {Card, Col, Icon, Row, Statistic} from 'antd';
import moment from 'moment-timezone';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import AppStore from '../../shared/stores/App.store';
import dashboardModel from '../../shared/models/Dashboard.model';
import PieChart from '../../shared/components/Graphs/PieChart/PieChart';
import ChartFilterByDates from '../../shared/components/Graphs/ChartFilterByDates/ChartFilterByDates';
import DasboardPendingOrders from './PendingOrders/DasboardPendingOrders';
import {Timeline} from './Timeline';
import DashboardTodayOrders from './TodayOrders/DashboardTodayOrders';
import DashboardSummary from './Summary/DashboardSummary';
import DashboardTotalAndAverage from './TotalAndAverage/DashboardTotalAndAverage';

import './Dashboard.less';
import formatNumber from '../../shared/utils/FormatNumber';

const dailyOrder = {
  booked: 0,
  unpaid: 0,
  paid: 0,
  paidPercent: 0,
  amountPaid: 0,
};

const driverAvail = {
  available: 0,
  ready: 0,
  percent: 0,
};

const inventoryAndPendingorders = {
  ready: 0,
  total: 0,
  percent: 0,
};

const totalAndAverage = {
  orders: 0,
  canceled: 0,
  revenues: 0,
};

const Dashboard: React.FC = observer(() => {
  const appStore = useContext(AppStore);
  const {t} = useTranslation('app');
  const [filter, setFilter] = useState('allWeek'); // allWeek, allMonth, allYear, allSelectedByUser
  const [initFilter, setInitFilter] = useState(moment().startOf('week')); // init date to filter
  const [endFilter, setEndFilter] = useState(moment().endOf('week')); // end date to filter
  const [dailyOrderStatitics, setDailyOrderStatitics]: any = useState(dailyOrder);
  const [driverAvailability, setDriverAvailability] = useState(driverAvail);
  const [vehicleInventory, setVehicleInventory] = useState(inventoryAndPendingorders);
  const [pendingOrders, setPendingOrders] = useState(inventoryAndPendingorders);
  const [dailyOrderStatiticsForGraph, setDailyOrderStatiticsForGraph] = useState([]);
  const [driversStatitics, setDriversStatitics] = useState([]);
  const [vehiclesStatitics, setVehiclesStatitics] = useState([]);
  const [total, setTotal] = useState(totalAndAverage);
  const [dailyAverage, setDailyAverage] = useState(totalAndAverage);

  useEffect(() => {
    getData(initFilter, endFilter);
  }, [initFilter, endFilter]);

  const getData = async (initDate, endDate) => {
    try {
      // user auth company
      const myCompany = appStore.getCompanyUserAuth();
      await getDataDashboard(initDate, endDate, myCompany);
    } catch (e) {
      appStore.setIsLoading(false);
      // handleCatch(e, {}, {});
    }
  };

  const getDataDashboard = async (initDate, endDate, myCompany) => {
    try {
      appStore.setIsLoading(true);
      const daily = {
        where: [
          {
            field: 'dateAt',
            value: [
              moment()
                .utc(appStore.getTimeZone())
                .format('YYYY-MM-DD'),
            ],
            op: 'EQ',
          },
          {field: 'timezone', value: `${appStore.getTimeZone()}`, op: 'EQ'},
          {field: 'companyId', value: `${myCompany}`, op: 'EQ', isPk: true},
        ],
      };

      const dailyForGraph = {
        where: [
          {
            field: 'dateAt',
            value: [
              initDate.utc(appStore.getTimeZone()).format('YYYY-MM-DD'),
              endDate.utc(appStore.getTimeZone()).format('YYYY-MM-DD'),
            ],
            op: 'BETWEEN',
          },
          {field: 'timezone', value: `${appStore.getTimeZone()}`, op: 'EQ'},
          {field: 'companyId', value: `${myCompany}`, op: 'EQ', isPk: true},
        ],
      };

      const summaryAndAverage = {
        where: [{field: 'companyId', value: `${myCompany}`, op: 'EQ', isPk: true}],
      };

      const dataDashboard: any = await dashboardModel.getDataDashboard(
        daily,
        dailyForGraph,
        summaryAndAverage,
        summaryAndAverage,
      );
      if (
        dataDashboard &&
        dataDashboard.data &&
        dataDashboard.data.daily &&
        dataDashboard.data.daily.items &&
        dataDashboard.data.daily.items.length > 0
      ) {
        dailyData(dataDashboard.data.daily.items);
      }

      if (
        dataDashboard &&
        dataDashboard.data &&
        dataDashboard.data.dailyForGraph &&
        dataDashboard.data.dailyForGraph.items &&
        dataDashboard.data.dailyForGraph.items.length > 0
      ) {
        dailyForGraphData(dataDashboard.data.dailyForGraph.items);
      }

      // Data for Summary section
      if (
        dataDashboard &&
        dataDashboard.data &&
        dataDashboard.data.AnalyticSummaryOrderList &&
        dataDashboard.data.AnalyticSummaryOrderList.items &&
        dataDashboard.data.AnalyticSummaryOrderList.items.length > 0
      ) {
        analyticSummaryOrderListData(dataDashboard.data.AnalyticSummaryOrderList.items);
      }

      if (
        dataDashboard &&
        dataDashboard.data &&
        dataDashboard.data.AnalyticAverageOrderList &&
        dataDashboard.data.AnalyticAverageOrderList.items &&
        dataDashboard.data.AnalyticAverageOrderList.items.length > 0
      ) {
        analyticAverageOrderListData(dataDashboard.data.AnalyticAverageOrderList.items);
      }
      appStore.setIsLoading(false);
    } catch (e) {
      appStore.setIsLoading(false);
      // handleCatch(e, {}, {});
    }
  };

  const dailyData = daily => {
    daily.forEach(e => {
      const dataTmp: any = {
        booked:
          e.bookedDeliveryCount !== undefined && e.assignedDeliveryCount !== undefined
            ? parseInt(e.bookedDeliveryCount, 10) + parseInt(e.assignedDeliveryCount, 10)
            : 0,
        unpaid: e.completedCount,
        paid: e.paidCount,
        paidPercent:
          e.bookedDeliveryCount && e.assignedDeliveryCount
            ? (e.paidCount / (e.bookedDeliveryCount + e.assignedDeliveryCount)) * 100
            : 0,
        amountPaid: e.amountPaidMoney && e.amountPaidMoney.amount,
      };
      setDailyOrderStatitics(dataTmp);
    });
  };

  // Daily for Graph
  const dailyForGraphData = dailyGraph => {
    const dataTmp: any = [];
    dailyGraph.forEach(e => {
      dataTmp.push({
        date: e.dateAt,
        orderType: t('labelBooked'),
        count: e.bookedCount,
      });
      dataTmp.push({
        date: e.dateAt,
        orderType: t('labelPending'),
        count: e.pendingCount,
      });
      dataTmp.push({
        date: e.dateAt,
        orderType: t('labelCanceled'),
        count: e.canceledCount,
      });
      dataTmp.push({
        date: e.dateAt,
        orderType: t('labelCompleted'),
        count: e.completedCount,
      });
    });
    setDailyOrderStatiticsForGraph(dataTmp);
  };

  // Summary
  const analyticSummaryOrderListData = sum => {
    const dataDriversTmp: any = [];
    const dataVehiclesTmp: any = [];
    sum.forEach(e => {
      dataDriversTmp.push({
        item: t('labelOnBoarding'),
        count: e.driverOnboardingCount,
      });
      dataDriversTmp.push({
        item: t('labelClear'),
        count: e.driverClearCount,
      });
      dataDriversTmp.push({
        item: t('labelGHReady'),
        count: e.driverReadyCount,
      });
      dataDriversTmp.push({
        item: t('labelAlert'),
        count: e.driverAlertCount,
      });
      dataVehiclesTmp.push({
        item: t('labelOnBoarding'),
        count: e.vehicleOnboardingCount,
      });
      dataVehiclesTmp.push({
        item: t('labelClear'),
        count: e.vehicleClearCount,
      });
      dataVehiclesTmp.push({
        item: t('labelGHReady'),
        count: e.vehicleReadyCount,
      });
      dataVehiclesTmp.push({
        item: t('labelAlert'),
        count: e.vehicleAlertCount,
      });
      const dataDriverAvailTmp: any = {
        available: e.driverAvailableCount,
        ready: e.vehicleReadyCount,
        percent: (e.driverAvailableCount / e.driverReadyCount) * 100,
      };
      const dataVehicleInvTmp: any = {
        ready: e.vehicleReadyCount,
        total: e.vehicleTotalCount,
        percent: (e.vehicleReadyCount / e.vehicleTotalCount) * 100,
      };
      const dataPendingOrdersTmp: any = {
        ready: e.totalPendingCount,
        total: e.bookedAndAssignedStatusCount,
        percent: (e.totalPendingCount / e.bookedAndAssignedStatusCount) * 100,
      };
      const totalAndAverageTmp = {
        orders: e.totalCount,
        canceled: e.totalCancelledCount,
        revenues: e.totalRevenueMoney,
      };
      setDriverAvailability(dataDriverAvailTmp);
      setVehicleInventory(dataVehicleInvTmp);
      setPendingOrders(dataPendingOrdersTmp);
      setTotal(totalAndAverageTmp);
    });
    setDriversStatitics(dataDriversTmp);
    setVehiclesStatitics(dataVehiclesTmp);
  };

  // Average
  const analyticAverageOrderListData = ave => {
    ave.forEach(e => {
      const totalAndAverageTmp = {
        orders: e.averageCount,
        canceled: e.averageCanceledCount,
        revenues: e.averageRevenueMoney,
      };
      setDailyAverage(totalAndAverageTmp);
    });
  };

  const setToWeekFilter = () => {
    setFilter('allWeek');
    setInitFilter(moment().startOf('week'));
    setEndFilter(moment().endOf('week'));
  };

  const setToMonthFilter = () => {
    setFilter('allMonth');
    setInitFilter(moment().startOf('month'));
    setEndFilter(moment().endOf('month'));
  };

  const setToYearFilter = () => {
    setFilter('allYear');
    setInitFilter(moment().startOf('year'));
    setEndFilter(moment().endOf('year'));
  };

  const onChangeDatesByUser = (date, dateString) => {
    const [init, end] = date;
    if (init === moment().startOf('week') && end === moment().endOf('week')) {
      setToWeekFilter();
    } else if (init === moment().startOf('month') && end === moment().endOf('month')) {
      setToMonthFilter();
    } else if (init === moment().startOf('year') && end === moment().endOf('year')) {
      setToYearFilter();
    } else {
      setFilter('allSelectedByUser');
      setInitFilter(init);
      setEndFilter(end);
    }
  };

  const onChangeFilterDates = filterDate => {
    if (filterDate === 'allWeek') {
      setToWeekFilter();
    } else if (filterDate === 'allMonth') {
      setToMonthFilter();
    }
    if (filterDate === 'allYear') {
      setToYearFilter();
    }
  };

  return (
    <Row gutter={10} style={{margin: '15px 0'}}>
      <Col md={24} lg={17} xxl={18}>
        <Row gutter={15} className="mb-15">
          <Col xs={24} sm={24} md={6} lg={9} xl={9}>
            <DashboardTodayOrders
              labels={[t('labelTodaysOrders'), t('labelBooked'), t('labelUnPaid'), t('labelPaid')]}
              data={dailyOrderStatitics}
            />
          </Col>
          <Col xs={24} sm={24} md={6} lg={5} xl={5}>
            <DashboardSummary
              labels={[t('labelDriverAvailability')]}
              part={driverAvailability.available}
              total={driverAvailability.ready}
              percent={driverAvailability.percent}
            />
          </Col>
          <Col xs={24} sm={24} md={6} lg={5} xl={5}>
            <DashboardSummary
              labels={[t('labelVehicleInventory')]}
              part={vehicleInventory.ready}
              total={vehicleInventory.total}
              percent={vehicleInventory.percent}
            />
          </Col>
          <Col xs={24} sm={24} md={6} lg={5} xl={5}>
            <DashboardSummary
              labels={[t('labelPendingorders')]}
              part={pendingOrders.ready}
              total={pendingOrders.total}
              percent={pendingOrders.percent}
            />
          </Col>
        </Row>
        <Row className="mb-15">
          <Col span={24}>
            <Card>
              <ChartFilterByDates
                data={dailyOrderStatiticsForGraph}
                filterType={filter}
                rangeFilter={[initFilter, endFilter]}
                onChangeDatesByUser={onChangeDatesByUser}
                onChangeFilterDates={onChangeFilterDates}
              />
            </Card>
          </Col>
        </Row>
        <Row className="mb-15">
          <Col sm={24} xs={12} md={12} lg={12} xl={12}>
            <Card className="stats-pie">
              <div className="stats__main-statistics-title">
                <span>{t('labelDriversStatistics')}</span>
              </div>
              <PieChart data={driversStatitics} />
            </Card>
          </Col>
          <Col sm={24} xs={12} md={12} lg={12} xl={12}>
            <Card className="stats-pie">
              <div className="stats__main-statistics-title">
                <span>{t('labelVehiclesStatistics')}</span>
              </div>
              <PieChart data={vehiclesStatitics} />
            </Card>
          </Col>
        </Row>
      </Col>
      <Col md={24} lg={7} xxl={6}>
        <Row gutter={15} className="mb-15">
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <DasboardPendingOrders />
          </Col>
        </Row>
        <Row gutter={15} className="mb-15">
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <DashboardTotalAndAverage
              labels={[t('labelTotal'), t('labelOrders'), t('labelCanceled'), t('labelRevenue')]}
              orders={total.orders}
              canceled={total.canceled}
              revenues={total.revenues}
              totalPrecision={0}
              canceledPrecision={0}
              revenuePrecision={2}
            />
          </Col>
        </Row>
        <Row gutter={15} className="mb-15">
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <DashboardTotalAndAverage
              labels={[t('labelDailyAverage'), t('labelOrders'), t('labelCanceled'), t('labelRevenue')]}
              orders={formatNumber.formatFloat(dailyAverage.orders)}
              canceled={formatNumber.formatFloat(dailyAverage.canceled)}
              revenues={formatNumber.formatFloat(dailyAverage.revenues)}
              totalPrecision={2}
              canceledPrecision={2}
              revenuePrecision={2}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
});

export default Dashboard;
