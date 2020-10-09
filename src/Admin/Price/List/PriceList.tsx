import React from 'react';
import {observer} from 'mobx-react-lite';

import listHoc from '../../../shared/components/HoC/ListHoc/ListHoc';
import PriceListTable from './Table/PriceListTable';
import ModalExport from '../../../shared/components/ModalExport/ModalExport';
import priceModel from '../../../shared/models/Price.model';

const dataComponent = {
  headIcon: 'dollar',
  headTitle: 'labelPriceList',
  createPermissions: [''],
  linkToCreate: '/admin/price/',
  labelAdd: 'labelAddPrice',
  labelItem: 'labelPrice',
  isFormModal: false,
  isUseKeyword: true,
};

/**
 * Format to export report
 * @key refers to field
 * @title refers to label in the file app.json (i18n)
 */
const exportFormat = {
  title: 'labelPriceList',
  headers: [
    {
      key: 'type',
      title: 'labelVehicleType',
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
    const file: any = await priceModel.exportTo(input);
    const url =
      file.data.VehicleTypeList && file.data.VehicleTypeList.export ? file.data.VehicleTypeList.export.url : '';
    return url;
  } catch (e) {
    // console.log(`eeror at export: ${JSON.stringify(e)}`);
  }
};

const VehicleTypesList = observer(
  listHoc(
    {
      WrappedComponent: (props: {config: any; updateConfig: any; setCountList: any}) => (
        <PriceListTable input={props.config} updateConfig={props.updateConfig} updateCountList={props.setCountList} />
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

export default VehicleTypesList;
