import React, {useState} from 'react';
import {Steps} from 'antd';

const {Step} = Steps;

export const Timeline = () => {
  const [current, setCurrent] = useState(4);
  return (
    <Steps current={current} onChange={(x: any) => setCurrent(x)} direction="vertical">
      <Step title="Step 1" description="Contact us" />
      <Step title="Step 2" description="Request for a ride" />
      <Step title="Step 3" status="finish" description="Succesfull Delivery" />
    </Steps>
  );
};
