import masks from './masks';

describe('Test Masks methods', () => {
  it('Test call Zip method with max 5 charcteres', () => {
    expect(masks.maskZip('23333')).toBe('23333');
  });

  it('Test call Zip method', () => {
    expect(masks.maskZip('23333333')).toBe('23333-333');
  });

  it('Test call Emloyer Id method with 3 or more charcteres', () => {
    // const getQueryString = jest.fn().mockImplementation(masks.maskZip);
    // getQueryString();
    expect(masks.maskEmployerId('221234567')).toBe('22-1234567');
  });

  it('Test call Emloyer Id method with max 2 characteres', () => {
    // const getQueryString = jest.fn().mockImplementation(masks.maskZip);
    // getQueryString();
    expect(masks.maskEmployerId('22')).toBe('22');
  });

  it('Test call Emloyer Id method with null value', () => {
    // const getQueryString = jest.fn().mockImplementation(masks.maskZip);
    // getQueryString();
    expect(masks.maskEmployerId(null)).toBe(null);
  });
});
