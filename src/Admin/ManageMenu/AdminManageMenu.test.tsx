import * as React from 'react';
import {shallow} from 'enzyme';
import AdminManageMenu from './AdminManageMenu';
import {ListMenuManage} from './ListManageMenu';

describe('AdminManageMenu', () => {
  it('AdminManageMenu renders correctly', () => {
    shallow(<AdminManageMenu menuconfig={ListMenuManage} selected={1} handleOnClick={jest.fn(opts => c => c)} />);
  });

  it('Should render correctly AdminManageMenu with Snapshot', () => {
    const component = shallow(
      <AdminManageMenu menuconfig={ListMenuManage} selected={1} handleOnClick={jest.fn(opts => c => c)} />,
    );
    expect(component).toMatchSnapshot();
  });
});
