import React, {useContext, useEffect, useState} from 'react';
import {Card, Col, Button, Divider, Form, Row, Input} from 'antd';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {useMutation, useQuery} from 'react-apollo-hooks';
import {useRouter} from 'rift-router';
import gql from 'graphql-tag';
import {FormComponentProps} from 'antd/lib/form';

import AppStore from '../../../shared/stores/App.store';
import appModel from '../../../shared/models/App.model';
import HeadTitle from '../../../shared/components/HeadTitle/HeadTitle';

import './ManageSizeForm.less';

import {ProductSize} from '../../../shared/cs/ProductSize.cs';
import manageSizeModel from '../../../shared/models/ManageSize.model';

import openNotificationWithIcon from '../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';
import InputNumberMinMaxField from '../../../shared/components/Inputs/InputNumberMinMax';
import InputSingleMultipleField from '../../../shared/components/Inputs/InputSingleMultipleField';
import InputNumberField from '../../../shared/components/Inputs/InputNumberField';
import InputSelectField from '../../../shared/components/Inputs/InputSelectField';
import {SizeEnum} from '../../../shared/enums/Size.enum';
import SizeStore from '../../../shared/stores/Size.store';
import {UnitMassEnum} from '../../../shared/enums/UnitMass.enum';
import {UnitLengthEnum} from '../../../shared/enums/UnitLength.enum';
import {UnitTimeEnum} from '../../../shared/enums/UnitTime.enum';

type ManageSizeFormProps = FormComponentProps;

const EDIT_MUTATION = gql`
  mutation($id: EncryptId!, $input: ProductSizeUpdateInput!) {
    ProductSizeUpdate(id: $id, input: $input) {
      id
    }
  }
`;

const GET_LIST = gql`
  query($input: GenericFilterInput) {
    ProductSizeList(input: $input) {
      total
      items {
        id
        labelSize {
          type
        }
        measureLwh {
          amount(unit: inches)
        }
        lwhLargerThanEqual
        measureWeightMin {
          amount(unit: pounds)
        }
        measureWeightMax {
          amount(unit: pounds)
        }
        measureTotalLinearMin {
          amount(unit: inches)
        }
        measureTotalLinearMax {
          amount(unit: inches)
        }
        measureLabourLoadingSingle {
          amount(unit: minutes)
        }
        measureLabourLoadingMultiple {
          amount(unit: minutes)
        }
        measureLabourUnloadingSingle {
          amount(unit: minutes)
        }
        measureLabourUnloadingMultiple {
          amount(unit: minutes)
        }
      }
    }
  }
`;

const ManageSizeForm = observer((props: ManageSizeFormProps) => {
  const appStore = useContext(AppStore);
  const sizeStore = useContext(SizeStore);
  const {t} = useTranslation('app');
  const [item, setItem] = useState(new ProductSize());
  const [itemNext, setItemNext] = useState(new ProductSize());
  const [itemPrev, setItemPrev] = useState(new ProductSize());
  const [formTitle, setFormTitle] = useState(t('labelAddManageSize'));
  const [buttonTitle, setButtonTitle] = useState(t('labelAdd'));
  const router = useRouter();
  const config = {
    pageSize: 10,
    page: 1,
    order: [{field: 'id', orderType: 'ASC'}],
  };
  const {data, error, loading} = useQuery(GET_LIST, {
    suspend: false,
    variables: {
      input: config,
    },
    fetchPolicy: 'network-only',
  });

  const tabIndexFieldsOrder: any = [
    'type',
    'lwhValue',
    'weightMin',
    'weightMax',
    'totalLinearInchesMin',
    'totalLinearInchesMax',
    'labourLoadingSingleMinute',
    'labourLoadingMultipleMinute',
    'labourUnloadingSingleMinute',
    'labourUnloadingMultipleMinute',
  ];

  useEffect(() => {
    // tabIndex order for the fields
    tabIndexFieldsOrder &&
      tabIndexFieldsOrder.forEach((field: any, index: any) => {
        if ((document as any).getElementById(field)) {
          (document as any).getElementById(field).tabIndex = index + 1;
        }
      });
  });

  useEffect(() => {
    // restart isEditing variable
    return () => {
      appStore.setIsEditing(false);
    };
  }, []);

  useEffect(() => {
    appStore.setIsLoading(true);
    const onCompleted = result => {
      appStore.setIsLoading(false);
      const {items, total} = result.ProductSizeList;
      const mappedDataTmp = items.map(element => {
        const {
          id,
          labelSize,
          measureLwh,
          lwhLargerThanEqual,
          measureWeightMin,
          measureWeightMax,
          measureTotalLinearMin,
          measureTotalLinearMax,
          measureLabourLoadingSingle,
          measureLabourLoadingMultiple,
          measureLabourUnloadingSingle,
          measureLabourUnloadingMultiple,
        } = element;
        return {
          id,
          labelSize,
          measureLwh,
          lwhLargerThanEqual,
          measureWeightMin,
          measureWeightMax,
          measureTotalLinearMin,
          measureTotalLinearMax,
          measureLabourLoadingSingle,
          measureLabourLoadingMultiple,
          measureLabourUnloadingSingle,
          measureLabourUnloadingMultiple,
        };
      });
      sizeStore.setItemsSize(mappedDataTmp);
    };

    const onError = paramError => {
      appStore.setIsLoading(false);
      return <div>{paramError}</div>;
    };

    if (onCompleted || onError) {
      if (onCompleted && !loading && !error) {
        sizeStore.itemsSize.length === 0 && onCompleted(data);
        getData();
      } else if (onError && !loading && error) {
        onError(error);
      }
    }
  }, [loading, data, error]);

  const setNextPrevItems = itemToEdit => {
    const position = sizeStore.itemsSize.findIndex(element => element.labelSize.type === itemToEdit.labelSize.type);
    switch (itemToEdit.labelSize.type) {
      case SizeEnum.TYPE_SMALL:
        setItemNext({...new ProductSize(sizeStore.itemsSize[position + 1])});
        break;
      case SizeEnum.TYPE_HUGE:
        setItemPrev({...new ProductSize(sizeStore.itemsSize[position - 1])});
        break;
      default:
        setItemNext({...new ProductSize(sizeStore.itemsSize[position + 1])});
        setItemPrev({...new ProductSize(sizeStore.itemsSize[position - 1])});
        break;
    }
  };

  const getData = async () => {
    try {
      appStore.setIsLoading(true);
      const params: any = router;
      if (params && params.params && params.params.id) {
        appStore.setIsEditing(true);
        setFormTitle(t('labelEditManageSize'));
        setButtonTitle(t('labelUpdate'));
        const input = {
          id: params.params.id,
        };
        const itemToEdit: any = await manageSizeModel.getManageSize(input);
        setNextPrevItems(itemToEdit.data.ProductSizeGet);
        setItem({...new ProductSize(itemToEdit.data.ProductSizeGet)});
      }
      appStore.setIsLoading(false);
    } catch (e) {
      appStore.setIsLoading(false);
    }
  };

  /*
  * @maxWeight
  Important
  For S size :
  The value of this field must be less than the (maximum weight recorded in the system for size M) - 0.01.
  For M size:
  The value of this field must be less than the (maximum weight recorded in the system for L size) - 0.01.
  The value of this field must be greater than the (maximum weight recorded in the system for S size) + 0.01.
  For L size:
  The value of this field must be less than the (maximum weight recorded in the system for size H) - 0.01.
  The value of this field must be greater than the (maximum weight recorded in the system for size M) + 0.01.
  For H size:
  The value of this field must be greater than the (maximum weight recorded in the system for size L) + 0.01.
   */

  const validateMaxWeight = (rule, val, callback, msgMatch) => {
    setTimeout(() => {
      let nextMaxWeight;
      let prevMaxWeight;
      const expR = /^\d*(\.\d+)?$/; // for float numbers
      const {newValue, newValueMax, decimals, decimalsMax} = getValuesAndDecimal(
        props.form.getFieldValue('weightMin'),
        props.form.getFieldValue('weightMax'),
      );
      if (
        props.form.getFieldValue('weightMax') !== '' &&
        props.form.getFieldValue('weightMax') !== null &&
        props.form.getFieldValue('weightMax') !== undefined &&
        String(props.form.getFieldValue('weightMax')).match(expR) &&
        String(props.form.getFieldValue('weightMin')).match(expR) &&
        decimals.length < 3 &&
        decimalsMax.length < 3
      ) {
        if (
          (parseFloat(newValueMax) < parseFloat(newValue) || parseFloat(newValueMax) === parseFloat(newValue)) &&
          item.labelSize.type === SizeEnum.TYPE_SMALL
        ) {
          callback([new Error(`${t('msgValidMinMax')} `)]);
        } else {
          switch (item.labelSize.type) {
            case SizeEnum.TYPE_SMALL:
              nextMaxWeight = itemNext.measureWeightMax.amount.toFixed(2);
              if (
                props.form.getFieldValue('weightMax') > parseFloat(nextMaxWeight) - 0.01 ||
                props.form.getFieldValue('weightMax') === (parseFloat(nextMaxWeight) - 0.01).toFixed(2)
              ) {
                callback([
                  new Error(`${t('msgValidValueLessThan')} ${(parseFloat(nextMaxWeight) - 0.01).toFixed(2)} `),
                ]);
              } else {
                callback();
              }
              break;
            case SizeEnum.TYPE_HUGE:
              prevMaxWeight = itemPrev.measureWeightMax.amount.toFixed(2);
              if (
                props.form.getFieldValue('weightMax') < parseFloat(prevMaxWeight) + 0.01 ||
                props.form.getFieldValue('weightMax') === (parseFloat(prevMaxWeight) + 0.01).toFixed(2)
              ) {
                callback([
                  new Error(`${t('msgValidValueGreaterThan')} ${(parseFloat(prevMaxWeight) + 0.01).toFixed(2)} `),
                ]);
              } else {
                callback();
              }
              break;
            default:
              nextMaxWeight = itemNext.measureWeightMax.amount.toFixed(2);
              prevMaxWeight = itemPrev.measureWeightMax.amount.toFixed(2);
              if (
                props.form.getFieldValue('weightMax') > parseFloat(nextMaxWeight) - 0.01 ||
                props.form.getFieldValue('weightMax') === (parseFloat(nextMaxWeight) - 0.01).toFixed(2)
              ) {
                callback([
                  new Error(`${t('msgValidValueLessThan')} ${(parseFloat(nextMaxWeight) - 0.01).toFixed(2)} `),
                ]);
              } else if (
                props.form.getFieldValue('weightMax') < parseFloat(prevMaxWeight) + 0.01 ||
                props.form.getFieldValue('weightMax') === (parseFloat(prevMaxWeight) + 0.01).toFixed(2)
              ) {
                callback([
                  new Error(`${t('msgValidValueGreaterThan')} ${(parseFloat(prevMaxWeight) + 0.01).toFixed(2)} `),
                ]);
              } else {
                callback();
              }
              break;
          }
        }
      } else {
        callback();
      }
    }, 300);
  };

  /*
   * @LWH
    Important
    For S size :
    The value of this field must be less than or equal to the inches LWH registered in the system for size M.
    For M size:
    The value of this field must be less than or equal to the inches LWH registered in the system for size L.
    For L size:
    The value of this field must be less than or equal to the inches LWH registered in the system for size H.
    For H size:
    The value of this field must be greater than or equal to the inches LWH recorded in the system for size L.
  */
  const validateLWH = (rule, val, callback, msgMatch) => {
    setTimeout(() => {
      let nextLWH;
      let prevLWH;
      const expR = /^\d*(\.\d+)?$/; // for float numbers
      const {newValue, newValueMax, decimals, decimalsMax} = getValuesAndDecimal(val, '');
      if (decimals.length > 2) {
        callback([new Error(`${t('msgValidDecimalNumberTwoDigits')}`)]);
      } else if (
        props.form.getFieldValue('lwhValue') !== '' &&
        props.form.getFieldValue('lwhValue') !== null &&
        props.form.getFieldValue('lwhValue') !== undefined &&
        String(props.form.getFieldValue('lwhValue')).match(expR)
      ) {
        switch (item.labelSize.type) {
          case SizeEnum.TYPE_HUGE:
            prevLWH = itemPrev.measureLwh.amount.toFixed(2);
            if (props.form.getFieldValue('lwhValue') < parseFloat(prevLWH)) {
              callback([new Error(`${t('msgValidValueGreaterThan')} ${parseFloat(prevLWH)} .`)]);
            } else {
              callback();
            }
            break;
          default:
            nextLWH = itemNext.measureLwh.amount.toFixed(2);
            if (props.form.getFieldValue('lwhValue') > parseFloat(nextLWH)) {
              callback([new Error(`${t('msgValidValueLessThan')} ${nextLWH}`)]);
            } else {
              callback();
            }
            break;
        }
      } else {
        callback();
      }
    }, 300);
  };

  const getValuesAndDecimal = (val, valMax) => {
    let newValue = String(val).replace(/(^\s*)|(\s*$)/gi, '');
    let newValueMax = String(valMax).replace(/(^\s*)|(\s*$)/gi, '');
    newValue = newValue.replace(/[ ]{2,}/gi, ' ');
    newValue = newValue.replace(/\n /, '\n');
    const newValueArray = newValue.split('.');
    const [decimals] = newValueArray.length > 1 ? newValueArray.slice(-1) : [''];
    newValueMax = newValueMax.replace(/[ ]{2,}/gi, ' ');
    newValueMax = newValueMax.replace(/\n /, '\n');
    const newValueArrayMax = newValueMax.split('.');
    const [decimalsMax] = newValueArrayMax.length > 1 ? newValueArrayMax.slice(-1) : [''];
    return {newValue, newValueMax, decimals, decimalsMax};
  };

  /*
  * @totalLinearInchesMax
  Important
  For S size :
  The value of this field must be less than the maximum linear inches recorded in the system for size M.
  For M size:
  The value of this field must be less than the maximum linear inches recorded in the system for L size.
  The value of this field must be greater than the maximum linear inches recorded in the system for S size.
  For L size:
  The value of this field must be less than the maximum linear inches recorded in the system for size H.
  The value of this field must be greater than the maximum linear inches recorded in the system for size M.
  For H size:
  The value of this field must be greater than the maximum linear inches recorded in the system for size L.
  */
  const validateMaxLinearInches = (rule, val, callback, msgMatch) => {
    setTimeout(() => {
      let nextLinearInchesMax;
      let prevLinearInchesMax;
      const expR = /^\d*(\.\d+)?$/; // for float numbers
      const {newValue, newValueMax, decimals, decimalsMax} = getValuesAndDecimal(
        props.form.getFieldValue('totalLinearInchesMin'),
        props.form.getFieldValue('totalLinearInchesMax'),
      );
      if (
        props.form.getFieldValue('totalLinearInchesMax') !== '' &&
        props.form.getFieldValue('totalLinearInchesMax') !== null &&
        props.form.getFieldValue('totalLinearInchesMax') !== undefined &&
        String(props.form.getFieldValue('totalLinearInchesMax')).match(expR) &&
        String(props.form.getFieldValue('totalLinearInchesMin')).match(expR) &&
        decimals.length < 3 &&
        decimalsMax.length < 3
      ) {
        if (
          (parseFloat(props.form.getFieldValue('totalLinearInchesMax')) <
            parseFloat(props.form.getFieldValue('totalLinearInchesMin')) ||
            parseFloat(newValueMax) === parseFloat(newValue)) &&
          item.labelSize.type === SizeEnum.TYPE_SMALL
        ) {
          callback([new Error(`${t('msgValidMinMax')} `)]);
        } else {
          switch (item.labelSize.type) {
            case SizeEnum.TYPE_SMALL:
              nextLinearInchesMax = itemNext.measureTotalLinearMax.amount.toFixed(2);
              if (
                props.form.getFieldValue('totalLinearInchesMax') > parseFloat(nextLinearInchesMax) - 0.01 ||
                props.form.getFieldValue('totalLinearInchesMax') === (parseFloat(nextLinearInchesMax) - 0.01).toFixed(2)
              ) {
                callback([
                  new Error(`${t('msgValidValueLessThan')} ${(parseFloat(nextLinearInchesMax) - 0.01).toFixed(2)} `),
                ]);
              } else {
                callback();
              }
              break;
            case SizeEnum.TYPE_HUGE:
              prevLinearInchesMax = itemPrev.measureTotalLinearMax.amount.toFixed(2);
              if (
                props.form.getFieldValue('totalLinearInchesMax') < parseFloat(prevLinearInchesMax) + 0.01 ||
                props.form.getFieldValue('totalLinearInchesMax') === (parseFloat(prevLinearInchesMax) + 0.01).toFixed(2)
              ) {
                callback([
                  new Error(`${t('msgValidValueGreaterThan')} ${(parseFloat(prevLinearInchesMax) + 0.01).toFixed(2)} `),
                ]);
              } else {
                callback();
              }
              break;
            default:
              nextLinearInchesMax = itemNext.measureTotalLinearMax.amount.toFixed(2);
              prevLinearInchesMax = itemPrev.measureTotalLinearMax.amount.toFixed(2);
              if (
                props.form.getFieldValue('totalLinearInchesMax') > parseFloat(nextLinearInchesMax) - 0.01 ||
                props.form.getFieldValue('totalLinearInchesMax') === (parseFloat(nextLinearInchesMax) - 0.01).toFixed(2)
              ) {
                callback([
                  new Error(`${t('msgValidValueLessThan')} ${(parseFloat(nextLinearInchesMax) - 0.01).toFixed(2)} `),
                ]);
              } else if (
                props.form.getFieldValue('totalLinearInchesMax') < parseFloat(prevLinearInchesMax) + 0.01 ||
                props.form.getFieldValue('totalLinearInchesMax') === (parseFloat(prevLinearInchesMax) + 0.01).toFixed(2)
              ) {
                callback([
                  new Error(`${t('msgValidValueGreaterThan')} ${(parseFloat(prevLinearInchesMax) + 0.01).toFixed(2)} `),
                ]);
              } else {
                callback();
              }
              break;
          }
        }
      } else {
        callback();
      }
    }, 300);
  };

  const handleCatch = (err, values, textType) => {
    if (err && err.networkError && err.networkError.statusCode === 403) {
      appModel.logout();
      window.location.href = '/admin/login';
    } else {
      const {validation, ...others} = err.graphQLErrors[0];
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
              openNotificationWithIcon('error', t('lavelSaveFailed'), `The ${textType} ${t('labelDontExist')}`);
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
        openNotificationWithIcon('error', t('lavelSaveFailed'), err.message);
      }
    }
    appStore.setIsLoading(false);
  };

  const addMutation = useMutation(EDIT_MUTATION, {
    update: (proxy, result) => {
      /* your custom update logic */
      setTimeout(() => {
        appStore.setIsLoading(true);
        const {errors} = result;
        if (!errors) {
          appStore.setUserAction({...appStore.userAction, ...{isSaved: true, action: 'updated'}});
          appStore.setIsLoading(false);
          appStore.setIsEditing(false);
          router.to('/admin/size');
        } else {
          const messages = [];
          for (const e of errors) {
            const obj = JSON.parse(e.message);
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
        const {
          labourLoadingMultipleMinute,
          labourLoadingSingleMinute,
          labourUnloadingMultipleMinute,
          labourUnloadingSingleMinute,
          lwhLargerThanEqual,
          lwhValue,
          totalLinearInchesMax,
          totalLinearInchesMin,
          type,
          weightMax,
          ...all
        } = values;
        const input = {
          measureWeightMax: {
            amount: weightMax,
            unit: UnitMassEnum.pounds,
          },
          measureLwh: {
            amount: lwhValue,
            unit: UnitLengthEnum.inches,
          },
          measureTotalLinearMin: {
            amount: totalLinearInchesMin,
            unit: UnitLengthEnum.inches,
          },
          measureTotalLinearMax: {
            amount: totalLinearInchesMax,
            unit: UnitLengthEnum.inches,
          },
          measureLabourLoadingSingle: {
            amount: labourLoadingSingleMinute,
            unit: UnitTimeEnum.minutes,
          },
          measureLabourLoadingMultiple: {
            amount: labourLoadingMultipleMinute,
            unit: UnitTimeEnum.minutes,
          },
          measureLabourUnloadingSingle: {
            amount: labourUnloadingSingleMinute,
            unit: UnitTimeEnum.minutes,
          },
          measureLabourUnloadingMultiple: {
            amount: labourUnloadingMultipleMinute,
            unit: UnitTimeEnum.minutes,
          },
        };
        appStore.setUserAction({...appStore.userAction, ...{typeOfElem: 'labelSize'}});
        addMutation({variables: {input, ...(appStore.isEditing && {id: item.id})}}).catch(er => {
          handleCatch(er, values, t('labelManageSize'));
        });
      } else {
        const errormsg = t('errorMsgAuthAdmin');
        appStore.setHasError(true);
        appStore.setErrorMsg(errormsg);
      }
    });
  };

  const onCancelForm = () => {
    appStore.setIsEditing(false);
    router.to('/admin/size');
  };

  const formItemLayout = {
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 14},
      md: {span: 12},
      lg: {span: 15},
      xl: {span: 12},
    },
  };
  const formItemLayoutMinMax = {
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 24},
    },
  };

  const FormItem = Form.Item;
  const {getFieldDecorator} = props.form;

  return (
    <div className="manage-size-form">
      <Form onSubmit={handleSubmit} layout="vertical" id={'manage-size-form'} autoComplete={'off'}>
        <Card bordered={false} className="gutter-row">
          <Row type="flex" justify="space-between" align="middle" style={{marginBottom: '13px'}}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <HeadTitle icon="arrows-alt" title={formTitle} />
              <Divider />
            </Col>
          </Row>
          <Row type="flex" justify="space-between" align="top">
            <Col xs={24} sm={12} md={24} lg={12} xl={12}>
              <InputSelectField
                placeholder={t('labelKeyKeywordSizes')}
                label={t('labelKeyKeywordSizes')}
                disabled={true}
                required={true}
                form={props.form}
                propertyName="type"
                items={[
                  {id: SizeEnum.TYPE_SMALL, name: 'S'},
                  {id: SizeEnum.TYPE_MEDIUM, name: 'M'},
                  {id: SizeEnum.TYPE_LARGE, name: 'L'},
                  {id: SizeEnum.TYPE_HUGE, name: 'H'},
                ]}
                formItemLayout={formItemLayout}
                requiredMsg={t('msgFieldRequired')}
                value={item.labelSize && item.labelSize.type}
              />
              <InputNumberMinMaxField
                isRequired={true}
                label={t('labelWeight')}
                form={props.form}
                propertyName="weight"
                propertyNameMin="weightMin"
                propertyNameMax="weightMax"
                valueMin={
                  item.labelSize && item.labelSize.type === SizeEnum.TYPE_SMALL
                    ? 0
                    : item.measureWeightMin.amount && item.measureWeightMin.amount.toFixed(2)
                }
                disableMin={true}
                valueMax={item.measureWeightMax.amount && item.measureWeightMax.amount.toFixed(2)}
                validateLength={50}
                formItemLayout={formItemLayout}
                formItemLayoutMinMax={formItemLayoutMinMax}
                onValidate={validateMaxWeight}
                decimalNumber={true}
                validatedMsg={t('msgValidDecimalNumberTwoDigits')}
                requiredMsg={t('msgFieldRequired')}
              />
            </Col>
            <Col xs={24} sm={12} md={24} lg={12} xl={12}>
              <InputNumberField
                placeholder={t('labelPlaceHolderLWH')}
                label={t('labelLWH')}
                required={true}
                form={props.form}
                propertyName="lwhValue"
                validateLength={6}
                maxlength={6}
                formItemLayout={formItemLayout}
                requiredMsg={t('msgFieldRequired')}
                value={item.measureLwh.amount && item.measureLwh.amount.toFixed(2)}
                onValidate={validateLWH}
                decimalNumber={true}
                validatedMsg={t('msgValidDecimalNumberTwoDigits')}
              />
              <InputNumberMinMaxField
                isRequired={true}
                label={t('labelLinearInchesSum')}
                form={props.form}
                propertyName="linearInches"
                propertyNameMin="totalLinearInchesMin"
                propertyNameMax="totalLinearInchesMax"
                valueMin={item.measureTotalLinearMin.amount && item.measureTotalLinearMin.amount.toFixed(2)}
                valueMax={item.measureTotalLinearMax.amount && item.measureTotalLinearMax.amount.toFixed(2)}
                validateLength={50}
                disableMin={item.labelSize && item.labelSize.type !== SizeEnum.TYPE_SMALL}
                formItemLayout={formItemLayout}
                decimalNumber={true}
                formItemLayoutMinMax={formItemLayoutMinMax}
                onValidate={validateMaxLinearInches}
                validatedMsg={t('msgValidDecimalNumberTwoDigits')}
                requiredMsg={t('msgFieldRequired')}
              />
            </Col>
          </Row>
          <Divider />
          <Row type="flex" justify="space-between" align="top">
            <Col xs={24} sm={12} md={24} lg={12} xl={12}>
              <Row className="titles">
                <InputSingleMultipleField
                  label={t('labelEstimateLaborMinuteLoading')}
                  form={props.form}
                  propertyNameSingle="labourLoadingSingleMinute"
                  propertyNameMultiple="labourLoadingMultipleMinute"
                  valueSingle={
                    item.measureLabourLoadingSingle.amount && item.measureLabourLoadingSingle.amount.toFixed(2)
                  }
                  valueMultiple={
                    item.measureLabourLoadingMultiple.amount && item.measureLabourLoadingMultiple.amount.toFixed(2)
                  }
                  validateLength={50}
                />
              </Row>
            </Col>
            <Col xs={24} sm={12} md={24} lg={12} xl={12}>
              <Row className="titles">
                <InputSingleMultipleField
                  label={t('labelEstimateLaborMinuteUnLoading')}
                  form={props.form}
                  propertyNameSingle="labourUnloadingSingleMinute"
                  propertyNameMultiple="labourUnloadingMultipleMinute"
                  valueSingle={
                    item.measureLabourUnloadingSingle.amount && item.measureLabourUnloadingSingle.amount.toFixed(2)
                  }
                  valueMultiple={
                    item.measureLabourUnloadingMultiple.amount && item.measureLabourUnloadingMultiple.amount.toFixed(2)
                  }
                  validateLength={50}
                />
              </Row>
            </Col>
          </Row>
          <FormItem>
            {getFieldDecorator('lwhLargerThanEqual', {
              initialValue: item.lwhLargerThanEqual,
            })(<Input type="hidden" />)}
          </FormItem>
          <Button type="primary" htmlType="submit" className="manage-size-form__button-submit">
            {buttonTitle}
          </Button>
          <Button type="default" className="manage-size-form__button-cancel" onClick={() => onCancelForm()}>
            {t('labelCancel')}
          </Button>
        </Card>
      </Form>
    </div>
  );
});

export default Form.create()(ManageSizeForm);
