

export class Cartesian {

    private static _offsetLongitude: number = 0;// - 0.01185;
    private static _offsetLatitude: number = 0;// - 0.00328;

    public static offset2(longitude: number, latitude: number) {

        return {
            longitude: longitude + this._offsetLongitude,
            latitude: latitude + this._offsetLatitude,
        };

    };

}