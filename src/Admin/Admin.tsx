import React, {Suspense, useContext, useEffect, useState} from 'react';
import {Avatar, Icon, Modal, Spin, Menu, Dropdown, Badge, Button} from 'antd';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {RiftGate, useRouter, RiftLink} from 'rift-router';
import useWindowChange from '../shared/OwnHooks/useWindowChange.hook';

import AppStore from '../shared/stores/App.store';
import appModel from '../shared/models/App.model';
import BreadCumbs from './BreadCumbs/BreadCumbs';

import {ListMenuManage} from './ManageMenu/ListManageMenu';
import ChangePassword from '../shared/components/ChangePassword/ChangePassword';

import './Admin.less';

import {Footer} from './Footer';
import Sidebar from './Sidebar';

const confirm = Modal.confirm;

const Admin = observer((props: any) => {
  const appStore = useContext(AppStore);
  const {t} = useTranslation('app');
  const [isCollapse, setIsCollapse] = useState(false);
  const windowWidth: any = useWindowChange();
  const router = useRouter();
  const isMobile = windowWidth <= 500;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Update user data in localStorage
    const data: any = appStore.getToken();
    if (appStore.getToken()) {
      data && data.dataUserAuth && appStore.setUserAuth(data.dataUserAuth);
      data && data.roles && appStore.setRoles(data.roles);
      data && data.permissions && appStore.setPermissions(data.permissions);
      data && data.companies && appStore.setCompanies(data.companies);
      data && data.mainRole && appStore.setMainRole(data.mainRole);
    } else {
      router.to('/admin/login');
    }
  }, []);

  useEffect(() => {
    const link: any = document.querySelector('link[rel*=icon]') || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = appStore.siteSettings.siteIconFile.publicUrl;
    document.getElementsByTagName('head')[0].appendChild(link);
  }, [appStore.siteSettings.siteIconFile.publicUrl]);

  // for changes in path
  useEffect(() => {
    let child: any;
    const elem: any = ListMenuManage.filter(item => {
      if (router && router.active && router.active.path && item.routeTo === router.active.path) {
        return item;
      } else {
        if (router && router.active && router.active.path && item.children) {
          child = item.children.filter(val => val.routeTo === router.active.path);
          if (child.length > 0) {
            return child;
          }
        }
      }
    });
    appStore.setItemSelected(
      child && child.length > 0 && child[0].idSelected
        ? child[0].idSelected
        : elem && elem.length > 0 && elem[0].idSelected
        ? elem[0].idSelected
        : 1,
    );
    appStore.setParentSelected(child && child.length > 0 ? elem[0].idSelected : 0);
    const length = ListMenuManage.length;
    ListMenuManage[length - 1].routeTo = router.active.path;
  }, [router.path]);

  useEffect(() => {
    // cause effect when isLoading change
    const abortController = new AbortController();
    return () => abortController.abort();
  }, []);

  useEffect(() => {
    // cause effect when isLoading change
  }, [appStore.isLoading]);

  useEffect(() => {
    if (isCollapse || isMobile) {
      setIsCollapse(true);
    }
  }, [windowWidth]);

  const showLogoutConfirm = () => {
    confirm({
      title: t('msgLogout'),
      okText: t('Yes'),
      okType: 'danger',
      cancelText: t('No'),
      onOk: () => {
        logOut();
      },
    });
  };

  const logOut = () => {
    appModel.logout();
    window.location.href = '/admin/dashboard';
    // swService.unRegister();
  };

  const showChangePassword = () => {
    appStore.setIsOpenModalLogOut(true);
  };

  const menuHeader = (
    <Menu className="admin-main__dropdown">
      {appStore.hasPermissions(appStore.permissions, [
        'AdministratorProfileGet',
        'AdministratorProfileUpdate',
        'FleetOwnerProfileGet',
        'FleetOwnerProfileUpdate',
      ]) && (
        <Menu.Item key="0">
          <RiftLink to={`/admin/accountsettings`}>
            <span>{t('labelAccountSettings')}</span>
          </RiftLink>
        </Menu.Item>
      )}
      <Menu.Item key="1" onClick={() => showChangePassword()}>
        {t('labelChangePassword')}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2" onClick={() => showLogoutConfirm()}>
        {t('labelLogout')}
      </Menu.Item>
    </Menu>
  );

  return (
    <Spin size="large" spinning={appStore.isLoading}>
      <div className="layout">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="content">
          <div className="header-bar ant-card ant-card-bordered">
            <div className="flex-basic">
              <Button
                className="sidebar-trigger-btn"
                type={'default'}
                shape={'circle'}
                onClick={() => setSidebarOpen(true)}
              >
                <Icon type="menu" />
              </Button>
              <BreadCumbs />
            </div>

            <div className="header-bar__right">
              {/* <Icon type="bell" style={{fontSize: '20px'}} theme="outlined" />
              <Badge count={5}>
                <Icon type="mail" style={{fontSize: '20px'}} />
              </Badge> */}

              <Dropdown overlay={menuHeader} trigger={['click']}>
                <Avatar shape="circle" size={32} src={appStore.userAuth.avatar.publicUrl} />
              </Dropdown>
            </div>
          </div>

          <Suspense fallback={<p>Loading..</p>}>
            <RiftGate />
          </Suspense>

          <Footer />
        </div>
      </div>
      <ChangePassword />
    </Spin>
  );
});

export default Admin;
