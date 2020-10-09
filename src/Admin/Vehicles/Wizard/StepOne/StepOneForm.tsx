import React, {useContext, useEffect, useState} from 'react';
import {Col, Button, Divider, Form, Row, Select} from 'antd';
import {useTranslation} from 'react-i18next';
import {useRouter, RiftLink} from 'rift-router';
import {observer} from 'mobx-react-lite';
import {FormComponentProps} from 'antd/lib/form';

import AppStore from '../../../../shared/stores/App.store';
import VehicleStore from '../../../../shared/stores/Vehicle.store';
import './StepOneForm.less';
import WizardStore from '../../../../shared/stores/Wizard.store';
import InputNumberField from '../../../../shared/components/Inputs/InputNumberField';
import InputWithPatternField from '../../../../shared/components/Inputs/InputWithPatternField';
import SelectFieldVehiclesType from '../../../../shared/components/Inputs/SelectFieldVehiclesType';
import vehicleTypeModel from '../../../../shared/models/VehicleTypes.model';
import NumberLxWxH from '../../../../shared/components/Inputs/NumberLxWxH';
import vehicleModel from '../../../../shared/models/Vehicle.model';
import {Vehicle} from '../../../../shared/cs/vehicle.cs';
import {MeasureLength} from '../../../../shared/cs/measureLength.cs';
import {UnitLengthEnum} from '../../../../shared/enums/UnitLength.enum';
import {MeasureMass} from '../../../../shared/cs/measureMass.cs';
import {UnitMassEnum} from '../../../../shared/enums/UnitMass.enum';
import {DocumentTypeEnum} from '../../../../shared/enums/DocumentType.enum';

type StepOneFormProps = FormComponentProps;

export const StepOneForm = observer(
  (props: StepOneFormProps): JSX.Element => {
    const appStore = useContext(AppStore);
    const vehicleStore = useContext(VehicleStore);
    const wizardStore = useContext(WizardStore);
    const {t} = useTranslation('app');
    const [vehiclesType, setVehiclesType] = useState([]);
    const [vehiclesTypeDraw, setVehiclesTypeDraw] = useState([]);
    const router = useRouter();
    const [selectedType, setSelectedType]: any = useState([]);
    const msgValidRangePayloadDimensions: string = t('msgValidRangePayloadDimensions');

    useEffect(() => {
      getData();
    }, []);

    useEffect(() => {
      vehicleStore.isErrorStepOne && showErrorVinField(wizardStore.item.vin, true);
      vehicleStore.setIsErrorStepOne(false);
      return () => {
        vehicleStore.setIsErrorStepOne(false);
      };
    }, [vehicleStore.isErrorStepOne]);

    useEffect(() => {
      wizardStore.item &&
        (wizardStore.item.vehicleTypeId || (wizardStore.item.vehicleType && wizardStore.item.vehicleType.id)) &&
        vehiclesType.length > 0 &&
        onSelect(wizardStore.item.vehicleTypeId || (wizardStore.item.vehicleType && wizardStore.item.vehicleType.id));
    }, [vehiclesType, wizardStore.item.vehicleType]);

    const getData = async () => {
      try {
        appStore.setIsLoading(true);
        const typeList: any = await vehicleTypeModel.getTypes({
          page: 1,
          pageSize: 1000,
        });
        const mappedTypes = typeList.data.VehicleTypeList.items.map(st => {
          const {measureMinDimension, measureMaxDimension, measureMinPayload, measureMaxPayload} = st;
          return {
            id: st.id,
            name: st.type,
            dimensions:
              `${parseFloat(measureMinDimension.amount).toFixed(2)} - ${parseFloat(measureMaxDimension.amount).toFixed(
                2,
              )} cu ft` || '',
            payload:
              `${parseFloat(measureMinPayload.amount).toFixed(2)} - ${parseFloat(measureMaxPayload.amount).toFixed(
                2,
              )} lb` || '',
            minDimension: measureMinDimension.amount.toFixed(2),
            maxDimension: measureMaxDimension.amount.toFixed(2),
            minPayload: measureMinPayload.amount.toFixed(2),
            maxPayload: measureMaxPayload.amount.toFixed(2),
          };
        });
        setVehiclesType(mappedTypes);
        const draw = drawVehiclesTypeItems(mappedTypes);
        setVehiclesTypeDraw(draw);
        const params: any = router;
        if (!appStore.isEditing) {
          if (params && params.search && params.search.from) {
            vehicleStore.setFromCompany(params.search.from);
            vehicleStore.setFromFleetOwner(true);
          } else {
            const companyId = appStore.companies.find(e => e.typeSuperAdmin).typeSuperAdmin.companyId;
            vehicleStore.setFromCompany(companyId ? companyId : '');
            vehicleStore.setFromFleetOwner(false);
          }
        }
        if (params && params.params && params.params.vehicleId) {
          const input = {
            id: params.params.vehicleId,
          };
          const itemToEdit: any = await vehicleModel.getVehicle(input);
          wizardStore.setItem({...new Vehicle(itemToEdit.data.VehicleGet)});
          const vehiclePhoto = wizardStore.item.documents.filter(
            val => val.type === DocumentTypeEnum.TYPE_VEHICLE_PHOTO && !val.file.data,
          );
          const certificatePicture = wizardStore.item.documents.filter(
            val => val.type === DocumentTypeEnum.TYPE_INSURANCE_CERTIFICATE_PICTURE_FILE && !val.file.data,
          );
          const stickerPicture = wizardStore.item.documents.filter(
            val => val.type === DocumentTypeEnum.TYPE_VEHICLE_REGISTRATION_STICKER && !val.file.data,
          );
          const inputAdded = {
            idLicensePlatePhotoFile: wizardStore.item.licensePlatePhotoFile.id,
            idVehiclePhoto: vehiclePhoto[0].id,
            idFileVehiclePhoto: vehiclePhoto[0].file.id,
            idCertificatePicture: certificatePicture[0].id,
            idFileCertificatePicture: certificatePicture[0].file.id,
            idStickerPicture: stickerPicture[0].id,
            idFileStickerPicture: stickerPicture[0].file.id,
          };
          wizardStore.setItem({...wizardStore.item, ...inputAdded});
        } else {
          JSON.stringify(wizardStore.item) === JSON.stringify({}) && wizardStore.setItem({...new Vehicle()});
        }
        appStore.setIsLoading(false);
      } catch (e) {
        appStore.setIsLoading(false);
      }
    };

    const onInputChange = (e: any) => {
      const val = e;
      const length = val ? val.length : 0;
      const expR = /^[0-9a-zA-Z]{17}/;
      if (length === 17 && String(val).match(expR)) {
        setTimeout(() => {
          vehicleDetailsVinGet(val);
        }, 400);
      } else {
        const input = {
          measurePayload: {...new MeasureMass({amount: 0})},
          measureLoadingSpace: {...new MeasureMass({amount: 0})},
          make: '',
          model: '',
          year: undefined,
        };
        wizardStore.setItem({...wizardStore.item, ...input});
        wizardStore.setDisableFields(false);
      }
    };

    const resetFields = () => {
      const input = {
        measurePayload: {...new MeasureMass({amount: 0})},
        measureLoadingSpace: {...new MeasureMass({amount: 0})},
        make: '',
        model: '',
        year: undefined,
      };
      wizardStore.setItem({...wizardStore.item, ...input});
      props.form.resetFields(['long', 'width', 'height', 'payload', 'loadingSpace', 'floorSpace', 'vehicleTypeId']);
    };

    const showErrorVinField = (vinParam: string, resetField: boolean = false) => {
      const obj = {
        vin: {
          value: vinParam,
          errors: [new Error(`${t('msgValidVinDuplicate')}`)],
        },
      };
      props.form.setFields(obj);
      !resetField && resetFields();
      !resetField && wizardStore.setDisableFields(false);
    };

    const vehicleDetailsVinGet = async (vinParam: string) => {
      try {
        appStore.setIsLoading(true);
        resetFields();
        const itemToGet: any = await vehicleModel.getVehicleDetailsVinGet(vinParam);
        const {vehicleId} = itemToGet.data.VehicleDetailsVinGet;
        if (itemToGet && itemToGet.data && itemToGet.data.VehicleDetailsVinGet && vehicleId) {
          if (!appStore.isEditing) {
            showErrorVinField(vinParam);
          } else {
            const {vin, id} = wizardStore.item;
            if (vin !== vinParam && vehicleId !== id) {
              showErrorVinField(vinParam);
            } else {
              const {__typename, ...rest} = itemToGet.data.VehicleDetailsVinGet;
              const objDataOne = {
                dataOne: rest,
              };
              wizardStore.setItem({...wizardStore.item, ...objDataOne});
              wizardStore.setItem({...wizardStore.item, ...rest});
              wizardStore.setDisableFields(true);
            }
          }
        } else if (itemToGet && itemToGet.data && itemToGet.data.VehicleDetailsVinGet && !vehicleId) {
          const {__typename, ...rest} = itemToGet.data.VehicleDetailsVinGet;
          const objDataOne = {
            dataOne: rest,
          };
          wizardStore.setItem({...wizardStore.item, ...objDataOne});
          wizardStore.setItem({...wizardStore.item, ...rest});
          wizardStore.setDisableFields(true);
        }
        appStore.setIsLoading(false);
      } catch (e) {
        appStore.setIsLoading(false);
      }
    };

    const handleSubmit = e => {
      e.preventDefault();
      let errorVin = false;
      props.form.validateFieldsAndScroll(async (err, values) => {
        appStore.setIsLoading(true);
        const {vin, id} = wizardStore.item;
        const existVin: any = await vehicleModel.getVehicleDetailsVinGet(values.vin);
        if (!appStore.isEditing) {
          if (
            existVin &&
            existVin.data &&
            existVin.data.VehicleDetailsVinGet &&
            existVin.data.VehicleDetailsVinGet.vehicleId &&
            existVin.data.VehicleDetailsVinGet.vehicleId !== null
          ) {
            showErrorVinField(values.vin, true);
            errorVin = true;
          }
        } else {
          if (
            vin !== values.vin &&
            existVin.data.VehicleDetailsVinGet.vehicleId !== id &&
            existVin.data.VehicleDetailsVinGet.vehicleId !== null
          ) {
            showErrorVinField(values.vin, true);
            errorVin = true;
          }
        }
        appStore.setIsLoading(false);
        if (!err && !errorVin) {
          const {floorSpace, height, interiorDimenssions, loadingSpace, long, payload, width, ...rest} = values;
          if (
            parseFloat(payload) < parseFloat(selectedType.minPayload) ||
            parseFloat(payload) > parseFloat(selectedType.maxPayload) ||
            parseFloat(loadingSpace) < parseFloat(selectedType.minDimension) ||
            parseFloat(loadingSpace) > parseFloat(selectedType.maxDimension)
          ) {
            const obj = {
              vehicleTypeId: {
                value: selectedType.id,
                errors: [new Error(`${msgValidRangePayloadDimensions}`)],
              },
            };
            props.form.setFields(obj);
          } else {
            const input = {
              measureLong: {...new MeasureLength({amount: long, unit: UnitLengthEnum.inches})},
              measureWidth: {...new MeasureLength({amount: width, unit: UnitLengthEnum.inches})},
              measureHeight: {...new MeasureLength({amount: height, unit: UnitLengthEnum.inches})},
              measurePayload: {...new MeasureMass({amount: payload, unit: UnitMassEnum.pounds})},
              measureFloorSpace: {...new MeasureLength({amount: floorSpace})},
              measureLoadingSpace: {...new MeasureLength({amount: loadingSpace})},
              ...rest,
            };
            wizardStore.setItem({...wizardStore.item, ...input});
            wizardStore.wizardNext();
          }
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
    const formItemLayoutLWH = {
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 24},
      },
    };
    const onChange = e => {
      const loadingSpace =
        props.form.getFieldValue('long') && props.form.getFieldValue('width') && props.form.getFieldValue('height')
          ? parseFloat(
              (
                Math.round(
                  ((parseFloat(props.form.getFieldValue('long')) *
                    parseFloat(props.form.getFieldValue('width')) *
                    parseFloat(props.form.getFieldValue('height'))) /
                    1728) *
                    100,
                ) / 100
              ).toString(),
            ).toFixed(2)
          : (wizardStore.item.measureLoadingSpace && wizardStore.item.measureLoadingSpace.amount) || 0;
      const floorSpace =
        props.form.getFieldValue('long') && props.form.getFieldValue('width')
          ? parseFloat(
              (
                Math.round(
                  parseFloat(props.form.getFieldValue('long')) *
                    parseFloat(props.form.getFieldValue('width')) *
                    0.006944 *
                    100,
                ) / 100
              ).toString(),
            ).toFixed(2)
          : 0;
      props.form.setFieldsValue({loadingSpace});
      props.form.setFieldsValue({floorSpace});
    };
    const Option = Select.Option;

    const drawItems = () => {
      return vehiclesTypeDraw;
    };

    const drawVehiclesTypeItems = list => {
      return list.map((item: any) => (
        <Option value={item.id} key={item.id}>
          <strong>{item.name}</strong>
          <br />
          <span style={{marginLeft: '5px'}}>{item.payload}</span>
          <br />
          <span style={{marginLeft: '5px'}}>{item.dimensions}</span>
        </Option>
      ));
    };

    const onSelect = e => {
      const [type] = vehiclesType.filter((val: any) => val.id === e);
      setSelectedType(type);
      const draw = drawVehiclesTypeItems(vehiclesType);
      setVehiclesTypeDraw(draw);
    };

    const onSearch = e => {
      const vehiclesTypeFilter: any = vehiclesType.filter(
        (val: any) => val.name.toLowerCase().indexOf(e.toLowerCase()) >= 0,
      );
      const draw = drawVehiclesTypeItems(vehiclesTypeFilter);
      setVehiclesTypeDraw(draw);
    };

    return (
      <div className="step-one-form">
        <Form onSubmit={handleSubmit} layout="vertical" id={'step-one-form'} autoComplete={'off'}>
          <div className="steps-content">
            <Row type="flex" justify="space-between" align="top">
              <Col xs={24} sm={12} md={24} lg={12} xl={12}>
                <InputWithPatternField
                  placeholder={t('labelPlaceholderVehicleVin')}
                  label={t('labelVehicleVIN')}
                  required={true}
                  form={props.form}
                  propertyName="vin"
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                  value={wizardStore.item.vin}
                  validatedMsg={`${t('msgValidVin')}`}
                  pattern={/^[0-9a-zA-Z]{17}/}
                  validateLength={17}
                  upperCase={true}
                  onChange={e => onInputChange(e.target.value)}
                />
              </Col>
              <Col xs={24} sm={12} md={24} lg={12} xl={12}>
                <SelectFieldVehiclesType
                  placeholder={t('labelPlaceHolderVehicleType')}
                  form={props.form}
                  label={t('labelVehicleType')}
                  required={true}
                  value={
                    wizardStore.item.vehicleTypeId ||
                    (wizardStore.item.vehicleType && wizardStore.item.vehicleType.id) ||
                    ''
                  }
                  propertyName={'vehicleTypeId'}
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                  items={vehiclesType}
                  drawItemsParent={drawItems}
                  onSelect={onSelect}
                  onSearch={onSearch}
                />
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Divider>{t('labelVehicleCapacity')}</Divider>
            </Row>
            <Row type="flex" justify="space-between" align="top">
              <Col xs={24} sm={12} md={24} lg={12} xl={12}>
                <NumberLxWxH
                  isRequired={true}
                  label={t('labelInteriorDimensions')}
                  form={props.form}
                  propertyName="interiorDimenssions"
                  propertyNameL="long"
                  propertyNameW="width"
                  propertyNameH="height"
                  valueL={
                    (wizardStore.item &&
                      wizardStore.item.measureLong &&
                      wizardStore.item.measureLong.amount &&
                      !isNaN(wizardStore.item.measureLong.amount) &&
                      parseFloat(wizardStore.item.measureLong.amount).toFixed(2)) ||
                    ''
                  }
                  valueW={
                    (wizardStore.item &&
                      wizardStore.item.measureWidth &&
                      wizardStore.item.measureWidth.amount &&
                      !isNaN(wizardStore.item.measureWidth.amount) &&
                      parseFloat(wizardStore.item.measureWidth.amount).toFixed(2)) ||
                    ''
                  }
                  valueH={
                    (wizardStore.item &&
                      wizardStore.item.measureHeight &&
                      wizardStore.item.measureHeight.amount &&
                      !isNaN(wizardStore.item.measureHeight.amount) &&
                      parseFloat(wizardStore.item.measureHeight.amount).toFixed(2)) ||
                    ''
                  }
                  validateLength={5}
                  formItemLayout={formItemLayout}
                  formItemLayoutLWH={formItemLayoutLWH}
                  onChangeField={onChange}
                />
                <InputNumberField
                  placeholder={t('labelPlaceHolderFloorSpace')}
                  label={t('labelFloorSpace')}
                  required={true}
                  form={props.form}
                  propertyName="floorSpace"
                  validateLength={5}
                  value={
                    (wizardStore.item &&
                      wizardStore.item.measureFloorSpace &&
                      wizardStore.item.measureFloorSpace.amount &&
                      !isNaN(wizardStore.item.measureFloorSpace.amount) &&
                      parseFloat(wizardStore.item.measureFloorSpace.amount).toFixed(2)) ||
                    ''
                  }
                  maxlength={5}
                  disabled={true}
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                />
              </Col>
              <Col xs={24} sm={12} md={24} lg={12} xl={12}>
                <InputNumberField
                  placeholder={t('labelPlaceHolderPayload')}
                  label={t('labelPayload')}
                  required={true}
                  decimalNumber={true}
                  form={props.form}
                  value={
                    (wizardStore.item &&
                      wizardStore.item.measurePayload &&
                      wizardStore.item.measurePayload.amount &&
                      !isNaN(wizardStore.item.measurePayload.amount) &&
                      parseFloat(wizardStore.item.measurePayload.amount).toFixed(2)) ||
                    0
                  }
                  propertyName="payload"
                  validateLength={10}
                  disabled={
                    wizardStore.disableFields &&
                    wizardStore.item &&
                    wizardStore.item.dataOne &&
                    wizardStore.item.dataOne.measurePayload &&
                    wizardStore.item.measurePayload &&
                    wizardStore.item.measurePayload.amount !== 0 &&
                    wizardStore.item.measurePayload.amount === wizardStore.item.dataOne.measurePayload.amount
                  }
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                />
                <InputNumberField
                  placeholder={t('labelPlaceHolderLoadingSpace')}
                  label={t('labelLoadingSpace')}
                  required={true}
                  form={props.form}
                  propertyName="loadingSpace"
                  validateLength={5}
                  value={
                    (wizardStore.item &&
                      wizardStore.item.measureLoadingSpace &&
                      wizardStore.item.measureLoadingSpace.amount &&
                      !isNaN(wizardStore.item.measureLoadingSpace.amount) &&
                      parseFloat(wizardStore.item.measureLoadingSpace.amount).toFixed(2)) ||
                    ''
                  }
                  maxlength={5}
                  disabled={true}
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                />
              </Col>
            </Row>
          </div>
          <Row style={{textAlign: 'left'}}>
            <Col>
              <div className="step-one-form__steps-action">
                {wizardStore.current === wizardStore.steps.length - 1 && (
                  <Button type="primary" htmlType="submit" style={{marginRight: 5}}>
                    {t('labelDone')}
                  </Button>
                )}
                {wizardStore.current < wizardStore.steps.length - 1 && (
                  <Button type="primary" htmlType="submit" style={{marginRight: 5}}>
                    {t('labelNext')}
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

export default Form.create()(StepOneForm);
