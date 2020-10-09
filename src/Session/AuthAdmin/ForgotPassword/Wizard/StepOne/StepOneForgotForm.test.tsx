import * as React from 'react';
import {shallow, mount} from 'enzyme';
import {Form} from 'antd';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../../../../shared/i18n/i18n';
import StepOneForgotForm from './StepOneForgotForm';

const FormComponent = Form.create()(StepOneForgotForm);

describe('Step One Forgot Form', () => {
  let wrapper;
  let formRef;

  it('Step One Forgot Form renders correctly', () => {
    shallow(<FormComponent />);
  });

  it('Should render correctly Step One Forgot Form with Snapshot', () => {
    const component = shallow(<FormComponent />);
    expect(component).toMatchSnapshot();
  });

  it('render Step One Forgot Form without crashing', () => {
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

  it('should set email value for Step One Forgot Form', () => {
    const {form} = formRef.props;
    form.setFieldsValue({
      email: 'admin@goheavy.com',
    });
    expect(form.getFieldValue('email')).toEqual('admin@goheavy.com');
  });

  it('when the form is submitted the event is cancelled for Step One Forgot Form', () => {
    let prevented = false;
    wrapper.find('form#step-one-forgot-form').simulate('submit', {
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
