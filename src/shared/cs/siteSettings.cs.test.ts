import {SiteSetting} from './siteSettings.cs';
import {ImageFile} from './imageFile.cs';
import {Currency} from './currency.cs';

describe('Test Site Settings class', () => {
  const imageLogo = new ImageFile({
    id: undefined,
    name: '',
    pathUrl: '',
    mimeType: '',
    size: '',
  });
  const imageLogo2 = new ImageFile({
    id: undefined,
    name: '',
    pathUrl: '',
    mimeType: '',
    size: '',
  });
  const curr = new Currency({
    id: undefined,
    name: '',
    alphabeticCode: '',
  });
  const curr2 = new Currency({
    id: 'MzM2SHNRSzZGMXF3NmNSTVdTdlhxMlY6NQ',
    name: '',
    alphabeticCode: '',
  });
  const initValues = {
    siteName: '',
    measureOpportunityTimeout: '',
    measureSearchRadius: '',
    gMapFrontendKey: '',
    gMapBackendKey: '',
    gMapMobileKey: '',
    siteCopyright: '',
    mobileAppPlayStoreUrl: '',
    mobileAppStoreUrl: '',
    siteContactPhoneNumber: '',
    siteContactPhoneNumberCode: '+1',
    siteLogoFile: imageLogo,
    siteIconFile: imageLogo,
    bookingPrefix: '',
    stripeAccountId: '',
    stripePublicKey: '',
    stripePrivateKey: '',
    fareNextDayPrice: '',
    fareFleetCommission: '',
    fareDriverCommission: '',
    currency: curr,
    supportEmail: '',
  };
  const initTwoValues = {
    siteName: 'Goheavy',
    measureOpportunityTimeout: '',
    measureSearchRadius: '',
    gMapFrontendKey: '',
    gMapBackendKey: '',
    gMapMobileKey: '',
    siteCopyright: '',
    mobileAppPlayStoreUrl: '',
    mobileAppStoreUrl: '',
    siteContactPhoneNumber: '',
    siteContactPhoneNumberCode: '+1',
    siteLogoFile: imageLogo2,
    siteIconFile: imageLogo2,
    bookingPrefix: '',
    stripeAccountId: '',
    stripePublicKey: '',
    stripePrivateKey: '',
    fareNextDayPrice: '',
    fareFleetCommission: '',
    fareDriverCommission: '',
    currency: curr2,
    supportEmail: '',
  };
  const objOne = new SiteSetting(initValues);
  const objTwo = new SiteSetting(initTwoValues);
  // const loginAsAdmin = jest.fn().mockImplementation(store.loginAsAdmin);

  it('obj without init values', () => {
    expect(objOne).toEqual(initValues);
  });

  it('obj with init values', () => {
    expect(objTwo).toEqual(initTwoValues);
  });
});
