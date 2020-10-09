import {ProductSize} from './ProductSize.cs';
import {SizeEnum} from '../enums/Size.enum';

describe('Test Product Size class', () => {
  const initValues = {
    id: undefined,
    labelSize: undefined,
    measureLwh: '',
    lwhLargerThanEqual: false,
    measureWeightMin: '',
    measureWeightMax: '',
    measureTotalLinearMin: '',
    measureTotalLinearMax: '',
    measureLabourLoadingSingle: '',
    measureLabourLoadingMultiple: '',
    measureLabourUnloadingSingle: '',
    measureLabourUnloadingMultiple: '',
  };
  const initTwoValues = {
    id: undefined,
    labelSize: undefined,
    measureLwh: '',
    lwhLargerThanEqual: false,
    measureWeightMin: '',
    measureWeightMax: '',
    measureTotalLinearMin: '',
    measureTotalLinearMax: '',
    measureLabourLoadingSingle: '',
    measureLabourLoadingMultiple: '',
    measureLabourUnloadingSingle: '',
    measureLabourUnloadingMultiple: '',
  };
  const objOne = new ProductSize();
  const objTwo = new ProductSize(initTwoValues);

  it('obj without init values', () => {
    expect(objOne).toEqual(initValues);
  });

  it('obj with init values', () => {
    expect(objTwo).toEqual(initTwoValues);
  });
});
