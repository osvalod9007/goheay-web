import {Price} from './price.cs';

describe('Test Price class', () => {
  const initValues = {
    id: undefined,
    prices: [],
  };
  const initTwoValues = {
    id: undefined,
    prices: [],
  };
  const objOne = new Price();
  const objTwo = new Price(initTwoValues);
  // const loginAsAdmin = jest.fn().mockImplementation(store.loginAsAdmin);

  it('obj without init values', () => {
    expect(objOne).toEqual(initValues);
  });

  it('obj with init values', () => {
    expect(objTwo).toEqual(initTwoValues);
  });
});
