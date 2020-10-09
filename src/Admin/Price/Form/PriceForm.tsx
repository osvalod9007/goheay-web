import React, {useContext, useEffect, useState} from 'react';
import {Card, Col, Button, Divider, Form, Row, Tabs} from 'antd';
import {useTranslation} from 'react-i18next';
import {useMutation} from 'react-apollo-hooks';
import {useRouter} from 'rift-router';
import {observer} from 'mobx-react-lite';
import gql from 'graphql-tag';
import {FormComponentProps} from 'antd/lib/form';

import AppStore from '../../../shared/stores/App.store';
import appModel from '../../../shared/models/App.model';

import HeadTitle from '../../../shared/components/HeadTitle/HeadTitle';
import openNotificationWithIcon from '../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';
import './PriceForm.less';
import priceModel from '../../../shared/models/Price.model';
import CardPriceByType from '../../../shared/components/CardPricing/CardPriceByType';
import {Price} from '../../../shared/cs/price.cs';
import {PriceProductSizePieceTypeEnum} from '../../../shared/enums/PriceProductSizePieceType.enum';
import CheckboxPriceByType from '../../../shared/components/CardPricing/CheckboxPriceByType';
import {SizeEnum} from '../../../shared/enums/Size.enum';

const TabPane = Tabs.TabPane;

type PriceFormProps = FormComponentProps;

const EDIT_MUTATION = gql`
  mutation($input: PriceProductSizeUpdateListInput!) {
    PriceProductSizeUpdate(input: $input) {
      total
      items {
        id
      }
    }
  }
`;

export const PriceForm = observer(
  (props: PriceFormProps): JSX.Element => {
    const appStore = useContext(AppStore);
    const {t} = useTranslation('app');
    const [formTitle, setFormTitle] = useState(t('labelAddPrice'));
    const [defaultActiveKey, setDefaultActiveKey] = useState('1');
    const [buttonTitle, setButtonTitle] = useState(t('labelAdd'));
    const [item, setItem] = useState(new Price());
    const [valueFirst, setValueFirst] = useState(false);
    const [valueSecond, setValueSecond] = useState(false);
    const [valueThird, setValueThird] = useState(false);
    const [valueFourth, setValueFourth] = useState(false);
    const router = useRouter();

    useEffect(() => {
      getData();

      // restart isEditing variable
      return () => {
        appStore.setIsEditing(false);
      };
    }, []);

    useEffect(() => {
      item.prices.length > 0 &&
        item.prices.forEach(price => {
          switch (price.productSize.labelSize.type) {
            case SizeEnum.TYPE_MEDIUM:
              setValueSecond(price.isEnabled);
              break;
            case SizeEnum.TYPE_LARGE:
              setValueThird(price.isEnabled);
              break;
            case SizeEnum.TYPE_HUGE:
              setValueFourth(price.isEnabled);
              break;
            default:
              setValueFirst(price.isEnabled);
              break;
          }
        });
      return () => {
        setValueFirst(false);
        setValueSecond(false);
        setValueFirst(false);
        setValueFourth(false);
      };
    }, [item.prices]);

    const getData = async () => {
      try {
        appStore.setIsLoading(true);
        const params: any = router;
        if (params && params.params && params.params.id) {
          appStore.setIsEditing(true);
          setButtonTitle(t('labelUpdate'));
          const input = {
            id: params.params.id,
          };
          const itemToEdit: any = await priceModel.get(input);
          itemToEdit &&
            itemToEdit.data &&
            itemToEdit.data.VehicleTypeGet &&
            setFormTitle(`${t('labelEditPrice')} ${t('labelOf')} ${itemToEdit.data.VehicleTypeGet.type}`);
          setItem({...new Price(itemToEdit.data.VehicleTypeGet)});
        }
        appStore.setIsLoading(false);
      } catch (e) {
        appStore.setIsLoading(false);
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
          openNotificationWithIcon('error', t('lavelSaveFailed'), error.message);
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
            appStore.setUserAction({
              ...appStore.userAction,
              ...{isSaved: true, action: appStore.isEditing ? 'updated' : 'created'},
            });
            appStore.setIsLoading(false);
            appStore.setIsEditing(false);
            router.to('/admin/price');
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

    const convertToSend: any = (values: any) => {
      const input: any = [];
      item.prices.forEach(price => {
        const itemToSend = {
          currencyBaseFare: {amount: 0, currency: 'USD'},
          currencyMileRate: {amount: 0, currency: 'USD'},
          currencyMinimumFare: {amount: 0, currency: 'USD'},
          currencyMileRateAfter: {amount: 0, currency: 'USD'},
          currencyLoadingUnloading: {amount: 0, currency: 'USD'},
          isEnabled: false,
          id: '',
        };
        switch (price.productSize.labelSize.type) {
          case SizeEnum.TYPE_MEDIUM:
            itemToSend.isEnabled = valueSecond;
            break;
          case SizeEnum.TYPE_LARGE:
            itemToSend.isEnabled = valueThird;
            break;
          case SizeEnum.TYPE_HUGE:
            itemToSend.isEnabled = valueFourth;
            break;
          default:
            itemToSend.isEnabled = valueFirst;
            break;
        }
        const {id} = price;
        for (const key in values) {
          if (values.hasOwnProperty(key)) {
            const splitted = key.split('&');
            const [keysplit] = splitted.slice(0);
            const [idsplit] = splitted.slice(-1);
            if (id === idsplit && keysplit !== 'estimateTime') {
              itemToSend[keysplit].amount = values[key];
              itemToSend.id = id;
            }
          }
        }
        itemToSend && itemToSend.id !== '' && itemToSend.isEnabled && input.push(itemToSend);
      });
      return input;
    };

    const handleSubmit = e => {
      e.preventDefault();
      props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          appStore.setIsLoading(true);
          const obj = convertToSend(values);
          appStore.setUserAction({...appStore.userAction, ...{typeOfElem: 'labelPrice'}});
          addMutation({variables: {input: {prices: obj}}}).catch(error => {
            handleCatch(error, values, '');
          });
        } else {
          const firstTab: any = [];
          const secondTab: any = [];
          for (const key in err) {
            if (err.hasOwnProperty(key)) {
              const splitted = key.split('&');
              const [type] = splitted.slice(1);
              type === PriceProductSizePieceTypeEnum.PIECE_TYPE_SIMPLE ? firstTab.push(key) : secondTab.push(key);
            }
          }
          firstTab.length > 0 && secondTab.length === 0
            ? setDefaultActiveKey('1')
            : firstTab.length === 0 && secondTab.length > 0
            ? setDefaultActiveKey('2')
            : setDefaultActiveKey(defaultActiveKey);
          const DOCUMENT: any = window.document;
          DOCUMENT.getElementsByClassName('content')[0].scroll({top: 0});
        }
      });
    };

    const onCancelForm = () => {
      appStore.setIsEditing(false);
      router.to('/admin/price');
    };

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
        md: {span: 10},
        lg: {span: 24},
        xl: {span: 24},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 15},
        md: {span: 18},
        lg: {span: 18},
        xl: {span: 18},
      },
    };
    const onChangeFirst = val => {
      setValueFirst(val.target.checked);
    };
    const onChangeSecond = val => {
      setValueSecond(val.target.checked);
    };
    const onChangeThird = val => {
      setValueThird(val.target.checked);
    };
    const onChangeFourth = val => {
      setValueFourth(val.target.checked);
    };

    const drawCards: any = (typeShow: any) => {
      const cards =
        item.prices.length > 0 &&
        item.prices.map(price => {
          const splitted = price.productSize.labelSize.type.split('_');
          const [titleCard] = splitted.slice(-1);
          let visible = false;
          switch (price.productSize.labelSize.type) {
            case SizeEnum.TYPE_MEDIUM:
              visible = valueSecond;
              break;
            case SizeEnum.TYPE_LARGE:
              visible = valueThird;
              break;
            case SizeEnum.TYPE_HUGE:
              visible = valueFourth;
              break;
            default:
              visible = valueFirst;
              break;
          }
          return (
            price.pieceType === typeShow &&
            visible && (
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <CardPriceByType
                  form={props.form}
                  item={price}
                  type={price.pieceType}
                  formItemLayout={formItemLayout}
                  idPrice={price.id}
                  isRequired={true}
                  label={titleCard}
                  validateLength={5}
                  validatedMsg={t('msgValidDecimalNumberTwoDigits')}
                  validatedMsg0={`${t('msgValidValueGreaterThan')} 0`}
                />
              </Col>
            )
          );
        });
      return cards;
    };

    return (
      <div className="price-form">
        <Form onSubmit={handleSubmit} layout="vertical" id={'price-form'} name={'price-form'} autoComplete={'off'}>
          <Card bordered={false} className="gutter-row">
            <Row type="flex" justify="space-between" align="middle" style={{marginBottom: '13px'}}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <HeadTitle icon="dollar" title={formTitle} />
                <Divider />
              </Col>
            </Row>
            <Row type="flex" justify="space-between" align="middle">
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Tabs activeKey={defaultActiveKey} onChange={activeKey => setDefaultActiveKey(activeKey)}>
                  <TabPane tab={t('labelSinglePrice')} key="1" />
                  <TabPane tab={t('labelMultiplePrice')} key="2" />
                </Tabs>
                <Row type="flex" justify="end" align="middle" style={{marginBottom: '13px'}}>
                  <CheckboxPriceByType
                    width={'300px'}
                    labelFirst={'S'}
                    labelSecond={'M'}
                    labelThird={'L'}
                    labelFourth={'H'}
                    valueFirst={valueFirst}
                    valueSecond={valueSecond}
                    valueThird={valueThird}
                    valueFourth={valueFourth}
                    onChangeFirst={onChangeFirst}
                    onChangeSecond={onChangeSecond}
                    onChangeThird={onChangeThird}
                    onChangeFourth={onChangeFourth}
                  />
                </Row>
                {!valueFirst && !valueSecond && !valueThird && !valueFourth && (
                  <Row type="flex" justify="center" align="middle">
                    <span className="not-display">{`${t('labelPleaseSelect')} ${t('labelSize').toLowerCase()}`}</span>
                  </Row>
                )}
                <Row
                  className="price-card"
                  type="flex"
                  justify="space-between"
                  align="middle"
                  style={{display: defaultActiveKey === '1' ? 'block' : 'none'}}
                >
                  {drawCards(PriceProductSizePieceTypeEnum.PIECE_TYPE_SIMPLE)}
                </Row>
                <Row
                  className="price-card"
                  type="flex"
                  justify="space-between"
                  align="middle"
                  style={{display: defaultActiveKey === '2' ? 'block' : 'none'}}
                >
                  {drawCards(PriceProductSizePieceTypeEnum.PIECE_TYPE_MULTIPLE)}
                </Row>
              </Col>
            </Row>
            <Button
              type="primary"
              htmlType="submit"
              className="price-form__button-submit"
              disabled={!valueFirst && !valueSecond && !valueThird && !valueFourth}
            >
              {buttonTitle}
            </Button>
            <Button type="default" className="price-form__button-cancel" onClick={() => onCancelForm()}>
              {t('labelCancel')}
            </Button>
          </Card>
        </Form>
      </div>
    );
  },
);

export default Form.create()(PriceForm);
