import {createContext} from 'react';
import {decorate, observable, action} from 'mobx';
import {CheckUserConvertEnum} from '../enums/CheckUserConvert.enum';

export class UniqueUserModalStore {
  email: string;
  mobilePhone: string;
  mobilePhoneCode: string;
  message: string;
  userId: string;
  type: CheckUserConvertEnum;
  isOpenModalView: boolean;
  isUserConvert: boolean;

  constructor() {
    this.email = '';
    this.message = '';
    this.mobilePhone = '';
    this.mobilePhoneCode = '';
    this.userId = '';
    this.type = CheckUserConvertEnum.DRIVER;
    this.isOpenModalView = false;
    this.isUserConvert = false;
  }
  setUserId(userId: string) {
    this.userId = userId;
  }
  setMessage(message: string) {
    this.message = message;
  }
  setEmail(email: string) {
    this.email = email;
  }
  setMobilePhone(mobilePhone: string) {
    this.mobilePhone = mobilePhone;
  }
  setMobilePhoneCode(mobilePhoneCode: string) {
    this.mobilePhoneCode = mobilePhoneCode;
  }
  setType(type: CheckUserConvertEnum) {
    this.type = type;
  }
  setIsOpenModalView(isOpenModalView: boolean) {
    this.isOpenModalView = isOpenModalView;
  }
  setIsUserConvert(isUserConvert: boolean) {
    this.isUserConvert = isUserConvert;
  }
}

decorate(UniqueUserModalStore, {
  email: observable,
  mobilePhone: observable,
  mobilePhoneCode: observable,
  type: observable,
  isOpenModalView: observable,
  isUserConvert: observable,
  message: observable,
  userId: observable,
  setEmail: action,
  setMobilePhone: action,
  setMobilePhoneCode: action,
  setType: action,
  setIsOpenModalView: action,
  setUserId: action,
  setIsUserConvert: action,
  setMessage: action,
});

export default createContext(new UniqueUserModalStore());
