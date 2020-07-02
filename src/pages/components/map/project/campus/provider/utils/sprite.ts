import { mapConfig } from 'vtouch-map';
import { MAPAPP } from '@/pages/components/map';
import * as Cesium from 'cesium';

export interface ISpriteProp {
  name?: string;
  position?: Cesium.Cartesian3;
  image?: NodeRequire;
  text?: string;
}

export class Sprite {
  public viewer: Cesium.Viewer;

  constructor(viewer: Cesium.Viewer, prop?: ISpriteProp) {
    this.viewer = viewer;

    // if (mapConfig.map instanceof MAPAPP) {
    // mapConfig.map.viewer.entities.removeAll();

    const option = {
      // position : Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
      name: 'sprite',
      position: Cesium.Cartesian3.fromDegrees(113, 23, mapConfig.horizon * 10),
      billboard: {
        // image: fireOption.ionSrc,
        image: require('@/assets/header_logo.png'),
        scale: 0.1,
        width: 256,
        height: 256,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
          0,
          2250000000,
        ),
      },
      label: {
        text: '学校位置',
        font: '14pt monospace',
        fillColor: Cesium.Color.YELLOW,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.TOP,
        pixelOffset: new Cesium.Cartesian2(0, 32),
      },
      // point: {
      //   pixelSize: 12,
      //   color: Cesium.Color.RED,
      //   distanceDisplayCondition: new Cesium.DistanceDisplayCondition(2250, 99999999),
      // },
    };

    const entity = this.viewer.entities.add(option);
    // const entity = mapConfig.map.viewer.entities.add(option as any);

    return entity;

    // }
  }
}
