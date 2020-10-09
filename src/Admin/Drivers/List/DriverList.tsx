import React from 'react';
import {observer} from 'mobx-react-lite';

import listHoc from '../../../shared/components/HoC/ListHoc/ListHoc';
import DriverListTable from './Table/DriverListTable';
import ModalExport from '../../../shared/components/ModalExport/ModalExport';
import driverModel from '../../../shared/models/Driver.model';

/**
 * @headTitle, @labelAdd, @labelItem: refers to label in the file app.json (i18n)
 */
const dataComponent = {
  headIcon: 'idcard',
  headTitle: 'labelDriverList',
  createPermissions: ['DriverCreate'],
  linkToCreate: '/admin/driver/',
  labelAdd: 'labelAddDriver',
  labelItem: 'labelDriver',
  isFormModal: false,
  isUseKeyword: true,
};

/**
 * Format to export report
 * @key refers to field
 * @title refers to label in the file app.json (i18n)
 */
const exportFormat = {
  title: 'labelDriverList',
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
      key: 'company.name',
      title: 'labelCompany',
    },
    {
      key: 'vehicle.vin',
      title: 'labelVIN',
    },
    {
      key: 'statusToString',
      title: 'labelStatus',
    },
    {
      key: 'rating',
      title: 'labelRating',
    },
    {
      key: 'basicProfile.createdAtExport',
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
    const file: any = await driverModel.exportTo(input);
    const url = file.data.DriverList && file.data.DriverList.export ? file.data.DriverList.export.url : '';
    return url;
  } catch (e) {
    console.log(`eeror at export: ${JSON.stringify(e)}`);
  }
};

const DriverList = observer(
  listHoc(
    {
      WrappedComponent: (props: {config: any; updateConfig: any; setCountList: any}) => (
        <DriverListTable input={props.config} updateConfig={props.updateConfig} updateCountList={props.setCountList} />
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

export default DriverList;
