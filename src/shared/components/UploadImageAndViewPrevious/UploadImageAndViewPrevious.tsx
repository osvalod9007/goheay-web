import React, {useState} from 'react';
import {Col, Modal, Row} from 'antd';
import UploadImage from '../UploadImage/UploadImage';

const UploadImageAndViewPrevious = (props: any) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const handleChange = info => props.handleUpdatePicture(info);
  const handleCancel = () => setPreviewVisible(false);
  const handleOpen = () => setPreviewVisible(true);
  return (
    <div className="upload-image-view-previous">
      <Row type="flex" justify="space-between" align="middle">
        <Col xs={24} sm={4} md={24} lg={12} xl={12}>
          <UploadImage
            form={props.form}
            label={props.label}
            imageUrl={props.imageUrl}
            propertyName={props.propertyName}
            isRequired={props.isRequired}
            formItemLayout={props.formItemLayout}
            handleUpdatePicture={handleChange}
            requiredMsg={props.requiredMsg}
          />
        </Col>
        <Col xs={24} sm={4} md={24} lg={12} xl={12}>
          {props.imageUrl ? (
            <img
              style={{width: '132px'}}
              src={props.imageUrl}
              alt="avatar"
              className={'upload-image-view-previous__image-preview'}
              onClick={handleOpen}
            />
          ) : (
            <span>Preview here</span>
          )}
        </Col>
      </Row>
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{width: '100%'}} src={props.imageUrl} />
      </Modal>
    </div>
  );
};

export default UploadImageAndViewPrevious;
