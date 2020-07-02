export interface IMapProps {
    mapInfo: any;
    elementChildren?: Array<any>;
    isTrajectory: boolean | undefined;
}

export interface Cartesian3 {
    longitude: number;
    latitude: number;
    height: number;
};

export interface IFirePointOption {
    location: Cartesian3;
    ionSrc: string;
    handleEvent: any;
    item: any;
};

export interface Rectangle {
    beginLongitude: number;
    beginLatitude: number;
    endLongitude: number;
    endLatitude: number;
}
