<script setup lang="ts">
import { Ticker } from '@nodecg-ticker/types/schemas';
import { useReplicant } from '@nodecg-ticker/utils/useReplicant';
import { onMounted } from 'vue';

const ticker = useReplicant<Ticker>('ticker', { defaultValue: [] });

const moveDown = (itemId: string) => {
    nodecg.sendMessage('ticker:move-down', { id: itemId });
};

const moveUp = (itemId: string) => {
    nodecg.sendMessage('ticker:move-up', { id: itemId });
};

const removeInstance = (itemId: string) => {
    nodecg.sendMessage('ticker:remove-instance', { id: itemId });
}

onMounted(() => {
    nodecg.listenFor('ticker:add-module', () => {
        nodecg.getDialog('ticker-module-picker')?.close()
    })

    nodecg.listenFor('ticker:show-dialog', (info: { dialogName: string, bundleName: string }) => {
        let dialog = nodecg.getDialog(info.dialogName, info.bundleName)
        if (!dialog) {
            nodecg.log.error(`Couldn't find a dialog named ${info.dialogName} from the bundle ${info.bundleName}`)
            return
        }

        // add a delay to let the other dialogs close before opening this one.
        setTimeout(() => {
            dialog?.open()
        }, 500)
    })
});
</script>

<template>
    <div class="p-2">
        <div class="flex justify-end mb-2">
            <button nodecg-dialog="ticker-module-picker" class="py-2 px-4 bg-green-500 text-white">
                Add Entry
            </button>
        </div>
        <div v-if="ticker.length > 0">
            <div v-for="(item, index) in ticker" :key="item.id" class="flex items-center group" :class="{ 'bg-gray-700': index % 2 == 0, 'bg-gray-800': index % 2 == 1 }">
                <div class="flex-1 p-2">
                    <div v-html="item.name" class="text-sm italic"></div>
                    <div v-html="item.description" class="text-md"></div>
                </div>
                <div class="hidden group-hover:flex no-hover:flex pointer-coarse:gap-2 pr-2">
                    <button class="w-6 h-8 text-gray-500 disabled:opacity-25" :disabled="index == ticker.length - 1" @click="moveDown(item.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="object-fill fill-current"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </button>
                    <button class="w-6 h-8 text-gray-500 disabled:opacity-25" :disabled="index == 0" @click="moveUp(item.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="object-fill fill-current"><path d="M10.707 7.05L10 6.343 4.343 12l1.414 1.414L10 9.172l4.243 4.242L15.657 12z"/></svg>
                    </button>
                    <button class="w-6 h-8 text-red-600" @click="removeInstance(item.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="object-fill fill-current"><path d="M6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z"/></svg>
                    </button>
                </div>
            </div>
        </div>
        <div v-else class="h-16 text-gray-500 w-full flex justify-center items-center">
            No Ticker Items
        </div>
    </div>
</template>