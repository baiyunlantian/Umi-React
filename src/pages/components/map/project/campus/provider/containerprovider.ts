import * as Cesium from 'cesium';
// import { dynamic } from 'umi';
// const Cesium = dynamic({
//   loader: async function () {
//     const { default: Cesium } = await import('cesium');
//     return Cesium;
//   },
// });

import { Config, Plugin } from '..';



export class containerProvider {
  public plugin: Plugin;
  public viewer: Cesium.Viewer;

  public static classId(): string {
    return Config.IMapContainer;
  };

  constructor(plugin: Plugin) {
    // super('div');
    this.plugin = plugin;
    this.viewer = this.plugin.viewer;

    this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = Config.cameraHeight.min;
    this.viewer.scene.screenSpaceCameraController.maximumZoomDistance = Config.cameraHeight.max;

    // this.cameraInit();

  }

  public cameraInit() {

    this.viewer.camera.setView({
      destination: Cesium.Rectangle.fromDegrees(
        113.37619198869344927516, 23.05573557122957595311,
        113.38555758641153659028, 23.06252222671671958665,

        // this.initViewPosition.longitude,
        // this.initViewPosition.latitude,
        // this.initViewPosition.height,
      ),
      orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-90),
        roll: 0.0
      }
    });

  }

  public exit() {

  };

  public handlerDestroy() {

  };



}