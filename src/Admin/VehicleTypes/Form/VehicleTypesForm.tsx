import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Col, Divider, Form, Row} from 'antd';
import {useTranslation} from 'react-i18next';
import {useMutation} from 'react-apollo-hooks';
import {useRouter} from 'rift-router';
import gql from 'graphql-tag';
import {FormComponentProps} from 'antd/lib/form';

import AppStore from '../../../shared/stores/App.store';
import vehicleTypesModel from '../../../shared/models/VehicleTypes.model';
import appModel from '../../../shared/models/App.model';
import {VehicleType} from '../../../shared/cs/vehicleType.cs';

import HeadTitle from '../../../shared/components/HeadTitle/HeadTitle';

import './VehicleTypesForm.less';

import InputWithPatternField from '../../../shared/components/Inputs/InputWithPatternField';
import UploadImage from '../../../shared/components/UploadImage/UploadImage';
import InputNumberMinMaxField from '../../../shared/components/Inputs/InputNumberMinMax';

import openNotificationWithIcon from '../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';

type LoginFormProps = FormComponentProps;

const ADD_MUTATION = gql`
  mutation($input: VehicleTypeCreateInput!) {
    VehicleTypeCreate(input: $input) {
      id
    }
  }
`;

const EDIT_MUTATION = gql`
  mutation($id: EncryptId!, $input: VehicleTypeUpdateInput!) {
    VehicleTypeUpdate(id: $id, input: $input) {
      id
    }
  }
`;

export const VehicleTypesForm = (props: LoginFormProps): JSX.Element => {
  const appStore = useContext(AppStore);
  const {t} = useTranslation('app');
  const [item, setItem] = useState(new VehicleType());
  const [formTitle, setFormTitle] = useState(t('labelAddVehicleType'));
  const [buttonTitle, setButtonTitle] = useState(t('labelAdd'));
  const router = useRouter();

  const tabIndexFieldsOrder: any = [
    'type',
    'measureMinDimension',
    'measureMaxDimension',
    'measureMinPayload',
    'measureMaxPayload',
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

  // useEffect(() => {
  //   return () => {
  //     appStore.setIsEditing(false);
  //   };
  // });

  const getData = async () => {
    try {
      appStore.setIsLoading(true);
      const params: any = router;
      if (params && params.params && params.params.id) {
        appStore.setIsEditing(true);
        setFormTitle(t('labelEditVehicleType'));
        setButtonTitle(t('labelUpdate'));
        const input = {
          id: params.params.id,
        };
        const itemToEdit: any = await vehicleTypesModel.get(input);
        setItem({...new VehicleType(itemToEdit.data.VehicleTypeGet)});
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
        const {errors, data} = result;
        if (!errors) {
          appStore.setUserAction({
            ...appStore.userAction,
            ...{isSaved: true, action: appStore.isEditing ? 'updated' : 'created'},
          });
          appStore.setIsLoading(false);
          appStore.setIsEditing(false);
          router.to('/admin/vehicletype');
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
    appStore.setIsLoading(true);
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {
          upload_avatar,
          avatar,
          range,
          payload,
          measureMaxDimension,
          measureMaxPayload,
          measureMinDimension,
          measureMinPayload,
          type,
        } = values;
        const data = {
          type,
          measureMinDimension: {
            amount: measureMinDimension,
            unit: 'cubicFeet',
          },
          measureMaxDimension: {
            amount: measureMaxDimension,
            unit: 'cubicFeet',
          },
          measureMaxPayload: {
            amount: measureMaxPayload,
            unit: 'pounds',
          },
          measureMinPayload: {
            amount: measureMinPayload,
            unit: 'pounds',
          },
          ...(upload_avatar && {
            image: {
              data: upload_avatar.originFileObj,
            },
          }),
        };

        appStore.setUserAction({...appStore.userAction, ...{typeOfElem: 'labelVehicleType'}});

        addMutation({variables: {input: {...data}, ...(appStore.isEditing && {id: item.id})}}).catch(error => {
          handleCatch(error, values, t('labelFleetOwner'));
        });
      } else {
        appStore.setHasError(true);
        appStore.setIsLoading(false);
      }
    });
  };

  const onCancelForm = () => {
    appStore.setIsEditing(false);
    router.to('/admin/vehicletype');
  };

  const formItemLayout = {
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 15},
      md: {span: 12},
      lg: {span: 16},
      xl: {span: 16},
    },
  };

  const formUploadLayout = {
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 15},
      md: {span: 12},
      lg: {span: 15},
      xl: {span: 16},
    },
  };

  const formItemLayoutMinMax = {
    labelCol: {
      xs: {span: 24},
      sm: {span: 5},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 24},
    },
  };

  const labelEmail: string = t('labelEmail');
  const handleChange = (avatar: any) => {
    // setItem({item, ...avatar});
  };

  return (
    <div className="vehicle-types-form">
      <Form onSubmit={handleSubmit} layout="vertical" id={'vehicle-types-form'} autoComplete={'off'}>
        <Card bordered={false} className="gutter-row">
          <Row type="flex" justify="space-between" align="middle">
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <HeadTitle icon="car" title={formTitle} />
              <Divider />
            </Col>
          </Row>
          <Row type="flex" justify="space-between" align="top">
            <Col xs={24} sm={12} md={24} lg={10} xl={9}>
              <UploadImage
                form={props.form}
                label={t('labelVehicleTypeImage')}
                imageUrl={item.image.publicUrl}
                propertyName="avatar"
                isRequired={true}
                formItemLayout={formUploadLayout}
                handleUpdatePicture={handleChange}
                requiredMsg={t('msgFieldRequired')}
              />
            </Col>
          </Row>
          <Divider style={{marginBottom: '53px'}} />
          <Row type="flex" justify="space-between" align="middle">
            <Col xs={24} sm={24} md={16} lg={14} xl={11}>
              <InputWithPatternField
                placeholder={t('labelPlaceholderVehicleType')}
                label={t('labelVehicleType')}
                required={true}
                form={props.form}
                propertyName="type"
                formItemLayout={formItemLayout}
                requiredMsg={t('msgFieldRequired')}
                value={item.type}
                validatedMsg={`${t('msgValidVehicleType')}`}
                pattern={/^[0-9a-zA-Z ]+$/}
                validateLength={50}
                // ref={focusInput}
                // focus={true}
              />
              <InputNumberMinMaxField
                isRequired={true}
                label={t('labelDimensionsRange')}
                form={props.form}
                propertyName="range"
                propertyNameMin="measureMinDimension"
                propertyNameMax="measureMaxDimension"
                valueMin={item.measureMinDimension ? parseFloat(item.measureMinDimension).toFixed(2) : ''}
                disableMin={false}
                valueMax={item.measureMaxDimension ? parseFloat(item.measureMaxDimension).toFixed(2) : ''}
                validateLength={50}
                decimalNumber={true}
                formItemLayout={formItemLayout}
                formItemLayoutMinMax={formItemLayoutMinMax}
                validatedMsg={t('msgValidDecimalNumberTwoDigits')}
                requiredMsg={t('msgFieldRequired')}
              />
              <InputNumberMinMaxField
                isRequired={true}
                label={t('labelPayloadRange')}
                form={props.form}
                propertyName="payload"
                propertyNameMin="measureMinPayload"
                propertyNameMax="measureMaxPayload"
                valueMin={item.measureMinPayload ? parseFloat(item.measureMinPayload).toFixed(2) : ''}
                disableMin={false}
                valueMax={item.measureMaxPayload ? parseFloat(item.measureMaxPayload).toFixed(2) : ''}
                validateLength={50}
                decimalNumber={true}
                formItemLayout={formItemLayout}
                formItemLayoutMinMax={formItemLayoutMinMax}
                validatedMsg={t('msgValidDecimalNumberTwoDigits')}
                requiredMsg={t('msgFieldRequired')}
              />
            </Col>
          </Row>
          <Button type="primary" htmlType="submit" className="vehicle-types-form__button-submit">
            {buttonTitle}
          </Button>
          <Button type="default" className="vehicle-types-form__button-cancel" onClick={() => onCancelForm()}>
            {t('labelCancel')}
          </Button>
        </Card>
      </Form>
    </div>
  );
};

export default Form.create()(VehicleTypesForm);
