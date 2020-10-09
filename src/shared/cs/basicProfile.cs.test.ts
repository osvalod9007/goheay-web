import {BasicProfile} from './basicProfile.cs';
import {ImageFile} from './imageFile.cs';

describe('Test Basic Profile class', () => {
  const imageLogoDef = new ImageFile();
  const imageLogo = new ImageFile({
    id: undefined,
    name: '',
    pathUrl: '',
    mimeType: '',
    size: '',
  });
  const initValues = {
    id: undefined,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobilePhone: '',
    mobilePhoneCode: '',
    avatar: imageLogoDef,
    addressCountryId: '',
    addressStateId: '',
    addressState: undefined,
    addressCountry: undefined,
    addressCity: '',
    address: '',
    addressZipCode: '',
    tShirtSize: '',
    isConfigurePaymentStripeAccount: false,
  };
  const initTwoValues = {
    id: undefined,
    firstName: 'Driverone',
    lastName: '',
    email: '',
    password: '',
    mobilePhone: '+1',
    mobilePhoneCode: '',
    avatar: imageLogo,
    addressState: undefined,
    addressStateId: '',
    addressCountry: undefined,
    addressCountryId: '',
    addressCity: '',
    address: '',
    addressZipCode: '',
    tShirtSize: '',
    isConfigurePaymentStripeAccount: true,
  };
  const objOne = new BasicProfile();
  const objTwo = new BasicProfile(initTwoValues);
  // const loginAsAdmin = jest.fn().mockImplementation(store.loginAsAdmin);

  it('obj without init values', () => {
    expect(objOne).toEqual(initValues);
  });

  it('obj with init values', () => {
    expect(objTwo).toEqual(initTwoValues);
  });
});
