import * as React from 'react';
// import { mapConfig } from '@/pages/components/vtouch/vtouch-map';
import { mapConfig } from 'vtouch-map';
import styles from './style/index.less';
import { Plugin, mapDivUpdate, Config } from '../..';
import { MAPAPP } from '../../../..';

const IMapContainer = () => {
  if (!Config.showMap) return (<div></div>);
  const divId = Config.IMapContainer;
  React.useEffect(() => {

    //移动到IMapContainer div
    new mapDivUpdate().getCanvasdomElementById(Config.IMapContainer);

    //new  cesium.viewer 
    new Plugin(Config.IMapContainer);

    //挂在body节点
    // const root = document.getElementById("root")!;
    // const body = document.getElementsByTagName("body")[0]!;
    // const canvas = document.getElementById(Config.IMapContainer)!;
    // // console.log(canvas);
    // body.appendChild(canvas);
    // if (canvas instanceof HTMLDivElement) {

    // } else if (canvas instanceof Array) {
    //   body.appendChild(canvas[0]);
    // }


    if (mapConfig.map instanceof MAPAPP) {
      mapConfig.map.plugin.createProvider(Config.IMapContainer);
    }

    return () => {
      // console.log('IMapContainer 退出了.', mapConfig.map);
    }

  }, []);

  console.log('IMapContainer 加载完', mapConfig.map);

  const style: React.CSSProperties = { position: 'relative', width: '100%', height: '100%' };

  return (
    <React.Suspense fallback={<div>map..</div>}>
      <div id={Config.IMapContainer} className={styles.IMapContainer}>
        <div id={mapConfig.domElementId} style={style}>
        </div >
      </div>
    </React.Suspense >
  );
}

export default IMapContainer;