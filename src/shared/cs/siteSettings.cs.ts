import {ImageFile} from './imageFile.cs';
import {Currency} from './currency.cs';

export class SiteSetting {
  siteName;
  siteLogoFile: ImageFile;
  siteIconFile: ImageFile;
  measureOpportunityTimeout;
  measureSearchRadius;
  gMapFrontendKey;
  gMapBackendKey;
  gMapMobileKey;
  siteCopyright;
  mobileAppPlayStoreUrl;
  mobileAppStoreUrl;
  siteContactPhoneNumber;
  siteContactPhoneNumberCode;
  bookingPrefix;
  stripeAccountId;
  stripePublicKey;
  stripePrivateKey;
  fareNextDayPrice;
  fareFleetCommission;
  fareDriverCommission;
  currency: Currency;
  supportEmail;

  constructor(item: Partial<SiteSetting> = {}) {
    const {
      siteName,
      siteLogoFile,
      siteIconFile,
      measureOpportunityTimeout,
      measureSearchRadius,
      gMapFrontendKey,
      gMapBackendKey,
      gMapMobileKey,
      siteCopyright,
      mobileAppPlayStoreUrl,
      mobileAppStoreUrl,
      siteContactPhoneNumber,
      siteContactPhoneNumberCode,
      bookingPrefix,
      stripeAccountId,
      stripePublicKey,
      stripePrivateKey,
      fareNextDayPrice,
      fareFleetCommission,
      fareDriverCommission,
      currency,
      supportEmail,
    } = item;
    this.siteName = siteName || '';
    this.siteLogoFile = siteLogoFile ? {...new ImageFile(siteLogoFile)} : new ImageFile();
    this.siteIconFile = siteIconFile ? {...new ImageFile(siteIconFile)} : new ImageFile();
    this.measureOpportunityTimeout = measureOpportunityTimeout ? measureOpportunityTimeout.amount : '';
    this.measureSearchRadius = measureSearchRadius ? measureSearchRadius.amount : '';
    this.gMapFrontendKey = gMapFrontendKey || '';
    this.gMapBackendKey = gMapBackendKey || '';
    this.gMapMobileKey = gMapMobileKey || '';
    this.siteCopyright = siteCopyright || '';
    this.mobileAppPlayStoreUrl = mobileAppPlayStoreUrl || '';
    this.mobileAppStoreUrl = mobileAppStoreUrl || '';
    this.siteContactPhoneNumber = siteContactPhoneNumber || '';
    this.siteContactPhoneNumberCode = siteContactPhoneNumberCode || '+1';
    this.bookingPrefix = bookingPrefix || '';
    this.stripeAccountId = stripeAccountId || '';
    this.stripePublicKey = stripePublicKey || '';
    this.stripePrivateKey = stripePrivateKey || '';
    this.fareNextDayPrice = fareNextDayPrice || '';
    this.fareFleetCommission = fareFleetCommission || '';
    this.fareDriverCommission = fareDriverCommission || '';
    this.currency = currency ? {...new Currency(currency)} : new Currency();
    this.supportEmail = supportEmail || '';
  }
}
