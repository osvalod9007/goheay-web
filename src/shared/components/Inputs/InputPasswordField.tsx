import React, {useEffect, useState} from 'react';
import {Col, Form, Input, Row} from 'antd';

const FormItem = Form.Item;

interface Props {
  form: any;
  propertyName: string;
  label?: string;
  value?: string;
  required?: boolean;
  requiredMsg?: string;
  minCharactersPasswordMsg?: string;
  requiredMsgConfirm?: string;
  minCharactersConfirmMsg?: string;
  placeholder?: string;
  confirmPlaceholder?: string;
  formItemLayout?: any;
  hidden?: boolean;
  minLength?: number;
  maxLength?: number;
  size?: any;
  hideLabel?: boolean;
  rules?: any[];
  matchMsg: string;
  disabled?: boolean;
  validatedMsg?: string;
  isHorizontal?: boolean;
}

export const InputPasswordField = (props: Props): JSX.Element => {
  const [state, setState] = useState({confirmDirty: false});

  // useEffect(() => {
  //   const some_id: any = document.getElementById(propertyName);
  //   some_id.removeAttribute('autocomplete');
  // });

  const handleConfirmBlur = e => {
    const val = e.target.value;
    setState({confirmDirty: state.confirmDirty || !!val});
  };

  const compareToFirstPassword = (rule, val, callback) => {
    setTimeout(() => {
      const inputForm = props.form;
      if (val && val !== inputForm.getFieldValue(`${props.propertyName}`)) {
        callback(props.matchMsg);
      } else {
        callback();
      }
    }, 300);
  };

  const validateToNextPassword = (rule, val, callback) => {
    setTimeout(() => {
      const expR = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,15}$)/;
      const inputForm = props.form;
      val && val !== '' && val !== null && val !== undefined && !val.match(expR) && callback(props.validatedMsg);

      val && state.confirmDirty && inputForm.validateFieldsAndScroll(['confirm'], {force: true});
      callback();
    }, 300);
  };

  const {
    form,
    label,
    value,
    propertyName,
    required,
    requiredMsg,
    minCharactersPasswordMsg,
    requiredMsgConfirm,
    minCharactersConfirmMsg,
    placeholder,
    confirmPlaceholder,
    formItemLayout,
    hidden,
    minLength,
    maxLength,
    size,
    hideLabel,
    rules,
    matchMsg,
    disabled,
    validatedMsg,
    isHorizontal,
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
    <div style={!hidden ? {} : {display: 'none'}}>
      {!isHorizontal ? (
        <React.Fragment>
          <Row type="flex" justify="space-between" align="middle">
            <Col xs={24} sm={12} md={24} lg={12} xl={12}>
              <FormItem {...layout} {...(!hideLabel ? {label: label || 'Password'} : {})}>
                {getFieldDecorator(propertyName, {
                  initialValue: value || '',
                  rules: [
                    {
                      required,
                      message: requiredMsg || `Please input ${label || 'Password'}!`,
                    },
                    {
                      validator: validateToNextPassword,
                    },
                    ...(rules || []),
                  ],
                })(
                  <Input
                    type="password"
                    placeholder={placeholder || 'Password'}
                    // maxLength={maxLength || 30}
                    size={size}
                    disabled={disabled ? disabled : false}
                    autoComplete={'new-password'}
                  />,
                )}
              </FormItem>
            </Col>
            <Col xs={24} sm={12} md={24} lg={12} xl={12}>
              <FormItem {...layout} {...(!hideLabel ? {label: 'Confirm ' + (label || 'Password')} : {})}>
                {getFieldDecorator('confirm', {
                  initialValue: value || '',
                  rules: [
                    {
                      required,
                      message: requiredMsgConfirm || `Confirm ${label || 'Password'} must not be empty.!`,
                    },
                    {
                      validator: compareToFirstPassword,
                    },
                  ],
                })(
                  <Input
                    type="password"
                    placeholder={confirmPlaceholder || 'Confirm password'}
                    onBlur={handleConfirmBlur}
                    // maxLength={maxLength || 30}
                    size={size}
                    disabled={disabled ? disabled : false}
                    autoComplete={'new-password'}
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <FormItem {...layout} {...(!hideLabel ? {label: label || 'Password'} : {})}>
            {getFieldDecorator(propertyName, {
              initialValue: value || '',
              rules: [
                {
                  required,
                  message: requiredMsg || `Please input ${label || 'Password'}!`,
                },
                {
                  validator: validateToNextPassword,
                },
                ...(rules || []),
              ],
            })(
              <Input
                type="password"
                placeholder={placeholder || 'Password'}
                // maxLength={maxLength || 30}
                size={size}
                disabled={disabled ? disabled : false}
                autoComplete={'new-password'}
              />,
            )}
          </FormItem>
          <FormItem {...layout} {...(!hideLabel ? {label: 'Confirm ' + (label || 'Password')} : {})}>
            {getFieldDecorator('confirm', {
              initialValue: value || '',
              rules: [
                {
                  required,
                  message: requiredMsgConfirm || `Confirm ${label || 'Password'} must not be empty.!`,
                },
                {
                  validator: compareToFirstPassword,
                },
              ],
            })(
              <Input
                type="password"
                placeholder={confirmPlaceholder || 'Confirm password'}
                onBlur={handleConfirmBlur}
                // maxLength={maxLength || 30}
                size={size}
                disabled={disabled ? disabled : false}
                autoComplete={'new-password'}
              />,
            )}
          </FormItem>
        </React.Fragment>
      )}
    </div>
  );
};

export default InputPasswordField;
