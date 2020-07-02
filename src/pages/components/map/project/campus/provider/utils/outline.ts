import { mapConfig } from 'vtouch-map';
import { MAPAPP, Config } from '@/pages/components/map';
import * as Cesium from 'cesium';

export interface IOutlineProp {
  positions?: [];
  width?: number;
  distanceDisplayCondition?: Cesium.DistanceDisplayCondition;
  material?: Cesium.PolylineGlowMaterialProperty;
}

export class Outline {
  public viewer: Cesium.Viewer;

  constructor(viewer: Cesium.Viewer, prop: IOutlineProp) {
    this.viewer = viewer;

    /*polygon */
    // const range = JSON.parse(polygon);
    // console.log(range);
    const entity = this.viewer.entities.add({
      polyline: {
        positions: prop.positions,
        width: prop.width ? prop.width : 20.0,
        distanceDisplayCondition: prop.distanceDisplayCondition,

        material: prop.material,

        // material: new Cesium.PolylineOutlineMaterialProperty({
        //   color: Cesium.Color.RED,
        //   outlineColor: Cesium.Color.GREEN,
        //   outlineWidth: 10.0,
        //   // color: Cesium.Color.fromCssColorString('#000000').withAlpha(0.26),
        //   // color: Cesium.Color.YELLOW,
        //   // glowPower: 0.05,
        //   // taperPower: 0.5,
        // }),
      },
    });

    return entity;

    // }
  }
}
