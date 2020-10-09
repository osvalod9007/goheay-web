import React, {useContext, useEffect, useState} from 'react';
import {Col, Form, Icon, Modal, Row, Spin} from 'antd';
import {useTranslation} from 'react-i18next';
import {useMutation} from 'react-apollo-hooks';
import {observer} from 'mobx-react-lite';
import gql from 'graphql-tag';
import {FormComponentProps} from 'antd/lib/form';

import AppStore from '../../../../shared/stores/App.store';
import TaxStore from '../../../../shared/stores/Tax.store';
import appModel from '../../../../shared/models/App.model';
import taxSettingModel from '../../../../shared/models/TaxSetting.model';
import {TaxSetting} from '../../../../shared/cs/taxSettings.cs';

import InputSelectField from '../../../../shared/components/Inputs/InputSelectField';
import PercentageField from '../../../../shared/components/Inputs/PercentageField';
import openNotificationWithIcon from '../../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';
import formatNumber from '../../../../shared/utils/FormatNumber';

type LoginFormProps = FormComponentProps;

const ADD_MUTATION = gql`
  mutation($input: SettingTaxCreateInput!) {
    SettingTaxCreate(input: $input) {
      id
    }
  }
`;

const EDIT_MUTATION = gql`
  mutation($id: EncryptId!, $input: SettingTaxUpdateInput!) {
    SettingTaxUpdate(id: $id, input: $input) {
      id
    }
  }
`;

export const TaxSettingsForm = observer(
  (props: LoginFormProps): JSX.Element => {
    const appStore = useContext(AppStore);
    const taxStore = useContext(TaxStore);
    const {t} = useTranslation('app');
    const [item, setItem] = useState(new TaxSetting());
    const [countries, setCountries]: any = useState([]);
    const [states, setStates] = useState([]);
    const [formTitle, setFormTitle] = useState(t('labelAddTaxSettings'));
    const [buttonTitle, setButtonTitle] = useState(t('labelAdd'));

    useEffect(() => {
      // get data for the form
      getData();
    }, []);

    useEffect(() => {
      setItem({...new TaxSetting()});
      props.form.resetFields();
      getData();
    }, [taxStore.idToEdit, appStore.isOpenModalForm]);

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
        setCountries(mappedCountries);
        const filter =
          taxStore.usedStates.length > 0 && taxStore.idToEdit === ''
            ? [
                {field: 'country.id', value: mappedCountries[0].id, isPk: true},
                {field: 'id', op: 'NOT_IN', value: taxStore.usedStates, isPk: true},
              ]
            : [{field: 'country.id', value: mappedCountries[0].id, isPk: true}];
        const stateList: any = await appModel.getStates({
          page: 0,
          pageSize: 0,
          where: filter,
          order: [{field: 'name', orderType: 'ASC'}],
        });
        const mappedStates = stateList.data.StateList.items.map(st => {
          return {
            id: st.id,
            name: st.name,
          };
        });
        setStates(mappedStates);
        if (taxStore.idToEdit !== '') {
          appStore.setIsEditing(true);
          setFormTitle(t('labelEditTaxSettings'));
          setButtonTitle(t('labelUpdate'));
          const input = {
            id: taxStore.idToEdit,
          };
          const itemToEdit: any = await taxSettingModel.getTaxSetting(input);
          setItem({...new TaxSetting(itemToEdit.data.SettingTaxGet)});
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
            taxStore.setIdToEdit('');
            taxStore.setShouldUpdateTable(true);
            appStore.setIsOpenModalForm(false);
            setFormTitle(t('labelAddTaxSettings'));
            setButtonTitle(t('labelAdd'));
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
          const obj = {
            ...values,
            countryId: countries[0].id,
          };

          appStore.setUserAction({...appStore.userAction, ...{typeOfElem: 'labelTaxSetting'}});

          addMutation({variables: {input: {...obj}, ...(appStore.isEditing && {id: item.id})}})
            .then(() => appStore.setIsLoading(false))
            .catch(error => {
              handleCatch(error, values, '');
            });
        } else {
          const error = t('errorMsgAuthAdmin');
          appStore.setHasError(true);
          appStore.setErrorMsg(error);
        }
      });
    };

    const onCloseModal = () => {
      appStore.setIsLoading(false);
      appStore.setIsEditing(false);
      taxStore.setIdToEdit('');
      taxStore.setShouldUpdateTable(true);
      appStore.setIsOpenModalForm(false);
      setFormTitle(t('labelAddTaxSettings'));
      setButtonTitle(t('labelAdd'));
    };

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
        md: {span: 8},
        lg: {span: 7},
        xl: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
        md: {span: 14},
        lg: {span: 15},
        xl: {span: 15},
      },
    };

    return (
      <div className="tax-settings-form">
        <Modal
          title={
            <React.Fragment>
              <Icon type="calculator" /> {formTitle}
            </React.Fragment>
          }
          visible={appStore.isOpenModalForm}
          onCancel={() => onCloseModal()}
          onOk={handleSubmit}
          okText={buttonTitle}
          cancelText={t('labelCancel')}
          okButtonProps={{disabled: appStore.isLoading}}
          cancelButtonProps={{disabled: appStore.isLoading}}
          width={'617px'}
          destroyOnClose={true}
        >
          <Spin spinning={appStore.isLoading} size="large">
            <Form onSubmit={handleSubmit} autoComplete={'off'}>
              <Row type="flex" justify="space-between" align="top">
                <Col xs={24} sm={12} md={24} lg={24} xl={24}>
                  <InputSelectField
                    placeholder={t('labelPlaceHolderState')}
                    form={props.form}
                    label={t('labelState')}
                    required={true}
                    propertyName={'stateId'}
                    formItemLayout={formItemLayout}
                    value={item.stateId}
                    requiredMsg={t('msgFieldRequired')}
                    items={states}
                    disabled={appStore.isEditing}
                  />
                  <PercentageField
                    placeholder={t('labelPlaceholderTaxSettingPercent')}
                    label={t('labelTaxSettingPercent')}
                    required={true}
                    form={props.form}
                    propertyName="tax"
                    min={0}
                    max={100}
                    formItemLayout={formItemLayout}
                    value={formatNumber.formatFloat(item.tax)}
                    requiredMsg={t('msgFieldRequired')}
                    validatedMsg={t('msgValidPercentage')}
                  />
                </Col>
              </Row>
            </Form>
          </Spin>
        </Modal>
      </div>
    );
  },
);

export default Form.create()(TaxSettingsForm);
