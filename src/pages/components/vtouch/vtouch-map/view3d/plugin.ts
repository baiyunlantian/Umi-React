import { mapConfig, Map } from '.';


export class mapPlugin {

    public map: Map;
    // public viewer: Cesium.Viewer;
    // public handler: Cesium.ScreenSpaceEventHandler;

    constructor() {

        this.map = new Map();

        mapConfig.map = this.map;
        this.map.onStartUp();

        // this.viewer = this.map.viewer;
        // this.handler = this.map.handler;

        // const map = new Map();
        // if (!(mapConfig.map instanceof Map)) {
        //     mapConfig.map = map;
        // }

        // map.onStartUp();

    }


}