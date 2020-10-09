import {BaseClient} from '../config/BaseClient';

class FleetOwner extends BaseClient {
  getFleetOwner(input: any) {
    const schema = `
    query($input: CoreGetInput!) {
      FleetOwnerGet(input: $input) {
        id
        employerId
        company{
          name
        }
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
        FleetOwnerDelete(input: $input){
          isSuccess
        }
      }
      `;
    return this.mutate('websiteBackend', schema, {input});
  }

  exportTo(input: any) {
    const schema = `
    query($input: GenericFilterInput) {
      FleetOwnerList(input: $input) {
        export {
          url
        }
      }
    }
      `;
    return this.query('websiteBackend', schema, {input});
  }

  stripeExpressAccountCreate(input: any) {
    const schema = `
      mutation($input: StripeExpressAccountCreateInput!){
        StripeExpressAccountCreate(input: $input){
          isSuccess
        }
      }
      `;
    return this.mutate('websiteBackend', schema, {input});
  }

  stripeAccountExpressDashboardGet() {
    const schema = `
      query{
        StripeAccountExpressDashboardGet{
          url
        }
      }
      `;
    return this.query('websiteBackend', schema, undefined);
  }
}

const fleetOwnerModel = new FleetOwner();
export default fleetOwnerModel;
