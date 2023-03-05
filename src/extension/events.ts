import { get as nodecg } from '@nodecg-ticker/util/nodecg';
import { tickerReplicant } from './util/replicants';

nodecg().listenFor('ticker:remove-instance', (args: { id: string }) => {
    tickerReplicant.value = tickerReplicant.value.filter(instance => instance.id != args.id);
});

nodecg().listenFor('ticker:move-down', (args: { id: string }) => {
    let index = tickerReplicant.value.findIndex(instance => instance.id == args.id );
    if (index == -1) {
        return
    }

    if (index == tickerReplicant.value.length - 1) {
        return
    }

    let removedItem = tickerReplicant.value.splice(index, 1)
    tickerReplicant.value.splice(index + 1, 0, ...removedItem)
});

nodecg().listenFor('ticker:move-up', (args: { id: string }) => {
    let index = tickerReplicant.value.findIndex(instance => instance.id == args.id )
    if (index == -1) {
        return
    }

    if (index == 0) {
        return
    }

    let removedItem = tickerReplicant.value.splice(index, 1)
    tickerReplicant.value.splice(index - 1, 0, ...removedItem)
});