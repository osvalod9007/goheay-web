import {Driver} from './driver.cs';
import {DriverStatusEnum} from '../enums/DriverStatus.enum';
import {ImageFile} from './imageFile.cs';
import {Company} from './company.cs';
import {BasicProfile} from './basicProfile.cs';

describe('Test Driver class', () => {
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
    birthAt: null,
    experienceYear: undefined,
    status: DriverStatusEnum.STATUS_ON_BOARDING,
    rating: 0,
    tShirtSize: '',
    basicProfile: basicProfileOne,
    documents: [],
    driverLicenseBack: undefined,
  };
  const initTwoValues = {
    id: undefined,
    birthAt: null,
    experienceYear: '2',
    status: DriverStatusEnum.STATUS_ON_BOARDING,
    rating: 2,
    tShirtSize: '',
    basicProfile: basicProfileTwo,
    documents: [],
    driverLicenseBack: undefined,
  };
  const objOne = new Driver();
  const objTwo = new Driver(initTwoValues);
  // const loginAsAdmin = jest.fn().mockImplementation(store.loginAsAdmin);

  it('obj without init values', () => {
    expect(objOne).toEqual(initValues);
  });

  it('obj with init values', () => {
    expect(objTwo).toEqual(initTwoValues);
  });
});
