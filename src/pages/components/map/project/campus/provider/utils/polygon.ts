import { mapConfig } from 'vtouch-map';
import { MAPAPP, Config } from '@/pages/components/map';
import * as Cesium from 'cesium';

export interface IPolygonProp {
  name?: string;
  hierarchy?: [];
  material?: Cesium.StripeMaterialProperty | Cesium.Color;
}

export class Polygon {
  public viewer: Cesium.Viewer;

  constructor(viewer: Cesium.Viewer, prop: IPolygonProp) {
    this.viewer = viewer;

    /*polygon */
    // const range = JSON.parse(polygon);
    // console.log(range);
    const entity = this.viewer.entities.add({
      // id:'';
      name: prop.name,
      polygon: {
        // hierarchy: this.dataToRange(JSON.parse(polygon)),
        hierarchy: new Cesium.PolygonHierarchy(
          // Cesium.Cartesian3.fromDegreesArray(this.activeShapePoints)
          // this.activeShapePoints
          Cesium.Cartesian3.fromDegreesArray(prop.hierarchy),
        ),
        // hierarchy: JSON.parse(polygon),
        // material: Config.rangeColor,
        // height: 1500,
        outline: true,
        // outlineColor: Config.rangeoutlineColor,
        outlineColor: Cesium.Color.RED,
        outlineWidth: 1.0, //windows 只能是  1.0
        material: Config.rangeFillMaterial,
      },
    });

    return entity;

    // }
  }
}
