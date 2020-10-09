import {BaseClient} from '../config/BaseClient';

class ManageSizeModel extends BaseClient {
  getManageSize(input: any) {
    const schema = `
      query ($input: CoreGetInput!){
        ProductSizeGet(input: $input){
          id
          labelSize{
            type
          }
          measureLwh{amount(unit:inches)}
          lwhLargerThanEqual
          measureWeightMin{amount(unit:pounds)}
          measureWeightMax{amount(unit:pounds)}
          measureTotalLinearMin{amount(unit:inches)}
          measureTotalLinearMax{amount(unit:inches)}
          measureLabourLoadingSingle{amount(unit:minutes)}
          measureLabourLoadingMultiple{amount(unit:minutes)}
          measureLabourUnloadingSingle{amount(unit:minutes)}
          measureLabourUnloadingMultiple{amount(unit:minutes)}
        }
      }
      `;
    return this.query('websiteBackend', schema, {input});
  }

  exportTo(input: any) {
    const schema = `
    query($input: GenericFilterInput) {
      ProductSizeList(input: $input) {
        export {
          url
        }
      }
    }
      `;
    return this.query('websiteBackend', schema, {input});
  }
}

const manageSizeModel = new ManageSizeModel();
export default manageSizeModel;
