import React, {useContext} from 'react';
import {Menu, Icon} from 'antd';
import {RiftLink} from 'rift-router';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import AppStore from '../../shared/stores/App.store';

import './AdminManageMenu.less';

const SubMenu = Menu.SubMenu;

const AdminManageMenu = observer((props: any) => {
  const appStore = useContext(AppStore);
  const {t} = useTranslation('app');

  return (
    <div className="admin-manage-menu">
      <Menu
        style={{minHeight: '100vh', backgroundColor: '#263238'}}
        mode="inline"
        selectedKeys={[String(props.selected)]}
        defaultOpenKeys={props.parentSelected !== 0 ? [String(props.parentSelected)] : ['']}
        theme="dark"
      >
        {props.menuconfig.sort((a, b) => {
          return a.weight - b.weight;
        }) &&
          props.menuconfig.map(
            item =>
              item.name !== '' &&
              (appStore.hasPermissions(appStore.permissions, item.permissions) &&
                (item.isSubMenu ? (
                  <SubMenu
                    key={item.id}
                    title={
                      <React.Fragment>
                        <Icon type={item.iconClass} style={{color: '#fff', fontSize: '20px'}} />
                        <span>{t(`${item.name}`)}</span>
                      </React.Fragment>
                    }
                  >
                    {item.children.sort((a, b) => {
                      return a.weight - b.weight;
                    }) &&
                      item.children.map(
                        i =>
                          i.name !== '' &&
                          (appStore.hasPermissions(appStore.permissions, i.permissions) && (
                            <Menu.Item key={i.id}>
                              <RiftLink to={i.routeTo}>
                                <Icon type={i.iconClass} style={{color: '#fff', fontSize: '20px'}} />
                                <span>{t(`${i.name}`)}</span>
                              </RiftLink>
                            </Menu.Item>
                          )),
                      )}
                  </SubMenu>
                ) : (
                  <Menu.Item key={item.id}>
                    <RiftLink to={item.routeTo}>
                      <Icon type={item.iconClass} style={{color: '#fff', fontSize: '20px'}} />
                      <span>{t(`${item.name}`)}</span>
                    </RiftLink>
                  </Menu.Item>
                ))),
          )}
      </Menu>
    </div>
  );
});

export default AdminManageMenu;
