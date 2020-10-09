import React from 'react';
import {observer} from 'mobx-react-lite';

import listHoc from '../../../../shared/components/HoC/ListHoc/ListHoc';
import TaxSettingListTable from './Table/TaxSettingListTable';
import ModalExport from '../../../../shared/components/ModalExport/ModalExport';
import taxSettingModel from '../../../../shared/models/TaxSetting.model';

/**
 * @headTitle, @labelAdd, @labelItem: refers to label in the file app.json (i18n)
 */
const dataComponent = {
  headIcon: 'calculator',
  headTitle: 'labelTaxesList',
  createPermissions: ['SettingTaxCreate'],
  linkToCreate: '',
  labelAdd: 'labelAddTaxSettings',
  labelItem: 'labelTaxSetting',
  isFormModal: true,
  isUseKeyword: true,
};

/**
 * Format to export report
 * @key refers to field
 * @title refers to label in the file app.json (i18n)
 */
const exportFormat = {
  title: 'labelTaxSettings',
  headers: [
    {
      key: 'state.name',
      title: 'labelState',
    },
    {
      key: 'taxExport',
      title: 'labelTaxSettingPercent',
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
    const file: any = await taxSettingModel.exportTo(input);
    const url = file.data.SettingTaxList && file.data.SettingTaxList.export ? file.data.SettingTaxList.export.url : '';
    return url;
  } catch (e) {
    // console.log(`eeror at export: ${JSON.stringify(e)}`);
  }
};

const TaxSettingList = observer(
  listHoc(
    {
      WrappedComponent: (props: {config: any; updateConfig: any; setCountList: any}) => (
        <TaxSettingListTable
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

export default TaxSettingList;
