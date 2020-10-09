import {BaseClient} from '../config/BaseClient';
class VehicleModel extends BaseClient {
  getVehicle(input: any) {
    const schema = `
      query ($input: CoreGetInput!){
        VehicleGet(input: $input){
        id
        vin
        measureLong{amount(unit:inches)}
        measureWidth{amount(unit:inches)}
        measureHeight{amount(unit:inches)}
        measurePayload{amount(unit:pounds)}
        measureFloorSpace{amount(unit:squaredFeet)}
        measureLoadingSpace{amount(unit:cubicFeet)}
        make
        year
        model
        color
        trim
        transmission
        towingKitInstalled
        insurancePolicyNo
        insuranceCertificateCompany
        insuranceEffectiveDate
        insuranceExpirationDate
        insuranceRenewal
        licensePlatePhotoFile{
          id
          publicUrl
        }
        licensePlateNo
        licensePlateStateIssued{
          id
          name
        }
        status
        vehicleType{
          type
          id
        }
        documents{
        id
        file{
          id
          publicUrl
        }
        type
        status
        }
        createdAt
        company{
          name
        }
            }
          }
      `;
    return this.query('websiteBackend', schema, {input});
  }
  getVehicleDetailsVinGet(input: any) {
    const schema = `
      query ($input: String!){
        VehicleDetailsVinGet(vin: $input){
          make
          model
          year
          measurePayload{amount(unit:pounds)}
          measureLoadingSpace{amount(unit:cubicFeet)}
          vehicleId
        }
      }
      `;
    return this.query('websiteBackend', schema, {input});
  }
  existVin(input: any) {
    const schema = `query($input: String!){
      VehicleList(input:
        {
          where:{
            field:"vin"
            op:EQ
            value:[$input]
          }
        }
      ){
        total
      }
    }`;
    return this.query('websiteBackend', schema, {input});
  }

  deleteVehicle(input: any) {
    const schema = `
      mutation($input: GenericFilterInput!){
        VehicleDelete(input: $input){
          isSuccess
        }
      }
      `;
    return this.mutate('websiteBackend', schema, {input});
  }
  assignVehicle(input: any) {
    const schema = `
      mutation($input: VehicleAssignInput!){
        VehicleAssign (input: $input)
      }
      `;
    return this.mutate('websiteBackend', schema, {input});
  }

  exportTo(input: any) {
    const schema = `
    query($input: GenericFilterInput) {
      VehicleList(input: $input) {
        export {
          url
        }
      }
    }
      `;
    return this.query('websiteBackend', schema, {input});
  }

  getDocuments(input: any) {
    const schema = `
      query ($input: CoreGetInput!){
        VehicleGet(input: $input){
          id
          vin
          documents(input:{
            order:{
              field:"weight"
              orderType: ASC
            }
          }) {
            id
            type
            status
            file {
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
    mutation($id: EncryptId!, $input: VehicleUpdateInput!) {
      VehicleUpdate(id: $id, input: $input) {
        id
      }
    }
      `;
    return this.mutate('websiteBackend', schema, {...input});
  }
}

const vehicleModel = new VehicleModel();
export default vehicleModel;
