import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {Form, Input, Select} from 'antd';
type Props = {
  form: any;
  label?: string;
  value?: any;
  propertyName: string;
  required?: boolean;
  placeholder?: string;
  formItemLayout?: any;
  formItemStyle?: any;
  size?: any;
  requiredMsg?: string;
  disabled?: boolean;
  items: any;
  onSelect?: any;
  focus?: any;
  drawItemsParent?: any;
};
export const InputSelectField = (props: Props, ref: any): JSX.Element => {
  const FormItem = Form.Item;
  const Option = Select.Option;
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
    items,
    onSelect,
    drawItemsParent,
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

  const drawItems = () => {
    return items.map(item => (
      <Option value={item.id} key={item.id}>
        {item.name}
      </Option>
    ));
  };

  const inputRef: any = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      props.focus && inputRef.current.focus();
    },
  }));

  return (
    <FormItem hasFeedback label={label} {...layout} style={formItemStyle}>
      {getFieldDecorator(propertyName, {
        initialValue: value || '',
        rules: [
          {
            message: requiredMsg || `Please select ${label}!`,
            required,
          },
        ],
      })(
        <Select
          disabled={disabled}
          style={{width: '100%'}}
          // onChange={props.onStateChangeGetCities}
          showSearch
          filterOption={(input, option) =>
            String(option.props.children)
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
          }
          ref={inputRef}
          onSelect={e => {
            onSelect && onSelect(e);
          }}
        >
          <Option value="">-{placeholder}-</Option>
          {drawItemsParent ? drawItemsParent() : drawItems()}
        </Select>,
      )}
    </FormItem>
  );
};

export default forwardRef(InputSelectField);
