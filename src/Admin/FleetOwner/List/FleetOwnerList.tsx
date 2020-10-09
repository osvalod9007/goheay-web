import React from 'react';
import {observer} from 'mobx-react-lite';

import listHoc from '../../../shared/components/HoC/ListHoc/ListHoc';
import FleetOwnerListTable from './Table/FleetOwnerListTable';
import ModalExport from '../../../shared/components/ModalExport/ModalExport';
import fleetOwnerModel from '../../../shared/models/FleetOwner.model';

/**
 * @headTitle, @labelAdd, @labelItem: refers to label in the file app.json (i18n)
 */
const dataComponent = {
  headIcon: 'solution',
  headTitle: 'labelFleetOwnerList',
  createPermissions: ['FleetOwnerCreate'],
  linkToCreate: '/admin/fleetowner/',
  labelAdd: 'labelAddFleetOwner',
  labelItem: 'labelFleetOwner',
  isFormModal: false,
  isUseKeyword: true,
};

/**
 * Format to export report
 * @key refers to field
 * @title refers to label in the file app.json (i18n)
 */
const exportFormat = {
  title: 'labelFleetOwnerList',
  headers: [
    {
      key: 'basicProfile.fullName',
      title: 'labelFullName',
    },
    {
      key: 'company.name',
      title: 'labelCompany',
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
    const file: any = await fleetOwnerModel.exportTo(input);
    const url = file.data.FleetOwnerList && file.data.FleetOwnerList.export ? file.data.FleetOwnerList.export.url : '';
    return url;
  } catch (e) {
    // console.log(`eeror at export: ${JSON.stringify(e)}`);
  }
};

const DriverListHoc = observer(
  listHoc(
    {
      WrappedComponent: (props: {config: any; updateConfig: any; setCountList: any}) => (
        <FleetOwnerListTable
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

export default DriverListHoc;
