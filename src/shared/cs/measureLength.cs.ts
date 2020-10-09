import {UnitLengthEnum} from '../enums/UnitLength.enum';
import {UnitMassEnum} from '../enums/UnitMass.enum';

export class MeasureLength {
  amount: number;
  unit: UnitLengthEnum;

  constructor(item: Partial<MeasureLength> = {}) {
    const {amount, unit} = item;
    this.amount = amount || 0;
    this.unit = unit || UnitLengthEnum.feet;
  }
}
