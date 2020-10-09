import {Company} from './company.cs';
import {ImageFile} from './imageFile.cs';
export class BasicProfile {
  id;
  firstName;
  lastName;
  email;
  password;
  mobilePhone;
  mobilePhoneCode;
  avatar: ImageFile;
  addressCountryId;
  addressStateId;
  addressCity;
  address;
  addressZipCode;
  tShirtSize;
  addressState;
  addressCountry;
  isConfigurePaymentStripeAccount;

  constructor(item: Partial<BasicProfile> = {}) {
    const {
      id,
      firstName,
      lastName,
      email,
      password,
      mobilePhone,
      mobilePhoneCode,
      avatar,
      addressCity,
      address,
      addressZipCode,
      tShirtSize,
      addressState,
      addressCountry,
      isConfigurePaymentStripeAccount,
    } = item;
    this.id = id || undefined;
    this.firstName = firstName || '';
    this.lastName = lastName || '';
    this.email = email || '';
    this.password = password || '';
    this.mobilePhone = mobilePhone || '';
    this.mobilePhoneCode = mobilePhoneCode || '';
    this.avatar = avatar ? {...new ImageFile(avatar)} : new ImageFile();
    this.addressCountryId = addressCountry ? addressCountry.id : '';
    this.addressStateId = addressState ? addressState.id : '';
    this.addressCity = addressCity || '';
    this.address = address || '';
    this.addressZipCode = addressZipCode || '';
    this.tShirtSize = tShirtSize || '';
    this.isConfigurePaymentStripeAccount = isConfigurePaymentStripeAccount || false;
  }
}
