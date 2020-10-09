import {BaseClient} from '../config/BaseClient';

class PriceModel extends BaseClient {
  get(input: any) {
    const schema = `
    query($input: CoreGetInput!){
      VehicleTypeGet(input: $input){
        id
        type
        prices(input:{
          order:[
              {
              field:"productSize.labelSize.order"
              orderType: ASC
              }
            ]
          }){
          id
          isEnabled
          productSize{
            labelSize{
              type
            }
            measureLabourLoadingSingle{
              amount(unit:minutes)
            }
            measureLabourLoadingMultiple{
              amount(unit:minutes)
            }
            measureLabourUnloadingSingle{
              amount(unit:minutes)
            }
            measureLabourUnloadingMultiple{
              amount(unit:minutes)
            }
          }
          currencyBaseFare{
          amount
          }
          currencyMinimumFare{
            amount
          }
          currencyMileRate{
            amount
          }
          currencyMileRateAfter{
            amount
          }
          currencyLoadingUnloading{
            amount
          }
          pieceType
        }
      }
    }
      `;
    return this.query('websiteBackend', schema, {input});
  }

  delete(input: any) {
    const schema = `
      mutation($input: GenericFilterInput!){
        PriceProductSizeDelete(input: $input){
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
}

const priceModel = new PriceModel();
export default priceModel;
