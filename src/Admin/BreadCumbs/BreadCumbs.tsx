import React from 'react';
import {Breadcrumb, Icon} from 'antd';
import {RiftLink, useRouter} from 'rift-router';
import {useTranslation} from 'react-i18next';

import './BreadCumbs.less';
import {RoutesBardcrumb} from './RoutesBroadCrumbs';

const BreadCumbs = props => {
  const {t} = useTranslation('app');
  const router = useRouter();
  const pathSnippets = router && router.active && router.active.path && router.active.path.split('/').filter(i => i);

  const extraBreadcrumbItems =
    pathSnippets &&
    pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const route: any = RoutesBardcrumb.find(i => i.path === url);
      const tempPath = router.active ? router.active.path : undefined;
      if (route !== undefined) {
        return (
          <Breadcrumb.Item key={index + 2}>
            {tempPath && tempPath !== url ? (
              <RiftLink to={url ? url : ''}>
                <Icon type={route.iconClass} />
                <span className="breadcumbs__margin-left breadcumbs__margin-left--pointer">
                  {t(`${route.breadcrumbName}`)}
                </span>
              </RiftLink>
            ) : (
              <span className="breadcumbs__margin-left">{t(`${route.breadcrumbName}`)}</span>
            )}
          </Breadcrumb.Item>
        );
      }
    });

  const breadcrumbItems = [
    <Breadcrumb.Item key={1}>
      <RiftLink to={`/admin/dashboard`}>
        <Icon type="home" className="breadcumbs__margin-left--pointer" />
      </RiftLink>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);

  return (
    <div className="breadcumbs">
      <Breadcrumb style={{margin: '10px 0', fontSize: '14px'}} separator="/">
        {breadcrumbItems}
      </Breadcrumb>
    </div>
  );
};

export default BreadCumbs;
