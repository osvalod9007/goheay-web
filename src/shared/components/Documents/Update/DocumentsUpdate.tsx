import React, {useContext, useState} from 'react';
import {Button, Divider, Form, Icon, Modal, Spin} from 'antd';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import {FormComponentProps} from 'antd/lib/form';

import AppStore from '../../../stores/App.store';
import DocumentsStore from '../../../stores/documents.store';
import driverModel from '../../../models/Driver.model';
import vehicleModel from '../../../models/Vehicle.model';
import {DocumentStatusEnum} from '../../../enums/DocumentStatus.enum';
import UploadDocument from '../../../components/UploadDocument/UploadDocument';
import appModel from '../../../models/App.model';
import openNotificationWithIcon from '../../../components/OpenNotificationWithIcon/OpenNotificationWithIcon';

import './DocumentsUpdate.less';

type LoginFormProps = FormComponentProps;

export const DocumentsUpdate = observer(
  (props: LoginFormProps): JSX.Element => {
    const appStore = useContext(AppStore);
    const documentsStore = useContext(DocumentsStore);
    const {t} = useTranslation('app');
    const [viewImage] = useState('');

    /**
     *
     * @param e : Approve or Disapprove
     */
    const handleSubmit = e => {
      try {
        e.preventDefault();
        props.form.validateFieldsAndScroll(async (err, values) => {
          if (!err) {
            appStore.setIsLoading(true);
            const {upload_avatar, avatar, ...all} = values;

            const obj = {
              ...(documentsStore.parentType &&
                upload_avatar && {
                  input: {uploadFile: {data: upload_avatar.originFileObj}},
                  id: documentsStore.documentId,
                }),
              ...(!documentsStore.parentType &&
                upload_avatar && {
                  input: {documents: [{id: documentsStore.documentId, file: {data: upload_avatar.originFileObj}}]},
                  id: documentsStore.parentId,
                }),
            };
            const typeModel: any = documentsStore.parentType ? driverModel : vehicleModel;
            await typeModel.update({...obj});
            documentsStore.setIsUpdateList(!documentsStore.isUpdateList);
            documentsStore.setIsOpenModalUpdateForm(false);
          } else {
            appStore.setHasError(true);
          }
        });
      } catch (e) {
        appStore.setIsLoading(false);
        handleCatch(e, '', '');
      }
    };

    const handleCatch = (err, values, textType) => {
      if (err && err.networkError && err.networkError.statusCode === 403) {
        appModel.logout();
        window.location.href = '/admin/login';
      } else {
        const {validation, ...others} = err.graphQLErrors[0];
        if (typeof validation === 'object') {
          Object.entries(validation).forEach(([key, value]) => {
            const obj = {};
            let msg = '';
            const splitted = key.split('.');
            const [keysplit] = splitted.slice(-1);
            switch (value) {
              case 'DUPLICITY': {
                msg = `${textType}` + keysplit + t('labelExistsPleaseChoose');
                break;
              }
              case 'INSTANCE_ALREADY_EXIST': {
                msg = `${textType}` + keysplit + t('labelExistsPleaseChoose');
                break;
              }
              case 'DOES_NOT_EXIST': {
                openNotificationWithIcon('error', `The ${textType} ${t('labelDontExist')}`, '');
                break;
              }
              case 'EMPTY_VALUE': {
                msg = `${textType}` + keysplit + t('labelNotBeEmpty');
                break;
              }
              case 'INVALID_VALUE': {
                msg = `${textType}` + keysplit + t('labelHaveInvalid');
                break;
              }
              default: {
                msg = `${value}`;
                break;
              }
            }
            if (msg !== '') {
              openNotificationWithIcon('error', msg, '');
            }
          });
        } else {
          openNotificationWithIcon('error', err.message, '');
        }
      }
      appStore.setIsLoading(false);
    };

    const handleChange = (avatar: any) => {
      documentsStore.setUrl(avatar);
    };

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
        md: {span: 10},
        lg: {span: 7},
        xl: {span: 5},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 15},
        md: {span: 12},
        lg: {span: 15},
        xl: {span: 15},
      },
    };

    return (
      <div className="documents-update-modal">
        <Modal
          title={
            <React.Fragment>
              <Icon type="eye" /> {t('labelUpdateDocument')}
            </React.Fragment>
          }
          visible={documentsStore.isOpenModalUpdate}
          onCancel={() => documentsStore.setIsOpenModalUpdateForm(false)}
          okText={t('labelDisapprove')}
          cancelText={t('labelApprove')}
          okButtonProps={{disabled: appStore.isLoading}}
          cancelButtonProps={{disabled: appStore.isLoading}}
          width={'617px'}
          destroyOnClose={true}
          footer={null}
        >
          <Spin spinning={appStore.isLoading} size="large">
            <Form onSubmit={handleSubmit}>
              <img alt="example" style={{width: '100%'}} src={documentsStore.url} />
              <div>
                <UploadDocument
                  form={props.form}
                  label={t('labelImageUpload')}
                  imageUrl={viewImage}
                  propertyName="avatar"
                  isRequired={true}
                  formItemLayout={formItemLayout}
                  handleUpdatePicture={handleChange}
                  requiredMsg={t('msgFieldRequired')}
                />
              </div>
              <Divider />
              <div className="documents-update-modal__buttons">
                <Button
                  type="default"
                  className="documents-update-modal__button-cancel"
                  onClick={() => documentsStore.setIsOpenModalUpdateForm(false)}
                >
                  {t('labelCancel')}
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="documents-update-modal__button-update"
                  onClick={() => documentsStore.setDocumentStatus(DocumentStatusEnum.STATUS_ASSESSING)}
                >
                  {t('labelUpdate')}
                </Button>
              </div>
            </Form>
          </Spin>
        </Modal>
      </div>
    );
  },
);

export default Form.create()(DocumentsUpdate);
