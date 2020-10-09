import React, {useEffect, useState} from 'react';
import {Icon, Layout, Row, Col} from 'antd';

import useWindowChange from '../../../OwnHooks/useWindowChange.hook';

import './TemplateOneHoC.less';

const {Header} = Layout;

const templateOneHoC = ({Menu, Content}) => () => {
  const windowWidth: any = useWindowChange();
  const [stateMenu] = useState(false);
  const [isCollapse, setIsCollapse] = useState(false);
  const isMobile = windowWidth <= 500;
  const isTablet = windowWidth <= 768;

  useEffect(() => {
    // code here
  }, [stateMenu]);

  useEffect(() => {
    // code here
  }, [windowWidth]);

  const toggle = () => {
    setIsCollapse(!isCollapse);
  };

  return (
    <Layout style={{minHeight: '100vh'}} className={'template-one-layout'}>
      <Header className="header" style={{padding: '0 2px', background: 'white'}}>
        <Row align={'middle'} type={'flex'} style={{height: '65px'}}>
          <Col xs={8} sm={4} md={10} lg={12} xl={14}>
            {!isTablet ? (
              <Icon
                // style={{ fontSize: '16px', color: '#08c' }}
                className="trigger template-one-layout__icoClass"
                type={isTablet || isCollapse ? 'menu-unfold' : 'menu-fold'}
                onClick={toggle}
              />
            ) : null}
            <a className="" href="/">
              {isMobile ? (
                <img
                  alt=""
                  style={{marginBottom: '2px', maxHeight: '48px', maxWidth: '135px'}}
                  className="logo"
                  // src={IS_SAAS ? '/antd/src/images/logos/logo-mca-786x132.png' : '/antd/src/images/logo-min.png'}
                  // src={this.props.b2bBookRideStore.agency_src}
                  src={''}
                />
              ) : (
                <img
                  alt=""
                  style={{marginBottom: '2px', maxHeight: '48px', maxWidth: '135px'}}
                  className="logo"
                  src={require('../../../../images/logo.png')}
                />
              )}
            </a>
          </Col>
          <Col xs={16} sm={4} md={14} lg={12} xl={10}>
            {/* <SelectLangs
            nameUser={this.props.b2bBookRideStore.fullName ? this.props.b2bBookRideStore.fullName : ''}
            src={this.props.b2bBookRideStore.avatar_src}
            changeLanguage={this.changeLanguage}
            lang={'Language'}
          /> */}
          </Col>
        </Row>
      </Header>
      <Menu />
    </Layout>
  );
};

export default templateOneHoC;
