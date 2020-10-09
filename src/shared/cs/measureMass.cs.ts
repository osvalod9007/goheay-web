import {UnitMassEnum} from '../enums/UnitMass.enum';

export class MeasureMass {
  amount: number;
  unit: UnitMassEnum;

  constructor(item: Partial<MeasureMass> = {}) {
    const {amount, unit} = item;
    this.amount = amount || 0;
    this.unit = unit || UnitMassEnum.pounds;
  }
}
