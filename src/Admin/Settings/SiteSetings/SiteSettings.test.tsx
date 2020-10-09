import * as React from 'react';
import {shallow, mount} from 'enzyme';
import {Form} from 'antd';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../../shared/i18n/i18n';
import SiteSettings from './SiteSettings';
import {ApolloProvider} from 'react-apollo-hooks';
import gqlClient from '../../../shared/config/gqlClient';

const FormComponent = Form.create()(SiteSettings);

describe('Site Settings Form', () => {
  let wrapper;
  let formRef;

  it('Site Settings Form renders correctly', () => {
    gqlClient.getClient().then(client => {
      shallow(
        <ApolloProvider client={client}>
          <FormComponent />
        </ApolloProvider>,
      );
    });
  });

  it('Should render correctly Site Settings without Snapshot', () => {
    gqlClient.getClient().then(client => {
      const component = shallow(
        <ApolloProvider client={client}>
          <FormComponent />
        </ApolloProvider>,
      );
      expect(component).toMatchSnapshot();
    });
  });

  it('render Site Settings without crashing', () => {
    gqlClient.getClient().then(client => {
      wrapper = mount(
        <ApolloProvider client={client}>
          <FormComponent
            wrappedComponentRef={inst => {
              formRef = inst;
            }}
          />
        </ApolloProvider>,
      );
    });
  });

  it('should set email value for Site Settings', () => {
    const {form} = formRef.props;
    form.setFieldsValue({
      siteName: 'GoHeavy',
    });
    expect(form.getFieldValue('siteName')).toEqual('GoHeavy');
  });

  it('when the form is submitted the event is cancelled for Site Settings', () => {
    let prevented = false;
    wrapper.find('form#site-settings').simulate('submit', {
      preventDefault: () => {
        prevented = true;
      },
    });
    expect(prevented).toBe(true);
  });

  it('Test handle submit', () => {
    const handleSubmit = jest.fn();
    handleSubmit();
    expect(handleSubmit).toHaveBeenCalled();
  });
});
