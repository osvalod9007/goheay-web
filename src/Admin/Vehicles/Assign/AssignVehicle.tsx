import React, {useContext, ReactElement, useState, useEffect} from 'react';
import {Form, Icon, Modal, Spin, Input, AutoComplete, Select} from 'antd';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import {FormComponentProps} from 'antd/lib/form';

import AppStore from '../../../shared/stores/App.store';
import driverModel from '../../../shared/models/Driver.model';
import openNotificationWithIcon from '../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';

import './AssignVehicle.less';
import VehicleStore from '../../../shared/stores/Vehicle.store';
import gql from 'graphql-tag';
import {useMutation} from 'react-apollo-hooks';
import {useRouter} from 'rift-router';
import FormItem from 'antd/lib/form/FormItem';
import Search from 'antd/lib/input/Search';
import {InputProps} from 'antd/lib/input';
import {DriverStatusEnum} from '../../../shared/enums/DriverStatus.enum';
import {DataSourceItemType} from 'antd/lib/auto-complete';
import appModel from '../../../shared/models/App.model';

type LoginFormProps = FormComponentProps;

export const AssignVehicle = observer(
  (props: LoginFormProps): JSX.Element => {
    const appStore = useContext(AppStore);
    const vehicleStore = useContext(VehicleStore);
    const [drivers, setDrivers] = useState([]);
    const {t} = useTranslation('app');
    const router = useRouter();

    useEffect(() => {
      appStore.isOpenModalForm && loadDrivers();
    }, [appStore.isOpenModalForm]);

    const ASSIGN_MUTATION = gql`
      mutation($input: VehicleAssignInput!) {
        VehicleAssign(input: $input)
      }
    `;

    const assignMutation = useMutation(ASSIGN_MUTATION, {
      update: (proxy, result) => {
        /* your custom update logic */
        setTimeout(() => {
          appStore.setIsLoading(true);
          const {errors} = result;
          if (!errors) {
            appStore.setUserAction({
              ...appStore.userAction,
              ...{isSaved: true, action: props.form.getFieldValue('driverId') === '0' ? 'unassigned' : 'assigned'},
            });
            appStore.setIsLoading(false);
            appStore.setIsEditing(false);
            vehicleStore.setIdParent('');
            vehicleStore.setIsUpdateList(true);
            vehicleStore.setDriverAssigned(false);
            appStore.setIsOpenModalForm(false);
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
      e.preventDefault();
      props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          appStore.setIsLoading(true);
          appStore.setUserAction({...appStore.userAction, ...{typeOfElem: 'labelVehicle'}});
          assignMutation({
            variables: {
              input: {
                ...values,
              },
            },
          }).catch(error => {
            handleCatch(error, values, '');
            appStore.setIsLoading(false);
          });
        } else {
          const error = t('errorMsgAuthAdmin');
          appStore.setHasError(true);
          appStore.setErrorMsg(error);
        }
      });
    };

    const handleCatch = (error, values, textType) => {
      if (error && error.networkError && error.networkError.statusCode === 403) {
        appModel.logout();
        window.location.href = '/admin/login';
      } else {
        const {validation} = error.graphQLErrors[0];
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

            if (msg !== '' && keysplit !== 'Assign') {
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
    };

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
        md: {span: 10},
        lg: {span: 9},
        xl: {span: 9},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 15},
        md: {span: 12},
        lg: {span: 15},
        xl: {span: 15},
      },
    };
    const {getFieldDecorator} = props.form;
    const {Option: AutoCompleteOption} = AutoComplete;

    const drawDrivers = () => {
      const draw = drivers.map(
        (driver: any) =>
          (
            <AutoCompleteOption
              {...{
                key: JSON.stringify(driver),
                name: driver.name.toString(),
                value: `${driver.id}`,
              }}
            >
              {driver.name} {driver.phone}
            </AutoCompleteOption>
          ) as DataSourceItemType,
      );
      vehicleStore.driverAssigned &&
        draw.unshift((
          <AutoCompleteOption
            {...{
              key: JSON.stringify(t('labelNoDriver')),
              name: t('labelNoDriver').toString(),
              value: '0',
            }}
          >
            {t('labelNoDriver')}
          </AutoCompleteOption>
        ) as DataSourceItemType);
      return draw;
    };
    const onInputKeyDownDriverName = (e: any) => {
      const w = e.which;
      if (
        !(
          /^[a-zA-Z\s]$/.test(e.key) ||
          w === 17 ||
          w === 8 ||
          // w === 9 ||
          w === 46 ||
          w === 86 ||
          w === 66 ||
          (w > 36 && w < 41)
        )
      ) {
        e.preventDefault();
      } else {
        if (!appStore.isLoading) {
          setTimeout(() => {
            appStore.setIsLoading(true);
            loadDrivers(props.form.getFieldValue(`driverId`) || '');
          }, 400);
        }
      }
    };

    const loadDrivers = async (name: string = '') => {
      try {
        appStore.setIsLoading(true);
        const driversList: any = await driverModel.listDrivers({
          where:
            name !== ''
              ? [
                  {field: 'status', op: 'EQ', value: DriverStatusEnum.STATUS_CLEAR},
                  {field: 'keyword', value: name, op: 'CONTAIN'},
                  {field: 'vehicle.id', op: 'IS_NULL', value: '0'},
                ]
              : [
                  {field: 'status', op: 'EQ', value: DriverStatusEnum.STATUS_CLEAR},
                  {field: 'vehicle.id', op: 'IS_NULL', value: '0'},
                ],
          page: 1,
          pageSize: 1000,
        });
        if (driversList && driversList.data && driversList.data.DriverList) {
          const mappedDrivers = driversList.data.DriverList.items.map(driver => {
            return {
              id: driver.id,
              name: driver.basicProfile.fullName,
              phone: driver.basicProfile.fullMobilePhone,
            };
          });
          setDrivers(mappedDrivers.length > 0 ? mappedDrivers : []);
          if (mappedDrivers.length === 0 && props.form.getFieldValue('driverId')) {
            const driverId = {
              value: props.form.getFieldValue('driverId'),
              errors: [new Error(`${t('msgValidNoMatch')} ${props.form.getFieldValue('driverId')}.`)],
            };
            props.form.setFields({driverId});
          }
          appStore.setIsLoading(false);
        } else {
          appStore.setIsLoading(false);
        }
      } catch (error) {
        appStore.setIsLoading(false);
      }
    };

    return (
      <div className="assign-vehicle-view-modal">
        <Modal
          title={
            <React.Fragment>
              <Icon type="check-square" /> {t('labelAssignVehicle')}
            </React.Fragment>
          }
          visible={appStore.isOpenModalForm}
          onCancel={() => {
            vehicleStore.setIdParent('');
            vehicleStore.setIsUpdateList(false);
            vehicleStore.setDriverAssigned(false);
            appStore.setIsOpenModalForm(false);
          }}
          okText={t('labelAssign')}
          cancelText={t('labelCancel')}
          okButtonProps={{disabled: appStore.isLoading}}
          cancelButtonProps={{disabled: appStore.isLoading}}
          width={'617px'}
          onOk={handleSubmit}
          destroyOnClose={true}
        >
          <Spin spinning={appStore.isLoading} size="large">
            <Form>
              <FormItem
                {...formItemLayout}
                hasFeedback
                style={{marginBottom: '0px'}}
                label={t('labelDriversAvailable')}
              >
                {getFieldDecorator(`driverId`, {
                  rules: [
                    {
                      message: t('msgFieldRequired'),
                      required: true,
                    },
                  ],
                })(
                  <AutoComplete
                    placeholder={drivers.length > 0 ? t('msgValidDriverNotEmpty') : t('msgValidNotDriversAvailable')}
                    dataSource={drawDrivers()}
                    children={<Search onKeyDown={onInputKeyDownDriverName} /> as ReactElement<InputProps>}
                    optionLabelProp={'name'}
                    filterOption={(inputValue, option: any) =>
                      option.props.children
                        .toString()
                        .toUpperCase()
                        .indexOf(inputValue.toUpperCase()) !== -1
                    }
                  />,
                )}
              </FormItem>
              <FormItem style={{marginBottom: '0px', marginLeft: '34%'}}>
                {getFieldDecorator('vehicleId', {
                  initialValue: vehicleStore.idParent,
                })(<Input type="hidden" />)}
              </FormItem>
            </Form>
          </Spin>
        </Modal>
      </div>
    );
  },
);

export default Form.create()(AssignVehicle);
