import {createContext} from 'react';
import {decorate, observable, action} from 'mobx';

class VehicleStore {
  idParent: string;
  driverAssigned: boolean;
  isUpdateList: boolean;
  fromCompany: any;
  fromFleetOwner: boolean;
  isErrorStepOne: boolean;

  constructor() {
    this.idParent = '';
    this.driverAssigned = false;
    this.isUpdateList = false;
    this.fromCompany = '';
    this.fromFleetOwner = false;
    this.isErrorStepOne = false;
  }

  setIdParent(idParent: string) {
    this.idParent = idParent;
  }
  setDriverAssigned(driverAssigned: boolean) {
    this.driverAssigned = driverAssigned;
  }
  setIsUpdateList(update: boolean) {
    this.isUpdateList = update;
  }

  setFromCompany(fromCompany: any) {
    this.fromCompany = fromCompany;
  }

  setFromFleetOwner(fromFleetOwner: boolean) {
    this.fromFleetOwner = fromFleetOwner;
  }
  setIsErrorStepOne(isErrorStepOne: boolean) {
    this.isErrorStepOne = isErrorStepOne;
  }
}
decorate(VehicleStore, {
  idParent: observable,
  driverAssigned: observable,
  isUpdateList: observable,
  fromCompany: observable,
  fromFleetOwner: observable,
  isErrorStepOne: observable,
  setIdParent: action,
  setIsUpdateList: action,
  setDriverAssigned: action,
  setFromCompany: action,
  setFromFleetOwner: action,
  setIsErrorStepOne: action,
});

export default createContext(new VehicleStore());
