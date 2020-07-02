'use strict';
import * as Cesium from 'cesium';
// import { dynamic } from 'umi';
// const Cesium = dynamic({
//   loader: async function () {
//     const { default: Cesium } = await import('cesium');
//     return Cesium;
//   },
// });
// import { mapConfig, Provider } from '@/pages/components/vtouch/vtouch-map';
import { Provider } from 'vtouch-map';
import { IInteractor, controlRange } from '..';
import { Config, Plugin } from '../..';

export class drawRangeProvider extends Provider implements IInteractor {
  public plugin: Plugin;
  public viewer: Cesium.Viewer;

  public drawingMode = 'polygon';

  public activeShapePoints: Cesium.Cartesian3[] = [];
  public activeShape?: Cesium.Entity;
  public floatingPoint?: Cesium.Entity;

  public arr = [];
  public currLayers?: Cesium.ImageryLayer;

  public polygonColor = Config.rangeColor;

  public handler: Cesium.ScreenSpaceEventHandler;

  public baseLayers: Cesium.ImageryLayer[] = [];

  constructor(plugin: Plugin) {
    super('div');
    this.plugin = plugin;
    this.viewer = this.plugin.viewer;
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas as HTMLCanvasElement);
    this.init();
    this.draw();

    this.plugin.map.googleMapStatus(true);

  }

  public init = () => {
    // this.viewer.zoomTo(this.viewer.entities);
  };

  public createPoint = (worldPosition: Cesium.Cartesian3) => {
    // console.log(worldPosition);
    let point = this.viewer.entities.add({
      // position: worldPosition,
      position: Cesium.Cartesian3.fromDegrees(worldPosition.x, worldPosition.y, worldPosition.z),
      point: {
        color: Cesium.Color.WHITE,
        pixelSize: 0,
        heightReference: Cesium.HeightReference.NONE,
        // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(2250, 99999999),
        // disableDepthTestDistance: Number.POSITIVE_INFINITY,
      }
    });
    return point;
  };

  public drawShape(positionData: Cesium.Cartesian3[] | Cesium.CallbackProperty) {
    let shape;
    if (this.drawingMode === 'line') {
      shape = this.viewer.entities.add({
        polyline: {
          positions: positionData,
          // positions: Cesium.Cartesian3.fromDegrees(positionData),
          clampToGround: true,
          width: 3,
        }
      });
    }
    else if (this.drawingMode === 'polygon') {
      shape = this.viewer.entities.add({
        polygon: {
          hierarchy: positionData,
          // material: new Cesium.ColorMaterialProperty(Cesium.Color.BLUE.withAlpha(0.3)),
          material: this.polygonColor,
        }
      });
    }
    return shape;
  };


  public draw() {
    if (!this.viewer.scene.pickPositionSupported) {
      window.alert('This browser does not support pickPosition.');
    }

    // this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    this.handlerInit();

    this.viewer.scene.globe.depthTestAgainstTerrain = true;

    this.viewer.scene.screenSpaceCameraController.enableTilt = false;

  }

  public earthPositionToLocaltionPoint(earthPosition: Cesium.Cartesian3) {
    var ellipsoid = this.viewer.scene.globe.ellipsoid;
    // var cartesian3 = new Cesium.cartesian3(x, y, z);
    var cartesian3 = earthPosition;
    var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
    var lat = Cesium.Math.toDegrees(cartographic.latitude);
    var lng = Cesium.Math.toDegrees(cartographic.longitude);
    var alt = cartographic.height;
    // console.log(lat, lng, alt);
    return new Cesium.Cartesian3(lat, lng, alt)
  }

  public handlerInit() {
    this.handler.setInputAction((event: any) => {
      let earthPosition = this.viewer.scene.pickPosition(event.position);
      Config.debug && console.log(event.position, earthPosition);

      const pickedObject = this.viewer.scene.pick(event.position);

      if (Cesium.defined(pickedObject) && pickedObject && pickedObject.id) {
        // const range = new controlRange();
        // range.mapZoomToTarget(pickedObject.id);
      }

      if (Cesium.defined(earthPosition) && earthPosition) {
        console.log(event, earthPosition);
        const localtionPoint = this.earthPositionToLocaltionPoint(earthPosition);
        if (this.activeShapePoints.length === 0) {

          this.floatingPoint = this.createPoint(localtionPoint);
          // console.log(earthPosition);
          this.activeShapePoints.push(localtionPoint);
          // console.log(this.activeShapePoints);
          let dynamicPositions = new Cesium.CallbackProperty(() => {
            if (this.drawingMode === 'polygon') {
              const arrayPoint: number[] = [];
              this.activeShapePoints.forEach((v, i) => {
                arrayPoint.push(v.y);
                arrayPoint.push(v.x);
              });

              return new Cesium.PolygonHierarchy(
                Cesium.Cartesian3.fromDegreesArray(arrayPoint)
              );
            }
            return this.activeShapePoints;
          }, false);
          this.activeShape = this.drawShape(dynamicPositions);
        }
        this.activeShapePoints.push(localtionPoint);
        this.createPoint(localtionPoint);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this.handler.setInputAction((event: any) => {
      if (Cesium.defined(this.floatingPoint)) {
        let newPosition = this.viewer.scene.pickPosition(event.endPosition);

        if (Cesium.defined(newPosition) && newPosition) {
          const localtionPoint = this.earthPositionToLocaltionPoint(newPosition);
          // console.log(event, newPosition, localtionPoint);
          this.floatingPoint && this.floatingPoint.position.setValue(localtionPoint);
          this.activeShapePoints.pop();
          this.activeShapePoints.push(localtionPoint);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    this.handler.setInputAction((event: any) => {
      this.terminateShape();

      var earthPosition = this.viewer.scene.pickPosition(event.position);
      if (Cesium.defined(earthPosition)) {

      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  public terminateShape = () => {
    this.activeShapePoints.pop();
    Config.debug && console.log(this.activeShapePoints);
    Config.variable.zone = this.activeShapePoints;
    const range = new controlRange();
    this.drawShape(range.dataToRange({ app: { version: Config.version, range: this.activeShapePoints as Cesium.cartesian3[] } }));
    this.floatingPoint && this.viewer.entities.remove(this.floatingPoint);
    this.activeShape && this.viewer.entities.remove(this.activeShape);
    this.floatingPoint = undefined;
    this.activeShape = undefined;
    this.activeShapePoints = [];
  }


  public exit = () => {
    this.plugin.map.googleMapStatus(false);
    this.handlerDestroy();
  };

  public handlerDestroy = () => {
    if (this.handler) {
      this.handler.destroy();
    }
    this.viewer.entities.removeAll();
  };

}