import { TickerModuleInfo } from '@nodecg-ticker/types/schemas';
import { TickerItem } from './ticker-item';
import { TickerModuleInstance } from './ticker-module-instance';
import { v4 as uuid } from 'uuid';
import { DataType } from './data-type';

type TickerItemResolver<Data> = (instance: TickerModuleInstance<Data>) => TickerItem<Data>[];
type TickerModuleInstanceCustomizer<Data> = (instance: TickerModuleInstance<Data>) => TickerModuleInstance<Data>;

export class TickerModule<Data extends DataType> {
    id: string;
    name: string;
    description: string;

    dialogName?: string;
    bundleName?: string;

    private _onCreateInstance?: TickerModuleInstanceCustomizer<Data>;
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
            dialogName: this.dialogName,
            bundleName: this.bundleName
        }
    }

    registerDialog (name: string, bundleName: string): TickerModule<Data> {
        this.dialogName = name;
        this.bundleName = bundleName;

        return this;
    }

    onResolve(resolver: TickerItemResolver<Data>): TickerModule<Data> {
        this._resolve = resolver;

        return this;
    }

    onCreateInstance(customizer: TickerModuleInstanceCustomizer<Data>): TickerModule<Data> {
        this._onCreateInstance = customizer;
        
        return this;
    }

    createInstance(data: Data): TickerModuleInstance<Data> {
        let instance: TickerModuleInstance<Data> = {
            id: uuid(),
            moduleId: this.id,
            name: this.name,
            description: '',
            data
        };

        if (this._onCreateInstance) {
            instance = this._onCreateInstance(instance);
        }

        return instance;
    }

    resolve(instance: TickerModuleInstance<Data>): TickerItem<Data>[] {
        return this._resolve(instance);
    }
}