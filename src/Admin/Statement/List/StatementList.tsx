import React from 'react';
import {observer} from 'mobx-react-lite';

import listHoc from '../../../shared/components/HoC/ListHoc/ListHoc';
import StatementListTable from './Table/StatementListTable';
import ModalExport from '../../../shared/components/ModalExport/ModalExport';
import orderModel from '../../../shared/models/Order.model';

/**
 * @headTitle, @labelAdd, @labelItem: refers to label in the file app.json (i18n)
 */
const dataComponent = {
  headIcon: 'audit',
  headTitle: 'labelStatementList',
  createPermissions: [''],
  linkToCreate: '/admin/statement/',
  labelAdd: 'labelAddStatement',
  labelItem: 'labelStatement',
  isFormModal: false,
  isUseKeyword: true,
  isUseFilterBy: true,
};

/**
 * Format to export report
 * @key refers to field
 * @title refers to label in the file app.json (i18n)
 */
const exportFormat = {
  title: 'labelStatementList',
  headers: [
    {
      key: 'bookingId',
      title: 'labelBookingId',
    },
    {
      key: 'customerFullName',
      title: 'labelCustomerName',
    },
    {
      key: 'driverFullName',
      title: 'labelDriverName',
    },
    {
      key: 'driver.company.name',
      title: 'labelCompany',
    },
    {
      key: 'statusToString',
      title: 'labelStatus',
    },
    {
      key: 'totalPriceExport',
      title: 'labelAmount',
    },
    {
      key: 'fleetCommissionTipsExport',
      title: 'labelFleetCommissionTips',
    },
    {
      key: 'createdAtExport',
      title: 'labelCreatedDate',
    },
  ],
  format: 'XLSX',
};

/**
 *
 * @param input refers to export filter
 */
const exportToFile = async input => {
  try {
    const file: any = await orderModel.exportTo(input);
    const url = file.data.OrderList && file.data.OrderList.export ? file.data.OrderList.export.url : '';
    return url;
  } catch (e) {
    // console.log(`error at export: ${JSON.stringify(e)}`);
  }
};

const StatementList = observer(
  listHoc(
    {
      WrappedComponent: (props: {config: any; updateConfig: any; setCountList: any}) => (
        <StatementListTable
          input={props.config}
          updateConfig={props.updateConfig}
          updateCountList={props.setCountList}
        />
      ),
      WrappedExportComponent: (props: {config: any; visibleExportModal: any; setExportModal: any}) => (
        <ModalExport
          listConfig={props.config}
          visible={props.visibleExportModal}
          setExportModal={props.setExportModal}
          exportTo={exportFormat}
          exportToFile={exportToFile}
        />
      ),
    },
    dataComponent,
  ),
);

export default StatementList;
