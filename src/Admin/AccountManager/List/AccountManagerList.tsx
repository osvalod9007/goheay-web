import React from 'react';
import {observer} from 'mobx-react-lite';

import listHoc from '../../../shared/components/HoC/ListHoc/ListHoc';
import AccountManagerListTable from './Table/AccountManagerListTable';
import ModalExport from '../../../shared/components/ModalExport/ModalExport';
import accountManagerModel from '../../../shared/models/AccountManager.model';

/**
 * @headTitle, @labelAdd, @labelItem: refers to label in the file app.json (i18n)
 */
const dataComponent = {
  headIcon: 'user',
  headTitle: 'labelAcountManagerList',
  createPermissions: ['AccountManagerCreate'],
  linkToCreate: '/admin/accountmanager/',
  labelAdd: 'labelAddAccountManager',
  labelItem: 'labelAccountManager',
  isFormModal: false,
  isUseKeyword: true,
};

/**
 * Format to export report
 * @key refers to field
 * @title refers to label in the file app.json (i18n)
 */
const exportFormat = {
  title: 'labelAcountManagerList',
  headers: [
    {
      key: 'roleToString',
      title: 'labelRole',
    },
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
    const file: any = await accountManagerModel.exportTo(input);
    const url =
      file.data.AccountManagerList && file.data.AccountManagerList.export
        ? file.data.AccountManagerList.export.url
        : '';
    return url;
  } catch (e) {
    // console.log(`eeror at export: ${JSON.stringify(e)}`);
  }
};

const AccountManagerList = observer(
  listHoc(
    {
      WrappedComponent: (props: {config: any; updateConfig: any; setCountList: any}) => (
        <AccountManagerListTable
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

export default AccountManagerList;
