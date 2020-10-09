import React from 'react';
import {Col, Row, Card} from 'antd';
import {useTranslation} from 'react-i18next';
import InputNumberField from '../Inputs/InputNumberField';
import {PriceProductSizePieceTypeEnum} from '../../enums/PriceProductSizePieceType.enum';
import formatNumber from '../../utils/FormatNumber';

type Props = {
  form: any;
  type: any;
  idPrice: any;
  validateLength: number;
  validatedMsg: string;
  validatedMsg0: string;
  formItemLayout?: any;
  item?: any;
  label?: string;
  isRequired?: boolean;
  maxLength?: number;
};
const CardPriceByType = (props: Props) => {
  const {t} = useTranslation('app');
  const {
    form,
    item,
    type,
    label,
    validateLength,
    isRequired,
    idPrice,
    validatedMsg,
    validatedMsg0,
    formItemLayout,
  } = props;

  const layout = formItemLayout || {
    labelCol: {
      xs: {span: 24},
      sm: {span: 12},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 4},
    },
  };
  const validateField = (rule, val, callback) => {
    setTimeout(() => {
      if (val !== '' && val !== undefined && val !== null) {
        // const expR = /^\d+$/;
        const expR = /^\d*(\.\d+)?$/; // for float numbers
        if (val !== '' && val !== undefined && val !== null && !String(val).match(expR)) {
          callback([new Error(props.validatedMsg ? props.validatedMsg : t('msgValidDecimalNumberTwoDigits'))]);
        } else if (val === 0) {
          callback([new Error(props.validatedMsg0)]);
        } else {
          let newValue = String(val).replace(/(^\s*)|(\s*$)/gi, '');
          newValue = newValue.replace(/[ ]{2,}/gi, ' ');
          newValue = newValue.replace(/\n /, '\n');
          const newValueArray = newValue.split('.');
          const [decimals] = newValueArray.length > 1 ? newValueArray.slice(-1) : [''];
          if (decimals.length > 2) {
            callback([new Error(`${props.validatedMsg ? props.validatedMsg : t('msgValidDecimalNumberTwoDigits')}`)]);
          } else {
            callback();
          }
        }
      }
      callback();
    }, 300);
  };

  return (
    <Card bordered={false} className="gutter-row">
      <Row type="flex" justify="center" align="middle">
        <h2>{label}</h2>
      </Row>
      <Row type="flex" justify="space-between" align="top">
        <Col xs={24} sm={8} md={24} lg={8} xl={8}>
          <InputNumberField
            label={t('labelBaseFare')}
            required={isRequired}
            form={form}
            value={formatNumber.formatFloat(item && item.currencyBaseFare && item.currencyBaseFare.amount) || 0}
            propertyName={`currencyBaseFare&${type}&${idPrice}`}
            validateLength={validateLength}
            formItemLayout={layout}
            validatedMsg={validatedMsg}
            decimalNumber={true}
            requiredMsg={t('msgFieldRequired')}
            onValidate={validateField}
          />
          <InputNumberField
            label={t('labelCurrencyMinimumFare')}
            required={isRequired}
            form={form}
            propertyName={`currencyMinimumFare&${type}&${idPrice}`}
            value={formatNumber.formatFloat(item && item.currencyMinimumFare && item.currencyMinimumFare.amount) || 0}
            validateLength={validateLength}
            formItemLayout={layout}
            decimalNumber={true}
            validatedMsg={validatedMsg}
            requiredMsg={t('msgFieldRequired')}
            onValidate={validateField}
          />
        </Col>
        <Col xs={24} sm={8} md={24} lg={8} xl={8}>
          <InputNumberField
            label={t('labelCurrencyMileRate')}
            required={isRequired}
            form={form}
            propertyName={`currencyMileRate&${type}&${idPrice}`}
            value={formatNumber.formatFloat(item && item.currencyMileRate && item.currencyMileRate.amount) || 0}
            validateLength={validateLength}
            formItemLayout={layout}
            decimalNumber={true}
            validatedMsg={validatedMsg}
            requiredMsg={t('msgFieldRequired')}
            onValidate={validateField}
          />
          <InputNumberField
            label={t('labelCurrencyMileRateAfter')}
            required={isRequired}
            form={form}
            propertyName={`currencyMileRateAfter&${type}&${idPrice}`}
            validateLength={validateLength}
            value={
              formatNumber.formatFloat(item && item.currencyMileRateAfter && item.currencyMileRateAfter.amount) || 0
            }
            formItemLayout={layout}
            decimalNumber={true}
            validatedMsg={validatedMsg}
            requiredMsg={t('msgFieldRequired')}
            onValidate={validateField}
          />
        </Col>
        <Col xs={24} sm={8} md={24} lg={8} xl={8}>
          <InputNumberField
            label={t('labelCurrencyLoadingUnloading')}
            required={isRequired}
            form={form}
            propertyName={`estimateTime&${type}&${idPrice}`}
            decimalNumber={true}
            value={
              type === PriceProductSizePieceTypeEnum.PIECE_TYPE_SIMPLE
                ? item &&
                  item.productSize &&
                  item.productSize &&
                  item.productSize.measureLabourLoadingSingle &&
                  item.productSize.measureLabourUnloadingSingle
                  ? formatNumber.formatFloat(
                      item.productSize.measureLabourLoadingSingle.amount +
                        item.productSize.measureLabourUnloadingSingle.amount,
                    )
                  : 0
                : item &&
                  item.productSize &&
                  item.productSize &&
                  item.productSize.measureLabourLoadingSingle &&
                  item.productSize.measureLabourUnloadingSingle
                ? formatNumber.formatFloat(
                    item.productSize.measureLabourLoadingMultiple.amount +
                      item.productSize.measureLabourUnloadingMultiple.amount,
                  )
                : 0
            }
            validateLength={validateLength}
            disabled={true}
            formItemLayout={layout}
            validatedMsg={validatedMsg}
            requiredMsg={t('msgFieldRequired')}
          />
          <InputNumberField
            label={t('labelLoadingUnloadingTime')}
            required={isRequired}
            form={form}
            propertyName={`currencyLoadingUnloading&${type}&${idPrice}`}
            validateLength={validateLength}
            value={
              formatNumber.formatFloat(item && item.currencyLoadingUnloading && item.currencyLoadingUnloading.amount) ||
              0
            }
            formItemLayout={layout}
            decimalNumber={true}
            validatedMsg={validatedMsg}
            requiredMsg={t('msgFieldRequired')}
            onValidate={validateField}
          />
        </Col>
      </Row>
    </Card>
  );
};
export default CardPriceByType;
