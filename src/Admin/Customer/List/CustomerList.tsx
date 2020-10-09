import React from 'react';
import {observer} from 'mobx-react-lite';

import listHoc from '../../../shared/components/HoC/ListHoc/ListHoc';
import CustomersListTable from './Table/CustomersListTable';
import ModalExport from '../../../shared/components/ModalExport/ModalExport';
import customerModel from '../../../shared/models/Customer.model';

const dataComponent = {
  headIcon: 'team',
  headTitle: 'labelCustomerList',
  createPermissions: ['CustomerCreate'],
  linkToCreate: '/admin/customer/',
  labelAdd: 'labelAddCustomer',
  labelItem: 'labelCustomer',
  isFormModal: false,
  isUseKeyword: true,
};

/**
 * Format to export report
 * @key refers to field
 * @title refers to label in the file app.json (i18n)
 */
const exportFormat = {
  title: 'labelCustomerList',
  headers: [
    {
      key: 'basicProfile.fullName',
      title: 'labelFullName',
    },
    {
      key: 'basicProfile.email',
      title: 'labelEmail',
    },
    {
      key: 'basicProfile.fullMobilePhone',
      title: 'labelMobile',
    },
    {
      key: 'rating',
      title: 'labelRating',
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
    const file: any = await customerModel.exportTo(input);
    const url = file.data.CustomerList && file.data.CustomerList.export ? file.data.CustomerList.export.url : '';
    return url;
  } catch (e) {
    // console.log(`eeror at export: ${JSON.stringify(e)}`);
  }
};

const CustomerList = observer(
  listHoc(
    {
      WrappedComponent: (props: {config: any; updateConfig: any; setCountList: any}) => (
        <CustomersListTable
          input={props.config}
          updateConfig={props.updateConfig}
          updateCountList={props.setCountList}
        />
      ),
      WrappedExportComponent: (props: {config: any; visibleExportModal: any; setExportModal: any; exportTo: any}) => (
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

export default CustomerList;
