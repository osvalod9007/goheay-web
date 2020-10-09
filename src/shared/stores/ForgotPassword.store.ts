import {createContext} from 'react';
import {decorate, observable, action} from 'mobx';

export class ForgotPasswordStore {
  email: string;

  constructor() {
    this.email = '';
  }

  setEmail(email: string) {
    this.email = email;
  }
}

decorate(ForgotPasswordStore, {
  email: observable,
  setEmail: action,
});

export default createContext(new ForgotPasswordStore());
