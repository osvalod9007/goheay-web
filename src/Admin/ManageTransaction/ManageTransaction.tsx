import React from 'react';
import {observer} from 'mobx-react-lite';

import transactionHoC from '../../shared/components/HoC/TransactionHoc/TransactionHoc';
import TransactionsListTable from './List/Table/TransactionListTable';

/**
 * @headTitle, @labelAdd, @labelItem: refers to label in the file app.json (i18n)
 */
const dataComponent = {
  headIcon: 'interaction',
  headTitle: 'labelManageTransactionList',
  createPermissions: [''],
  linkToCreate: '/admin/transaction/',
  labelAdd: '',
  labelItem: 'labelTransaction',
  isUseFilter: true,
};

const ManageTransaction = observer(
  transactionHoC(
    {
      WrappedComponent: (props: {config: any; updateConfig: any; setCountList: any}) => (
        <TransactionsListTable
          input={props.config}
          updateConfig={props.updateConfig}
          updateCountList={props.setCountList}
        />
      ),
    },
    dataComponent,
  ),
);

export default ManageTransaction;
