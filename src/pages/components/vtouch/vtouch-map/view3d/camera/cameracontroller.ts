import * as Cesium from 'cesium';
import { Cartesian3, Rectangle, mapConfig, Cartesian } from '../';

export class cameraController {

  // private _viewer: Cesium.Viewer;
  private _camera: Cesium.Camera;

  constructor(viewer: Cesium.Viewer) {

    // this._viewer = viewer;
    this._camera = viewer.camera;

    // let cameraHeight = 1.1e7;
    // //相机高度最小值，即控制放大级别
    // this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = cameraHeight * 1.5;
    // //相机高度最大值，即控制缩小级别
    // this.viewer.scene.screenSpaceCameraController.maximumZoomDistance = cameraHeight * 3;

    this.initChinaViewer();

    return this;

  };

  public initChinaViewer = () => {
    this._camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(117.48, 30.67, 30000000.0),
      orientation: {
        // 指向
        heading: Cesium.Math.toRadians(0),
        // 视角
        pitch: Cesium.Math.toRadians(-90),
        roll: 0.0
      }
    });
  }

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