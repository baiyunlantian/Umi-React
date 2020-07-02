import * as Cesium from 'cesium';
// import { dynamic } from 'umi';
// const Cesium = dynamic({
//   loader: async function () {
//     const { default: Cesium } = await import('cesium');
//     return Cesium;
//   },
// });
import { IFirePointOption, mapConfig, Cartesian } from '..';

export class Sprite {

    public viewer: Cesium.Viewer;
    public handler: Cesium.ScreenSpaceEventHandler;

    constructor(viewer: Cesium.Viewer, handler: Cesium.ScreenSpaceEventHandler) {
        this.viewer = viewer;
        this.handler = handler;

    }

    public addSprite(fireOption: IFirePointOption) {

        const { longitude, latitude } = Cartesian.offset2(fireOption.location.longitude, fireOption.location.latitude);

        const option = {
            // position : Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
            name: 'sprite',
            position: Cesium.Cartesian3.fromDegrees(
                longitude,
                latitude,
                mapConfig.horizon),
            billboard: {
                image: fireOption.ionSrc,
                scale: 0.10,
                width: 256,
                height: 256,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 2250),
            },
            label: {
                text: '起火位置',
                font: '14pt monospace',
                fillColor: Cesium.Color.YELLOW,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                pixelOffset: new Cesium.Cartesian2(0, 32),
            },
            point: {
                pixelSize: 12,
                color: Cesium.Color.RED,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(2250, 99999999),
            },
        }
        const entity = this.viewer.entities.add(option as any);


        this.hander(entity, fireOption);

    }

    public hander(entity: Cesium.Entity, fireOption: IFirePointOption) {

        // const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas as HTMLCanvasElement);
        this.handler.setInputAction((movement: any) => {
            var pickedObject = this.viewer.scene.pick(movement.position);
            if (Cesium.defined(pickedObject) && (pickedObject.id === entity)) {
                fireOption.handleEvent(fireOption.item);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    }


};