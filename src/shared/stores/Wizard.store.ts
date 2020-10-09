import {createContext} from 'react';
import {decorate, observable, action} from 'mobx';

export class WizardStore {
  item: any;
  steps: any[];
  current: number;
  disableFields: boolean;

  constructor() {
    this.item = {};
    this.steps = [];
    this.current = 0;
    this.disableFields = false;
  }

  setDisableFields(disableFields) {
    this.disableFields = disableFields;
  }
  setItem(item) {
    this.item = item;
  }

  wizardSteps(s) {
    this.steps = s;
  }

  wizardNext() {
    this.current += 1;
  }

  wizardPrev() {
    this.current -= 1;
  }

  setWizardStep(step) {
    this.current = step;
  }
}

decorate(WizardStore, {
  item: observable,
  steps: observable,
  disableFields: observable,
  current: observable,
  setItem: action,
  setDisableFields: action,
  setWizardStep: action,
  wizardSteps: action,
  wizardNext: action,
  wizardPrev: action,
});

export default createContext(new WizardStore());
