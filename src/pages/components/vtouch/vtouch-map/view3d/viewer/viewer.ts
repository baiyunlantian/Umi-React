// import * as Cesium from 'cesium';
import { mapConfig } from '../constant';

import * as Cesium from 'cesium';
// import { dynamic } from 'umi';
// const Cesium = dynamic({
//   loader: async function () {
//     const { default: Cesium } = await import('cesium');
//     return Cesium;
//   },
// });

// require('cesium/Widgets/widgets.css');
try {
  Cesium.buildModuleUrl.setBaseUrl(mapConfig.buildModuleUrl);
} catch (err) {

} finally {
  window.CESIUM_BASE_URL = mapConfig.buildModuleUrl;
};

export class Viewer {

  public viewer: Cesium.Viewer;

  constructor() {

    this.viewer = new Cesium.Viewer(mapConfig.domElementId, {
      // imageryProvider: false,
      imageryProvider: new Cesium.TileMapServiceImageryProvider({
        url: Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII"),
      }),
      // imageryProvider: this._googleMap(),
      // terrainProvider: Cesium.createWorldTerrain(),
      // imageryProvider: new Cesium.TileMapServiceImageryProvider({
      //   url: Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII"),
      // }),
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
      scene3DOnly: true,
      requestRenderMode: true,
      maximumRenderTimeChange: Infinity,
      // useDefaultRenderLoop: false,
      // targetFrameRate: 12,
    });

    return this.viewer;
  }



}