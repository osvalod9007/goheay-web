import * as React from 'react';
import {Form, Switch} from 'antd';
interface Props {
  form: any;
  label?: string;
  propertyName: string;
  value?: any;
  required?: boolean;
  requiredMsg?: string;
  placeholder?: string;
  formItemLayout?: any;
  size?: any;
  formItemStyle?: any;
  rules?: any[];
  disabled?: boolean;
  onChange?: any;
}
const SwitchField = (props: Props) => {
  const FormItem = Form.Item;
  const {
    form,
    label,
    value,
    propertyName,
    required,
    placeholder,
    formItemLayout,
    formItemStyle,
    size,
    requiredMsg,
    disabled,
    onChange,
  } = props;
  const layout = formItemLayout || {
    labelCol: {
      xs: {span: 24},
      sm: {span: 8},
      span: 8,
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 10},
      span: 10,
    },
  };
  const {getFieldDecorator} = form;
  return (
    <FormItem label={label} {...layout} style={formItemStyle}>
      {getFieldDecorator(propertyName, {
        initialValue: value || null,
        rules: [
          {
            message: requiredMsg || `Please input ${label}!`,
            required,
          },
        ],
      })(
        <Switch
          checkedChildren="YES"
          unCheckedChildren="NO"
          checked={value ? true : false}
          onChange={e => {
            onChange && onChange(e);
          }}
        />,
      )}
    </FormItem>
  );
};
export default SwitchField;
