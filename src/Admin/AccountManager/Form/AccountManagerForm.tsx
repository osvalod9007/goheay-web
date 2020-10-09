import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Col, Divider, Form, Row} from 'antd';
import {useTranslation} from 'react-i18next';
import {useMutation} from 'react-apollo-hooks';
import {useRouter} from 'rift-router';
import {observer} from 'mobx-react-lite';
import gql from 'graphql-tag';
import {FormComponentProps} from 'antd/lib/form';

import AppStore from '../../../shared/stores/App.store';
import accountManagerModel from '../../../shared/models/AccountManager.model';
import appModel from '../../../shared/models/App.model';
import {AccountManager} from '../../../shared/cs/accountManager.cs';
import {BasicProfile} from '../../../shared/cs/basicProfile.cs';

import HeadTitle from '../../../shared/components/HeadTitle/HeadTitle';

import './AccountManagerForm.less';

import InputTextField from '../../../shared/components/Inputs/InputTextField';
import InputEmailField from '../../../shared/components/Inputs/InputEmailField';
import InputPhoneField from '../../../shared/components/Inputs/InputPhoneField';
import InputPasswordField from '../../../shared/components/Inputs/InputPasswordField';
import InputSelectField from '../../../shared/components/Inputs/InputSelectField';

import openNotificationWithIcon from '../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';
import {RolesEnum} from '../../../shared/enums/Roles.enum';
import UniqueUserModalStore from '../../../shared/stores/UniqueUserModal.store';
import {CheckUserConvertEnum} from '../../../shared/enums/CheckUserConvert.enum';
import UniqueUserModal from '../../../shared/components/UniqueUserModal/UniqueUserModal';
import formatPhone from '../../../shared/utils/formatPhone';
import {FormatPhoneTypeEnum} from '../../../shared/enums/FormatPhoneType.enum';
import InputAddressField from '../../../shared/components/Inputs/InputAddressField';

type LoginFormProps = FormComponentProps;

const ADD_MUTATION = gql`
  mutation($input: AccountManagerCreateInput!) {
    AccountManagerCreate(input: $input) {
      id
    }
  }
`;

const EDIT_MUTATION = gql`
  mutation($id: EncryptId!, $input: AccountManagerUpdateInput!) {
    AccountManagerUpdate(id: $id, input: $input) {
      id
    }
  }
`;

export const AccountManagerForm = observer(
  (props: LoginFormProps): JSX.Element => {
    const appStore = useContext(AppStore);
    const uniqueUserModalStore = useContext(UniqueUserModalStore);
    const {t} = useTranslation('app');
    const [formTitle, setFormTitle] = useState(t('labelAddAccountManager'));
    const [buttonTitle, setButtonTitle] = useState(t('labelAdd'));
    const [item, setItem] = useState(new AccountManager());
    const router = useRouter();

    const tabIndexFieldsOrder: any = ['firstName', 'lastName', 'mobilePhone', 'email', 'password', 'confirm'];

    useEffect(() => {
      // tabIndex order for the fields
      tabIndexFieldsOrder &&
        tabIndexFieldsOrder.forEach((field: any, index: any) => {
          if ((document as any).getElementById(field)) {
            (document as any).getElementById(field).tabIndex = index + 1;
          }
        });
      // get data for the form
      getData();

      // restart isEditing variable
      return () => {
        appStore.setIsEditing(false);
      };
    }, []);

    const setChildrenCountries = (countriesMapped: any) => {
      setItem({...item, ...{basicProfile: new BasicProfile({addressCountry: countriesMapped[0]})}});
    };

    const getData = async () => {
      try {
        appStore.setIsLoading(true);
        const params: any = router;
        if (params && params.params && params.params.id) {
          appStore.setIsEditing(true);
          setFormTitle(t('labelEditAccountManager'));
          setButtonTitle(t('labelUpdate'));
          const input = {
            id: params.params.id,
          };
          const itemToEdit: any = await accountManagerModel.get(input);
          setItem({...item, ...new AccountManager(itemToEdit.data.AccountManagerGet)});
        }
        appStore.setIsLoading(false);
      } catch (e) {
        appStore.setIsLoading(false);
      }
    };

    const handleCatch = (error, values, textType) => {
      if (error && error.networkError && error.networkError.statusCode === 403) {
        appModel.logout();
        window.location.href = '/admin/login';
      } else {
        const {validation, ...others} = error.graphQLErrors[0];
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
            switch (keysplit) {
              case 'uniqueUserConvert':
                uniqueUserModalStore.setEmail(values.email);
                uniqueUserModalStore.setMobilePhoneCode(values.mobilePhoneCode);
                uniqueUserModalStore.setMobilePhone(formatPhone.formatToString(values.mobilePhone));
                uniqueUserModalStore.setMessage(t('msgUniqueUser'));
                uniqueUserModalStore.setType(CheckUserConvertEnum.ACCOUNT_MANAGER);
                uniqueUserModalStore.setIsOpenModalView(true);
                uniqueUserModalStore.setIsUserConvert(true);
                break;
              default:
                break;
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

    const addMutation = useMutation(appStore.isEditing ? EDIT_MUTATION : ADD_MUTATION, {
      update: (proxy, result) => {
        /* your custom update logic */
        setTimeout(() => {
          appStore.setIsLoading(true);
          const {errors, data} = result;
          if (!errors) {
            appStore.setUserAction({
              ...appStore.userAction,
              ...{isSaved: true, action: appStore.isEditing ? 'updated' : 'created'},
            });
            appStore.setIsLoading(false);
            appStore.setIsEditing(false);
            router.to('/admin/accountmanager');
          } else {
            const messages = [];
            for (const error of errors) {
              const obj = JSON.parse(error.message);
              for (const key in obj) {
                // messages.push(obj[key]);
              }
            }
            openNotificationWithIcon('error', t('lavelSaveFailed'), messages[0]);
          }
        });
      },
    });

    const handleSubmit = e => {
      !uniqueUserModalStore.isUserConvert && e.preventDefault();

      props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          appStore.setIsLoading(true);
          const {confirm, role, mobilePhone, ...profile} = values;
          const mobilePhoneE164 = formatPhone.formatToString(mobilePhone);
          const basicProfile = {
            ...profile,
            mobilePhone: mobilePhoneE164,
          };
          const obj = {
            role,
            ...(uniqueUserModalStore.userId !== '' && uniqueUserModalStore.isUserConvert
              ? {userId: uniqueUserModalStore.userId}
              : {basicProfile}),
          };
          uniqueUserModalStore.setIsUserConvert(false);
          uniqueUserModalStore.setUserId('');
          const typeOfElem = role === RolesEnum.ROLE_ADMINISTRATOR ? t('labelAdmin') : t('labelDispatcher');
          const isUndefinedArticle = role === RolesEnum.ROLE_ADMINISTRATOR ? true : false;
          appStore.setUserAction({...appStore.userAction, ...{typeOfElem}, ...{isUndefinedArticle}});

          addMutation({variables: {input: {...obj}, ...(appStore.isEditing && {id: item.id})}}).catch(error => {
            handleCatch(error, values, '');
          });
        } else {
          const error = t('errorMsgAuthAdmin');
          appStore.setHasError(true);
          appStore.setErrorMsg(error);
        }
      });
    };

    const onCancelForm = () => {
      appStore.setIsEditing(false);
      router.to('/admin/accountmanager');
    };

    const formItemLayout = {
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 15},
        md: {span: 12},
        lg: {span: 15},
        xl: {span: 15},
      },
    };

    const labelEmail: string = t('labelEmail');

    return (
      <div className="account-manager-form">
        <Form
          onSubmit={handleSubmit}
          layout="vertical"
          id={'account-manager-form'}
          autoComplete={'off'}
          data-testid="account-form"
        >
          <Card bordered={false} className="gutter-row">
            <Row type="flex" justify="space-between" align="middle" style={{marginBottom: '13px'}}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <HeadTitle icon="user" title={formTitle} />
                <Divider />
              </Col>
            </Row>
            <Row type="flex" justify="space-between" align="top">
              <Col xs={24} sm={12} md={24} lg={12} xl={12}>
                <InputSelectField
                  placeholder={t('labelSelect')}
                  form={props.form}
                  label={t('labelRole')}
                  required={true}
                  propertyName={'role'}
                  formItemLayout={formItemLayout}
                  value={item.role}
                  requiredMsg={t('msgFieldRequired')}
                  items={[
                    {id: RolesEnum.ROLE_ADMINISTRATOR, name: t('labelAdmin')},
                    {id: RolesEnum.ROLE_DISPATCHER, name: t('labelDispatcher')},
                  ]}
                  disabled={false}
                  // ref={focusInput}
                  // focus={true}
                />
              </Col>
            </Row>
            <Row type="flex" justify="space-between" align="top">
              <Col xs={24} sm={12} md={24} lg={12} xl={12}>
                <InputTextField
                  placeholder={t('labelPlaceHolderFirstName')}
                  label={t('labelFirstName')}
                  required={true}
                  form={props.form}
                  propertyName="firstName"
                  validateLength={50}
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                  typeOfCharMsg={t('labelOnlyLetters')}
                  maxLengthMsg={t('labelMaxLenLetters')}
                  labelLettersMsg={t('labelLetters')}
                  value={item.basicProfile.firstName}
                  validatedMsg={`${t('labelOnlyLettersANCharacteres')} 50 ${t('msgCharactersMaximum')}`}
                  // ref={focusInput}
                  // focus={true}
                />
                <InputPhoneField
                  placeholder={t('labelPlaceHolderMobile')}
                  required={true}
                  requiredCode={true}
                  form={props.form}
                  propertyName={'mobilePhone'}
                  propertyNameCode={'mobilePhoneCode'}
                  value={formatPhone.formatsGeneral(
                    item.basicProfile.mobilePhone,
                    false,
                    '1',
                    FormatPhoneTypeEnum.NATIONAL,
                  )}
                  valueCode={'+1'}
                  label={t('labelMobile')}
                  validateLength={10}
                  formItemLayout={formItemLayout}
                  validatedMsg={t('msgValidMobile')}
                  requiredMsg={t('msgFieldRequired')}
                  disabledCode={true}
                />
              </Col>
              <Col xs={24} sm={12} md={24} lg={12} xl={12}>
                <InputTextField
                  placeholder={t('labelPlaceHolderLastName')}
                  label={t('labelLastName')}
                  required={true}
                  form={props.form}
                  propertyName="lastName"
                  validateLength={50}
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                  typeOfCharMsg={t('labelOnlyLetters')}
                  maxLengthMsg={t('labelMaxLenLetters')}
                  labelLettersMsg={t('labelLetters')}
                  value={item.basicProfile.lastName}
                  validatedMsg={`${t('labelOnlyLettersANCharacteres')} 50 ${t('msgCharactersMaximum')}`}
                />
                <InputEmailField
                  placeholder={t('labelPlaceHolderEmail')}
                  form={props.form}
                  label={labelEmail}
                  required={true}
                  propertyName={'email'}
                  formItemLayout={formItemLayout}
                  validateLength={50}
                  requiredMsg={t('msgFieldRequired')}
                  value={item.basicProfile.email}
                  validatedMsg={t('msgValidEmail')}
                />
              </Col>
            </Row>
            {!appStore.isEditing ? (
              <React.Fragment>
                <InputPasswordField
                  placeholder={t('labelPlaceHolderPassword')}
                  confirmPlaceholder={t('labelPlaceHolderConfirmPassword')}
                  form={props.form}
                  label={t('labelPassword')}
                  propertyName="password"
                  required={true}
                  formItemLayout={formItemLayout}
                  minLength={8}
                  maxLength={15}
                  requiredMsg={t('msgFieldRequired')}
                  requiredMsgConfirm={t('labelConfirmPassword')}
                  value={''}
                  validatedMsg={t('msgValidPassword')}
                  isHorizontal={false}
                  matchMsg={t('labelConfirmPassword')}
                />
              </React.Fragment>
            ) : null}
            <Divider />
            <InputAddressField
              form={props.form}
              formItemLayout={formItemLayout}
              propertyNameAddress={'address'}
              propertyNameCountry={'addressCountryId'}
              propertyNameCity={'addressCity'}
              propertyNameZipCode={'addressZipCode'}
              propertyNameState={'addressStateId'}
              placeholderAddress={t('labelPlaceHolderAddress')}
              placeholderCountry={t('labelPlaceHolderCountry')}
              placeholderCity={t('labelPlaceHolderCity')}
              placeholderZipCode={t('labelPlaceHolderZipCode')}
              placeholderState={t('labelPlaceHolderState')}
              valueAddress={item.basicProfile.address}
              valueAddressCountryId={item.basicProfile.addressCountryId}
              valueAddressCity={item.basicProfile.addressCity}
              valueAddressZipCode={item.basicProfile.addressZipCode}
              valueAddressStateId={item.basicProfile.addressStateId}
              setCountries={setChildrenCountries}
            />
            <Button
              type="primary"
              id="accountManagerSubmitButton"
              htmlType="submit"
              className="account-manager-form__button-submit"
            >
              {buttonTitle}
            </Button>
            <Button
              type="default"
              id="accountManagerCancelButton"
              className="account-manager-form__button-cancel"
              onClick={() => onCancelForm()}
            >
              {t('labelCancel')}
            </Button>
          </Card>
        </Form>
        {uniqueUserModalStore.isUserConvert && <UniqueUserModal handleSubmit={handleSubmit} />}
      </div>
    );
  },
);

export default Form.create()(AccountManagerForm);
