import * as Cesium from 'cesium';
// import { dynamic } from 'umi';
// const Cesium = dynamic({
//   loader: async function () {
//     const { default: Cesium } = await import('cesium');
//     return Cesium;
//   },
// });
// import { Cartesian3, Provider, mapConfig } from '@/pages/components/vtouch/vtouch-map';
import { Cartesian3, Provider } from 'vtouch-map';
import { history } from 'umi';
import { getCampusList } from '@/services/scene';
import { Config, controlRange } from '..';
import { MAPAPP } from '../../..';
import { Plugin } from '..';

export declare type InteractorExit = () => void;
export interface IInteractor {
  // onMouseMove?: InteractorMouseFunction;
  exit?: InteractorExit;
  handlerDestroy?: InteractorExit;
}

export class homeProvider extends Provider implements IInteractor {

  public plugin: Plugin;

  public static classId(): string {
    return Config.IHomeMap;
  };
  public name = Config.IHomeMap;
  public viewer: Cesium.Viewer;
  public handler: Cesium.ScreenSpaceEventHandler;

  private static _addLayer = new Cesium.MapboxStyleImageryProvider({
    //mapbox://styles/qq793931289/ckatbx8pa43341insqhces8m3
    url: 'https://api.mapbox.com/styles/v1',
    username: 'qq793931289',
    styleId: 'ckatbx8pa43341insqhces8m3',
    accessToken: 'pk.eyJ1IjoicXE3OTM5MzEyODkiLCJhIjoiY2s5M3oxbmFzMDdrczNlbXpibDI0bTQxYiJ9.GuZhkGBTu6vkisVE7CKGeA',
    scaleFactor: true,
    // minimumLevel: 2,
    // maximumLevel: 20,
    hasAlphaChannel: false,
    tileHeight: 256,
    tileWidth: 256,
    tilesize: 256,
  });

  public initViewPosition: Cartesian3 = {
    longitude: (113.38555758641153659028 + 113.37619198869344927516) / 2,
    latitude: (23.06252222671671958665 + 23.05573557122957595311) / 2,
    height: 15000,
  };

  public addLayer?: Cesium.ImageryLayer;

  constructor(plugin: Plugin) {
    super('div');
    this.plugin = plugin;
    this.viewer = this.plugin.viewer;
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas as HTMLCanvasElement);
    this.init();
    this.plugin.map.mapboxMapStatus(true);
  }

  public init = () => {
    this.handlerInit();
    // this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    this.addImageryLayers();
    this.initShowRange();
  };

  public async initShowRange() {
    const { data } = await getCampusList({isNeedAccount: 0});
    if (data) {
      const { campusList } = data;
      if (campusList && !campusList.length) {
        // this.cameraInit();
        return;
      };
      // Config.debug && console.log(campusList);

      const showZone = new controlRange();

      if (campusList) {
        showZone.showAllRangeUpdate(campusList, true);

      }
    }

  };

  public handlerInit() {

    this.handler.setInputAction((event) => {

      // var earthPosition = this.viewer.scene.pickPosition(event.position);

      var pickedObject = this.viewer.scene.pick(event.position);

      if (Cesium.defined(pickedObject)) {
        Config.debug && console.log('homeProvider');

        Config.debug && console.log(pickedObject);
        if (pickedObject.id.name && pickedObject.id.polygon instanceof Cesium.PolygonGraphics) {

          if (pickedObject.id.name.split('_').length < 2) {
            return;
          }

          // this.exit();

          const campusId = pickedObject.id.name.split('_')[0];
          const campusName = pickedObject.id.name.split('_')[1];

          const limit_campusId = JSON.parse(window.localStorage.getItem('campus') || "{}").campusId;

          if (limit_campusId == null || limit_campusId == campusId) {
            history.push('campus');
            window.localStorage.setItem('currentCampus', JSON.stringify({ campusId: campusId, campusName: campusName }));
          } else if (limit_campusId !== campusId) {
            return;
          };
        }

        if (pickedObject.id.name === 'child') {
          const range = new controlRange();
          range.mapZoomToTarget(pickedObject.id.child[0]);
        };

      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  public cameraInit() {

    this.viewer.camera.flyTo({
      destination: Cesium.Rectangle.fromDegrees(
        113.38555758641153659028, 113.37619198869344927516,
        23.06252222671671958665, 23.05573557122957595311 ,
        // this.initViewPosition.longitude,
        // this.initViewPosition.latitude,
        // this.initViewPosition.height,
      ),
    });

  }

  public exit = () => {

    this.plugin.map.mapboxMapStatus(false);

    Config.debug && console.log('exit homeP');

    this.handlerDestroy();
  };

  public handlerDestroy = () => {
    Config.debug && console.log(this.handler);
    if (this.handler) {
      this.handler.destroy();
    }

  };

  public addImageryLayers() {

  }

  public createPoint = (worldPosition: Cartesian3) => {
    let point = this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(worldPosition.longitude, worldPosition.latitude, 150),
      point: {
        color: Cesium.Color.RED,
        pixelSize: 10,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      }
    });
  };

}

// Provider.registerProvider(homeProvider.classId(), new homeProvider('div'));
