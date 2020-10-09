import {SizeEnum} from '../enums/Size.enum';

export class ProductSize {
  id;
  labelSize;
  measureLwh;
  measureWeightMin;
  measureWeightMax;
  measureTotalLinearMin;
  measureTotalLinearMax;
  measureLabourLoadingSingle;
  measureLabourLoadingMultiple;
  measureLabourUnloadingSingle;
  measureLabourUnloadingMultiple;
  lwhLargerThanEqual;
  constructor(item: Partial<ProductSize> = {}) {
    const {
      id,
      labelSize,
      measureLwh,
      lwhLargerThanEqual,
      measureWeightMin,
      measureWeightMax,
      measureTotalLinearMin,
      measureTotalLinearMax,
      measureLabourLoadingSingle,
      measureLabourLoadingMultiple,
      measureLabourUnloadingSingle,
      measureLabourUnloadingMultiple,
    } = item;

    this.id = id || undefined;
    this.labelSize = labelSize || undefined;
    this.measureWeightMin = measureWeightMin || '';
    this.measureWeightMax = measureWeightMax || '';
    this.measureLwh = measureLwh || '';
    this.lwhLargerThanEqual = lwhLargerThanEqual || false;
    this.measureTotalLinearMin = measureTotalLinearMin || '';
    this.measureTotalLinearMax = measureTotalLinearMax || '';
    this.measureLabourLoadingSingle = measureLabourLoadingSingle || '';
    this.measureLabourLoadingMultiple = measureLabourLoadingMultiple || '';
    this.measureLabourUnloadingSingle = measureLabourUnloadingSingle || '';
    this.measureLabourUnloadingMultiple = measureLabourUnloadingMultiple || '';
  }
}
