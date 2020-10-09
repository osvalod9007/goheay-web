import * as React from 'react';
import {Col, Row, Checkbox} from 'antd';
import {useTranslation} from 'react-i18next';
import FormItem from 'antd/lib/form/FormItem';

type Props = {
  width?: string;
  labelFirst?: string;
  labelSecond?: string;
  labelThird?: string;
  labelFourth?: string;
  valueFirst?: boolean;
  valueSecond?: boolean;
  valueThird?: boolean;
  valueFourth?: boolean;
  onChangeFirst?: any;
  onChangeSecond?: any;
  onChangeThird?: any;
  onChangeFourth?: any;
};
const CheckboxPriceByType = (props: Props) => {
  const {t} = useTranslation('app');
  const {
    width,
    labelFirst,
    labelSecond,
    labelThird,
    labelFourth,
    valueFirst,
    valueSecond,
    valueThird,
    valueFourth,
    onChangeFirst,
    onChangeSecond,
    onChangeThird,
    onChangeFourth,
  } = props;

  return (
    <React.Fragment>
      <Row type={'flex'} justify={'space-around'} style={{width: width || '100%', marginRight: '20px'}}>
        <Col>
          <Checkbox
            checked={valueFirst}
            onChange={e => {
              onChangeFirst && onChangeFirst(e);
            }}
          >
            {labelFirst}
          </Checkbox>
        </Col>
        <Col>
          <Checkbox
            checked={valueSecond}
            onChange={e => {
              onChangeSecond && onChangeSecond(e);
            }}
          >
            {labelSecond}
          </Checkbox>
        </Col>
        <Col>
          <Checkbox
            checked={valueThird}
            onChange={e => {
              onChangeThird && onChangeThird(e);
            }}
          >
            {labelThird}
          </Checkbox>
        </Col>
        <Col>
          <Checkbox
            checked={valueFourth}
            onChange={e => {
              onChangeFourth && onChangeFourth(e);
            }}
          >
            {labelFourth}
          </Checkbox>
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default CheckboxPriceByType;
