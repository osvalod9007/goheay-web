import * as React from 'react';
import {shallow, mount} from 'enzyme';
import {Form} from 'antd';
import {I18nextProvider} from 'react-i18next';
import templateOneHook from './TemplateOneHoC';

describe('Testing HoC', () => {
  it('should render the component only when the condition passes', () => {
    const Ride = templateOneHook({
      Menu: () => <h1>Ride</h1>,
      Content: () => <h1>Content</h1>,
    });
    const wrapper = shallow(<Ride />);
    expect(wrapper.html()).not.toBe(null);
  });
});
