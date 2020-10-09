import * as React from 'react';
import {shallow, mount} from 'enzyme';
import {Form} from 'antd';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../../shared/i18n/i18n';
import AuthAdminForm from './AuthAdminForm';

const FormComponent = Form.create()(AuthAdminForm);

describe('Admin Auth Form', () => {
  let wrapper;
  let formRef;

  it('Admin Auth Form renders correctly', () => {
    shallow(<FormComponent />);
  });

  it('Should render correctly Auth Admin Form with Snapshot', () => {
    const component = shallow(<FormComponent />);
    expect(component).toMatchSnapshot();
  });

  it('render Auth Admin Form without crashing', () => {
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

  it('should set email value for Auth Admin Form', () => {
    const {form} = formRef.props;
    form.setFieldsValue({
      email: 'admin@goheavy.com',
    });
    expect(form.getFieldValue('email')).toEqual('admin@goheavy.com');
  });

  it('should set password value for Auth Admin Form', () => {
    const {form} = formRef.props;
    form.setFieldsValue({
      password: 'admin123',
    });
    expect(form.getFieldValue('password')).toEqual('admin123');
  });

  it('when the form is submitted the event is cancelled for Auth Admin Form', () => {
    let prevented = false;
    wrapper.find('form#admin-form-session').simulate('submit', {
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
