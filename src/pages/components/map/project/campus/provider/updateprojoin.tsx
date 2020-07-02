

// export class updateProvider {

import { Config } from '..';

//     constructor() {

//     }




// } 


export class updateProvider {

    public viewer = new Cesium.Viewer(mapConfig.domElementId, {
        terrainProvider: Cesium.createWorldTerrain(),
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
        // useDefaultRenderLoop: false,
        scene3DOnly: true,
        targetFrameRate: 12,

    });


    public drawingMode = 'polygon';

    public activeShapePoints = [];
    public activeShape: any;
    public floatingPoint: any;
    public handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);


    public arr = [];
    public currLayers;



    public init() {
        // this.arr = this.viewer.imageryLayers;



        // viewer.imageryLayers
        // 添加mapbox自定义地图实例
        let layer = new Cesium.MapboxStyleImageryProvider({
            url: 'https://api.mapbox.com/styles/v1',
            username: 'dengzengjian',
            styleId: 'ck5290o2z121u1cle7mdtfmdk',
            accessToken: 'pk.eyJ1IjoiZGVuZ3plbmdqaWFuIiwiYSI6ImNqbGhnbWo1ZjFpOHEzd3V2Ynk1OG5vZHgifQ.16zy39I-tbQv3K6UnRk8Cw',
            scaleFactor: true,
        });

        this.arr.push(layer);

        layer = new Cesium.ArcGisMapServerImageryProvider({
            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
        });

        this.arr.push(layer);
    };

    public baseLayers = [];

    public addBaseLayerOption(name: string, imageryProvider: any) {
      Config.debug &&   console.log('addBaseLayerOption', imageryProvider);
        var layer;
        const imageryLayers = this.viewer.imageryLayers;
        if (typeof imageryProvider === 'undefined') {
            layer = imageryLayers.get(0);
            // viewModel.selectedLayer = layer;
        } else {
            layer = new Cesium.ImageryLayer(imageryProvider);
        }

        // layer.name = name;
        this.baseLayers.push(layer);
    }

    public initLayer() {
        this.addBaseLayerOption(
            'Bing Maps Aerial',
            undefined); // the current base layer
        // addBaseLayerOption(
        //     'Bing Maps Road',
        //     new Cesium.BingMapsImageryProvider({
        //         url: 'https://dev.virtualearth.net',
        //         mapStyle: Cesium.BingMapsStyle.ROAD
        //     }));
        this.addBaseLayerOption(
            'ArcGIS World Street Maps',
            new Cesium.ArcGisMapServerImageryProvider({
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
            }));
        // addBaseLayerOption(
        //     'OpenStreetMaps',
        //     new Cesium.OpenStreetMapImageryProvider());
        this.addBaseLayerOption(
            'Stamen Maps',
            new Cesium.OpenStreetMapImageryProvider({
                url: 'https://stamen-tiles.a.ssl.fastly.net/watercolor/',
                fileExtension: 'jpg',
                credit: 'Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA.'
            }));
        this.addBaseLayerOption(
            'Natural Earth II (local)',
            new Cesium.TileMapServiceImageryProvider({
                url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
            }));


        this.currLayers = this.baseLayers[2];
        this.viewer.imageryLayers.add(this.currLayers, this.viewer.imageryLayers.length);
    }

    public changeLayer() {

        // if (!this.currLayers) {
        //     this.currLayers = this.viewer.imageryLayers.get(0);
        // }

        let layer;

        // var arr = [
        //     new Cesium.MapboxStyleImageryProvider({
        //         url: 'https://api.mapbox.com/styles/v1',
        //         username: 'dengzengjian',
        //         styleId: 'ck5290o2z121u1cle7mdtfmdk',
        //         accessToken: 'pk.eyJ1IjoiZGVuZ3plbmdqaWFuIiwiYSI6ImNqbGhnbWo1ZjFpOHEzd3V2Ynk1OG5vZHgifQ.16zy39I-tbQv3K6UnRk8Cw',
        //         scaleFactor: true,
        //     }),
        //     new Cesium.MapboxStyleImageryProvider({
        //         url: 'https://api.mapbox.com/styles/v1',
        //         username: 'dengzengjian',
        //         styleId: 'ck5290o2z121u1cle7mdtfmdk',
        //         accessToken: 'pk.eyJ1IjoiZGVuZ3plbmdqaWFuIiwiYSI6ImNqbGhnbWo1ZjFpOHEzd3V2Ynk1OG5vZHgifQ.16zy39I-tbQv3K6UnRk8Cw',
        //         scaleFactor: true,
        //     }),
        //     new Cesium.ArcGisMapServerImageryProvider({
        //         url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
        //     }),
        //     new Cesium.UrlTemplateImageryProvider({
        //         url: "https://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali"
        //     }),
        // ];

        if (Math.random() <= 0.25) {
            layer = this.baseLayers[0];
        } else if (Math.random() > 0.25 && Math.random() <= 0.5) {
            layer = this.baseLayers[1];
        } else if (Math.random() > 0.5 && Math.random() <= 0.75) {
            layer = this.baseLayers[2];
        } else
        // if (Math.random() > 0.75)
        {
            layer = this.baseLayers[3];
        }

        console.log('this.viewer.imageryLayers', this.viewer.imageryLayers);

        console.log('this.currLayers', this.currLayers);

        this.viewer.imageryLayers.remove(this.currLayers, false);

        console.log('this.viewer.imageryLayers', this.viewer.imageryLayers);


        console.log('layer', layer);

        this.viewer.imageryLayers.add(layer, this.viewer.imageryLayers.length);
        this.currLayers = layer;

        console.log('this.viewer.imageryLayers', this.viewer.imageryLayers);








        // console.log(this.viewer.imageryLayers);
        // this.viewer.imageryLayers.remove(this.currLayers, false);
        // console.log(this.viewer.imageryLayers);

        // this.viewer.imageryLayers.add(layer, this.viewer.imageryLayers.length);
        // console.log(this.viewer.imageryLayers);

        // this.currLayers = layer;

        // console.log(this.viewer.imageryLayers);

    };




    constructor() {

        const map = this.viewer;
        if (!(mapConfig.map instanceof Cesium.Viewer)) {
            mapConfig.map = map;
        }

        // map.onStartUp();

        this.draw();
        this.initLayer();
        // this.init();

        (this.viewer.cesiumWidget.creditContainer as HTMLElement).style.display = "none";

    }

    public createPoint = (worldPosition: any) => {
        let point = this.viewer.entities.add({
            position: worldPosition,
            point: {
                color: Cesium.Color.WHITE,
                pixelSize: 5,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            }
        });
        return point;
    };

    public drawShape(positionData: any) {
        let shape;
        if (this.drawingMode === 'line') {
            shape = this.viewer.entities.add({
                polyline: {
                    positions: positionData,
                    clampToGround: true,
                    width: 3
                }
            });
        }
        else if (this.drawingMode === 'polygon') {
            shape = this.viewer.entities.add({
                polygon: {
                    hierarchy: positionData,
                    material: new Cesium.ColorMaterialProperty(Cesium.Color.YELLOW.withAlpha(0.7))
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

        // Cesium.Entity.supportsPolylinesOnTerrain(this.viewer.scene);
        // this.viewer.camera.lookAt(Cesium.Cartesian3.fromDegrees(-122.2058, 46.1955, 1000.0), new Cesium.Cartesian3(5000.0, 5000.0, 5000.0));
        // this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
        this.viewer.scene.globe.depthTestAgainstTerrain = true;

        this.viewer.scene.screenSpaceCameraController.enableTilt = false;

        // 禁用默认相机控制事件
        // this.viewer.scene.screenSpaceCameraController.enableRotate = false;
        // this.viewer.scene.screenSpaceCameraController.enableTranslate = false;
        this.viewer.scene.screenSpaceCameraController.enableZoom = false;
        // this.viewer.scene.screenSpaceCameraController.enableTilt = false;
        // this.viewer.scene.screenSpaceCameraController.enableLook = false;

        // function createPoint(worldPosition) {
        //     var point = this.viewer.entities.add({
        //         position: worldPosition,
        //         point: {
        //             color: Cesium.Color.WHITE,
        //             pixelSize: 5,
        //             heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        //         }
        //     });
        //     return point;
        // }
        // var drawingMode = 'polygon';
        // function drawShape(positionData) {
        //     var shape;
        //     if (drawingMode === 'line') {
        //         shape = this.viewer.entities.add({
        //             polyline: {
        //                 positions: positionData,
        //                 clampToGround: true,
        //                 width: 3
        //             }
        //         });
        //     }
        //     else if (drawingMode === 'polygon') {
        //         shape = this.viewer.entities.add({
        //             polygon: {
        //                 hierarchy: positionData,
        //                 material: new Cesium.ColorMaterialProperty(Cesium.Color.WHITE.withAlpha(0.7))
        //             }
        //         });
        //     }
        //     return shape;
        // }
        // var activeShapePoints = [];
        // var activeShape;
        // var floatingPoint;
        // var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        // this.handler.setInputAction((event) => {
        // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
        // we get the correct point when mousing over terrain.
        //     var earthPosition = this.viewer.scene.pickPosition(event.position);
        //     // `earthPosition` will be undefined if our mouse is not over the globe.
        //     if (Cesium.defined(earthPosition)) {
        //         if (activeShapePoints.length === 0) {
        //             floatingPoint = createPoint(earthPosition);
        //             activeShapePoints.push(earthPosition);
        //             var dynamicPositions = new Cesium.CallbackProperty(() => {
        //                 if (drawingMode === 'polygon') {
        //                     return new Cesium.PolygonHierarchy(activeShapePoints);
        //                 }
        //                 return activeShapePoints;
        //             }, false);
        //             activeShape = drawShape(dynamicPositions);
        //         }
        //         activeShapePoints.push(earthPosition);
        //         createPoint(earthPosition);
        //     }
        // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // this.handler.setInputAction((event) => {
        //     if (Cesium.defined(floatingPoint)) {
        //         var newPosition = this.viewer.scene.pickPosition(event.endPosition);
        //         if (Cesium.defined(newPosition)) {
        //             floatingPoint.position.setValue(newPosition);
        //             activeShapePoints.pop();
        //             activeShapePoints.push(newPosition);
        //         }
        //     }
        // }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        // Redraw the shape so it's not dynamic and remove the dynamic shape.
        // function terminateShape() {
        //     activeShapePoints.pop();
        //     drawShape(activeShapePoints);
        //     this.viewer.entities.remove(floatingPoint);
        //     this.viewer.entities.remove(activeShape);
        //     floatingPoint = undefined;
        //     activeShape = undefined;
        //     activeShapePoints = [];
        // }
        // this.handler.setInputAction((event) => {
        //     terminateShape();
        // }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    public handlerInit() {
        // this.handler.setInputAction((event) => {
        //     // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
        //     // we get the correct point when mousing over terrain.
        //     let earthPosition = this.viewer.scene.pickPosition(event.position);
        //     // `earthPosition` will be undefined if our mouse is not over the globe.
        //     if (Cesium.defined(earthPosition)) {
        //         if (this.activeShapePoints.length === 0) {
        //             this.floatingPoint = this.createPoint(earthPosition);
        //             this.activeShapePoints.push(earthPosition);
        //             let dynamicPositions = new Cesium.CallbackProperty(() => {
        //                 if (this.drawingMode === 'polygon') {
        //                     return new Cesium.PolygonHierarchy(this.activeShapePoints);
        //                 }
        //                 return this.activeShapePoints;
        //             }, false);
        //             this.activeShape = this.drawShape(dynamicPositions);
        //         }
        //         this.activeShapePoints.push(earthPosition);
        //         this.createPoint(earthPosition);
        //     }
        //     console.log('earthPosition', earthPosition);
        // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // this.handler.setInputAction((event) => {
        //     if (Cesium.defined(this.floatingPoint)) {
        //         let newPosition = this.viewer.scene.pickPosition(event.endPosition);
        //         if (Cesium.defined(newPosition)) {
        //             this.floatingPoint.position.setValue(newPosition);
        //             this.activeShapePoints.pop();
        //             this.activeShapePoints.push(newPosition);
        //         }
        //         console.log('newPosition', newPosition);

        //     }
        // }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        this.handler.setInputAction((event) => {
            // this.terminateShape();

            var earthPosition = this.viewer.scene.pickPosition(event.position);
            // `earthPosition` will be undefined if our mouse is not over the globe.
            if (Cesium.defined(earthPosition)) {
                this.changeLayer();

                setTimeout(() => {
                    this.viewer.useDefaultRenderLoop = !this.viewer.useDefaultRenderLoop;

                }, 1);


            }
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    public terminateShape = () => {
        this.activeShapePoints.pop();
        console.log(this.activeShapePoints);
        this.drawShape(this.activeShapePoints);
        this.viewer.entities.remove(this.floatingPoint);
        this.viewer.entities.remove(this.activeShape);
        this.floatingPoint = undefined;
        this.activeShape = undefined;
        this.activeShapePoints = [];
    }

}