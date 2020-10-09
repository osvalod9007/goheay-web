import {BaseClient} from '../config/BaseClient';

class AccountManagerModel extends BaseClient {
  get(input: any) {
    const schema = `
      query ($input: CoreGetInput!){
        AccountManagerGet(input: $input){
          id
          role
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

  delete(input: any) {
    const schema = `
      mutation($input: GenericFilterInput!){
        AccountManagerDelete(input: $input){
          isSuccess
        }
      }
      `;
    return this.mutate('websiteBackend', schema, {input});
  }

  exportTo(input: any) {
    const schema = `
    query($input: GenericFilterInput) {
      AccountManagerList(input: $input) {
        export {
          url
        }
      }
    }
      `;
    return this.query('websiteBackend', schema, {input});
  }
}

const accountManagerModel = new AccountManagerModel();
export default accountManagerModel;
