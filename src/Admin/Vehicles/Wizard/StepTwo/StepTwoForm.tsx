import React, {useContext, useEffect, useState} from 'react';
import {Col, Button, Divider, Form, Row} from 'antd';
import {useTranslation} from 'react-i18next';
import {FormComponentProps} from 'antd/lib/form';
import moment from 'moment';

import './StepTwoForm.less';
import AppStore from '../../../../shared/stores/App.store';
import WizardStore from '../../../../shared/stores/Wizard.store';
import InputNumberField from '../../../../shared/components/Inputs/InputNumberField';
import InputTextField from '../../../../shared/components/Inputs/InputTextField';
import SwitchField from '../../../../shared/components/Inputs/SwitchField';
import UploadImage from '../../../../shared/components/UploadImage/UploadImage';
import {observer} from 'mobx-react-lite';
import InputWithPatternField from '../../../../shared/components/Inputs/InputWithPatternField';
import {VehicleDocuments} from '../../../../shared/cs/vehicleDocuments.cs';
import {DocumentTypeEnum} from '../../../../shared/enums/DocumentType.enum';
import {Vehicle} from '../../../../shared/cs/vehicle.cs';

type StepTwoFormProps = FormComponentProps;

export const StepTwoForm = observer(
  (props: StepTwoFormProps): JSX.Element => {
    const appStore = useContext(AppStore);
    const wizardStore = useContext(WizardStore);
    const {t} = useTranslation('app');
    const [kitInstalled, setKitInstalled] = useState(false);

    const tabIndexFieldsOrder: any = [
      'make',
      'year',
      'model',
      'color',
      'trim',
      'transmission',
      'towingKitInstalled',
      'vehiclePhoto',
    ];

    useEffect(() => {
      // tabIndex order for the fields
      tabIndexFieldsOrder.forEach((field: any, index: any) => {
        (document as any).getElementById(field).tabIndex = index + 1;
      });
      // get data for the form
      getImage();
    }, []);
    const getImage = () => {
      const vehiclePhoto = wizardStore.item.documents
        ? wizardStore.item.documents.filter(val => val.type === DocumentTypeEnum.TYPE_VEHICLE_PHOTO)
        : [];
      if (vehiclePhoto[0] && vehiclePhoto[0].file.data) {
        props.form.setFieldsValue({upload_vehiclePhoto: [vehiclePhoto[0].file.data]});
      }
    };
    useEffect(() => {
      wizardStore.item && wizardStore.item.towingKitInstalled && onChange(wizardStore.item.towingKitInstalled);
    }, [wizardStore.item.towingKitInstalled]);

    const handleSubmit = e => {
      e.preventDefault();
      props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const {upload_vehiclePhoto, vehiclePhoto, towingKitInstalled, ...rest} = values;
          const input = {
            towingKitInstalled: towingKitInstalled ? true : false,
            ...rest,
          };
          wizardStore.setItem({...wizardStore.item, ...input});
          wizardStore.wizardNext();
        } else {
          const error = t('errorMsgAuthAdmin');
          appStore.setHasError(true);
          appStore.setErrorMsg(error);
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
    const handleChange = (avatar: any) => {
      const keys: any = ['upload_vehiclePhoto'];
      const values = props.form.getFieldsValue(keys);
      const {upload_vehiclePhoto} = values;
      const vehicleOthersDocuments = wizardStore.item.documents
        ? wizardStore.item.documents.filter(val => val.type !== DocumentTypeEnum.TYPE_VEHICLE_PHOTO)
        : [];
      const documents: any = [];
      upload_vehiclePhoto &&
        documents.push({
          ...new VehicleDocuments({
            ...{
              file: {
                ...(appStore.isEditing &&
                  wizardStore.item.idFileVehiclePhoto && {id: wizardStore.item.idFileVehiclePhoto}),
                publicUrl: avatar,
                data: upload_vehiclePhoto.originFileObj,
              },
            },
            ...(appStore.isEditing && wizardStore.item.idVehiclePhoto && {id: wizardStore.item.idVehiclePhoto}),
            type: DocumentTypeEnum.TYPE_VEHICLE_PHOTO,
          }),
        });
      const input = {
        ...(upload_vehiclePhoto && {documents: [...documents, ...vehicleOthersDocuments]}),
      };
      wizardStore.setItem({...wizardStore.item, ...input});
      // console.log(`Item :${JSON.stringify(wizardStore.item)}`);
    };

    const compareYear = (rule, val, callback, msgMatch) => {
      setTimeout(() => {
        if (val !== '' && val !== undefined && val !== null) {
          const expR = /^\d+$/;
          if (val !== '' && val !== undefined && val !== null && !String(val).match(expR)) {
            callback([new Error(`${t('msgValidYear')}`)]);
          } else {
            const yearActual = moment().year();
            if (yearActual - 30 > parseInt(val, 10) || parseInt(val, 10) > yearActual) {
              callback([new Error(`${t('msgValidYear')}`)]);
            } else {
              callback();
            }
          }
        }
        callback();
      }, 300);
    };
    const goPrevious = () => {
      const keys: any = ['make', 'year', 'model', 'color', 'trim', 'transmission', 'towingKitInstalled'];
      const values = props.form.getFieldsValue(keys);
      wizardStore.setItem({...wizardStore.item, ...values});
      // console.log(`Item :${JSON.stringify(wizardStore.item)}`);
    };
    const onChange = (e: any) => {
      setKitInstalled(e);
    };

    return (
      <div className="step-two-form">
        <Form onSubmit={handleSubmit} layout="vertical" id={'step-two-form'} autoComplete={'off'}>
          <div className="steps-content">
            <Row type="flex" justify="space-between" align="top">
              <Col xs={24} sm={12} md={24} lg={12} xl={12}>
                <InputWithPatternField
                  placeholder={t('labelPlaceHolderVehicleMake')}
                  label={t('labelVehicleMake')}
                  required={true}
                  form={props.form}
                  propertyName={'make'}
                  value={(wizardStore.item && wizardStore.item.make) || ''}
                  formItemLayout={formItemLayout}
                  disabled={
                    wizardStore.disableFields &&
                    wizardStore.item &&
                    wizardStore.item.dataOne &&
                    wizardStore.item.dataOne.make &&
                    wizardStore.item.make &&
                    wizardStore.item.make !== '' &&
                    wizardStore.item.make !== wizardStore.item.dataOne.make
                  }
                  requiredMsg={t('msgFieldRequired')}
                  validatedMsg={`${t('msgValidOnlyLettersCharacteres')} 50 ${t('msgCharactersMaximum')}`}
                  pattern={/^[a-zA-Z\- ]{1,50}$/}
                />
                <InputWithPatternField
                  placeholder={t('labelPlaceHolderVehicleModel')}
                  label={t('labelVehicleModel')}
                  required={true}
                  form={props.form}
                  propertyName={'model'}
                  disabled={
                    wizardStore.disableFields &&
                    wizardStore.item &&
                    wizardStore.item.dataOne &&
                    wizardStore.item.dataOne.model &&
                    wizardStore.item.model &&
                    wizardStore.item.model !== '' &&
                    wizardStore.item.model === wizardStore.item.dataOne.model
                  }
                  value={(wizardStore.item && wizardStore.item.model) || ''}
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                  validatedMsg={`${t('msgValidOnlyLettersNumbersANCharacteres')} 50 ${t('msgCharactersMaximum')}`}
                  pattern={/^[0-9a-zA-Z\- ]{1,50}$/}
                />
                <InputWithPatternField
                  placeholder={t('labelPlaceHolderVehicleTrim')}
                  label={t('labelVehicleTrim')}
                  required={true}
                  form={props.form}
                  propertyName={'trim'}
                  value={(wizardStore.item && wizardStore.item.trim) || ''}
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                  validatedMsg={`${t('msgValidSiteName')} 250 ${t('msgCharactersMaximum')}`}
                  pattern={/^[0-9a-zA-Z\-' ]{1,250}$/}
                />
              </Col>
              <Col xs={24} sm={12} md={24} lg={12} xl={12}>
                <InputNumberField
                  placeholder={t('labelPlaceHolderVehicleYear')}
                  label={t('labelVehicleYear')}
                  required={true}
                  form={props.form}
                  value={(wizardStore.item && wizardStore.item.year) || ''}
                  propertyName="year"
                  disabled={
                    wizardStore.disableFields &&
                    wizardStore.item &&
                    wizardStore.item.dataOne &&
                    wizardStore.item.dataOne.year &&
                    wizardStore.item.year &&
                    wizardStore.item.year === wizardStore.item.dataOne.year
                  }
                  validateLength={4}
                  maxlength={4}
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                  onValidate={compareYear}
                />
                <InputWithPatternField
                  placeholder={t('labelPlaceHolderVehicleColor')}
                  label={t('labelVehicleColor')}
                  required={true}
                  form={props.form}
                  propertyName="color"
                  validateLength={10}
                  value={(wizardStore.item && wizardStore.item.color) || ''}
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                  validatedMsg={`${t('labelOnlyLetters')} 10 ${t('msgCharactersMaximum')}`}
                  pattern={/^[a-zA-Z]{1,10}$/}
                />
                <InputWithPatternField
                  placeholder={t('labelPlaceHolderVehicleTransmission')}
                  label={t('labelVehicleTransmission')}
                  required={true}
                  form={props.form}
                  propertyName="transmission"
                  value={(wizardStore.item && wizardStore.item.transmission) || ''}
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                  validatedMsg={`${t('msgValidOnlyLettersCharacteres')} 50 ${t('msgCharactersMaximum')}`}
                  pattern={/^[a-zA-Z\- ]{1,50}$/}
                />
              </Col>
            </Row>
            <Row type="flex" justify="center"></Row>
            <Divider />
            <Row type="flex" justify="space-between" align="top">
              <Col xs={24} sm={12} md={24} lg={12} xl={12}>
                <SwitchField
                  label={t('labelTowingKitInstalled')}
                  form={props.form}
                  propertyName="towingKitInstalled"
                  requiredMsg={t('msgFieldRequired')}
                  value={kitInstalled}
                  onChange={onChange}
                />
              </Col>
              <Col xs={24} sm={12} md={24} lg={12} xl={12}>
                <UploadImage
                  form={props.form}
                  label={t('labelVehiclePhoto')}
                  propertyName="vehiclePhoto"
                  isRequired={!appStore.isEditing}
                  imageUrl={
                    (wizardStore.item &&
                      wizardStore.item.documents &&
                      wizardStore.item.documents.length > 0 &&
                      wizardStore.item.documents.filter(val => val.type === DocumentTypeEnum.TYPE_VEHICLE_PHOTO)
                        .length > 0 &&
                      wizardStore.item.documents.filter(val => val.type === DocumentTypeEnum.TYPE_VEHICLE_PHOTO)[0].file
                        .publicUrl) ||
                    ''
                  }
                  formItemLayout={formItemLayoutImage}
                  handleUpdatePicture={handleChange}
                  requiredMsg={t('msgFieldRequired')}
                />
              </Col>
            </Row>
          </div>
          <Row style={{textAlign: 'left'}}>
            <Col>
              <div className="step-two-form__steps-action">
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

export default Form.create()(StepTwoForm);
