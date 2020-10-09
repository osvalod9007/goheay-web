import {ImageFile} from './imageFile.cs';

describe('Test Image File class', () => {
  const initValues = {
    id: undefined,
    name: '',
    pathUrl: '',
    publicUrl: '',
    mimeType: '',
    size: '',
  };
  const initTwoValues = {
    id: undefined,
    name: '',
    pathUrl: '',
    publicUrl: '',
    mimeType: '',
    size: '',
  };
  const objOne = new ImageFile();
  const objTwo = new ImageFile(initTwoValues);
  // const loginAsAdmin = jest.fn().mockImplementation(store.loginAsAdmin);

  it('obj without init values', () => {
    expect(objOne).toEqual(initValues);
  });

  it('obj with init values', () => {
    expect(objTwo).toEqual(initTwoValues);
  });
});
