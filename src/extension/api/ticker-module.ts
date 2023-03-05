import { TickerModuleInfo } from '@nodecg-ticker/types/schemas';
import { TickerItem } from './ticker-item';
import { TickerModuleInstance } from './ticker-module-instance';

type TickerItemResolver<Data> = (instance: TickerModuleInstance<Data>) => TickerItem<Data>[];

export class TickerModule<Data> {
    id: string;
    name: string;
    description: string;

    private _resolve: TickerItemResolver<Data>
    
    constructor (id: string, name: string, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;

        this._resolve = (instance) => {
            return [
                {
                    id: instance.id,
                    data: instance.data
                }
            ]
        };
    }

    get info(): TickerModuleInfo {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            dialogName: undefined,
            bundleName: undefined
        }
    }

    onResolve(resolver: TickerItemResolver<Data>): TickerModule<Data> {
        this._resolve = resolver;

        return this;
    }

    createInstance(data?: Data): TickerModuleInstance<Data> {
        return {
            id: '',
            moduleId: this.id,
            name: this.name,
            description: '',
            data
        };
    }

    resolve(instance: TickerModuleInstance<Data>): TickerItem<Data>[] {
        return this._resolve(instance);
    }
}