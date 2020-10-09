import {createContext} from 'react';
import {decorate, observable, action} from 'mobx';

export class TaxStore {
  idToEdit: string;
  shouldUpdateTable: boolean;
  usedStates: any[];

  constructor() {
    this.idToEdit = '';
    this.shouldUpdateTable = false;
    this.usedStates = [];
  }

  setIdToEdit(id: string) {
    this.idToEdit = id;
  }

  setShouldUpdateTable(shouldUpdateTable: boolean) {
    this.shouldUpdateTable = shouldUpdateTable;
  }

  setUsedStates(usedStates: any[]) {
    this.usedStates = usedStates;
  }
}

decorate(TaxStore, {
  idToEdit: observable,
  shouldUpdateTable: observable,
  usedStates: observable,
  setIdToEdit: action,
  setShouldUpdateTable: action,
  setUsedStates: action,
});

export default createContext(new TaxStore());
