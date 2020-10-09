import {MeasureLength} from './measureLength.cs';
import {UnitLengthEnum} from '../enums/UnitLength.enum';

describe('Test Measure wLength class', () => {
  const initValues = {
    amount: 0,
    unit: UnitLengthEnum.feet,
  };
  const initTwoValues = {
    amount: 30,
    unit: UnitLengthEnum.inches,
  };
  const objOne = new MeasureLength();
  const objTwo = new MeasureLength(initTwoValues);

  it('obj without init values', () => {
    expect(objOne).toEqual(initValues);
    expect(initValues.unit).toEqual(UnitLengthEnum.feet);
    expect(initValues.amount).toEqual(0);
  });

  it('obj with init values', () => {
    expect(objTwo).toEqual(initTwoValues);
    expect(initTwoValues.unit).toEqual(UnitLengthEnum.inches);
    expect(initTwoValues.amount).toEqual(30);
  });
});
