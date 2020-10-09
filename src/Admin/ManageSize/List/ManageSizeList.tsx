import React from 'react';
import {observer} from 'mobx-react-lite';

import listHoc from '../../../shared/components/HoC/ListHoc/ListHoc';
import ManageSizeListTable from './Table/ManageSizeListTable';
import ModalExport from '../../../shared/components/ModalExport/ModalExport';
import manageSize from '../../../shared/models/ManageSize.model';

/**
 * @headTitle, @labelAdd, @labelItem: refers to label in the file app.json (i18n)
 */
const dataComponent = {
  headIcon: 'arrows-alt',
  headTitle: 'labelManageSizeList',
  createPermissions: [],
  linkToCreate: '/admin/size/',
  labelAdd: 'labelAddManageSize',
  labelItem: 'labelSize',
  isFormModal: false,
  isUseKeyword: false,
};

/**
 * Format to export report
 * @key refers to field
 * @title refers to label in the file app.json (i18n)
 */
const exportFormat = {
  title: 'labelManageSizeList',
  headers: [
    {
      key: 'typeExport',
      title: 'labelKeyKeywordSizes',
    },
    {
      key: 'weightExport',
      title: 'labelWeight',
    },
    {
      key: 'linearInchesExport',
      title: 'labelLinearInchesSum',
    },
    {
      key: 'lwhExport',
      title: 'labelLWHInches',
    },
    {
      key: 'labourLoadingExport',
      title: 'labelEstimateLaborMinuteLoading',
    },
    {
      key: 'labourUnloadingExport',
      title: 'labelEstimateLaborMinuteUnLoading',
    },
    {
      key: 'totalLabourExport',
      title: 'labelTotalEstimateLaborMinutePerDelivery',
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
    const file: any = await manageSize.exportTo(input);
    const url =
      file.data.ProductSizeList && file.data.ProductSizeList.export ? file.data.ProductSizeList.export.url : '';
    return url;
  } catch (e) {
    // console.log(`error at export: ${JSON.stringify(e)}`);
  }
};

const ManageSizeList = observer(
  listHoc(
    {
      WrappedComponent: (props: {config: any; updateConfig: any; setCountList: any}) => (
        <ManageSizeListTable
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

export default ManageSizeList;
