import React from 'react';
import {Drawer} from 'antd';
import SidebarContent from './SidebarContent';
import {ListMenuManage} from './ManageMenu/ListManageMenu';
import './Sidebar.less';

const Sidebar = (props: any) => {
  return (
    <div className="sidebar">
      <SidebarContent menuConfig={ListMenuManage} />
      <Drawer visible={props.open} placement="left" bodyStyle={{padding: '0'}} onClose={props.onClose}>
        <SidebarContent menuConfig={ListMenuManage} inDrawer={true} onClose={props.onClose} />
      </Drawer>
    </div>
  );
};

export default Sidebar;
