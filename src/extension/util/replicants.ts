import { TickerModuleRegistry } from '@nodecg-ticker/types/schemas';
import { get as nodecg } from './nodecg';

export const tickerModuleRegistryReplicant = nodecg().Replicant<TickerModuleRegistry>('ticker-module-registry');