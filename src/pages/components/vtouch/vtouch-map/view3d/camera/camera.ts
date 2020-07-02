import * as Cesium from 'cesium';
// import { dynamic } from 'umi';
// const Cesium = dynamic({
//   loader: async function () {
//     const { default: Cesium } = await import('cesium');
//     return Cesium;
//   },
// });
import { Cartesian3, Rectangle, mapConfig, Cartesian } from '..';

export class Camera {

    // private _viewer: Cesium.Viewer;
    private _camera: Cesium.Camera;

    constructor(viewer: Cesium.Viewer) {

        // this._viewer = viewer;
        this._camera = viewer.camera;

        return this;

    };

    public get camera() {
        return this._camera;
    };

    public cameraUpdate(position: Cartesian3) {

        const { longitude, latitude } = Cartesian.offset2(position.longitude, position.latitude);

        this._camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(
                longitude,
                latitude,
                mapConfig.fireHeight
            ),
        });
    }

    public cameraRectangleUpdate(option: Rectangle) {
        // -0.01185，-0.00328
        const { longitude: beginLongitude, latitude: beginLatitude } = Cartesian.offset2(option.beginLongitude, option.beginLatitude);
        const { longitude: endLongitude, latitude: endLatitude } = Cartesian.offset2(option.endLongitude, option.endLatitude);
        console.log(
            beginLongitude, beginLatitude,
            endLongitude, endLatitude
        );
        this._camera.flyTo({
            destination: Cesium.Rectangle.fromDegrees(
                // 113.392367, 23.062804, 113.393429, 23.062706,
                beginLongitude, beginLatitude,
                endLongitude, endLatitude,
                // beginLongitude, beginLatitude,


            )
        });
    };

}