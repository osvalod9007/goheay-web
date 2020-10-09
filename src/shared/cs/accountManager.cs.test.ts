import {AccountManager} from './accountManager.cs';
import {ImageFile} from './imageFile.cs';
import {BasicProfile} from './basicProfile.cs';

describe('Test Account Manager class', () => {
  const imageLogoDef = new ImageFile();
  const imageLogo = new ImageFile({
    id: undefined,
    name: '',
    pathUrl: '',
    mimeType: '',
    size: '',
  });
  const basicProfileOne = new BasicProfile({
    id: undefined,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobilePhone: '',
    mobilePhoneCode: '',
    avatar: imageLogoDef,
    addressState: undefined,
    addressStateId: '',
    addressCountry: undefined,
    addressCountryId: '',
    addressCity: '',
    address: '',
    addressZipCode: '',
    tShirtSize: '',
  });
  const basicProfileTwo = new BasicProfile({
    id: undefined,
    firstName: 'Driverone',
    lastName: '',
    email: '',
    password: '',
    mobilePhone: '',
    mobilePhoneCode: '+1',
    avatar: imageLogo,
    addressState: undefined,
    addressStateId: '',
    addressCountry: undefined,
    addressCountryId: '',
    addressCity: '',
    address: '',
    addressZipCode: '',
    tShirtSize: '',
  });
  const initValues = {
    id: undefined,
    role: '',
    basicProfile: basicProfileOne,
  };
  const initTwoValues = {
    id: undefined,
    role: '',
    basicProfile: basicProfileTwo,
  };
  const objOne = new AccountManager();
  const objTwo = new AccountManager(initTwoValues);
  // const loginAsAdmin = jest.fn().mockImplementation(store.loginAsAdmin);

  it('obj without init values', () => {
    expect(objOne).toEqual(initValues);
  });

  it('obj with init values', () => {
    expect(objTwo).toEqual(initTwoValues);
  });
});
