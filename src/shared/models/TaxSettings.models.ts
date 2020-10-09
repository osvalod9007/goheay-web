import {BaseClient} from '../config/BaseClient';

class TaxSettingsModel extends BaseClient {
  getTaxSetting(input: any) {
    const schema = `
      query ($input: CoreGetInput!){
        DriverGet(input: $input){
          id
          birthAt
          experienceYear
          tShirtSize
          basicProfile{
            firstName
            lastName
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
    return this.query('websiteBackend', schema, {input});
  }

  deleteTaxSetting(input: any) {
    const schema = `
      mutation($input: GenericFilterInput!){
        DriverDelete(input: $input){
          isSuccess
        }
      }
      `;
    return this.mutate('websiteBackend', schema, {input});
  }

  exportTo(input: any) {
    const schema = `
    query($input: GenericFilterInput) {
      DriverList(input: $input) {
        export {
          url
        }
      }
    }
      `;
    return this.query('websiteBackend', schema, {input});
  }
}

const taxSettingsModel = new TaxSettingsModel();
export default taxSettingsModel;
