import React from 'react';
import {observer} from 'mobx-react-lite';

import dispatcherHoc from '../../shared/components/HoC/DispatcherHoc/DispatcherHoc';
import DispatcherOrders from './Orders/DispatcherOrders';
import GoogleMapRoute from '../../shared/components/Map/GoogleMapRoute';

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
  isRefresh: true,
};

const Dispatcher = observer(
  dispatcherHoc(
    {
      WrappedComponent: (props: {
        config: any;
        updateConfig: any;
        setCountList: any;
        updateOrderSelected: any;
        refreshData: any;
      }) => (
        <DispatcherOrders
          input={props.config}
          updateConfig={props.updateConfig}
          updateCountList={props.setCountList}
          updateOrderSelected={props.updateOrderSelected}
        />
      ),
      WrappedMapComponent: (props: {config: any; orderSelected: any}) => (
        <GoogleMapRoute mapId="google-map-test" orderSelected={props.orderSelected} config={props.config} />
      ),
    },
    dataComponent,
  ),
);

export default Dispatcher;
