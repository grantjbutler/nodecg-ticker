import { Ticker, TickerModuleRegistry } from '@nodecg-ticker/types/schemas';
import { get as nodecg } from './nodecg';

export const currentTickerReplicant = nodecg().Replicant('current-ticker', { persistent: false });
export const tickerModuleRegistryReplicant = nodecg().Replicant<TickerModuleRegistry>('ticker-module-registry');
export const tickerReplicant = nodecg().Replicant<Ticker>('ticker');