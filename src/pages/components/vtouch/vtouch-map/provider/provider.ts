
export type ProviderFactoryFunction = (div: string) => Provider;

export abstract class Provider {
    private static _Factories: Map<string, ProviderFactoryFunction> = new Map();

    public static registerProvider(classId: string, factory: ProviderFactoryFunction) {
        this._Factories.set(classId, factory);
    }

    public static createProvider(div: string) {
        const factory = this._Factories.get(div);
        if (factory) {
            return factory(div);
        }
        return undefined;
    }

    public div: string;

    constructor(div: string) {
        this.div = div;
    }

    public init = () => {

    }

    public loadEnd = () => {

    }

    public exit = () => {

    };



}