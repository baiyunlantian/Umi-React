import * as React from 'react';
// import { mapConfig } from '@/pages/components/vtouch/vtouch-map';
import { mapConfig } from 'vtouch-map';
import styles from './style/index.less';
import { Config, mapDivUpdate } from '../..';
import { MAPAPP } from '../../../..';

const IRangeMap = () => {
  if (!Config.showMap) return (<div></div>);
  const divId = Config.IRangeMap;
  React.useEffect(() => {
    new mapDivUpdate().getCanvasdomElementById(Config.IRangeMap);
    if (mapConfig.map instanceof MAPAPP) {
      mapConfig.map.plugin.createProvider(Config.IRangeMap);
    }
    return () => {
      new mapDivUpdate().getCanvasdomElementById(Config.IMapContainer);
    };
  }, []);
  return <React.Suspense fallback={<div>map..</div>}>
    <div id={Config.IRangeMap} className={styles.map}></div>
  </React.Suspense>;
}
export default IRangeMap;