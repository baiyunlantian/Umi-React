import * as Cesium from 'cesium';
// import { dynamic } from 'umi';
// const Cesium = dynamic({
//   loader: async function () {
//     const { default: Cesium } = await import('cesium');
//     return Cesium;
//   },
// });
// import { Provider, mapConfig } from '@/pages/components/vtouch/vtouch-map';
import { Provider } from 'vtouch-map';
import { IInteractor } from '.';
import { mapDivUpdate, Config } from '..';
import { MAPAPP } from '../../..';
import { Plugin } from '..';
export class subjoinProvider extends Provider implements IInteractor {
  public plugin: Plugin;
  public viewer: Cesium.Viewer;
  // public handler: Cesium.ScreenSpaceEventHandler;

  constructor(plugin: Plugin) {
    super('div');
    this.plugin = plugin;
    this.viewer = this.plugin.viewer;
    // this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas as HTMLCanvasElement);
    this.init();

    // this.viewer.scene.globe.depthTestAgainstTerrain = true;

    this.plugin.map.googleMapStatus(true);

  }

  public init = () => {

  };

  public exit = () => {

    this.plugin.map.googleMapStatus(false);

    this.handlerDestroy();
  };

  public handlerDestroy = () => {

    // this.handler.destroy();
    this.viewer.entities.removeAll();
  };





}