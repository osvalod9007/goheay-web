import {createContext} from 'react';
import {decorate, observable, action} from 'mobx';

class OrderStore {
  orderId: string;
  isDriverAvailableList: boolean;
  orderSelected: any;
  isFilterBy: boolean;

  constructor() {
    this.orderId = '';
    this.isDriverAvailableList = false;
    this.orderSelected = {};
    this.isFilterBy = false;
  }

  setOrderId(orderId) {
    this.orderId = orderId;
  }

  setIsDriverAvailableList(isDriverAvailableList) {
    this.isDriverAvailableList = isDriverAvailableList;
  }

  setOrderSelect(order) {
    this.orderSelected = order;
  }
  setIsFilterBy(isFilterBy) {
    this.isFilterBy = isFilterBy;
  }
}
decorate(OrderStore, {
  orderId: observable,
  isDriverAvailableList: observable,
  orderSelected: observable,
  isFilterBy: observable,
  setOrderId: action,
  setIsDriverAvailableList: action,
  setOrderSelect: action,
  setIsFilterBy: action,
});

export default createContext(new OrderStore());
