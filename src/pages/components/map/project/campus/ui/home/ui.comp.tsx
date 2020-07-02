import * as React from 'react';
// import { mapConfig } from '@/pages/components/vtouch/vtouch-map';
import { mapConfig } from 'vtouch-map';
import styles from './style/index.less';
import { Plugin, mapDivUpdate, Config } from '../..';
import { MAPAPP } from '../../../..';

const IHomeMap = () => {
  if (!Config.showMap) return (<div></div>);
  const divId = Config.IHomeMap;
  React.useEffect(() => {
    new mapDivUpdate().getCanvasdomElementById(Config.IHomeMap);
    if (mapConfig.map instanceof MAPAPP) {
      mapConfig.map.plugin.createProvider(Config.IHomeMap);
    }
    return () => {
      new mapDivUpdate().getCanvasdomElementById(Config.IMapContainer);
      if (mapConfig.map instanceof MAPAPP) {
        mapConfig.map.plugin.createProvider(Config.IMapContainer);
      }
    }
  }, []);
  return (
    <React.Suspense fallback={<div>map..</div>}>
      <div id={Config.IHomeMap} className={styles.mapDiv} >

      </div>
    </React.Suspense>
  );
}

export default IHomeMap;