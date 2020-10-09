import React from 'react';
import {shallow, mount} from 'enzyme';

import AuthAdmin from './AuthAdmin';

describe('Auth Admin Component', () => {
  let wrapper;

  it('Auth Admin renders correctly', () => {
    shallow(<AuthAdmin />);
  });

  it('Should render correctly Auth Admin without Snapshot', () => {
    wrapper = shallow(<AuthAdmin />);
    expect(wrapper).toMatchSnapshot();
  });
});
