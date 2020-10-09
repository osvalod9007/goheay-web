import {BaseClient} from '../config/BaseClient';

class CustomerModel extends BaseClient {
  getCustomer(input: any) {
    const schema = `
      query ($input: CoreGetInput!){
        CustomerGet(input: $input){
          id
          basicProfile {
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

  deleteCustomer(input: any) {
    const schema = `
      mutation($input: GenericFilterInput!){
        CustomerDelete(input: $input){
          isSuccess
        }
      }
      `;
    return this.mutate('websiteBackend', schema, {input});
  }

  exportTo(input: any) {
    const schema = `
    query($input: GenericFilterInput) {
      CustomerList(input: $input) {
        export {
          url
        }
      }
    }
      `;
    return this.query('websiteBackend', schema, {input});
  }
}

const customerModel = new CustomerModel();
export default customerModel;
