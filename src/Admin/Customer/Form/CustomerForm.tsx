import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Col, Divider, Form, Row} from 'antd';
import {useTranslation} from 'react-i18next';
import {useMutation} from 'react-apollo-hooks';
import {useRouter} from 'rift-router';
import gql from 'graphql-tag';
import {FormComponentProps} from 'antd/lib/form';

import AppStore from '../../../shared/stores/App.store';
import customerModel from '../../../shared/models/Customer.model';
import appModel from '../../../shared/models/App.model';
import {Customer} from '../../../shared/cs/customer.cs';
import {BasicProfile} from '../../../shared/cs/basicProfile.cs';

import HeadTitle from '../../../shared/components/HeadTitle/HeadTitle';

import './CustomerForm.less';

import InputTextField from '../../../shared/components/Inputs/InputTextField';
import InputEmailField from '../../../shared/components/Inputs/InputEmailField';
import InputPhoneField from '../../../shared/components/Inputs/InputPhoneField';
import InputPasswordField from '../../../shared/components/Inputs/InputPasswordField';
import openNotificationWithIcon from '../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';
import formatPhone from '../../../shared/utils/formatPhone';
import {FormatPhoneTypeEnum} from '../../../shared/enums/FormatPhoneType.enum';
import InputAddressField from '../../../shared/components/Inputs/InputAddressField';

type LoginFormProps = FormComponentProps;

const ADD_MUTATION = gql`
  mutation($input: CustomerCreateInput!) {
    CustomerCreate(input: $input) {
      id
    }
  }
`;

const EDIT_MUTATION = gql`
  mutation($id: EncryptId!, $input: CustomerUpdateInput!) {
    CustomerUpdate(id: $id, input: $input) {
      id
    }
  }
`;

export const CustomerForm = (props: LoginFormProps): JSX.Element => {
  const appStore = useContext(AppStore);
  const {t} = useTranslation('app');
  const [formTitle, setFormTitle] = useState(t('labelAddCustomer'));
  const [buttonTitle, setButtonTitle] = useState(t('labelAdd'));
  const [item, setItem] = useState(new Customer());
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
        setFormTitle(t('labelEditCustomer'));
        setButtonTitle(t('labelUpdate'));
        const input = {
          id: params.params.id,
        };
        const itemToEdit: any = await customerModel.getCustomer(input);
        setItem({...new Customer(itemToEdit.data.CustomerGet)});
      } else {
        const ENV = `${process.env.REACT_APP_ENV}`;
        const STORE_VAR = `jwtGoHeavy-${ENV}`;
        localStorage.removeItem(STORE_VAR);
        window.location.pathname = '/admin/login';
      }
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

  const addMutation = useMutation(appStore.isEditing ? EDIT_MUTATION : ADD_MUTATION, {
    update: (proxy, result) => {
      /* your custom update logic */
      setTimeout(() => {
        appStore.setIsLoading(true);
        const {errors} = result;
        if (!errors) {
          appStore.setUserAction({
            ...appStore.userAction,
            ...{isSaved: true, action: appStore.isEditing ? 'updated' : 'created'},
          });
          appStore.setIsLoading(false);
          appStore.setIsEditing(false);
          router.to('/admin/customer');
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
    e.preventDefault();

    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        appStore.setIsLoading(true);
        const {confirm, mobilePhone, ...obj} = values;
        const mobilePhoneE164 = formatPhone.formatToString(mobilePhone);
        const basicProfile = {
          mobilePhone: mobilePhoneE164,
          ...obj,
        };

        appStore.setUserAction({...appStore.userAction, ...{typeOfElem: 'labelCustomer'}});

        addMutation({variables: {input: {basicProfile}, ...(appStore.isEditing && {id: item.id})}}).catch(error => {
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
    router.to('/admin/customer');
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

  const focusInput = component => {
    if (component) {
      component.focus();
    }
  };

  return (
    <div className="customer-form">
      <Form onSubmit={handleSubmit} layout="vertical" id={'customer-form'} autoComplete={'off'}>
        <Card bordered={false} className="gutter-row">
          <Row type="flex" justify="space-between" align="top" style={{marginBottom: '13px'}}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <HeadTitle icon="team" title={formTitle} />
              <Divider />
            </Col>
          </Row>
          <Row type="flex" justify="space-between" align="top" style={{marginBottom: '13px'}}>
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
                validateLength={13}
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
                // hidden={agencyUserStore.isEditing}
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
          {/* <WeekPicker onChange={onChange} placeholder="Select week" /> */}
          <Button type="primary" htmlType="submit" className="customer-form__button-submit">
            {buttonTitle}
          </Button>
          <Button type="default" className="customer-form__button-cancel" onClick={() => onCancelForm()}>
            {t('labelCancel')}
          </Button>
        </Card>
      </Form>
    </div>
  );
};

export default Form.create()(CustomerForm);
