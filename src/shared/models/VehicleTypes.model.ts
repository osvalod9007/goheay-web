import {BaseClient} from '../config/BaseClient';

class VehicleTypesModel extends BaseClient {
  get(input: any) {
    const schema = `
      query($input: CoreGetInput!){
        VehicleTypeGet(input: $input){
          id
          type
          image {
            publicUrl
          }
          measureMinDimension {
              amount(unit: cubicFeet)
            }
            measureMaxDimension {
              amount(unit: cubicFeet)
            }
            measureMinPayload {
              amount(unit: pounds)
            }
            measureMaxPayload {
              amount(unit: pounds)
            }
        }
      }
      `;
    return this.query('websiteBackend', schema, {input});
  }

  delete(input: any) {
    const schema = `
      mutation($input: GenericFilterInput!){
        VehicleTypeDelete(input: $input){
          isSuccess
        }
      }
      `;
    return this.mutate('websiteBackend', schema, {input});
  }

  exportTo(input: any) {
    const schema = `
    query($input: GenericFilterInput) {
      VehicleTypeList(input: $input) {
        export {
          url
        }
      }
    }
      `;
    return this.query('websiteBackend', schema, {input});
  }
  getTypes(input: any) {
    const schema = `
    query($input: GenericFilterInput) {
      VehicleTypeList(input: $input) {
        total
        items {
          id
          type
          dimensions
          payload
          measureMinDimension {
            amount(unit: cubicFeet)
          }
          measureMaxDimension {
            amount(unit: cubicFeet)
          }
          measureMinPayload {
            amount(unit: pounds)
          }
          measureMaxPayload {
            amount(unit: pounds)
          }
        }
      }
    }
      `;
    return this.query('websiteBackend', schema, {input});
  }
}

const vehicleTypesModel = new VehicleTypesModel();
export default vehicleTypesModel;
