import {MeasureMass} from './measureMass.cs';
import {UnitMassEnum} from '../enums/UnitMass.enum';

describe('Test Measure Mass class', () => {
  const initValues = {
    amount: 0,
    unit: UnitMassEnum.pounds,
  };
  const initTwoValues = {
    amount: 30,
    unit: UnitMassEnum.ounce,
  };
  const objOne = new MeasureMass();
  const objTwo = new MeasureMass(initTwoValues);

  it('obj without init values', () => {
    expect(objOne).toEqual(initValues);
    expect(initValues.unit).toEqual(UnitMassEnum.pounds);
    expect(initValues.amount).toEqual(0);
  });

  it('obj with init values', () => {
    expect(objTwo).toEqual(initTwoValues);
    expect(initTwoValues.unit).toEqual(UnitMassEnum.ounce);
    expect(initTwoValues.amount).toEqual(30);
  });
});
