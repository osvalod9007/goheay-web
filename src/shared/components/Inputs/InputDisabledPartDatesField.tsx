import React from 'react';
import {Form, DatePicker} from 'antd';
import moment from 'moment-timezone';

export const InputDisabledPartDatesField = (props: any): JSX.Element => {
  const disabledDate = current => {
    // const minDate = moment().subtract(props.minDisableDate, 'years');
    // const maxDate = moment().subtract(props.maxDisableDate, 'years');
    const minDate = props.minDisableDate;
    const maxDate = props.maxDisableDate;
    return current && (current < maxDate || current > minDate);
  };

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
    requiredMsg,
    onChange,
    defaultPickerValue,
    disabledDateProps,
    disabled,
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
  const dateFormat = 'MM/DD/YYYY';
  // const dateInit = moment(value);
  // console.log(`date: ${JSON.stringify(dateInit.tz('UTC').format(dateFormat))}`);
  // console.log(`date: ${JSON.stringify(Intl.DateTimeFormat().resolvedOptions().timeZone)}`);
  // console.log(`date convert: ${JSON.stringify(dateInit.tz('UTC').format(dateFormat))}`);
  return (
    <FormItem hasFeedback label={label} {...layout} style={formItemStyle}>
      {getFieldDecorator(propertyName, {
        initialValue: value
          ? moment(
              moment(value)
                .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                .format('YYYY-MM-DD'),
              'YYYY-MM-DD',
            )
          : null,
        rules: [
          {
            message: requiredMsg || `Please input ${label}!`,
            required,
          },
        ],
      })(
        <DatePicker
          style={{width: '100%'}}
          placeholder={placeholder}
          format={dateFormat}
          disabled={disabled}
          disabledDate={disabledDateProps ? disabledDateProps : disabledDate}
          defaultPickerValue={
            defaultPickerValue ? defaultPickerValue : moment().subtract(props.minDisableDate || 0, 'years')
          }
          onChange={e => {
            onChange && onChange(e);
          }}
        />,
      )}
    </FormItem>
  );
};

export default InputDisabledPartDatesField;
