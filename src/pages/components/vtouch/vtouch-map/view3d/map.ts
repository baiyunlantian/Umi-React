// window.CESIUM_BASE_URL = "http://192.168.1.133:85/map/cesium/1.70/";

import * as Cesium from 'cesium';
// import { dynamic } from 'umi';
// const Cesium = dynamic({
//   loader: async function () {
//     const { default: Cesium } = await import('cesium');
//     return Cesium;
//   },
// });
import 'cesium/Source/Widgets/widgets.css';
import { mapConfig } from './constant/config';
import { IFirePointOption, Rectangle } from './interface/interface';
import { cameraController } from './camera';
import { Sprite } from './sprite';
import { viewerObject } from './viewer/viewobject';
// require('cesium/Widgets/widgets.css');


// Cesium.buildModuleUrl.setBaseUrl(mapConfig.buildModuleUrl);

// window.Cesium = Cesium;

// if (!window.startupCalled && typeof window.startup === "function") {
//   window.startup(Cesium);
// }

// Cesium.buildModuleUrl.setBaseUrl(mapConfig.buildModuleUrl);
export class Map {

  public viewer = new Cesium.Viewer(mapConfig.domElementId, {
    // terrainProvider: Cesium.createWorldTerrain(),
    selectionIndicator: false,
    animation: false,
    timeline: false,
    fullscreenButton: false,
    infoBox: false,
    homeButton: false,
    baseLayerPicker: false,
    navigationHelpButton: false,
    geocoder: false,
    sceneModePicker: false,
    // useDefaultRenderLoop: false,
    scene3DOnly: true,
    // targetFrameRate: 24,

    requestRenderMode: true,
    maximumRenderTimeChange: Infinity,
  });
  public viewerObject: viewerObject;
  public cameraController: cameraController;
  public handler: Cesium.ScreenSpaceEventHandler;

  public beginLongitude: number = mapConfig.defaultLocation.beginLongitude;
  public beginLatitude: number = mapConfig.defaultLocation.beginLatitude;
  public endLongitude: number = mapConfig.defaultLocation.endLongitude;
  public endLatitude: number = mapConfig.defaultLocation.endLatitude;

  constructor() {

    this.viewerObject = new viewerObject(this.viewer);

    this.cameraController = new cameraController(this.viewer);

    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);

  }

  public onStartUp() {

  }

  public addSprite = (fireOption: IFirePointOption) => {
    const sprite = new Sprite(this.viewer, this.handler);
    sprite.addSprite(fireOption);
    this.cameraController.cameraUpdate(fireOption.location);
  };


  public cameraRectangleUpdate = (option: Rectangle) => {
    this.cameraController.cameraRectangleUpdate(option);
  };

  public addTileMapServiceImageryProvider(url: string, format: string = 'jpg') {
    this.viewerObject.addTileMapServiceImageryProvider(url, format);
  };

}