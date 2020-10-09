import React, {useContext} from 'react';
import {Col, Form, Icon, Modal, Row, Spin} from 'antd';
import {useTranslation} from 'react-i18next';
import {useMutation} from 'react-apollo-hooks';
import {observer} from 'mobx-react-lite';
import gql from 'graphql-tag';
import {FormComponentProps} from 'antd/lib/form';

import AppStore from '../../../shared/stores/App.store';
import appModel from '../../../shared/models/App.model';

import InputPasswordSimpleField from '../../../shared/components/Inputs/InputPasswordSimpleField';
import InputPasswordField from '../../../shared/components/Inputs/InputPasswordField';
import openNotificationWithIcon from '../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';

type LoginFormProps = FormComponentProps;

const EDIT_MUTATION = gql`
  mutation($input: UserUpdatePasswordInput!) {
    UserUpdatePassword(input: $input) {
      isSuccess
    }
  }
`;

export const ChangePassword = observer(
  (props: LoginFormProps): JSX.Element => {
    const appStore = useContext(AppStore);
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

    const addMutation = useMutation(EDIT_MUTATION, {
      update: (proxy, result) => {
        appStore.setIsLoading(true);
        /* your custom update logic */
        setTimeout(() => {
          const {errors} = result;
          if (!errors) {
            const msg = `${t('labelPasswordChanged')}`;
            openNotificationWithIcon('success', msg, '');
            appStore.setIsLoading(false);
            appStore.setIsOpenModalLogOut(false);
          } else {
            const messages: any = [];
            for (const error of errors) {
              const obj = JSON.parse(error.message);
              for (const key in obj) {
                if (key) {
                  messages.push(obj[key]);
                }
              }
            }
            openNotificationWithIcon('error', t('lavelSaveFailed'), messages[0]);
            appStore.setIsLoading(false);
          }
        });
      },
    });

    const handleSubmit = e => {
      e.preventDefault();

      props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          appStore.setIsLoading(true);
          const {confirm, ...input} = values;

          addMutation({variables: {input}}).catch(error => {
            appStore.setIsLoading(false);
            handleCatch(error, values, '');
          });
        } else {
          const error = t('errorMsgAuthAdmin');
          appStore.setHasError(true);
          appStore.setErrorMsg(error);
        }
      });
    };

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
        md: {span: 8},
        lg: {span: 7},
        xl: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
        md: {span: 14},
        lg: {span: 15},
        xl: {span: 15},
      },
    };

    return (
      <div className="change-password">
        <Modal
          title={
            <React.Fragment>
              <Icon type="key" /> {t('labelChangePassword')}
            </React.Fragment>
          }
          visible={appStore.isOpenModalLogOut}
          onCancel={() => appStore.setIsOpenModalLogOut(false)}
          onOk={handleSubmit}
          okText={t('labelUpdate')}
          cancelText={t('labelCancel')}
          okButtonProps={{disabled: appStore.isLoading}}
          cancelButtonProps={{disabled: appStore.isLoading}}
          width={'617px'}
          destroyOnClose={true}
        >
          <Spin spinning={appStore.isLoading} size="large">
            <Form onSubmit={handleSubmit} autoComplete={'off'}>
              <Row type="flex" justify="space-between" align="middle">
                <Col xs={24} sm={12} md={24} lg={24} xl={24}>
                  <InputPasswordSimpleField
                    icon={false}
                    colon={true}
                    required={true}
                    form={props.form}
                    label={t('labelOldPassword')}
                    propertyName={'oldPassword'}
                    formItemLayout={formItemLayout}
                    placeholder={t('labelPlaceHolderOldPassword')}
                    requiredMsg={t('msgFieldRequired')}
                  />
                  <InputPasswordField
                    placeholder={t('labelPlaceHolderNewPassword')}
                    confirmPlaceholder={t('labelPlaceHolderConfirmNewPassword')}
                    form={props.form}
                    label={t('labelNewPassword')}
                    propertyName="newPassword"
                    required={true}
                    formItemLayout={formItemLayout}
                    // hidden={agencyUserStore.isEditing}
                    minLength={8}
                    maxLength={15}
                    requiredMsg={t('msgFieldRequired')}
                    requiredMsgConfirm={t('msgFieldRequired')}
                    value={''}
                    validatedMsg={t('msgValidPassword')}
                    isHorizontal={true}
                    matchMsg={t('labelConfirmNewPassword')}
                  />
                </Col>
              </Row>
            </Form>
          </Spin>
        </Modal>
      </div>
    );
  },
);

export default Form.create()(ChangePassword);
