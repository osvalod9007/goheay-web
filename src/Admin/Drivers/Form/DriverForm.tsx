import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Col, Divider, Form, Row} from 'antd';
import {useTranslation} from 'react-i18next';
import {useMutation} from 'react-apollo-hooks';
import {useRouter} from 'rift-router';
import {observer} from 'mobx-react-lite';
import gql from 'graphql-tag';
import {FormComponentProps} from 'antd/lib/form';
import moment from 'moment';

import AppStore from '../../../shared/stores/App.store';
import driverModel from '../../../shared/models/Driver.model';
import appModel from '../../../shared/models/App.model';
import {Driver} from '../../../shared/cs/driver.cs';
import {TShirtSizeEnum} from '../../../shared/enums/TShirtSize.enum';

import HeadTitle from '../../../shared/components/HeadTitle/HeadTitle';

import './DriverForm.less';

import InputTextField from '../../../shared/components/Inputs/InputTextField';
import InputEmailField from '../../../shared/components/Inputs/InputEmailField';
import InputPhoneField from '../../../shared/components/Inputs/InputPhoneField';
import InputPasswordField from '../../../shared/components/Inputs/InputPasswordField';
import InputDisabledPartDatesField from '../../../shared/components/Inputs/InputDisabledPartDatesField';
import InputNumberField from '../../../shared/components/Inputs/InputNumberField';
import InputSelectField from '../../../shared/components/Inputs/InputSelectField';

import openNotificationWithIcon from '../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';
import {BasicProfile} from '../../../shared/cs/basicProfile.cs';
import UniqueUserModalStore from '../../../shared/stores/UniqueUserModal.store';
import UniqueUserModal from '../../../shared/components/UniqueUserModal/UniqueUserModal';
import {CheckUserConvertEnum} from '../../../shared/enums/CheckUserConvert.enum';
import UploadDocumentsAndViewPrevious from '../../../shared/components/UploadDocumentsAndViewPrevious/UploadDocumentsAndViewPrevious';
import {DocumentTypeEnum} from '../../../shared/enums/DocumentType.enum';
import {DriverStatusEnum} from '../../../shared/enums/DriverStatus.enum';
import formatPhone from '../../../shared/utils/formatPhone';
import InputAddressField from '../../../shared/components/Inputs/InputAddressField';
import {FormatPhoneTypeEnum} from '../../../shared/enums/FormatPhoneType.enum';

type LoginFormProps = FormComponentProps;

const ADD_MUTATION = gql`
  mutation($input: DriverCreateInput!) {
    DriverCreate(input: $input) {
      id
    }
  }
`;

const EDIT_MUTATION = gql`
  mutation($id: EncryptId!, $input: DriverUpdateInput!) {
    DriverUpdate(id: $id, input: $input) {
      id
    }
  }
`;

export const DriverForm = observer(
  (props: LoginFormProps): JSX.Element => {
    const appStore = useContext(AppStore);
    const uniqueUserModalStore = useContext(UniqueUserModalStore);
    const {t} = useTranslation('app');
    const [formTitle, setFormTitle] = useState(t('labelAddDriver'));
    const [buttonTitle, setButtonTitle] = useState(t('labelAdd'));
    const [item, setItem] = useState(new Driver());
    const router = useRouter();
    const [disableField, setDisableField] = useState(true);
    const [fromCompany, setFromCompany] = useState('');
    const [fromFleetOwner, setFromFleetOwner] = useState(false);

    const tabIndexFieldsOrder: any = [
      'driverPhoto',
      'firstName',
      'lastName',
      'birthAt',
      'experienceYear',
      'mobilePhone',
      'email',
      'password',
      'confirm',
      'tShirtSize',
      'address',
      'addressCity',
      'addressCountryId',
      'addressZipCode',
      'addressStateId',
      'driverLicenseFront',
      'driverLicenseBack',
    ];
    const statusDrivers = [
      {id: DriverStatusEnum.STATUS_ON_BOARDING, name: `${t('labelOnBoarding')}`},
      {id: DriverStatusEnum.STATUS_ALERT, name: `${t('labelAlert')}`},
      {id: DriverStatusEnum.STATUS_CLEAR, name: `${t('labelClear')}`},
      {id: DriverStatusEnum.STATUS_READY, name: `${t('labelGoHeavyReady')}`},
    ];
    const statusDriversClear = [
      {id: DriverStatusEnum.STATUS_CLEAR, name: `${t('labelClear')}`},
      {id: DriverStatusEnum.STATUS_READY, name: `${t('labelGoHeavyReady')}`},
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
        if (params && params.search && params.search.from) {
          setFromCompany(params.search.from);
          setFromFleetOwner(true);
        } else {
          const ENV = `${process.env.REACT_APP_ENV}`;
          const STORE_VAR = `jwtGoHeavy-${ENV}`;
          localStorage.removeItem(STORE_VAR);
          window.location.pathname = '/admin/login';
          // const companyId = appStore.companies.find(e => e.typeSuperAdmin).typeSuperAdmin.companyId;
          // setFromCompany(companyId ? companyId : '');
          // setFromFleetOwner(false);
        }
        if (params && params.params && params.params.id) {
          appStore.setIsEditing(true);
          setFormTitle(t('labelEditDriver'));
          setButtonTitle(t('labelUpdate'));
          const input = {
            id: params.params.id,
          };
          const itemToEdit: any = await driverModel.getDriver(input);
          setItem({...new Driver(itemToEdit.data.DriverGet)});
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
            switch (keysplit) {
              case 'uniqueUserConvert':
                uniqueUserModalStore.setEmail(values.email);
                uniqueUserModalStore.setMobilePhoneCode(values.mobilePhoneCode);
                uniqueUserModalStore.setMobilePhone(formatPhone.formatToString(values.mobilePhone));
                uniqueUserModalStore.setMessage(t('msgUniqueUser'));
                uniqueUserModalStore.setType(CheckUserConvertEnum.DRIVER);
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
          const {errors} = result;
          if (!errors) {
            appStore.setUserAction({
              ...appStore.userAction,
              ...{isSaved: true, action: appStore.isEditing ? 'updated' : 'created'},
            });
            appStore.setIsLoading(false);
            appStore.setIsEditing(false);
            window.history.back();
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
          const {
            confirm,
            birthAt,
            experienceYear,
            tShirtSize,
            driverLicenseBack,
            upload_driverLicenseBack,
            driverLicenseFront,
            upload_driverLicenseFront,
            driverPhoto,
            upload_driverPhoto,
            status,
            mobilePhone,
            ...profile
          } = values;
          const mobilePhoneE164 = formatPhone.formatToString(mobilePhone);
          const basicProfile = {
            ...profile,
            mobilePhone: mobilePhoneE164,
          };
          const {documents} = item;
          const docs = documents.filter(val => val.data);
          const document = docs.map(element => {
            if (element.data !== undefined) {
              let elementAdd = element;
              const {uploadFile, ...addItem} = element;
              elementAdd = addItem;
              return elementAdd;
            }
          });
          const obj = {
            birthAt: birthAt.utc().format('YYYY-MM-DD'),
            experienceYear,
            tShirtSize,
            ...(!appStore.isEditing && fromCompany !== '' && {companyId: fromCompany}),
            ...(appStore.hasRole(appStore.roles, ['TYPE_SUPER_ADMIN']) && appStore.isEditing && {status}),
            ...(uniqueUserModalStore.userId !== '' && uniqueUserModalStore.isUserConvert
              ? {userId: uniqueUserModalStore.userId}
              : {basicProfile}),
            ...(document.length > 0 && {documents: document}),
          };
          uniqueUserModalStore.setIsUserConvert(false);
          uniqueUserModalStore.setUserId('');
          appStore.setUserAction({...appStore.userAction, ...{typeOfElem: 'labelDriver'}});
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
      window.history.back();
    };

    const compareToAge = (rule, val, callback, msgMatch) => {
      setTimeout(() => {
        if (val !== '' && val !== undefined && val !== null) {
          const expR = /^\d+$/;
          if (val !== '' && val !== undefined && val !== null && !String(val).match(expR)) {
            callback([new Error(`${t('msgValidNumber')}`)]);
          } else {
            const driverAge = Math.abs(props.form.getFieldValue('birthAt').diff(moment(), 'years'));
            if (parseInt(val, 10) < 3 || parseInt(val, 10) > driverAge - 16) {
              callback([new Error(`${t('msgValidExperience')} ${driverAge - 16}.`)]);
            } else {
              callback();
            }
          }
        }
        callback();
      }, 300);
    };

    useEffect(() => {
      props.form.getFieldValue('birthAt') && onChange(props.form.getFieldValue('birthAt'));
    }, [item.birthAt]);

    const onChange = val => {
      const inputForm = props.form;
      if (val !== '' && val !== undefined && val !== null) {
        setDisableField(false);
        if (
          inputForm.getFieldValue('experienceYear') !== '' &&
          inputForm.getFieldValue('experienceYear') !== undefined &&
          inputForm.getFieldValue('experienceYear') !== null
        ) {
          inputForm.validateFieldsAndScroll(['experienceYear'], {force: true});
        }
      } else {
        setDisableField(true);
      }
    };

    const focusInput = component => {
      if (component) {
        component.focus();
      }
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

    const handleDriverPhoto = (image: any) => {
      const keys: any = ['upload_driverPhoto'];
      const values = props.form.getFieldsValue(keys);
      const {upload_driverPhoto} = values;
      const [driverPhoto] = item.documents.filter(val => val.type === DocumentTypeEnum.TYPE_DRIVER_PHOTO);
      const driverOthersDocuments = item.documents.filter(val => val.type !== DocumentTypeEnum.TYPE_DRIVER_PHOTO);
      const documents: any = [];
      upload_driverPhoto &&
        documents.push({
          ...(appStore.isEditing && driverPhoto && driverPhoto.id && {id: driverPhoto.id}),
          uploadFile: {
            publicUrl: image,
          },
          data: upload_driverPhoto.originFileObj,
          type: DocumentTypeEnum.TYPE_DRIVER_PHOTO,
        });
      item.documents = [...documents, ...driverOthersDocuments];
    };

    const handleChangeDriverLicenseFront = (image: any) => {
      const keys: any = ['upload_driverLicenseFront'];
      const values = props.form.getFieldsValue(keys);
      const {upload_driverLicenseFront} = values;
      const driverOthersDocuments = item.documents.filter(
        val => val.type !== DocumentTypeEnum.TYPE_DRIVER_LICENCE_FRONT,
      );
      const [driverLicenseFront] = item.documents.filter(
        val => val.type === DocumentTypeEnum.TYPE_DRIVER_LICENCE_FRONT,
      );
      const documents: any = [];
      upload_driverLicenseFront &&
        documents.push({
          ...(appStore.isEditing && driverLicenseFront && driverLicenseFront.id && {id: driverLicenseFront.id}),
          uploadFile: {
            publicUrl: image,
          },
          data: upload_driverLicenseFront.originFileObj,
          type: DocumentTypeEnum.TYPE_DRIVER_LICENCE_FRONT,
        });
      item.documents = [...documents, ...driverOthersDocuments];
    };
    const handleChangeDriverLicenseBack = (image: any) => {
      const keys: any = ['upload_driverLicenseBack'];
      const values = props.form.getFieldsValue(keys);
      const {upload_driverLicenseBack} = values;
      const driverOthersDocuments = item.documents.filter(
        val => val.type !== DocumentTypeEnum.TYPE_DRIVER_LICENCE_BACK,
      );
      const [driverLicenseBack] = item.documents.filter(val => val.type === DocumentTypeEnum.TYPE_DRIVER_LICENCE_BACK);
      const documents: any = [];
      upload_driverLicenseBack &&
        documents.push({
          ...(appStore.isEditing && driverLicenseBack && driverLicenseBack.id && {id: driverLicenseBack.id}),
          uploadFile: {
            publicUrl: image,
          },
          data: upload_driverLicenseBack.originFileObj,
          type: DocumentTypeEnum.TYPE_DRIVER_LICENCE_BACK,
        });
      item.documents = [...documents, ...driverOthersDocuments];
    };

    return (
      <div className="driver-form">
        <Form onSubmit={handleSubmit} layout="vertical" id={'driver-form'} name={'driver-form'} autoComplete={'off'}>
          <Card bordered={false} className="gutter-row">
            <Row type="flex" justify="space-between" align="middle" style={{marginBottom: 10}}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <HeadTitle icon="idcard" title={formTitle} />
                <Divider />
              </Col>
            </Row>
            <Row type="flex" justify="space-between" align="top">
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <UploadDocumentsAndViewPrevious
                  form={props.form}
                  label={t('labelDriverIdPhoto')}
                  propertyName={'driverPhoto'}
                  imageUrl={
                    (item.documents.length > 0 &&
                      item.documents.filter(val => val.type === DocumentTypeEnum.TYPE_DRIVER_PHOTO).length > 0 &&
                      item.documents.filter(val => val.type === DocumentTypeEnum.TYPE_DRIVER_PHOTO)[0].uploadFile
                        .publicUrl) ||
                    ''
                  }
                  isRequired={true}
                  width={'145px'}
                  height={'145px'}
                  borderRadius={'5px'}
                  formItemLayout={formItemLayout}
                  handleUpdatePicture={handleDriverPhoto}
                  requiredMsg={t('msgFieldRequired')}
                />
              </Col>
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
                  // tabIndex={0}
                />
                <InputDisabledPartDatesField
                  placeholder={t('labelPlaceHolderBirthDate')}
                  label={t('labelBirthDate')}
                  required={true}
                  form={props.form}
                  propertyName={'birthAt'}
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                  value={item.birthAt}
                  minDisableDate={moment().subtract(21, 'years')}
                  maxDisableDate={moment().subtract(80, 'years')}
                  onChange={onChange}
                  tabIndex={2}
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
                  // ref={focusInput}
                  // focus={false}
                  // tabIndex={1}
                />
                <InputNumberField
                  placeholder={t('labelPlaceHolderYearsOfExperience')}
                  label={t('labelYearsOfExperience')}
                  required={true}
                  form={props.form}
                  onValidate={compareToAge}
                  propertyName="experienceYear"
                  validateLength={5}
                  disabled={disableField}
                  maxlength={5}
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                  value={item.experienceYear}
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
            <Row type="flex" justify="space-between" align="top">
              <Col xs={24} sm={12} md={24} lg={12} xl={12}>
                <InputSelectField
                  placeholder={t('labelPlaceHolderTShirtSize')}
                  form={props.form}
                  label={t('labelTShirtSize')}
                  required={true}
                  propertyName={'tShirtSize'}
                  formItemLayout={formItemLayout}
                  value={item.tShirtSize}
                  requiredMsg={t('msgFieldRequired')}
                  items={[
                    {id: TShirtSizeEnum.TYPE_SHIRT_SIZE_S, name: 'S'},
                    {id: TShirtSizeEnum.TYPE_SHIRT_SIZE_M, name: 'M'},
                    {id: TShirtSizeEnum.TYPE_SHIRT_SIZE_L, name: 'L'},
                    {id: TShirtSizeEnum.TYPE_SHIRT_SIZE_XL, name: 'XL'},
                    {id: TShirtSizeEnum.TYPE_SHIRT_SIZE_XXL, name: 'XXL'},
                  ]}
                  disabled={false}
                />
              </Col>
              <Col xs={24} sm={12} md={24} lg={12} xl={12}>
                {/* Only SUPER_ADMIN by Peter */}
                {appStore.hasRole(appStore.roles, ['TYPE_SUPER_ADMIN']) && appStore.isEditing ? (
                  <InputSelectField
                    placeholder={t('labelPlaceHolderStatus')}
                    form={props.form}
                    label={t('labelStatus')}
                    required={true}
                    propertyName={'status'}
                    formItemLayout={formItemLayout}
                    value={item.status}
                    requiredMsg={t('msgFieldRequired')}
                    items={item.status === DriverStatusEnum.STATUS_CLEAR ? statusDriversClear : statusDrivers}
                    disabled={item.status !== DriverStatusEnum.STATUS_CLEAR}
                  />
                ) : null}
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
              valueAddress={item.basicProfile.address}
              valueAddressCountryId={item.basicProfile.addressCountryId}
              valueAddressCity={item.basicProfile.addressCity}
              valueAddressZipCode={item.basicProfile.addressZipCode}
              valueAddressStateId={item.basicProfile.addressStateId}
              setCountries={setChildrenCountries}
            />
            <Divider />
            <Row type="flex" justify="space-between" align="top">
              <Col xs={24} sm={12} md={24} lg={12} xl={12}>
                <UploadDocumentsAndViewPrevious
                  form={props.form}
                  label={t('labelDriverLicenseFront')}
                  imageUrl={
                    (item.documents.length > 0 &&
                      item.documents.filter(val => val.type === DocumentTypeEnum.TYPE_DRIVER_LICENCE_FRONT).length >
                        0 &&
                      item.documents.filter(val => val.type === DocumentTypeEnum.TYPE_DRIVER_LICENCE_FRONT)[0]
                        .uploadFile.publicUrl) ||
                    ''
                  }
                  propertyName="driverLicenseFront"
                  isRequired={true}
                  width={'145px'}
                  height={'145px'}
                  borderRadius={'5px'}
                  formItemLayout={formItemLayout}
                  handleUpdatePicture={handleChangeDriverLicenseFront}
                  requiredMsg={t('msgFieldRequired')}
                />
              </Col>
              <Col xs={24} sm={12} md={24} lg={12} xl={12}>
                <UploadDocumentsAndViewPrevious
                  form={props.form}
                  label={t('labelDriverLicenseBack')}
                  imageUrl={
                    (item.documents.length > 0 &&
                      item.documents.filter(val => val.type === DocumentTypeEnum.TYPE_DRIVER_LICENCE_BACK).length > 0 &&
                      item.documents.filter(val => val.type === DocumentTypeEnum.TYPE_DRIVER_LICENCE_BACK)[0].uploadFile
                        .publicUrl) ||
                    ''
                  }
                  propertyName="driverLicenseBack"
                  isRequired={true}
                  width={'145px'}
                  height={'145px'}
                  borderRadius={'5px'}
                  formItemLayout={formItemLayout}
                  handleUpdatePicture={handleChangeDriverLicenseBack}
                  requiredMsg={t('msgFieldRequired')}
                />
              </Col>
            </Row>
            <Button type="primary" htmlType="submit" className="driver-form__button-submit">
              {buttonTitle}
            </Button>
            <Button type="default" className="driver-form__button-cancel" onClick={() => onCancelForm()}>
              {t('labelCancel')}
            </Button>
          </Card>
        </Form>
        {uniqueUserModalStore.isUserConvert && <UniqueUserModal handleSubmit={handleSubmit} />}
      </div>
    );
  },
);

export default Form.create()(DriverForm);
