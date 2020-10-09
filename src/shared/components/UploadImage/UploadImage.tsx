import React, {useEffect, useState} from 'react';
import {Form, Upload, Icon, Input} from 'antd';
import {useTranslation} from 'react-i18next';

import openNotificationWithIcon from '../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';

import './UploadImage.less';

const UploadImage = (props: any) => {
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
    return e && e.file;
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

  const uploadButton = (
    <div>
      <Icon
        type={isLoading ? 'loading' : 'plus'}
        style={{
          fontSize: '18px',
        }}
      />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const {imageUrl} = props;
  const FormItem = Form.Item;
  const formItemLayoutUpload = props.formItemLayout || {
    labelCol: {span: 16},
    wrapperCol: {span: 8},
  };
  const {getFieldDecorator} = props.form;
  return (
    <div className={props.isRequired ? 'upload-image' : ''}>
      <FormItem>
        {getFieldDecorator(props.propertyName, {
          initialValue: imageUrl,
        })(<Input type="hidden" />)}
      </FormItem>
      <FormItem {...formItemLayoutUpload} label={props.label} extra={props.extra}>
        {getFieldDecorator(`upload_${props.propertyName}`, {
          getValueFromEvent: normFile,
          valuePropName: 'file',
          rules: [
            {
              validator: validateRequired,
            },
          ],
        })(
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {image ? (
              <>
                {isLoading && (
                  <Icon
                    type={'loading'}
                    style={{fontSize: '20px', position: 'absolute', marginTop: '10%', marginLeft: '10%'}}
                  />
                )}
                <img src={image} alt="avatar" style={{width: '100%'}} />
              </>
            ) : (
              uploadButton
            )}
          </Upload>,
        )}
      </FormItem>
    </div>
  );
};

export default UploadImage;
