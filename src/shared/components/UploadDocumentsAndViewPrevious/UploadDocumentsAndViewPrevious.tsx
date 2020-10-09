import React, {useState} from 'react';
import {Col, Modal, Row} from 'antd';
import ImagePreview from '../ImagePreview/ImagePreview';
import UploadDocument from '../UploadDocument/UploadDocument';
import './UploadDocumentsAndViewPrevious.less';
type Props = {
  imageUrl: string;
  propertyName: string;
  requiredMsg: string;
  label: string;
  labelImage?: string;
  isRequired: boolean;
  form: any;
  width: string;
  height?: string;
  borderRadius?: string;
  handleUpdatePicture: any;
  formItemLayout?: any;
};
const UploadDocumentsAndViewPrevious = (props: Props) => {
  const handleChange = info => props.handleUpdatePicture(info);
  const {
    imageUrl,
    propertyName,
    isRequired,
    label,
    labelImage,
    formItemLayout,
    requiredMsg,
    width,
    height,
    borderRadius,
  } = props;
  return (
    <Row type="flex" justify="space-between" align="top" className={'upload-documents-preview'}>
      <Col xs={24} sm={12} md={24} lg={24} xl={24}>
        <UploadDocument
          form={props.form}
          label={label}
          imageUrl={imageUrl || ''}
          propertyName={propertyName}
          isRequired={isRequired}
          formItemLayout={formItemLayout}
          handleUpdatePicture={handleChange}
          requiredMsg={requiredMsg}
        />
        <ImagePreview
          imageUrl={imageUrl || ''}
          width={width}
          height={height}
          borderRadius={borderRadius}
          label={labelImage}
        />
      </Col>
    </Row>
  );
};

export default UploadDocumentsAndViewPrevious;
