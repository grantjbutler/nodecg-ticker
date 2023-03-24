import { tickerModuleRegistryReplicant } from '@nodecg-ticker/util/replicants';
import { TickerModule } from './ticker-module';
import { TickerModuleInstance } from './ticker-module-instance';
import { TickerItem } from './ticker-item';
import { DataType } from './data-type';
import { TickerModuleInfo } from '@nodecg-ticker/types/schemas';

export class TickerModuleRegistry<Data extends DataType> {
    constructors: Record<string, Function> = {};
    resolvers: Record<string, Function> = {};

    register<ModuleData extends DataType>(module: TickerModule<ModuleData>, transform: (data: TickerItem<ModuleData>) => TickerItem<Data>) {
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

    createInstance<ModuleData extends DataType>(moduleId: string, data: ModuleData): TickerModuleInstance<ModuleData> | undefined {
        let constructor = this.constructors[moduleId];
        if (!constructor) {
            return undefined;
        }

        return constructor(data);
    }

    resolve<ModuleData extends DataType>(instance: TickerModuleInstance<ModuleData>): TickerItem<Data>[] | undefined {
        let resolver = this.resolvers[instance.moduleId];
        if (!resolver) {
            console.log('no resolver');
            return undefined;
        }

        return resolver(instance);
    }

    moduleInfoForId(moduleId: string): TickerModuleInfo | undefined {
        return tickerModuleRegistryReplicant.value.find(info => info.id === moduleId);
    }
}