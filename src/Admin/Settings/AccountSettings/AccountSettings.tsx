import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Col, Divider, Form, Row} from 'antd';
import {useTranslation} from 'react-i18next';
import {useMutation} from 'react-apollo-hooks';
import {useRouter} from 'rift-router';
import gql from 'graphql-tag';
import {FormComponentProps} from 'antd/lib/form';

import AppStore from '../../../shared/stores/App.store';
import settingsModel from '../../../shared/models/Settings.model';
import appModel from '../../../shared/models/App.model';
import {BasicProfile} from '../../../shared/cs/basicProfile.cs';

import HeadTitle from '../../../shared/components/HeadTitle/HeadTitle';

import './AccountSettings.less';

import InputTextField from '../../../shared/components/Inputs/InputTextField';
import InputEmailField from '../../../shared/components/Inputs/InputEmailField';
import InputPhoneField from '../../../shared/components/Inputs/InputPhoneField';
import UploadImage from '../../../shared/components/UploadImage/UploadImage';
import formatPhone from '../../../shared/utils/formatPhone';

import openNotificationWithIcon from '../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';
import InputAddressField from '../../../shared/components/Inputs/InputAddressField';
import {FormatPhoneTypeEnum} from '../../../shared/enums/FormatPhoneType.enum';

type LoginFormProps = FormComponentProps;

const EDIT_MUTATION_ADMIN = gql`
  mutation($input: AdministratorProfileUpdateInput!) {
    AdministratorProfileUpdate(input: $input) {
      id
      basicProfile {
        firstName
        lastName
        fullName
        email
        avatar {
          id
          name
          publicUrl
          mimeType
          size
        }
      }
    }
  }
`;

const EDIT_MUTATION_FLEET = gql`
  mutation($input: FleetOwnerProfileUpdateInput!) {
    FleetOwnerProfileUpdate(input: $input) {
      id
      basicProfile {
        firstName
        lastName
        fullName
        email
        avatar {
          id
          name
          publicUrl
          mimeType
          size
        }
      }
    }
  }
`;

export const AccountSettings = (props: LoginFormProps): JSX.Element => {
  const appStore = useContext(AppStore);
  const {t} = useTranslation('app');
  const [item, setItem] = useState(new BasicProfile());
  const router = useRouter();

  const tabIndexFieldsOrder: any = [
    'firstName',
    'lastName',
    'mobilePhone',
    'email',
    'address',
    'addressCity',
    'addressCountryId',
    'addressZipCode',
    'addressStateId',
  ];

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
  }, []);

  const setChildrenCountries = (countriesMapped: any) => {
    setItem({...item, ...{basicProfile: new BasicProfile({addressCountry: countriesMapped[0]})}});
  };

  const getData = async () => {
    try {
      appStore.setIsLoading(true);
      const role = appStore.mainRole;
      const typeGet: any =
        role === 'TYPE_SUPER_ADMIN' || role === 'TYPE_DISPATCHER'
          ? 'getAdminAccountSettings'
          : 'getFleetAccountSettings';
      const typeReturn: any =
        role === 'TYPE_SUPER_ADMIN' || role === 'TYPE_DISPATCHER' ? 'AdministratorProfileGet' : 'FleetOwnerProfileGet';
      const itemToEdit: any = await settingsModel[typeGet]();
      setItem({...new BasicProfile(itemToEdit.data[typeReturn].basicProfile)});
      appStore.setIsLoading(false);
    } catch (e) {
      appStore.setIsLoading(false);
      // handleCatch(e, {}, {});
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

  const addMutation = useMutation(
    appStore.mainRole === 'TYPE_SUPER_ADMIN' || appStore.mainRole === 'TYPE_DISPATCHER'
      ? EDIT_MUTATION_ADMIN
      : EDIT_MUTATION_FLEET,
    {
      update: (proxy, result) => {
        /* your custom update logic */
        // setTimeout(() => {
        appStore.setIsLoading(true);
        const {errors, data} = result;
        if (!errors) {
          appStore.setIsLoading(false);
          appStore.setIsEditing(false);
          const msg = `${t('labelYour')} ${t('labelprofile')} ${t('labelWasUpdated')}`;
          openNotificationWithIcon('success', msg, '');
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
        // });
      },
    },
  );

  const handleSubmit = e => {
    e.preventDefault();

    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        appStore.setIsLoading(true);
        const {upload_avatar, avatar, mobilePhone, ...all} = values;
        const mobilePhoneE164 = formatPhone.formatToString(mobilePhone);
        const basicProfile = {
          mobilePhone: mobilePhoneE164,
          ...all,
          ...(upload_avatar && {
            avatar: {
              data: upload_avatar.originFileObj,
            },
          }),
        };
        addMutation({variables: {input: {basicProfile}}})
          .then(res => {
            appStore.setIsLoading(true);
            const role = appStore.mainRole;
            const typeReturn: any =
              role === 'TYPE_SUPER_ADMIN' || role === 'TYPE_DISPATCHER'
                ? 'AdministratorProfileUpdate'
                : 'FleetOwnerProfileUpdate';
            const profile = res.data[typeReturn];
            // Update user data in localStorage
            if (appStore.getToken()) {
              appModel.login({
                token: appStore.getToken().token,
                roles: appStore.getToken().roles,
                permissions: appStore.getToken().permissions,
                dataUserAuth: profile.basicProfile,
                expiresIn: appStore.getToken().expiresIn,
                companies: appStore.getToken().companies,
                mainRole: appStore.getToken().mainRole,
              });
              appStore.setUserAuth(profile.basicProfile);
            }
          })
          .catch(error => {
            handleCatch(error, values, '');
          })
          .finally(() => {
            appStore.setIsLoading(false);
          });
      } else {
        appStore.setHasError(true);
      }
    });
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
  const handleChange = (avatar: any) => {
    // setItem({item, ...avatar});
  };

  const focusInput = component => {
    if (component) {
      component.focus();
    }
  };

  return (
    <div className="account-settings">
      <Form onSubmit={handleSubmit} layout="vertical" id={'account-settings'} autoComplete={'off'}>
        <Card bordered={false} className="gutter-row">
          <Row type="flex" justify="space-between" align="middle" style={{marginBottom: '13px'}}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <HeadTitle icon="profile" title={t('labelAccountSettings')} />
              <Divider />
            </Col>
          </Row>
          <Row type="flex" justify="space-between" align="top">
            <Col xs={24} sm={12} md={24} lg={12} xl={12}>
              <UploadImage
                form={props.form}
                label={t('labelProfileImage')}
                imageUrl={item.avatar.publicUrl}
                propertyName="avatar"
                isRequired={true}
                formItemLayout={formItemLayout}
                handleUpdatePicture={handleChange}
                requiredMsg={t('msgFieldRequired')}
              />
            </Col>
          </Row>
          <Divider />
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
                value={item.firstName}
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
                value={formatPhone.formatsGeneral(item.mobilePhone, false, '1', FormatPhoneTypeEnum.NATIONAL)}
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
                value={item.lastName}
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
                value={item.email}
                validatedMsg={t('msgValidEmail')}
              />
            </Col>
          </Row>
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
            valueAddress={item.address}
            valueAddressCountryId={item.addressCountryId}
            valueAddressCity={item.addressCity}
            valueAddressZipCode={item.addressZipCode}
            valueAddressStateId={item.addressStateId}
            setCountries={setChildrenCountries}
          />
          <Button type="primary" htmlType="submit" className="account-settings__button-submit">
            {t('labelUpdate')}
          </Button>
        </Card>
      </Form>
    </div>
  );
};

export default Form.create()(AccountSettings);
