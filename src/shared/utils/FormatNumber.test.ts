import formatNumber from './FormatNumber';

describe('Test FOrmat Float method', () => {
  it('Test call Format method', () => {
    // const getQueryString = jest.fn().mockImplementation(masks.maskZip);
    // getQueryString();
    expect(formatNumber.formatFloat(34)).toBe('34.00');
  });
});
