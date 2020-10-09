import React, {useContext, useEffect, useState} from 'react';
import {Col, Button, Divider, Form, Row} from 'antd';
import {useTranslation} from 'react-i18next';
import {useMutation} from 'react-apollo-hooks';
import {FormComponentProps} from 'antd/lib/form';
import gql from 'graphql-tag';
import {observer} from 'mobx-react-lite';

import './StepThreeForm.less';
import AppStore from '../../../../shared/stores/App.store';
import VehicleStore from '../../../../shared/stores/Vehicle.store';
import WizardStore from '../../../../shared/stores/Wizard.store';
import UploadImage from '../../../../shared/components/UploadImage/UploadImage';
import InsuranceVerificationField from '../../../../shared/components/Inputs/InsuranceVerificationField';
import InputDisabledPartDatesField from '../../../../shared/components/Inputs/InputDisabledPartDatesField';
import InputWithPatternField from '../../../../shared/components/Inputs/InputWithPatternField';
import InputSelectField from '../../../../shared/components/Inputs/InputSelectField';
import appModel from '../../../../shared/models/App.model';
import {useRouter, RiftLink} from 'rift-router';
import openNotificationWithIcon from '../../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';
import {VehicleDocuments} from '../../../../shared/cs/vehicleDocuments.cs';
import {DocumentTypeEnum} from '../../../../shared/enums/DocumentType.enum';
import {Vehicle} from '../../../../shared/cs/vehicle.cs';
import moment from 'moment';
import vehicleModel from '../../../../shared/models/Vehicle.model';

const ADD_MUTATION = gql`
  mutation($input: VehicleCreateInput!) {
    VehicleCreate(input: $input) {
      id
    }
  }
`;

const EDIT_MUTATION = gql`
  mutation($id: EncryptId!, $input: VehicleUpdateInput!) {
    VehicleUpdate(id: $id, input: $input) {
      id
    }
  }
`;
type StepThreeFormProps = FormComponentProps;

export const StepThreeForm = observer(
  (props: StepThreeFormProps): JSX.Element => {
    const appStore = useContext(AppStore);
    const vehicleStore = useContext(VehicleStore);
    const wizardStore = useContext(WizardStore);
    const [states, setStates] = useState([]);
    const [disableField, setDisableField] = useState(true);
    const [insuranceEffectiveDateSelectedTmp, setInsuranceEffectiveDateSelectedTmp] = useState(moment());
    const {t} = useTranslation('app');
    const router = useRouter();

    const tabIndexFieldsOrder: any = [
      'currentInsuranceCertificatePicture',
      'verificationDelivery',
      'verificationLicenseTime',
      'insurancePolicyNo',
      'insuranceCertificateCompany',
      'insuranceEffectiveDate',
      'insuranceExpirationDate',
      'insuranceRenewal',
      'licensePlatePhoto',
      'licensePlateNo',
      'licensePlateStateIssuedId',
      'vehicleRegistrationSticker',
    ];
    const tabIndexFieldsOrderEdit: any = [
      'currentInsuranceCertificatePicture',
      'insurancePolicyNo',
      'insuranceCertificateCompany',
      'insuranceEffectiveDate',
      'insuranceExpirationDate',
      'insuranceRenewal',
      'licensePlatePhoto',
      'licensePlateNo',
      'licensePlateStateIssuedId',
      'vehicleRegistrationSticker',
    ];

    useEffect(() => {
      // tabIndex order for the fields
      (appStore.isEditing ? tabIndexFieldsOrderEdit : tabIndexFieldsOrder).forEach((field: any, index: any) => {
        (document as any).getElementById(field).tabIndex = index + 1;
      });
      // get data for the form
      getImage();
      getData();
    }, []);

    useEffect(() => {
      setDisableField(
        props.form.getFieldValue('insuranceEffectiveDate') === '' ||
          props.form.getFieldValue('insuranceEffectiveDate') === null ||
          props.form.getFieldValue('insuranceEffectiveDate') === undefined ||
          !props.form.getFieldValue('insuranceEffectiveDate'),
      );
    }, [props.form.getFieldValue('insuranceEffectiveDate')]);

    const getImage = () => {
      const vehicleRegistrationSticker = wizardStore.item.documents
        ? wizardStore.item.documents.filter(val => val.type === DocumentTypeEnum.TYPE_VEHICLE_REGISTRATION_STICKER)
        : [];
      const currentInsuranceCertificatePicture = wizardStore.item.documents
        ? wizardStore.item.documents.filter(
            val => val.type === DocumentTypeEnum.TYPE_INSURANCE_CERTIFICATE_PICTURE_FILE,
          )
        : [];
      if (vehicleRegistrationSticker[0] && vehicleRegistrationSticker[0].file.data) {
        props.form.setFieldsValue({upload_vehicleRegistrationSticker: [vehicleRegistrationSticker[0].file.data]});
      }
      if (currentInsuranceCertificatePicture[0] && currentInsuranceCertificatePicture[0].file.data) {
        props.form.setFieldsValue({
          upload_currentInsuranceCertificatePicture: [currentInsuranceCertificatePicture[0].file.data],
        });
      }
      if (
        wizardStore.item &&
        wizardStore.item.licensePlatePhotoFile &&
        wizardStore.item.licensePlatePhotoFile.publicUrl
      ) {
        props.form.setFieldsValue({upload_licensePlatePhoto: [wizardStore.item.licensePlatePhotoFile.publicUrl]});
      }
      if (wizardStore.item && wizardStore.item.verificationDelivery) {
        props.form.setFieldsValue({verificationDelivery: wizardStore.item.verificationDelivery});
      }
      if (wizardStore.item && wizardStore.item.verificationLicenseTime) {
        props.form.setFieldsValue({verificationLicenseTime: wizardStore.item.verificationLicenseTime});
      }
    };

    const getData = async () => {
      try {
        appStore.setIsLoading(true);
        const countryList: any = await appModel.getCountries();
        const mappedCountries: any = countryList.data.CountryList.items.map(ct => {
          return {
            id: ct.id,
            name: ct.name,
          };
        });
        const stateList: any = await appModel.getStates({
          page: 0,
          pageSize: 0,
          where: [{field: 'country.id', value: mappedCountries[0].id, isPk: true}],
          order: [{field: 'name', orderType: 'ASC'}],
        });
        const mappedStates = stateList.data.StateList.items.map(st => {
          return {
            id: st.id,
            name: st.name,
          };
        });
        setStates(mappedStates);
        appStore.setIsLoading(false);
      } catch (e) {
        appStore.setIsLoading(false);
        // handleCatch(e, {}, {});
      }
    };

    const addMutation = useMutation(appStore.isEditing ? EDIT_MUTATION : ADD_MUTATION, {
      update: (proxy, result) => {
        /* your custom update logic */
        setTimeout(() => {
          const {errors} = result;
          if (!errors) {
            appStore.setUserAction({...appStore.userAction, ...{typeOfElem: 'labelVehicle'}});
            appStore.setUserAction({
              ...appStore.userAction,
              ...{isSaved: true, action: appStore.isEditing ? 'updated' : 'created'},
            });
            appStore.setIsEditing(false);
            appStore.setIsLoading(false);
            window.history.back();
            wizardStore.setItem({...new Vehicle()});
            wizardStore.setWizardStep(0);
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
        }, 3000);
      },
    });

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
            if (msg !== '' && tabIndexFieldsOrder.includes(keysplit)) {
              obj[keysplit] = {
                value: values[keysplit],
                errors: [new Error(`${msg}`)],
              };
              props.form.setFields(obj);
            } else {
              openNotificationWithIcon('error', t('lavelSaveFailed'), msg);
            }
          });
        } else {
          openNotificationWithIcon('error', t('lavelSaveFailed'), error.message);
        }
      }

      appStore.setIsLoading(false);
    };

    const returnStepOne = () => {
      vehicleStore.setIsErrorStepOne(true);
      wizardStore.setWizardStep(0);
    };

    const handleSubmit = e => {
      e.preventDefault();
      props.form.validateFieldsAndScroll(async (err, values) => {
        appStore.setIsLoading(true);
        const existVin: any = await vehicleModel.getVehicleDetailsVinGet(wizardStore.item.vin);
        if (!appStore.isEditing) {
          if (
            existVin &&
            existVin.data &&
            existVin.data.VehicleDetailsVinGet &&
            existVin.data.VehicleDetailsVinGet.vehicleId &&
            existVin.data.VehicleDetailsVinGet.vehicleId !== null
          ) {
            returnStepOne();
          }
        } else {
          const {id} = wizardStore.item;
          if (
            existVin.data.VehicleDetailsVinGet.vehicleId &&
            existVin.data.VehicleDetailsVinGet.vehicleId !== id &&
            existVin.data.VehicleDetailsVinGet.vehicleId !== null
          ) {
            returnStepOne();
          }
        }
        appStore.setIsLoading(false);
        if (!err && !vehicleStore.isErrorStepOne) {
          appStore.setIsLoading(true);
          const {
            currentInsuranceCertificatePicture,
            licensePlatePhoto,
            upload_licensePlatePhoto,
            vehicleRegistrationSticker,
            upload_currentInsuranceCertificatePicture,
            upload_vehicleRegistrationSticker,
            ...rest
          } = values;
          const obj = {
            ...rest,
          };
          wizardStore.setItem({...wizardStore.item, ...obj});
          // Add vehicle
          const {
            documents,
            licensePlatePhotoFile,
            measureFloorSpace,
            measureLoadingSpace,
            id,
            vehicleId,
            dataOne,
            ...add
          } = wizardStore.item;
          const docs = documents.filter(val => val.file.data);
          const document = docs.map(element => {
            const elementAdd = Object.assign({}, element);
            if (element.file.data !== undefined) {
              const {publicUrl, ...addItem} = element.file;
              elementAdd.file = addItem;
              return elementAdd;
            }
          });
          // Edit vehicle
          const {
            vehicleType,
            licensePlateStateIssued,
            idLicensePlatePhotoFile,
            idVehiclePhoto,
            idFileVehiclePhoto,
            idCertificatePicture,
            idFileCertificatePicture,
            idFileStickerPicture,
            idStickerPicture,
            ...all
          } = add;
          const input = {
            ...(!appStore.isEditing && vehicleStore.fromCompany !== '' && {companyId: vehicleStore.fromCompany}),
            ...(licensePlatePhotoFile.data && {
              licensePlatePhotoFile: {
                data: licensePlatePhotoFile.data,
              },
            }),
            ...(document.length > 0 && {
              documents: document,
            }),
            ...(appStore.isEditing ? all : add),
          };
          addMutation({
            variables: {
              input,
              ...(appStore.isEditing && {id: wizardStore.item.id}),
            },
          }).catch(error => {
            handleCatch(error, values, '');
          });
        } else {
          const error = t('errorMsgAuthAdmin');
          appStore.setHasError(true);
          appStore.setErrorMsg(error);
          appStore.setIsLoading(false);
        }
      });
    };

    const formItemLayout = {
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 18},
        md: {span: 18},
        lg: {span: 18},
        xl: {span: 18},
      },
    };
    const formItemLayoutImage = {
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 18},
        md: {span: 18},
        lg: {span: 18},
        xl: {span: 18},
      },
    };

    const handleChangeLicensePlatePhoto = (avatar: any) => {
      const keys: any = ['upload_licensePlatePhoto'];
      const values = props.form.getFieldsValue(keys);
      const {upload_licensePlatePhoto} = values;
      const input = {
        ...(upload_licensePlatePhoto && {
          licensePlatePhotoFile: {
            publicUrl: avatar,
            data: upload_licensePlatePhoto.originFileObj,
          },
        }),
      };
      wizardStore.setItem({...wizardStore.item, ...input});
    };

    const handleChangeVehicleRegistrationSticker = (avatar: any) => {
      const keys: any = ['upload_vehicleRegistrationSticker'];
      const values = props.form.getFieldsValue(keys);
      const {upload_vehicleRegistrationSticker} = values;
      const vehicleOthersDocuments = wizardStore.item.documents
        ? wizardStore.item.documents.filter(val => val.type !== DocumentTypeEnum.TYPE_VEHICLE_REGISTRATION_STICKER)
        : [];
      const documents: any = [];
      upload_vehicleRegistrationSticker &&
        documents.push({
          ...new VehicleDocuments({
            ...(appStore.isEditing && wizardStore.item.idStickerPicture && {id: wizardStore.item.idStickerPicture}),
            ...{
              file: {
                ...(appStore.isEditing &&
                  wizardStore.item.idFileStickerPicture && {id: wizardStore.item.idFileStickerPicture}),
                publicUrl: avatar,
                data: upload_vehicleRegistrationSticker.originFileObj,
              },
            },
            type: DocumentTypeEnum.TYPE_VEHICLE_REGISTRATION_STICKER,
          }),
        });
      const input = {
        ...(upload_vehicleRegistrationSticker && {documents: [...documents, ...vehicleOthersDocuments]}),
      };
      wizardStore.setItem({...wizardStore.item, ...input});
    };

    const handleChange = (avatar: any) => {
      const keys: any = ['upload_currentInsuranceCertificatePicture'];
      const values = props.form.getFieldsValue(keys);
      const {upload_currentInsuranceCertificatePicture} = values;
      const vehicleOthersDocuments = wizardStore.item.documents
        ? wizardStore.item.documents.filter(
            val => val.type !== DocumentTypeEnum.TYPE_INSURANCE_CERTIFICATE_PICTURE_FILE,
          )
        : [];
      const documents: any = [];
      upload_currentInsuranceCertificatePicture &&
        documents.push({
          ...new VehicleDocuments({
            ...(appStore.isEditing &&
              wizardStore.item.idCertificatePicture && {id: wizardStore.item.idCertificatePicture}),
            ...{
              file: {
                ...(appStore.isEditing &&
                  wizardStore.item.idFileCertificatePicture && {id: wizardStore.item.idFileCertificatePicture}),
                publicUrl: avatar,
                data: upload_currentInsuranceCertificatePicture.originFileObj,
              },
            },
            type: DocumentTypeEnum.TYPE_INSURANCE_CERTIFICATE_PICTURE_FILE,
          }),
        });
      const input = {
        ...(upload_currentInsuranceCertificatePicture && {documents: [...documents, ...vehicleOthersDocuments]}),
      };
      wizardStore.setItem({...wizardStore.item, ...input});
    };

    const goPrevious = () => {
      const values = props.form.getFieldsValue(appStore.isEditing ? tabIndexFieldsOrderEdit : tabIndexFieldsOrder);
      const {
        currentInsuranceCertificatePicture,
        licensePlatePhoto,
        vehicleRegistrationSticker,
        upload_currentInsuranceCertificatePicture,
        upload_licensePlatePhoto,
        upload_vehicleRegistrationSticker,
        ...all
      } = values;
      const input = {
        ...all,
      };
      wizardStore.setItem({...wizardStore.item, ...input});
    };

    const onChange = e => {
      setInsuranceEffectiveDateSelectedTmp(e);
      if (!e) {
        const obj = {
          insuranceExpirationDate: {
            value: e,
          },
        };
        props.form.setFields(obj);
      }
    };

    return (
      <div className="step-three-form">
        <Form onSubmit={handleSubmit} layout="vertical" id={'step-three-form'} autoComplete={'off'}>
          <div className="steps-content">
            <Row type="flex" justify="space-between" align="top">
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Row type="flex" justify="center" align="middle">
                  <Divider>{t('labelInsurance')}</Divider>
                </Row>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <UploadImage
                  form={props.form}
                  label={t('labelCurrentInsuranceCertificatePicture')}
                  propertyName={'currentInsuranceCertificatePicture'}
                  imageUrl={
                    (wizardStore.item &&
                      wizardStore.item.documents &&
                      wizardStore.item.documents.length > 0 &&
                      wizardStore.item.documents.filter(
                        val => val.type === DocumentTypeEnum.TYPE_INSURANCE_CERTIFICATE_PICTURE_FILE,
                      ).length > 0 &&
                      wizardStore.item.documents.filter(
                        val => val.type === DocumentTypeEnum.TYPE_INSURANCE_CERTIFICATE_PICTURE_FILE,
                      )[0].file.publicUrl) ||
                    ''
                  }
                  isRequired={!appStore.isEditing}
                  formItemLayout={formItemLayoutImage}
                  handleUpdatePicture={handleChange}
                  requiredMsg={t('msgFieldRequired')}
                />
                <InputWithPatternField
                  placeholder={t('labelPlaceHolderInsurancePolicyNo')}
                  label={t('labelInsurancePolicyNo')}
                  required={true}
                  form={props.form}
                  propertyName={'insurancePolicyNo'}
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                  value={(wizardStore.item && wizardStore.item.insurancePolicyNo) || ''}
                  validatedMsg={`${t('msgValidOnlyLettersNumbersANCharacteres')} 15 ${t('msgCharactersMaximum')}`}
                  pattern={/^[0-9a-zA-Z\- ]{1,15}$/}
                />
                <InputDisabledPartDatesField
                  placeholder={t('labelPlaceHolderBirthDate')}
                  label={t('labelInsuranceEffectiveDate')}
                  required={true}
                  form={props.form}
                  value={(wizardStore.item && wizardStore.item.insuranceEffectiveDate) || ''}
                  propertyName={'insuranceEffectiveDate'}
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                  minDisableDate={moment().subtract(0, 'years')}
                  maxDisableDate={moment().subtract(1, 'years')}
                  onChange={onChange}
                  defaultPickerValue={moment()}
                />
                <InputWithPatternField
                  placeholder={t('labelPlaceHolderInsuranceRenewal')}
                  label={t('labelInsuranceRenewal')}
                  required={true}
                  form={props.form}
                  propertyName={'insuranceRenewal'}
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                  value={(wizardStore.item && wizardStore.item.insuranceRenewal) || ''}
                  validatedMsg={`${t('msgValidOnlyLettersNumbersANCharacteres')} 50 ${t('msgCharactersMaximum')}`}
                  pattern={/^[0-9a-zA-Z\- ]{1,50}$/}
                />
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                {!appStore.isEditing && (
                  <InsuranceVerificationField
                    form={props.form}
                    label={t('labelInsuranceVerification')}
                    labelFirst={t('labelInsuranceVerificationFirst')}
                    labelSecond={t('labelInsuranceVerificationSecond')}
                    propertyNameFirst="verificationDelivery"
                    valueFirst={(wizardStore.item && wizardStore.item.verificationDelivery) || false}
                    valueSecond={(wizardStore.item && wizardStore.item.verificationLicenseTime) || false}
                    propertyNameSecond="verificationLicenseTime"
                    isRequired={true}
                    requiredMsgFirst={t('msgFieldRequired')}
                    requiredMsgSecond={t('msgFieldRequired')}
                  />
                )}
                <InputWithPatternField
                  placeholder={t('labelPlaceHolderInsuranceCertificateCompany')}
                  label={t('labelInsuranceCertificateCompany')}
                  required={true}
                  form={props.form}
                  propertyName="insuranceCertificateCompany"
                  value={(wizardStore.item && wizardStore.item.insuranceCertificateCompany) || ''}
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                  validatedMsg={`${t('msgValidSiteName')} 50 ${t('msgCharactersMaximum')}`}
                  pattern={/^[0-9a-zA-Z\-' ]{1,50}$/}
                />
                <InputDisabledPartDatesField
                  placeholder={t('labelPlaceHolderBirthDate')}
                  label={t('labelInsuranceExpirationDate')}
                  required={true}
                  form={props.form}
                  value={(wizardStore.item && wizardStore.item.insuranceExpirationDate) || ''}
                  propertyName={'insuranceExpirationDate'}
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                  minDisableDate={moment(insuranceEffectiveDateSelectedTmp).add(1, 'years')}
                  maxDisableDate={moment(insuranceEffectiveDateSelectedTmp).add(1, 'days')}
                  disabled={disableField}
                  defaultPickerValue={moment()}
                />
              </Col>
            </Row>
            <Row type="flex" justify="space-between" align="top">
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Row type="flex" justify="center" align="middle">
                  <Divider>{t('labelLicense')}</Divider>
                </Row>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <UploadImage
                  form={props.form}
                  label={t('labelLicensePlatePhoto')}
                  propertyName={'licensePlatePhoto'}
                  imageUrl={
                    (wizardStore.item &&
                      wizardStore.item.licensePlatePhotoFile &&
                      wizardStore.item.licensePlatePhotoFile.publicUrl) ||
                    ''
                  }
                  isRequired={!appStore.isEditing}
                  formItemLayout={formItemLayoutImage}
                  handleUpdatePicture={handleChangeLicensePlatePhoto}
                  requiredMsg={t('msgFieldRequired')}
                />
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <InputWithPatternField
                  placeholder={t('labelPlaceholderVehicleLicensePlateNo')}
                  label={t('labelVehicleLicensePlateNo')}
                  required={true}
                  form={props.form}
                  propertyName={'licensePlateNo'}
                  value={(wizardStore.item && wizardStore.item.licensePlateNo) || ''}
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                  validatedMsg={`${t('msgValidOnlyLettersNumbersANCharacteres')} 10 ${t('msgCharactersMaximum')}`}
                  pattern={/^[0-9a-zA-Z\- ]{1,10}$/}
                />
                <InputSelectField
                  placeholder={t('labelPlaceHolderState')}
                  form={props.form}
                  label={t('labelVehicleLicensePlateStateIssued')}
                  required={true}
                  propertyName={'licensePlateStateIssuedId'}
                  formItemLayout={formItemLayout}
                  value={
                    (wizardStore.item && wizardStore.item.licensePlateStateIssuedId) ||
                    (wizardStore.item.licensePlateStateIssued && wizardStore.item.licensePlateStateIssued.id) ||
                    ''
                  }
                  requiredMsg={t('msgFieldRequired')}
                  items={states}
                  disabled={false}
                />
              </Col>
            </Row>
            <Row type="flex" justify="space-between" align="top">
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Row type="flex" justify="center" align="middle">
                  <Divider>{t('labelSticker')}</Divider>
                </Row>
                <Row type="flex" justify="start">
                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <UploadImage
                      form={props.form}
                      label={t('labelVehicleRegistrationSticker')}
                      propertyName={'vehicleRegistrationSticker'}
                      imageUrl={
                        (wizardStore.item &&
                          wizardStore.item.documents &&
                          wizardStore.item.documents.length > 0 &&
                          wizardStore.item.documents.filter(
                            val => val.type === DocumentTypeEnum.TYPE_VEHICLE_REGISTRATION_STICKER,
                          ).length > 0 &&
                          wizardStore.item.documents.filter(
                            val => val.type === DocumentTypeEnum.TYPE_VEHICLE_REGISTRATION_STICKER,
                          )[0].file.publicUrl) ||
                        ''
                      }
                      isRequired={!appStore.isEditing}
                      formItemLayout={formItemLayoutImage}
                      handleUpdatePicture={handleChangeVehicleRegistrationSticker}
                      requiredMsg={t('msgFieldRequired')}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
          <Row style={{textAlign: 'left'}}>
            <Col>
              <div className="step-three-form__steps-action">
                {wizardStore.current === wizardStore.steps.length - 1 && (
                  <Button type="primary" style={{marginRight: 5}} htmlType="submit">
                    {t('labelDone')}
                  </Button>
                )}
                {wizardStore.current < wizardStore.steps.length - 1 && (
                  <Button type="primary" style={{marginRight: 5}} htmlType="submit">
                    {t('labelNext')}
                  </Button>
                )}
                {wizardStore.current > 0 && (
                  <Button
                    style={{marginRight: 5}}
                    onClick={() => {
                      goPrevious();
                      wizardStore.wizardPrev();
                    }}
                  >
                    {t('labelPrevious')}
                  </Button>
                )}
                {/* <RiftLink to={`/admin/vehicleinsurance`}> */}
                <Button
                  onClick={() => {
                    window.history.back();
                    wizardStore.setWizardStep(0);
                    wizardStore.setItem({...new Vehicle()});
                  }}
                >
                  {t('labelCancel')}
                </Button>
                {/* </RiftLink> */}
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    );
  },
);

export default Form.create()(StepThreeForm);
