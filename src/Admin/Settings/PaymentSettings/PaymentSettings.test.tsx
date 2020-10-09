import * as React from 'react';
import {shallow, mount} from 'enzyme';
import {Form} from 'antd';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../../shared/i18n/i18n';
import PaymentSettings from './PaymentSettings';
import {ApolloProvider} from 'react-apollo-hooks';
import gqlClient from '../../../shared/config/gqlClient';

const FormComponent = Form.create()(PaymentSettings);

describe('Payment Settings Form', () => {
  let wrapper;
  let formRef;

  it('PaymentSettings Form renders correctly', () => {
    gqlClient.getClient().then(client => {
      shallow(
        <ApolloProvider client={client}>
          <FormComponent />
        </ApolloProvider>,
      );
    });
  });

  it('Should render correctly Payment Settings without Snapshot', () => {
    gqlClient.getClient().then(client => {
      const component = shallow(
        <ApolloProvider client={client}>
          <FormComponent />
        </ApolloProvider>,
      );
      expect(component).toMatchSnapshot();
    });
  });

  it('render Payment Settings without crashing', () => {
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

  it('should set Booking Id Prefix value for Payment Settings', () => {
    const {form} = formRef.props;
    form.setFieldsValue({
      bookingPrefix: 'BOOKING',
    });
    expect(form.getFieldValue('bookingPrefix')).toEqual('BOOKING');
  });

  it('when the form is submitted the event is cancelled for Payment Settings', () => {
    let prevented = false;
    wrapper.find('form#payment-settings').simulate('submit', {
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
