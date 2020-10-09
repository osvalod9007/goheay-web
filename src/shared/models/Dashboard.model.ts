import {BaseClient} from '../config/BaseClient';

class DashboardModel extends BaseClient {
  getDataDashboard(daily: any, dailyForGraph: any, summary: any, average: any) {
    const schema = `
    query($daily: GenericFilterInput, $dailyForGraph: GenericFilterInput, $summary: GenericFilterInput, $average: GenericFilterInput){
      daily: AnalyticDailyOrderList(input: $daily){
        total
        items {
            bookedDeliveryCount
            assignedDeliveryCount
            completedCount
            paidCount
            amountPaidMoney {
              amount
            }
        }
      }

      dailyForGraph: AnalyticDailyOrderList(input: $dailyForGraph){
        total
        items {
            dateAt
            bookedCount
            pendingCount
            canceledCount
            completedCount
        }
      }

      AnalyticSummaryOrderList(input: $summary){
        total
        items {
          driverOnboardingCount
          driverClearCount
          driverReadyCount
          driverAlertCount
          vehicleOnboardingCount
          vehicleClearCount
          vehicleReadyCount
          vehicleAlertCount
          driverAvailableCount
          vehicleTotalCount
          totalPendingCount
          bookedAndAssignedStatusCount
          totalCount
          totalCancelledCount
          totalRevenueMoney {
            amount
          }
        }
      }

      AnalyticAverageOrderList(input: $average){
        total
        items {
          averageCount
          averageCanceledCount
          averageRevenueMoney {
            amount
          }
        }
      }
    }
    `;
    return this.query('websiteBackend', schema, {daily, dailyForGraph, summary, average});
  }
}

const dashboardModel = new DashboardModel();
export default dashboardModel;
