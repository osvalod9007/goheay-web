import React, {useContext} from 'react';
import './Footer.less';
import {observer} from 'mobx-react-lite';
import AppStore from '../shared/stores/App.store';

export const Footer: React.FC = observer((props: any) => {
  const appStore = useContext(AppStore);
  return (
    <footer className="goh-footer-container">
      <div className="goh-footer">
        <div>
          <span className="goh-footer__text">Copyright {appStore.siteSettings.siteCopyright} </span>
        </div>
      </div>
    </footer>
  );
});
