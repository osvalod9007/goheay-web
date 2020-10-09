import React from 'react';
import {Form, Input, Select} from 'antd';
import formatPhone from '../../utils/formatPhone';
import {FormatPhoneTypeEnum} from '../../enums/FormatPhoneType.enum';

interface Props {
  form: any;
  label?: string;
  propertyName: string;
  propertyNameCode: string;
  propertyNamePhoneExt?: string;
  value?: string;
  valueCode?: string;
  required?: boolean;
  requiredMsg?: string;
  validatedMsg?: string;
  withExt?: boolean;
  extValue?: any;
  maxlength?: number;
  placeholder?: string;
  formItemLayout?: any;
  size?: any;
  formItemStyle?: any;
  rules?: any[];
  disabled?: boolean;
  disabledCode?: boolean;
  validateLength: number;
  onChange?: any;
  onChangeCode?: any;
  phoneCodes?: any;
  requiredCode?: boolean;
}

const Option = Select.Option;
const InputGroup = Input.Group;

export const InputPhoneField = (props: Props): JSX.Element => {
  const {
    form,
    label,
    value,
    valueCode,
    propertyName,
    propertyNameCode,
    withExt,
    propertyNamePhoneExt,
    extValue,
    required,
    requiredCode,
    maxlength,
    placeholder,
    formItemLayout,
    formItemStyle,
    size,
    requiredMsg,
    rules,
    disabled,
    disabledCode,
    onChange,
    onChangeCode,
    validatedMsg,
  } = props;

  const drawPhoneCodes = () => {
    if (props.phoneCodes) {
      return props.phoneCodes.map(code => (
        <Option value={`+${code}`} key={`${code}`}>
          +{code}
        </Option>
      ));
    } else {
      return <Option value="+1">+1</Option>;
    }
  };

  const validatePhone = () => {
    setTimeout(() => {
      const finalValue = formatPhone.formatsGeneral(
        form.getFieldValue(`${propertyName}`),
        false,
        '1',
        FormatPhoneTypeEnum.NATIONAL,
      );
      const field = props.propertyName;
      props.form.setFieldsValue({[field]: finalValue});
      form.validateFields([`${propertyName}`], (errors, values) => {
        //
      });
    }, 50);
  };

  const onValidatePhone = (rule, val, callback, msgMatch) => {
    let error: boolean = false;
    setTimeout(() => {
      const dataField = form.getFieldValue(`${propertyName}`);
      if (dataField !== '' && dataField !== undefined && dataField !== null) {
        const expR = /^[(]\d{3}[)]\s\d{3}\s[-]\s\d{4}$/; // for (233) 333 - 3333
        if (!dataField.match(expR)) {
          error = true;
        }
      }
      if (error) {
        callback([new Error(validatedMsg)]);
      } else {
        callback();
      }
    }, 300);
  };

  const FormItem = Form.Item;
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

  return !withExt ? (
    <FormItem hasFeedback {...layout} label={label}>
      {getFieldDecorator(propertyName, {
        initialValue: value,
        rules: [
          {required: props.required || false, message: requiredMsg || `Please input ${label}!`},
          {
            validator: onValidatePhone,
          },
        ],
      })(
        <Input
          placeholder={placeholder}
          disabled={disabled ? disabled : false}
          maxLength={16}
          addonBefore={getFieldDecorator(propertyNameCode, {
            initialValue: valueCode || '+1',
            rules: [
              {
                required: requiredCode,
                message: 'Phone code is required. ',
              },
            ],
          })(
            <Select
              style={{width: 70}}
              disabled={disabledCode ? disabledCode : false}
              onChange={e => {
                onChangeCode && onChangeCode(e);
              }}
            >
              {drawPhoneCodes()}
            </Select>,
          )}
          style={{width: '100%'}}
          onChange={e => {
            validatePhone();
          }}
        />,
      )}
    </FormItem>
  ) : (
    <FormItem hasFeedback {...formItemLayout} label={label}>
      <InputGroup compact style={{width: '100%'}}>
        {getFieldDecorator(propertyName, {
          initialValue: value,
          rules: [
            {
              required: props.required || false,
              message: requiredMsg || `Please input ${label}!`,
            },
            {
              validator: onValidatePhone,
            },
          ],
        })(
          <Input
            disabled={disabled ? disabled : false}
            style={{width: 'calc(100% - 73px)'}}
            addonBefore={getFieldDecorator(propertyNameCode, {
              initialValue: valueCode || '+1',
              rules: [
                {
                  required: requiredCode,
                  message: 'Phone code is required. ',
                },
              ],
            })(
              <Select
                style={{width: 70}}
                disabled={disabled ? disabled : false}
                onChange={e => {
                  onChangeCode && onChangeCode(e);
                }}
              >
                {drawPhoneCodes()}
              </Select>,
            )}
          />,
        )}
        ,
        {getFieldDecorator(propertyNamePhoneExt, {
          initialValue: extValue,
          rules: [],
        })(
          <Input
            placeholder="EXT:"
            style={{
              width: '75px',
              marginTop: '-1px',
              marginLeft: '-5px',
            }}
            onChange={e => {
              validatePhone();
            }}
          />,
        )}
      </InputGroup>
    </FormItem>
  );
};

export default InputPhoneField;
