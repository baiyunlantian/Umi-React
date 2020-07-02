import { mapConfig } from 'vtouch-map';
import { MAPAPP, Config } from '@/pages/components/map';
import * as Cesium from 'cesium';

export interface ISpriteNameProp {
  position?: Cesium.Cartesian3;
  name?: string;
  child?: Cesium.Entity[];
  label?: {};
}

export class SpriteName {
  public viewer: Cesium.Viewer;

  constructor(viewer: Cesium.Viewer, prop: ISpriteNameProp) {
    this.viewer = viewer;

    /*polygon */
    // const point = this.dataToPoint(JSON.parse(polygon));

    const entity = this.viewer.entities.add({
      position: prop.position,
      // id:'';
      name: prop.name,
      child: prop.child,
      label: prop.label,
      billboard: {
        // image: require('@/assets/map/model.png'),
        // heightReference: Cesium.HeightReference.CENTER,
      },
    });

    return entity;

    // }
  }
}
