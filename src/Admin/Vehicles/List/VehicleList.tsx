import React from 'react';
import {observer} from 'mobx-react-lite';

import listHoc from '../../../shared/components/HoC/ListHoc/ListHoc';
import VehicleListTable from './Table/VehicleListTable';
import ModalExport from '../../../shared/components/ModalExport/ModalExport';
import vehicleModel from '../../../shared/models/Vehicle.model';

/**
 * @headTitle, @labelAdd, @labelItem: refers to label in the file app.json (i18n)
 */
const dataComponent = {
  headIcon: 'car',
  headTitle: 'labelVehicleList',
  createPermissions: ['VehicleCreate'],
  linkToCreate: '/admin/vehicleinsurance/',
  labelAdd: 'labelAddVehicle',
  labelItem: 'labelVehicle',
  isFormModal: false,
  isUseKeyword: true,
};

/**
 * Format to export report
 * @key refers to field
 * @title refers to label in the file app.json (i18n)
 */
const exportFormat = {
  title: 'labelVehicleList',
  headers: [
    {
      key: 'make',
      title: 'labelVehicleMake',
    },
    {
      key: 'model',
      title: 'labelVehicleModel',
    },
    {
      key: 'year',
      title: 'labelVehicleYear',
    },
    {
      key: 'vehicleType.type',
      title: 'labelVehicleType',
    },
    {
      key: 'licensePlateNo',
      title: 'labelLicensePlateNo',
    },
    {
      key: 'insuranceCertificateCompany',
      title: 'labelInsuranceCertificateCompany',
    },
    {
      key: 'insuranceExpirationDateExport',
      title: 'labelInsuranceExpirationDate',
    },
    {
      key: 'company.name',
      title: 'labelCompany',
    },
    {
      key: 'driver.basicProfile.fullName',
      title: 'labelDriverName',
    },
    {
      key: 'statusToString',
      title: 'labelStatus',
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
    const file: any = await vehicleModel.exportTo(input);
    const url = file.data.VehicleList && file.data.VehicleList.export ? file.data.VehicleList.export.url : '';
    return url;
  } catch (e) {
    // console.log(`error at export: ${JSON.stringify(e)}`);
  }
};

const VehicleList = observer(
  listHoc(
    {
      WrappedComponent: (props: {config: any; updateConfig: any; setCountList: any}) => (
        <VehicleListTable input={props.config} updateConfig={props.updateConfig} updateCountList={props.setCountList} />
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

export default VehicleList;
