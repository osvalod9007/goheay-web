import {BaseClient} from '../config/BaseClient';

class DriverModel extends BaseClient {
  getDriver(input: any) {
    const schema = `
      query ($input: CoreGetInput!){
        DriverGet(input: $input){
          id
          birthAt
          experienceYear
          tShirtSize
          status
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
            avatar{
              id
              publicUrl
            }
          }
          #driverLicenseBack
          documents{
            id
            type
            uploadFile{
              id
              publicUrl
            }
          }
        }
      }
      `;
    return this.query('websiteBackend', schema, {input});
  }

  deleteDriver(input: any) {
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
    query($input: GenericFilterInput!) {
      DriverList(input: $input) {
        export {
          url
        }
      }
    }
      `;
    return this.query('websiteBackend', schema, {input});
  }

  listDrivers(input: any) {
    const schema = `
    query($input: GenericFilterInput!) {
      DriverList(input: $input) {
        total
        items{
          id
          status
          basicProfile{
            fullMobilePhone
            fullName
          }
        }
      }
    }
    `;
    return this.query('websiteBackend', schema, {input});
  }

  getDocuments(input: any) {
    const schema = `
      query ($input: CoreGetInput!){
        DriverGet(input: $input){
          id
          basicProfile {
            fullName
          }
          documents(input:{
            order:{
              field:"weight"
              orderType:ASC
            }
            where:[
              {
                field:"type"
                op:IN
                value:["TYPE_DRIVER_PHOTO", "TYPE_DRIVER_LICENCE_FRONT"]
              }
            ]
          }) {
            id
            type
            status
            uploadFile {
              publicUrl
            }
          }
        }
      }
      `;
    return this.query('websiteBackend', schema, {input});
  }

  update(input: any) {
    const schema = `
    mutation($id: EncryptId!, $input: DocumentDriverUpdateInput!) {
      DocumentDriverUpdate(id: $id, input: $input) {
        id
      }
    }
      `;
    return this.mutate('websiteBackend', schema, {...input});
  }
}

const driverModel = new DriverModel();
export default driverModel;
