import React, {useContext} from 'react';
import {Button, Divider, Form, Icon, Modal, Spin} from 'antd';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import {FormComponentProps} from 'antd/lib/form';

import AppStore from '../../../../shared/stores/App.store';
import DocumentsStore from '../../../stores/documents.store';
import appModel from '../../../../shared/models/App.model';
import driverModel from '../../../../shared/models/Driver.model';
import vehicleModel from '../../../models/Vehicle.model';
import {DocumentStatusEnum} from '../../../../shared/enums/DocumentStatus.enum';

import openNotificationWithIcon from '../../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';

import './DocumentsView.less';

type LoginFormProps = FormComponentProps;

export const DocumentView = observer(
  (props: LoginFormProps): JSX.Element => {
    const appStore = useContext(AppStore);
    const documentsStore = useContext(DocumentsStore);
    const {t} = useTranslation('app');

    const handleCatch = (error, values, textType) => {
      if (error && error.networkError && error.networkError.statusCode === 403) {
        appModel.logout();
        window.location.href = '/admin/login';
      } else {
        const {validation} = error.graphQLErrors[0];
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
                openNotificationWithIcon('error', t('labelSaveFailed'), `The ${textType} ${t('labelDontExist')}`);
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
              obj[keysplit] = {
                value: values[keysplit],
                errors: [new Error(`${msg}`)],
              };
              props.form.setFields(obj);
            }
          });
        } else {
          openNotificationWithIcon('error', t('labelSaveFailed'), error.message);
        }
      }
      appStore.setIsLoading(false);
    };

    /**
     *
     * @param e : Approve or Disapprove
     */
    const handleSubmit = async e => {
      e.preventDefault();
      try {
        appStore.setIsLoading(true);
        const obj = {
          ...(documentsStore.parentType && {
            input: {status: documentsStore.documentStatus},
            id: documentsStore.documentId,
          }),
          ...(!documentsStore.parentType && {
            input: {documents: [{id: documentsStore.documentId, status: documentsStore.documentStatus}]},
            id: documentsStore.parentId,
          }),
        };
        const typeModel: any = documentsStore.parentType ? driverModel : vehicleModel; // change the second model by vehicleModelt);
        await typeModel.update({...obj});
        appStore.setIsLoading(false);
        documentsStore.setIsUpdateList(!documentsStore.isUpdateList);
        appStore.setIsOpenModalForm(false);
      } catch (e) {
        appStore.setIsLoading(false);
        handleCatch(e, {}, {});
      }
    };

    return (
      <div className="documents-view-modal">
        <Modal
          title={
            <React.Fragment>
              <Icon type="check-circle" /> {t('labelApproveDisapproveDocument')}
            </React.Fragment>
          }
          visible={appStore.isOpenModalForm}
          onCancel={() => appStore.setIsOpenModalForm(false)}
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
              <Divider />
              <div className="documents-view-modal__buttons">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="documents-view-modal__button-approve"
                  onClick={() => documentsStore.setDocumentStatus(DocumentStatusEnum.STATUS_CLEAR)}
                  disabled={documentsStore.statusSelected === DocumentStatusEnum.STATUS_CLEAR}
                >
                  {t('labelApprove')}
                </Button>
                <Button
                  type="danger"
                  htmlType="submit"
                  className="documents-view-modal__button-disapprove"
                  onClick={() => documentsStore.setDocumentStatus(DocumentStatusEnum.STATUS_DISAPPROVED)}
                  disabled={documentsStore.statusSelected === DocumentStatusEnum.STATUS_DISAPPROVED}
                >
                  {t('labelDisapprove')}
                </Button>
              </div>
            </Form>
          </Spin>
        </Modal>
      </div>
    );
  },
);

export default Form.create()(DocumentView);
