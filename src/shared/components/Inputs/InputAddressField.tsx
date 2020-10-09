import React, {useState, useEffect, useContext} from 'react';
import {Col, Row} from 'antd';
import InputTextAreaField from './InputTextAreaField';
import {useTranslation} from 'react-i18next';
import InputSelectField from './InputSelectField';
import InputTextField from './InputTextField';
import InputWithPatternField from './InputWithPatternField';
import masks from '../../utils/masks';
import appModel from '../../models/App.model';
import {setTimeout} from 'timers';
import TaxStore from '../../stores/Tax.store';

type Props = {
  form: any;
  formItemLayout?: any;
  hidden?: boolean;
  propertyNameAddress?: string;
  propertyNameCountry?: string;
  propertyNameCity?: string;
  propertyNameZipCode?: string;
  propertyNameState?: string;
  placeholderAddress?: string;
  placeholderCountry?: string;
  placeholderCity?: string;
  placeholderZipCode?: string;
  placeholderState?: string;
  countries?: any;
  states?: any;
  filter?: any;
  valueAddressCountryId?: any;
  valueAddress?: string;
  valueAddressCity?: string;
  valueAddressZipCode?: string;
  valueAddressStateId?: any;
  setCountries?: any;
};

export const InputAddressField = (props: Props): JSX.Element => {
  const {t} = useTranslation('app');
  const taxStore = useContext(TaxStore);
  const [countriesDefault, setCountriesDefault] = useState([]);
  const [statesDefault, setStatesDefault] = useState([]);
  const {
    form,
    formItemLayout,
    hidden,
    propertyNameAddress,
    propertyNameCountry,
    propertyNameCity,
    propertyNameZipCode,
    propertyNameState,
    placeholderAddress,
    placeholderCountry,
    placeholderCity,
    placeholderZipCode,
    placeholderState,
    countries,
    states,
    filter,
    valueAddressCountryId,
    valueAddress,
    valueAddressCity,
    valueAddressZipCode,
    valueAddressStateId,
    setCountries,
  } = props;

  const layout = formItemLayout || {
    labelCol: {
      xs: {span: 24},
      sm: {span: 8},
      span: 8,
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 10},
      span: 10,
    },
  };
  useEffect(() => {
    // get data for the form
    getData();
  }, []);

  const getData = async () => {
    try {
      const countryList: any = await appModel.getCountries();
      const mappedCountries: any = countryList.data.CountryList.items.map(ct => {
        return {
          id: ct.id,
          name: ct.name,
        };
      });
      setCountriesDefault(mappedCountries);
      mappedCountries.length > 0 && setCountries && setCountries(mappedCountries);
      const stateList: any = await appModel.getStates({
        page: 0,
        pageSize: 0,
        where: filter ? filter : [{field: 'country.id', value: mappedCountries[0].id, isPk: true}],
        order: [{field: 'name', orderType: 'ASC'}],
      });
      const mappedStates = stateList.data.StateList.items.map(st => {
        return {
          id: st.id,
          name: st.name,
        };
      });
      setStatesDefault(mappedStates);
    } catch (e) {
      // console.log(JSON.stringify(e));
    }
  };

  const formatZip = e => {
    setTimeout(() => {
      const dataField = form.getFieldValue(`${propertyNameZipCode}`);
      const finalValue = masks.maskZip(dataField);
      const field = `${propertyNameZipCode}`;
      form.setFieldsValue({[field]: finalValue});
      form.validateFields([`${propertyNameZipCode}`], (errors, values) => {
        //
      });
    }, 50);
  };

  const onValidateZip = (rule, val, callback, msgMatch) => {
    let error: boolean = false;
    setTimeout(() => {
      const dataField = form.getFieldValue(`${propertyNameZipCode}`);
      if (dataField !== '' && dataField !== undefined && dataField !== null) {
        const expR = /^\d{5}$|^\d{5}-\d{4}$/; // for xxxxx-xxxxx or xxxxx
        if (!dataField.match(expR)) {
          error = true;
        }
      }
      if (error) {
        callback([new Error(`${t('msgValidZipCode')}`)]);
      } else {
        callback();
      }
    }, 300);
  };

  return (
    <div style={{display: !hidden ? 'block' : 'none'}}>
      <React.Fragment>
        <Row type="flex" justify="space-between" align="middle">
          <Col xs={24} sm={12} md={24} lg={12} xl={12}>
            <InputTextAreaField
              form={form}
              label={t('labelAddress')}
              value={valueAddress || ''}
              propertyName={propertyNameAddress || 'address'}
              formItemLayout={layout}
              isRequired={true}
              requiredMsg={t('msgFieldRequired')}
              validatedMsg={`${t('labelOnlyCharacteres')} 50 ${t('msgCharactersMaximum')}`}
              placeholder={placeholderAddress || 'Address'}
              cantWords={50}
              style={{height: '115px'}}
            />
            <InputSelectField
              placeholder={placeholderCountry || 'Country'}
              form={form}
              label={t('labelCountry')}
              required={true}
              propertyName={propertyNameCountry || 'addressCountryId'}
              formItemLayout={layout}
              value={valueAddressCountryId || ''}
              requiredMsg={t('msgFieldRequired')}
              items={countries || countriesDefault}
              disabled={true}
            />
          </Col>
          <Col xs={24} sm={12} md={24} lg={12} xl={12}>
            <InputTextField
              placeholder={placeholderCity || 'City'}
              label={t('labelCity')}
              required={true}
              form={form}
              propertyName={propertyNameCity || 'addressCity'}
              validateLength={50}
              formItemLayout={layout}
              requiredMsg={t('msgFieldRequired')}
              typeOfCharMsg={t('labelOnlyLetters')}
              value={valueAddressCity || ''}
              validatedMsg={`${t('labelOnlyLettersANCharacteres')} 50 ${t('msgCharactersMaximum')}`}
            />
            <InputWithPatternField
              placeholder={placeholderZipCode || 'Zip Code'}
              label={t('labelZipCode')}
              required={true}
              form={form}
              propertyName={propertyNameZipCode || 'addressZipCode'}
              formItemLayout={layout}
              requiredMsg={t('msgFieldRequired')}
              value={masks.maskZip(valueAddressZipCode) || ''}
              validatedMsg={`${t('msgValidZipCode')}`}
              pattern={/^\d{5}$|^\d{5}-\d{4}$/}
              onChange={formatZip}
              onValidate={onValidateZip}
            />
            <InputSelectField
              placeholder={placeholderState || 'State'}
              form={form}
              label={t('labelState')}
              required={true}
              propertyName={propertyNameState || 'addressStateId'}
              formItemLayout={layout}
              value={valueAddressStateId || ''}
              requiredMsg={t('msgFieldRequired')}
              items={states || statesDefault}
              disabled={false}
            />
          </Col>
        </Row>
      </React.Fragment>
    </div>
  );
};

export default InputAddressField;
