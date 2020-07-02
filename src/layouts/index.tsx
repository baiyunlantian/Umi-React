import React, { useMemo } from 'react';
import UserLayout from "@/layouts/components/UserLayout";
import BasicLayout from "@/layouts/components/BasicLayout";
import './index.less';
// import IMapContainer from './components/map/project/campus/ui/container/ui.comp';
// import { mapConfig } from './components/vtouch/vtouch-map';
// import { useModel, history, dynamic } from 'umi';
// const IMapContainer = dynamic({
//   loader: async function () {
//     const { default: IMapContainer } = await import('./components/map/project/campus/ui/container/ui.comp');
//     return IMapContainer;
//   },
// });

export interface LayoutProps {
  children: any;
  location: Location;
}
export default ({ children, location: { pathname } }: LayoutProps) => {
  const getContent = useMemo(() => {
    // 用户（登录）相关
    if (/^\/user/.test(pathname)) return <UserLayout>{children}</UserLayout>;
    return <BasicLayout pathname={pathname}>{children}</BasicLayout>;
  }, [pathname]);

  return <div className="main-page">
    {/* <IMapContainer /> */}

    {getContent}
  </div>;
};
