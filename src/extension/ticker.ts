import { TickerModuleRegistry } from "@nodecg-ticker/api/ticker-module-registry";
import { TickerModule } from '@nodecg-ticker/api/ticker-module';
import { TickerItem } from '@nodecg-ticker/api/ticker-item';
import { Ticker as RunningTicker } from "@nodecg-ticker/types/schemas";
import clone from 'clone';
import { currentTickerReplicant, tickerReplicant } from "./util/replicants";
import { TickerModuleInstance } from "./api/ticker-module-instance";
import { get as nodecg } from '@nodecg-ticker/util/nodecg';
import { DataType } from "./api/data-type";

export default class Ticker<Data extends DataType> {
    private registry: TickerModuleRegistry<Data> = new TickerModuleRegistry();

    private ticker?: RunningTicker;
    private activeItems: TickerItem<Data>[] = [];

    constructor() {
        this.ticker = this.buildTicker();
        this.scheduleNextTransition();

        nodecg().listenFor('ticker:add-module', (moduleId: string) => {
            let info = this.registry.moduleInfoForId(moduleId);
            if (!info) {
                nodecg().log.error(`No module is registered with the ID '${moduleId}'`);
                return;
            }

            if (info.dialogName && info.bundleName) {
                nodecg().sendMessage('ticker:show-dialog', {
                    dialogName: info.dialogName,
                    bundleName: info.bundleName,
                    moduleId
                })
            }
            else {
                nodecg().sendMessage('ticker:create-instance', {
                    moduleId
                })
            }
        })
        
        nodecg().listenFor('ticker:create-instance', (info: { moduleId: string, data: DataType }) => {
            let instance = this.registry.createInstance(info.moduleId, info.data);
            if (!instance) {
                nodecg().log.error(`No module is registered with the ID '${info. moduleId}'`);
                return
            }
            
            tickerReplicant.value.push(instance)
        })
    }

    register<ModuleData extends DataType>(module: TickerModule<ModuleData>, transform: (data: TickerItem<ModuleData>) => TickerItem<Data>) {
        this.registry.register(module, transform);
    }

    private buildTicker() {
        let ticker = clone(tickerReplicant.value);
        if (ticker.length == 0) {
            return undefined;
        }

        return ticker;
    }

    private scheduleNextTransition() {
        if (!this.activeItems.length) {
            this.activeItems = this.resolveNextInstance();
        }

        let activeItem = this.activeItems.shift();
        if (activeItem) {
            currentTickerReplicant.value = activeItem;
        }

        setTimeout(() => {
            this.scheduleNextTransition();
        }, nodecg().bundleConfig.interval * 1000);
    }

    private resolveNextInstance(): TickerItem<Data>[] {
        if (!this.ticker) {
            return [];
        }

        if (!this.ticker.length) {
            this.ticker = this.buildTicker();
            return this.resolveNextInstance();
        }

        let instance: TickerModuleInstance<DataType> | undefined = this.ticker.shift();
        if (!instance) {
            return this.resolveNextInstance();
        }

        return this.registry.resolve(instance) || [];
    }
}