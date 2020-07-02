import React, { useEffect, useState, useMemo, createContext } from 'react';
import Header from './Header';
import { setInterval } from 'timers';
import webSocket from '@/utils/webSokcet';
import { useModel, history, dynamic } from 'umi';
import '@/layouts/index.less';
import { mainConfig } from '../config';
// import { mapPlugin } from '@/pages/components/map';
// import { mapConfig } from 'vtouch-map';
// import { MAPAPP } from '@/pages/components/map';

// import { mapDivUpdate } from '@/pages/components/map';

// import IMapContainer from './map/project/campus/ui/container/ui.comp';
// import IMapContainer from '@/pages/components/map/project/campus/ui/container/ui.comp';
const IMapContainer = dynamic({
  loader: async function () {
    const { default: IMapContainer } = await import('@/pages/components/map/project/campus/ui/container/ui.comp');
    return IMapContainer;
  },
});

// const mapDivUpdate = dynamic({
//   loader: async function () {
//     const { mapDivUpdate } = await import('@/pages/components/map');
//     return mapDivUpdate;
//   },
// });


export const Context = createContext({});

export default (props: { children: React.ReactChild; pathname: String }) => {
  const { children, pathname } = props;
  /* const { setWbState } = useModel('webSocket');
   useEffect(() => {
     webSocket(setWbState);
   }, []);*/

  // get children authority
  /* const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
     authority: undefined,
   };*/

  if (!localStorage.getItem('token')) {
    console.log('login2');
    history.push('/user/login')
  }
  // 如果没有校区id  则返回/ 页面选择校区
  if (pathname !== '/' && !localStorage.getItem('currentCampus')) {
    history.push('/')
  }

  useEffect(() => {


    return () => {

      mainConfig.thridDStatus = 'off';

      // mapConfig.map = {};

      // // new mapDivUpdate().quit3D();
      // if (mapConfig.map instanceof MAPAPP) {
      //   mapConfig.map.viewer.entities.removeAll();
      //   mapConfig.map.viewer.destroy();
      // mapPlugin.app = null as any;
      //   mapConfig.map = {};
      // }
      console.log('BasicLayout quit');
    };
  }, []);

  return (
    <div className="page-basic">
      <IMapContainer />
      <Context.Provider value={{}}>
        <Header pathname={pathname} />
        <div className='main-content'>
          {children}
        </div>
      </Context.Provider>
    </div>
  );
};
