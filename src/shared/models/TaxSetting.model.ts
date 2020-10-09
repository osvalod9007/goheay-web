import {BaseClient} from '../config/BaseClient';

class TaxSettingModel extends BaseClient {
  getTaxSetting(input: any) {
    const schema = `
      query ($input: CoreGetInput!){
        SettingTaxGet(input: $input){
          id
          tax
          state {
            id
          }
          country {
            id
          }
        }
      }
      `;
    return this.query('websiteBackend', schema, {input});
  }

  deleteTaxSetting(input: any) {
    const schema = `
      mutation($input: GenericFilterInput!){
        SettingTaxDelete(input: $input){
          isSuccess
        }
      }
      `;
    return this.mutate('websiteBackend', schema, {input});
  }

  exportTo(input: any) {
    const schema = `
    query($input: GenericFilterInput) {
      SettingTaxList(input: $input) {
        export {
          url
        }
      }
    }
      `;
    return this.query('websiteBackend', schema, {input});
  }
}

const taxSettingModel = new TaxSettingModel();
export default taxSettingModel;
