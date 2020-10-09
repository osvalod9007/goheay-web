import React from 'react';
import {Icon} from 'antd';

import './HeadTitle.less';

interface Props {
  icon: string;
  title: string;
}

const HeadTitle = (props: Props) => {
  return (
    <div style={{textAlign: 'left'}}>
      <span style={{fontSize: 18, fontWeight: 'bold'}}>
        <Icon type={props.icon} /> {props.title}
      </span>
    </div>
  );
};

export default HeadTitle;
