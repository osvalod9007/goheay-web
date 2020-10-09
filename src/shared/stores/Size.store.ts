import {createContext} from 'react';
import {decorate, observable, action} from 'mobx';

export class SizeStore {
  itemsSize: any[];

  constructor() {
    this.itemsSize = [];
  }

  setItemsSize(itemsSize: any[]) {
    this.itemsSize = itemsSize;
  }
}

decorate(SizeStore, {
  itemsSize: observable,
  setItemsSize: action,
});

export default createContext(new SizeStore());
