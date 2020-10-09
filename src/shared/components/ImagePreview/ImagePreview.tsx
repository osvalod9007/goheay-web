import React, {useState} from 'react';
import {Modal} from 'antd';

import './ImagePreview.less';
type Props = {
  imageUrl: string;
  width: string;
  height?: string;
  label?: string;
  borderRadius?: string;
  handleUpdatePicture?: any;
};

const ImagePreview = (props: Props) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const handleChange = info => props.handleUpdatePicture(info);
  const handleCancel = () => setPreviewVisible(false);
  const handleOpen = () => setPreviewVisible(true);
  return (
    <div className="image-preview">
      {props.imageUrl ? (
        <img
          style={{
            width: `${[props.width]}`,
            height: `${props.height ? [props.height] : 'auto'}`,
            borderRadius: `${props.borderRadius ? [props.borderRadius] : '0px'}`,
          }}
          src={props.imageUrl}
          alt="avatar"
          className={'image-preview__img'}
          onClick={handleOpen}
        />
      ) : (
        <span>{props.label ? props.label : 'Preview here'}</span>
      )}
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{width: '100%'}} src={props.imageUrl} />
      </Modal>
    </div>
  );
};

export default ImagePreview;
