import * as Cesium from 'cesium';
// import { dynamic } from 'umi';
// const Cesium = dynamic({
//   loader: async function () {
//     const { default: Cesium } = await import('cesium');
//     return Cesium;
//   },
// });
// import { mapConfig } from '@/pages/components/vtouch/vtouch-map';
import { mapConfig } from 'vtouch-map';

export const Config = {

  IHomeMap: 'IHomeMap',
  IRangeMap: 'IRangeMap',
  IDrawRange: 'IDrawRange',
  IMapContainer: 'IMapContainer',

  rangeColor: new Cesium.ColorMaterialProperty(Cesium.Color.fromCssColorString('#0651fb').withAlpha(0.26 * 2)),
  // rangeoutlineColor: new Cesium.ColorMaterialProperty(Cesium.Color.fromCssColorString('#0651fb').withAlpha(0)),
  // rangeoutlineColor: Cesium.Color.fromCssColorString('#0651fb').withAlpha(1.0),
  rangeoutlineColor: Cesium.Color.fromCssColorString('#ffff00').withAlpha(1.0),

  rangeFillMaterial: new Cesium.StripeMaterialProperty({
    evenColor: Cesium.Color.fromCssColorString('#1159E2').withAlpha(0.6),
    oddColor: Cesium.Color.fromCssColorString('#45BFF7').withAlpha(0.6),
    repeat: 1.2,
  }),

  cameraHeight: {
    min: 500,
    max: 1200000,
    // max: 12000000000000000,
  },

  debug: mapConfig.debug,

  animation: {
    flyToTime: 3.0,
    flyHdight: 500000,
  },

  version: '1.0',

  variable: {
    zone: [],
  },

  showMap: mapConfig.showMap,

}; 