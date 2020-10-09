import React, {useEffect, useState} from 'react';
import {Button, Form, Upload, Icon, Input} from 'antd';
import {useTranslation} from 'react-i18next';

import openNotificationWithIcon from '../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';
import './UploadDocument.less';
type Props = {
  imageUrl: string;
  propertyName: string;
  requiredMsg: string;
  label: string;
  isRequired: boolean;
  form: any;
  extra?: any;
  handleUpdatePicture: any;
  formItemLayout?: any;
};
const UploadDocument = (props: Props) => {
  const {t} = useTranslation('app');
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState('');

  useEffect(() => {
    setImage(props.imageUrl);
  }, [props.imageUrl]);

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      openNotificationWithIcon('error', t('errorMsgImageType'), ``);
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      openNotificationWithIcon('error', t('errorMsgImageWidth'), ``);
    }
    return isJpgOrPng && isLt5M;
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const validateRequired = (rule, value, callback) => {
    setTimeout(() => {
      if (
        props.isRequired &&
        ((props.form.getFieldValue(`upload_${props.propertyName}`) === undefined ||
          props.form.getFieldValue(`upload_${props.propertyName}`) === null ||
          props.form.getFieldValue(`upload_${props.propertyName}`) === '') &&
          (props.form.getFieldValue(`${props.propertyName}`) === undefined ||
            props.form.getFieldValue(`${props.propertyName}`) === null ||
            props.form.getFieldValue(`${props.propertyName}`) === ''))
      ) {
        callback([new Error(props.requiredMsg)]);
      } else {
        callback();
      }
    }, 3000);
  };

  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setIsLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imgUrl => {
        props.handleUpdatePicture(String(imgUrl));
        setImage(imgUrl);
        setIsLoading(false);
      });
    }
  };

  const {imageUrl, propertyName, isRequired, label, extra, formItemLayout} = props;
  const FormItem = Form.Item;
  const formItemLayoutUpload = formItemLayout || {
    labelCol: {span: 16},
    wrapperCol: {span: 8},
  };
  const {getFieldDecorator} = props.form;

  return (
    <div className={isRequired ? 'upload-document' : ''}>
      <FormItem>
        {getFieldDecorator(propertyName, {
          initialValue: imageUrl,
        })(<Input type="hidden" />)}
      </FormItem>
      <FormItem {...formItemLayoutUpload} label={label} extra={extra}>
        {getFieldDecorator(`upload_${propertyName}`, {
          getValueFromEvent: normFile,
          valuePropName: 'fileList',
          rules: [
            {
              validator: validateRequired,
            },
          ],
        })(
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            showUploadList={false}
            headers={{authorization: 'authorization-text'}}
            name={propertyName}
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            <Button disabled={isLoading}>
              {isLoading && (
                <Icon type={'loading'} style={{fontSize: '22px', position: 'absolute', marginLeft: '-4px'}} />
              )}
              <Icon type="upload" />
              {t('labelClickToUpload')}
            </Button>
          </Upload>,
        )}
      </FormItem>
    </div>
  );
};

export default UploadDocument;
