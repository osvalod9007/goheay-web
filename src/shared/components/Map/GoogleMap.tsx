import React, {useContext, useEffect, useRef, useState} from 'react';
import {notification} from 'antd';
import Marker from './Marker/Marker';
import io from 'socket.io-client';
import MapStore from '../../../shared/stores/Map.store';

import './GoogleMap.less';

const AnyReactComponent = ({text}: any) => <div>{text}</div>;

const openNotificationWithIcon = (type, message, description) => {
  notification[type]({
    message,
    description,
  });
};

const GoogleMap = (props: any): JSX.Element => {
  return <div id={props.id} className="google-map" />;
};

export default GoogleMap;
