import {BaseClient} from '../config/BaseClient';

class SettingsModel extends BaseClient {
  getSiteSettings() {
    const schema = `
      query{
        SiteSettingGet{
          siteName
          measureOpportunityTimeout {
            amount(unit: seconds)
          }
          measureSearchRadius {
            amount(unit: miles)
          }
          gMapFrontendKey
          gMapBackendKey
          gMapMobileKey
          siteCopyright
          mobileAppPlayStoreUrl
          mobileAppStoreUrl
          siteContactPhoneNumber
          siteContactPhoneNumberCode
          siteLogoFile{
            id
            name
            publicUrl
            mimeType
            size
          }
          siteIconFile{
            id
            name
            publicUrl
            mimeType
            size
          }
          supportEmail
        }
      }
    `;
    return this.query('public', schema, undefined);
  }

  getSystemSettings() {
    const schema = `
      query{
        SiteSettingGet{
          siteCopyright
          siteLogoFile{
            id
            name
            publicUrl
            mimeType
            size
          }
          siteIconFile{
            id
            name
            publicUrl
            mimeType
            size
          }
        }
      }
    `;
    return this.publiQuery(schema, undefined);
  }

  getAdminAccountSettings() {
    const schema = `
      query{
        AdministratorProfileGet{
          basicProfile{
            firstName
            lastName
            avatar {
              id
              name
              publicUrl
              mimeType
              size
            }
            email
            mobilePhone
            mobilePhoneCode
            address
            addressCity
            addressState {
              id
            }
            addressCountry {
              id
            }
            addressZipCode
          }
        }
      }
    `;
    return this.query('websiteBackend', schema, undefined);
  }

  getFleetAccountSettings() {
    const schema = `
      query{
        FleetOwnerProfileGet{
          basicProfile{
            firstName
            lastName
            avatar {
              id
              name
              publicUrl
              mimeType
              size
            }
            email
            mobilePhone
            mobilePhoneCode
            address
            addressCity
            addressState {
              id
            }
            addressCountry {
              id
            }
            addressZipCode
          }
        }
      }
    `;
    return this.query('websiteBackend', schema, undefined);
  }

  getPaymentSettings() {
    const schema = `
      query{
        SiteSettingGet{
          bookingPrefix
          stripeAccountId
          stripePublicKey
          stripePrivateKey
          fareNextDayPrice
          fareFleetCommission
          fareDriverCommission
          currency {
            id
            name
            alphabeticCode
          }
        }
      }
    `;
    return this.query('websiteBackend', schema, undefined);
  }
}

const settingsModel = new SettingsModel();
export default settingsModel;
