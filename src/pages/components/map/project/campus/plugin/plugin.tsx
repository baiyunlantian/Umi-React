import * as Cesium from 'cesium';
// import { dynamic } from 'umi';
// const Cesium = dynamic({
//   loader: async function () {
//     const { default: Cesium } = await import('cesium');
//     return Cesium;
//   },
// });
// import { mapConfig, AppBase } from '@/pages/components/vtouch/vtouch-map';
import { AppBase, mapConfig } from 'vtouch-map';
import { mapPlugin, App, MAPAPP } from '../../..';
import { Config, drawRangeProvider, homeProvider, subjoinProvider } from '..';
import { containerProvider } from '../provider/containerprovider';
import { Map } from '.';

export class Plugin {

  public app: AppBase;

  public viewer: Cesium.Viewer;

  public handler: Cesium.ScreenSpaceEventHandler;

  public provider?: homeProvider | subjoinProvider | drawRangeProvider | containerProvider;

  public map: Map;

  constructor(name: string) {

    this.app = new mapPlugin(this);

    this.viewer = this.app.viewer;
    this.handler = this.app.handler;

    this.map = new Map(this.viewer);

    this.init(name);

  }

  public init(name: string) {
    this.reset();

    this.createProvider(name);

  };

  public createProvider(name: string) {
    this.exit();
    switch (name) {
      case Config.IMapContainer:
        this.provider = new containerProvider(this);
        break;
      case Config.IHomeMap:
        this.provider = new homeProvider(this);
        break;
      case Config.IRangeMap:
        this.provider = new subjoinProvider(this);
        break;
      case Config.IDrawRange:
        this.provider = new drawRangeProvider(this);
        break;
      default:
        throw ('undefind id element');
    }
  }

  public handlerDestroy() {
    this.provider && this.provider.handlerDestroy();
  }

  public exit(status: boolean = true) {

    this.provider && this.provider.exit();

    // this.defaultProvider(status);
  }

  public reset = () => {
    // this.viewer.camera.flyHome(0);
    // this.handler.destroy();
    // this.handler = this.handler && this.handler.destroy();

    this.viewer.entities.removeAll();
  };

  public mapRequestRender = () => {
    if (!App) return;

    App.viewer.entities.removeAll();
    App.viewer.scene.requestRender();
  }

  public mapZoomToTarget = (target: Cesium.Entity | Cesium.Entity[]) => {
    if (!App) return;

    App.viewer.flyTo(target, {
      duration: Config.animation.flyToTime,
      maximumHeight: 500000000,
      offset: new Cesium.HeadingPitchRange(0, -1.57, 100),
    });
    // mapConfig.map.viewer.forceResize();
    // mapConfig.map.viewer.resize();
  };

  public mapuZoneUpdate = (campusList: {}) => {
    if (!App) return;

    // setTimeout(() => {
    const point = campusList.locationPointer;
    const polygon = campusList.locationScope;
    Config.debug && console.log(point, polygon);
    Config.debug && console.log(JSON.parse(point), JSON.parse(polygon));

    Config.debug && console.log(mapConfig.map);
    // if (mapConfig.map instanceof AppBase) {
    App.viewer.entities.removeAll();
    // new Cesium.Cartesian3 ( x , y , z )
    Config.debug && console.log(App.viewer.entities);

    // const target = mapConfig.map.viewer.entities.add({
    //     name: "Red polygon on surface",
    //     polygon: {
    //         hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
    //             -90.0,
    //             41.0,
    //             0.0,
    //             -85.0,
    //             41.0,
    //             500000.0,
    //             -80.0,
    //             41.0,
    //             0.0,
    //         ]),
    //         material: Cesium.Color.RED,
    //     }
    // });

    const target = App.viewer.entities.add({
      polygon: {
        hierarchy: JSON.parse(polygon),
        material: Config.rangeColor,
      }
    });
    Config.debug && console.log(target);

    this.mapZoomToTarget(target);

    App.viewer.scene.requestRender();

    // mapConfig.map.viewer.camera.flyTo({
    //     destination: Cesium.Cartesian3.fromDegrees(113, 23, 1500),
    //     // orientation: {
    //     //     direction: new Cesium.Cartesian3(0, 0, 0),
    //     //     up: new Cesium.Cartesian3(0, 0, 1),
    //     // },
    // });

  };

}

export class mapDivUpdate {

  constructor() {

  }

  public getCanvasdomElementById(id: string) {
    if (!document.getElementById(mapConfig.domElementId)) {
      return false;
    }

    const canvas = document.getElementById(mapConfig.domElementId);

    const div = document.getElementById(id);

    if (div && canvas) {
      div.appendChild(canvas);
    }
    return true;
  }

  public quit3D() {
    if (mapConfig.map instanceof MAPAPP) {
      mapConfig.map.viewer.entities.removeAll();
      mapConfig.map.viewer.destroy();
      mapPlugin.app = null as any;
      mapConfig.map = null as any;
    }
  }
}