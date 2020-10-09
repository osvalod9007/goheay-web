import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Col, Divider, Form, Row} from 'antd';
import {useTranslation} from 'react-i18next';
import {useMutation} from 'react-apollo-hooks';
import {observer} from 'mobx-react-lite';
import gql from 'graphql-tag';
import {FormComponentProps} from 'antd/lib/form';

import AppStore from '../../../shared/stores/App.store';
import {SiteSetting} from '../../../shared/cs/siteSettings.cs';
import settingsModel from '../../../shared/models/Settings.model';
import appModel from '../../../shared/models/App.model';

import HeadTitle from '../../../shared/components/HeadTitle/HeadTitle';

import './SiteSettings.less';

import InputEmailField from '../../../shared/components/Inputs/InputEmailField';
import InputPhoneField from '../../../shared/components/Inputs/InputPhoneField';
import InputNumberField from '../../../shared/components/Inputs/InputNumberField';
import InputWithPatternField from '../../../shared/components/Inputs/InputWithPatternField';
import UploadImage from '../../../shared/components/UploadImage/UploadImage';
import formatPhone from '../../../shared/utils/formatPhone';

import openNotificationWithIcon from '../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';
import {useRouter} from 'rift-router';
import {FormatPhoneTypeEnum} from '../../../shared/enums/FormatPhoneType.enum';
import {UnitTimeEnum} from '../../../shared/enums/UnitTime.enum';
import {UnitLengthEnum} from '../../../shared/enums/UnitLength.enum';
import formatNumber from '../../../shared/utils/FormatNumber';

type LoginFormProps = FormComponentProps;

const EDIT_MUTATION = gql`
  mutation($input: SiteSettingUpdateInput!) {
    SiteSettingUpdate(input: $input) {
      siteLogoFile {
        id
        name
        publicUrl
        mimeType
        size
      }
      siteIconFile {
        id
        name
        publicUrl
        mimeType
        size
      }
      siteCopyright
    }
  }
`;

export const SiteSettings = observer(
  (props: LoginFormProps): JSX.Element => {
    const appStore = useContext(AppStore);
    const router = useRouter();
    const {t} = useTranslation('app');
    const [item, setItem] = useState(new SiteSetting());

    const tabIndexFieldsOrder: any = [
      'siteName',
      'measureOpportunityTimeout',
      'measureSearchRadius',
      'gMapFrontendKey',
      'gMapBackendKey',
      'gMapMobileKey',
      'siteCopyright',
      'mobileAppPlayStoreUrl',
      'mobileAppStoreUrl',
      'siteContactPhoneNumber',
      'supportEmail',
    ];

    useEffect(() => {
      // tabIndex order for the fields
      tabIndexFieldsOrder &&
        tabIndexFieldsOrder.forEach((field: any, index: any) => {
          if ((document as any).getElementById(field)) {
            (document as any).getElementById(field).tabIndex = index + 1;
          }
        });
      getItem();
    }, []);

    // request Item to edit
    const getItem = async () => {
      try {
        appStore.setIsLoading(true);
        const itemToEdit: any = await settingsModel.getSiteSettings();
        setItem({...new SiteSetting(itemToEdit.data.SiteSettingGet)});
        appStore.setIsLoading(false);
      } catch (e) {
        appStore.setIsLoading(false);
        handleCatch(e, {}, '');
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

    const addMutation = useMutation(EDIT_MUTATION, {
      update: (proxy, result) => {
        /* your custom update logic */
        setTimeout(() => {
          appStore.setIsLoading(true);
          const {errors, data} = result;
          if (!errors) {
            appStore.setIsLoading(false);
            appStore.setIsEditing(false);
            const msg = `${t('labelThe')} ${t('labelSiteSettings')} ${t('labelWereUpdated')}.`;
            openNotificationWithIcon('success', msg, '');
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
          const {
            upload_siteLogoFile,
            upload_siteIconFile,
            siteLogoFile,
            siteIconFile,
            siteContactPhoneNumber,
            measureOpportunityTimeout,
            measureSearchRadius,
            ...all
          } = values;
          const mobilePhoneE164 = formatPhone.formatToString(siteContactPhoneNumber);
          const obj = {
            measureOpportunityTimeout: {
              amount: measureOpportunityTimeout,
              unit: UnitTimeEnum.seconds,
            },
            measureSearchRadius: {
              amount: measureSearchRadius,
              unit: UnitLengthEnum.miles,
            },
            siteContactPhoneNumber: mobilePhoneE164,
            ...all,
            ...(upload_siteLogoFile && {
              siteLogoFile: {
                data: upload_siteLogoFile.originFileObj,
              },
            }),
            ...(upload_siteIconFile && {
              siteIconFile: {
                data: upload_siteIconFile.originFileObj,
              },
            }),
          };
          addMutation({variables: {input: {...obj}}})
            .then(res => {
              const siteLogo = res.data.SiteSettingUpdate.siteLogoFile;
              const iconLogo = res.data.SiteSettingUpdate.siteIconFile;
              setItem({...item, ...{siteLogoFile: siteLogo, siteIconFile: iconLogo}});
              res &&
                res.data &&
                res.data.SiteSettingUpdate &&
                appStore.setSiteSettings({...new SiteSetting(res.data.SiteSettingUpdate)});
            })
            .catch(error => {
              handleCatch(error, values, '');
            });
        } else {
          appStore.setHasError(true);
        }
      });
    };

    const handleSiteLogo = (siteLogoFile: any) => {
      // setItem({...item, ...{siteLogoFile}});
    };

    const handleImageIcon = (siteIconFile: any) => {
      // setItem({...item, ...{siteIconFile}});
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

    const formImagePreviewLayout = {
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 15},
        md: {span: 12},
        lg: {span: 10},
        xl: {span: 14},
      },
    };

    const regExp = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;

    const focusInput = component => {
      if (component) {
        component.focus();
      }
    };

    const validateFieldProviderOppTimeOut = (rule, val, callback) => {
      setTimeout(() => {
        const expR = /^\d*(\d+)?$/;
        if (val !== '' && val !== null && val !== undefined && String(val).match(expR)) {
          if (parseFloat(val) < 0 || parseFloat(val) > 300) {
            callback([new Error(`${t('msgValidMaxValueAllowed')} 300`)]);
          } else {
            callback();
          }
        } else if (val !== '' && val !== null && val !== undefined && !String(val).match(expR)) {
          callback([new Error(`${t('msgValidNumber')}`)]);
        } else {
          callback();
        }
      }, 300);
    };
    const validateFieldProviderSearchRadius = (rule, val, callback) => {
      setTimeout(() => {
        const expR = /^\d*(\d+)?$/;
        if (val !== '' && val !== null && val !== undefined && String(val).match(expR)) {
          if (parseFloat(val) < 0 || parseFloat(val) > 30) {
            callback([new Error(`${t('msgValidMaxValueAllowed')} 30`)]);
          } else {
            callback();
          }
        } else if (val !== '' && val !== null && val !== undefined && !String(val).match(expR)) {
          callback([new Error(`${t('msgValidNumber')}`)]);
        } else {
          callback();
        }
      }, 300);
    };

    return (
      <div className="site-settings">
        <Form onSubmit={handleSubmit} layout="vertical" id={'site-settings'} autoComplete={'off'}>
          <Card bordered={false} className="gutter-row">
            <Row type="flex" justify="space-between" align="middle" style={{marginBottom: '13px'}}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <HeadTitle icon="tool" title={t('labelSiteSettings')} />
                <Divider />
              </Col>
            </Row>
            <Row type="flex" justify="space-between" align="top">
              <Col xs={24} sm={12} md={24} lg={12} xl={12}>
                <InputWithPatternField
                  placeholder={t('labelPlaceHolderSiteName')}
                  label={t('labelSiteName')}
                  required={true}
                  form={props.form}
                  propertyName="siteName"
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                  value={item.siteName}
                  validateLength={15}
                  validatedMsg={`${t('msgValidSiteName')} 15 ${t('msgCharactersMaximum')}`}
                  pattern={/^[0-9A-Za-z' -]+$/}
                />
              </Col>
              <Col xs={24} sm={12} md={24} lg={12} xl={12}></Col>
            </Row>
            <Divider />
            <Row type="flex" justify="space-between" align="top">
              <Col xs={24} sm={12} md={24} lg={12} xl={12}>
                <UploadImage
                  form={props.form}
                  label={t('labelSiteLogo')}
                  imageUrl={item.siteLogoFile.publicUrl}
                  propertyName="siteLogoFile"
                  isRequired={true}
                  formItemLayout={formItemLayout}
                  handleUpdatePicture={handleSiteLogo}
                  requiredMsg={t('msgFieldRequired')}
                />
              </Col>
              <Col xs={24} sm={12} md={24} lg={12} xl={12}>
                <UploadImage
                  form={props.form}
                  label={t('labelSiteIcon')}
                  imageUrl={item.siteIconFile.publicUrl}
                  propertyName="siteIconFile"
                  isRequired={true}
                  formItemLayout={formItemLayout}
                  handleUpdatePicture={handleImageIcon}
                  requiredMsg={t('msgFieldRequired')}
                />
              </Col>
            </Row>
            <Row type="flex" justify="space-between" align="top">
              <Col xs={24} sm={12} md={24} lg={12} xl={12}>
                <InputNumberField
                  placeholder={t('labelPlaceHolderProviderOppTimeOut')}
                  label={t('labelProviderOppTimeOut')}
                  required={true}
                  form={props.form}
                  propertyName="measureOpportunityTimeout"
                  validateLength={3}
                  maxlength={3}
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                  value={String(formatNumber.formatFloat(item.measureOpportunityTimeout, 0))}
                  validatedMsg={t('msgValidNumber')}
                  onValidate={validateFieldProviderOppTimeOut}
                />
                <InputWithPatternField
                  placeholder={t('labelPlaceHolderFeGoogleMapKey')}
                  label={t('labelFeGoogleKey')}
                  required={true}
                  form={props.form}
                  propertyName="gMapFrontendKey"
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                  value={item.gMapFrontendKey}
                  validatedMsg={`${t('msgValidGoogleMapKey')}`}
                  pattern={/^[0-9a-zA-Z_]+$/}
                />
                <InputWithPatternField
                  placeholder={t('labelPlaceHolderMobileGoogleMapKey')}
                  label={t('labelMobileGoogleKey')}
                  required={true}
                  form={props.form}
                  propertyName="gMapMobileKey"
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                  value={item.gMapMobileKey}
                  validatedMsg={`${t('msgValidGoogleMapKey')}`}
                  pattern={/^[0-9a-zA-Z_]+$/}
                />
                <InputWithPatternField
                  placeholder={t('labelPlaceHolderPlayStoreLink')}
                  label={t('labelPlayStoreLink')}
                  required={true}
                  form={props.form}
                  propertyName="mobileAppPlayStoreUrl"
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                  value={item.mobileAppPlayStoreUrl}
                  validatedMsg={`${t('msgValidLink')}`}
                  pattern={regExp}
                />
                <InputPhoneField
                  placeholder={t('labelPlaceHolderContactNumber')}
                  required={true}
                  requiredCode={true}
                  form={props.form}
                  propertyName={'siteContactPhoneNumber'}
                  propertyNameCode={'siteContactPhoneNumberCode'}
                  value={formatPhone.formatsGeneral(
                    item.siteContactPhoneNumber,
                    false,
                    '1',
                    FormatPhoneTypeEnum.NATIONAL,
                  )}
                  valueCode={item.siteContactPhoneNumberCode}
                  label={t('labelContactNumber')}
                  validateLength={10}
                  formItemLayout={formItemLayout}
                  validatedMsg={t('msgValidContactNumber')}
                  requiredMsg={t('msgFieldRequired')}
                  disabledCode={true}
                />
              </Col>
              <Col xs={24} sm={12} md={24} lg={12} xl={12}>
                <InputNumberField
                  placeholder={t('labelPlaceHolderProviderSearchRadius')}
                  label={t('labelProviderSearchRadius')}
                  required={true}
                  form={props.form}
                  propertyName="measureSearchRadius"
                  validateLength={2}
                  maxlength={2}
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                  value={formatNumber.formatFloat(item.measureSearchRadius, 0)}
                  validatedMsg={t('msgValidNumber')}
                  onValidate={validateFieldProviderSearchRadius}
                />
                <InputWithPatternField
                  placeholder={t('labelPlaceHolderBkGoogleMapKey')}
                  label={t('labelBkGoogleKey')}
                  required={true}
                  form={props.form}
                  propertyName="gMapBackendKey"
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                  value={item.gMapBackendKey}
                  validatedMsg={`${t('msgValidGoogleMapKey')}`}
                  pattern={/^[0-9a-zA-Z_]+$/}
                />
                <InputWithPatternField
                  placeholder={t('labelPlaceHolderCopyright')}
                  label={t('labelCopyright')}
                  required={true}
                  form={props.form}
                  propertyName="siteCopyright"
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                  value={item.siteCopyright}
                  validatedMsg={`${t('msgValidCopyright')}`}
                  pattern={/^[0-9a-zA-Z© ]+$/}
                />
                <InputWithPatternField
                  placeholder={t('labelPlaceHolderAppStoreLink')}
                  label={t('labelAppStoreLink')}
                  required={true}
                  form={props.form}
                  propertyName="mobileAppStoreUrl"
                  formItemLayout={formItemLayout}
                  requiredMsg={t('msgFieldRequired')}
                  value={item.mobileAppStoreUrl}
                  validatedMsg={`${t('msgValidLink')}`}
                  pattern={regExp}
                />
                <InputEmailField
                  placeholder={t('labelPlaceHolderEmail')}
                  form={props.form}
                  label={t('labelEmail')}
                  required={true}
                  propertyName={'supportEmail'}
                  formItemLayout={formItemLayout}
                  validateLength={50}
                  requiredMsg={t('msgFieldRequired')}
                  value={item.supportEmail}
                  validatedMsg={t('msgValidEmail')}
                />
              </Col>
            </Row>
            <Button type="primary" htmlType="submit" className="site-settings__button-submit">
              {`${t('labelUpdate')}`}
            </Button>
          </Card>
        </Form>
      </div>
    );
  },
);

export default Form.create()(SiteSettings);
