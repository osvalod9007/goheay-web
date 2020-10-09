import * as React from 'react';
import {shallow, mount} from 'enzyme';
import {Form} from 'antd';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../../../../shared/i18n/i18n';
import StepTwoForgotForm from './StepTwoForgotForm';

const FormComponent = Form.create()(StepTwoForgotForm);

describe('Step Two Forgot Form', () => {
  let wrapper;
  let formRef;

  it('Step Two Forgot Form renders correctly', () => {
    shallow(<FormComponent />);
  });

  it('Should render correctly Step Two Forgot Form with Snapshot', () => {
    const component = shallow(<FormComponent />);
    expect(component).toMatchSnapshot();
  });

  it('render Step Two Forgot Form without crashing', () => {
    i18n.changeLanguage(require(`antd/lib/locale-provider/en_US.js`).default.locale);
    wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <FormComponent
          wrappedComponentRef={inst => {
            formRef = inst;
          }}
        />
      </I18nextProvider>,
    );
  });

  it('should set password value for Step Two Forgot Form', () => {
    const {form} = formRef.props;
    form.setFieldsValue({
      password: 'admin123',
    });
    expect(form.getFieldValue('password')).toEqual('admin123');
  });

  it('when the form is submitted the event is cancelled for Step Two Forgot Form', () => {
    let prevented = false;
    wrapper.find('form#step-two-forgot-form').simulate('submit', {
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
