import React, {useContext, useEffect} from 'react';
import {Avatar, Icon, Menu} from 'antd';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {RiftLink} from 'rift-router';

import AppStore from '../shared/stores/App.store';

import logo from './GOH-logo.png';

import './SidebarContent.less';

const {SubMenu} = Menu;

type Props = {
  inDrawer?: boolean;
  menuConfig: any[];
  onClose?: any;
};
const SidebarContent = observer((props: Props) => {
  const appStore = useContext(AppStore);
  const {t} = useTranslation('app');

  useEffect(() => {
    const element = document.getElementById('sidebar__div-container');
    const elementParent: any = element!.offsetParent;
    ResizeSensor(element, () => {
      const height = (elementParent as any).offsetHeight - element!.offsetHeight;
      if (height > 185) {
        elementParent.classList.remove('sidebar--hide-img');
      } else {
        elementParent.classList.add('sidebar--hide-img');
      }
    });
  });

  return (
    <div id="sidebar__div-container">
      <div style={{padding: 15}}>
        <img src={appStore.siteSettings.siteLogoFile.publicUrl} style={{maxWidth: 205, minHeight: 50}} alt="" />
      </div>
      <div className="sidebar__avatar">
        <Avatar
          size="large"
          shape="circle"
          src={appStore.userAuth && appStore.userAuth.avatar ? appStore.userAuth.avatar.publicUrl : ''}
        ></Avatar>
        <div className="sidebar__avatar-text">
          <b>
            {appStore.userAuth && appStore.userAuth.firstName ? appStore.userAuth.firstName : '-'}{' '}
            {appStore.userAuth && appStore.userAuth.lastName ? appStore.userAuth.lastName : '-'}
          </b>
          <div>
            <small>{appStore.userAuth && appStore.userAuth.email ? appStore.userAuth.email : '-'}</small>
          </div>
        </div>
      </div>
      <Menu
        // mode={props.inDrawer ? 'inline' : 'vertical'}
        mode="inline"
        selectedKeys={[String(appStore.itemSelected)]}
        defaultOpenKeys={appStore.parentSelected !== 0 ? [String(appStore.parentSelected)] : ['']}
      >
        {props.menuConfig.sort((a, b) => {
          return a.weight - b.weight;
        }) &&
          props.menuConfig.map(
            item =>
              item.name !== '' &&
              item.name !== 'labelDrivers' &&
              (appStore.hasRole(appStore.roles, item.role) &&
                appStore.hasPermissions(appStore.permissions, item.permissions) &&
                (item.isSubMenu ? (
                  <SubMenu
                    key={item.id}
                    title={
                      <React.Fragment>
                        <Icon type={item.iconClass} />
                        <span>{t(`${item.name}`)}</span>
                      </React.Fragment>
                    }
                    onTitleClick={e => {
                      const element: any = e.domEvent.currentTarget;
                      setTimeout(() => {
                        element && element.scrollIntoView();
                      }, 300);
                    }}
                  >
                    {item.children.sort((a, b) => {
                      return a.weight - b.weight;
                    }) &&
                      item.children.map(
                        i =>
                          i.name !== '' &&
                          (appStore.hasPermissions(appStore.permissions, i.permissions) && (
                            <Menu.Item key={i.id}>
                              <RiftLink
                                to={i.routeTo}
                                onClick={() => {
                                  props.inDrawer && props.onClose();
                                }}
                              >
                                <Icon type={i.iconClass} />
                                <span>{t(`${i.name}`)}</span>
                              </RiftLink>
                            </Menu.Item>
                          )),
                      )}
                  </SubMenu>
                ) : (
                  <Menu.Item key={item.id}>
                    <RiftLink
                      to={item.routeTo}
                      onClick={() => {
                        props.inDrawer && props.onClose();
                      }}
                    >
                      <Icon type={item.iconClass} />
                      <span>{t(`${item.name}`)}</span>
                    </RiftLink>
                  </Menu.Item>
                ))),
          )}
      </Menu>
    </div>
  );
});

export default SidebarContent;

function ResizeSensor(element, callback) {
  let zIndex = +getComputedStyle(element);
  if (isNaN(zIndex)) {
    zIndex = 0;
  }
  zIndex--;

  const expand = document.createElement('div');
  expand.style.position = 'absolute';
  expand.style.left = '0px';
  expand.style.top = '0px';
  expand.style.right = '0px';
  expand.style.bottom = '0px';
  expand.style.overflow = 'hidden';
  expand.style.zIndex = `${zIndex}`;
  expand.style.visibility = 'hidden';

  const expandChild = document.createElement('div');
  expandChild.style.position = 'absolute';
  expandChild.style.left = '0px';
  expandChild.style.top = '0px';
  expandChild.style.width = '10000000px';
  expandChild.style.height = '10000000px';
  expand.appendChild(expandChild);

  const shrink = document.createElement('div');
  shrink.style.position = 'absolute';
  shrink.style.left = '0px';
  shrink.style.top = '0px';
  shrink.style.right = '0px';
  shrink.style.bottom = '0px';
  shrink.style.overflow = 'hidden';
  shrink.style.zIndex = `${zIndex}`;
  shrink.style.visibility = 'hidden';

  const shrinkChild = document.createElement('div');
  shrinkChild.style.position = 'absolute';
  shrinkChild.style.left = '0px';
  shrinkChild.style.top = '0px';
  shrinkChild.style.width = '200%';
  shrinkChild.style.height = '200%';
  shrink.appendChild(shrinkChild);

  element.appendChild(expand);
  element.appendChild(shrink);

  function setScroll() {
    expand.scrollLeft = 10000000;
    expand.scrollTop = 10000000;

    shrink.scrollLeft = 10000000;
    shrink.scrollTop = 10000000;
  }
  setScroll();

  const size = element.getBoundingClientRect();

  let currentWidth = size.width;
  let currentHeight = size.height;

  const onScroll = () => {
    const sizeOnScroll = element.getBoundingClientRect();

    const newWidth = sizeOnScroll.width;
    const newHeight = sizeOnScroll.height;

    if (newWidth !== currentWidth || newHeight !== currentHeight) {
      currentWidth = newWidth;
      currentHeight = newHeight;

      callback();
    }

    setScroll();
  };

  expand.addEventListener('scroll', onScroll);
  shrink.addEventListener('scroll', onScroll);
}
