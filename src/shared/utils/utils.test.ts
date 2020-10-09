import utils from './utils';

describe('Test Query String method', () => {
  it('Test call method', () => {
    const getQueryString = jest.fn().mockImplementation(utils.getQueryString());
    // getQueryString();
    expect(getQueryString).toHaveLength(0);
  });
});
