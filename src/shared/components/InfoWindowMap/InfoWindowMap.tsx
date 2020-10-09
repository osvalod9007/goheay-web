import React, {useContext} from 'react';
import {Avatar, Button} from 'antd';
import {observer} from 'mobx-react-lite';

import AppStore from '../../../shared/stores/App.store';

import './InfoWindowMap.less';

type Props = {
  withAssign: boolean;
  data: any;
  onAssign?: (id) => void;
};

const InfoWindowMap = observer((props: Props) => {
  const appStore = useContext(AppStore);
  const API = `${process.env.REACT_APP_API}`;
  const STORAGE = `${process.env.REACT_APP_STORAGE}`;

  const {id, pickUpLocationAddress, driverId, fullName, email, fullMobilePhone, avatar} = props.data;
  const dataId = driverId ? driverId : id;

  return (
    <div className="info-window-map">
      <div className="info-window-map__flex-container">
        <div className="info-window-map__flex-item">
          <div className="info-window-map__flex-basic">
            <div className="info-window-map__avatar">
              {avatar && avatar.pathUrl ? (
                <React.Fragment>
                  <Avatar size={64} src={`${API}/${STORAGE}/${avatar.pathUrl}`} />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Avatar size={64} icon="user" />
                </React.Fragment>
              )}
            </div>
            <div className="info-window-map__info">
              <span style={{marginBottom: '5px'}}>{fullName ? fullName : '-'}</span>
              <br></br>
              <span style={{marginBottom: '5px'}}>{email ? email : '-'}</span>
              <br></br>
              <span style={{marginBottom: '5px'}}>{fullMobilePhone ? fullMobilePhone : '-'}</span>
              <br></br>
              <span>
                {props.withAssign ? (
                  <Button
                    type="primary"
                    className="info-window-map__button-submit"
                    onClick={() => props.onAssign && props.onAssign(dataId)}
                  >
                    Assign
                  </Button>
                ) : null}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default InfoWindowMap;
