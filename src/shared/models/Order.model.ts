import {BaseClient} from '../config/BaseClient';

class OrderModel extends BaseClient {
  cancel(input: any) {
    const schema = `
    mutation($id: EncryptId!, $input: OrderUpdateInput!) {
      OrderUpdate(id: $id, input: $input) {
        id
      }
    }
      `;
    return this.mutate('websiteBackend', schema, {...input});
  }

  get(input: any) {
    const schema = `
      query ($input: CoreGetInput!){
        OrderGet(input: $input){
          id
          status
          customerFullName
          driverFullName
          route {
            data
            measureTotalDistance{
              amount(unit:miles)
            }
          }
          deliveryStartAt
          deliveryEndAt
          pickUpLocationAddress
          dropOffLocationAddress
          fare {
            measureBaseFarePrice {
              amount
              currency
            }
            measureDistanceChargePrice {
              amount
              currency
            }
            measureLaborChargePrice {
              amount
              currency
            }
            measureServiceFeePrice {
              amount
              currency
            }
            measureEveningDeliveryPrice {
              amount
              currency
            }
            measureTaxPrice {
              amount
              currency
            }
            measureHandlingSurchargesTotalPiecesPrice {
              amount
              currency
            }
            measureTotalPrice {
              amount
              currency
            }
          }
        }
      }
      `;
    return this.query('websiteBackend', schema, {input});
  }
  exportTo(input: any) {
    const schema = `
    query($input: GenericFilterInput!) {
      OrderList(input: $input) {
        export {
          url
        }
      }
    }
      `;
    return this.query('websiteBackend', schema, {input});
  }
}

const orderModel = new OrderModel();
export default orderModel;
