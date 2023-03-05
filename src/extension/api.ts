import { TickerModuleInfo } from '@nodecg-ticker/types/schemas';
import { tickerModuleRegistryReplicant } from '@nodecg-ticker/util/replicants';
import { get as nodecg } from '@nodecg-ticker/util/nodecg';

interface TickerModuleInstance<Data> {
    id: string;
    moduleId: string;
    name: string;
    description: string;
    data: Data;
}

interface TickerItem<Data> {
    id: string;
    data: Data;
}

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

    createInstance(data: Data): TickerModuleInstance<Data> {
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

export class TickerModuleRegistry<Data> {
    constructors: Record<string, Function> = {};
    resolvers: Record<string, Function> = {};

    constructor() {
        
    }

    register<ModuleData>(module: TickerModule<ModuleData>, transform: (data: TickerItem<ModuleData>) => TickerItem<Data>) {
        if (this.constructors[module.id]) {
            // TODO: Log message saying that we've already registered a module with this ID.
            return;
        }

        this.constructors[module.id] = (data: ModuleData): TickerModuleInstance<ModuleData> => {
            return module.createInstance(data);
        };
        this.resolvers[module.id] = (instance: TickerModuleInstance<ModuleData>): TickerItem<Data>[] => {
            return module.resolve(instance).map(transform);
        }
        tickerModuleRegistryReplicant.value.push(module.info);
    }

    createInstance<ModuleData>(moduleId: string, data: ModuleData): TickerModuleInstance<ModuleData> | undefined {
        let constructor = this.constructors[moduleId];
        if (!constructor) {
            return undefined;
        }

        return constructor(data);
    }

    resolve<ModuleData>(instance: TickerModuleInstance<ModuleData>): TickerItem<Data>[] | undefined {
        let resolver = this.resolvers[instance.moduleId];
        if (!resolver) {
            return undefined;
        }

        return resolver(instance);
    }

    private moduleInfoWithId(moduleId: string): TickerModuleInfo | undefined {
        return tickerModuleRegistryReplicant.value.find(moduleInfo => moduleInfo.id === moduleId);
    }
}