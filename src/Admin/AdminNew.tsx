import React, {Suspense, useContext, useEffect, useState} from 'react';
import {Avatar, Layout, Icon, Modal, Spin, Menu, Dropdown, Breadcrumb, Badge, Button} from 'antd';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {RiftGate, useRouter, RiftLink} from 'rift-router';
import useWindowChange from '../shared/OwnHooks/useWindowChange.hook';

import AppStore from '../shared/stores/App.store';
import appModel from '../shared/models/App.model';
// import BreadCumbs from './BreadCumbs/BreadCumbs';

import AdminManageMenu from './ManageMenu/AdminManageMenu';
import {ListMenuManage} from './ManageMenu/ListManageMenu';
import ChangePassword from '../shared/components/ChangePassword/ChangePassword';

import './AdminNew.less';
import {Footer} from './Footer';
import Sidebar from './Sidebar';

const confirm = Modal.confirm;

const AdminNew: React.FC = observer((props: any) => {
  const appStore = useContext(AppStore);
  const {t} = useTranslation('app');
  const [isCollapse, setIsCollapse] = useState(false);
  const windowWidth: any = useWindowChange();
  const router = useRouter();
  const isMobile = windowWidth <= 500;
  const isTablet = windowWidth <= 768;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (appStore.getToken()) {
      appStore.setUserAuth(appStore.getToken().dataUserAuth);
      appStore.setRoles(appStore.getToken().roles);
      appStore.setPermissions(appStore.getToken().permissions);
    } else {
      router.to('/admin/login');
    }
  }, []);

  useEffect(() => {
    let child: any;
    const elem: any = ListMenuManage.filter(item => {
      if (item.routeTo === router.active.path) {
        return item;
      } else {
        if (item.children) {
          child = item.children.filter(val => val.routeTo === router.active.path);
          if (child.length > 0) {
            return child;
          }
        }
      }
    });
    appStore.setItemSelected(child && child.length > 0 ? child[0].idSelected : elem[0].idSelected);
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
      {appStore.hasPermissions(appStore.permissions, ['SiteSettingUpdate']) && (
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
              <Breadcrumb>
                <Breadcrumb.Item href="">
                  <Icon type="home" />
                </Breadcrumb.Item>
                <Breadcrumb.Item href="">
                  <Icon type="dashboard" />
                  <span>Dashboard</span>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>

            <div className="header-bar__right">
              <Icon type="bell" style={{fontSize: '20px'}} theme="outlined" />
              <Badge count={5}>
                <Icon type="mail" style={{fontSize: '20px'}} />
              </Badge>

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

export default AdminNew;
