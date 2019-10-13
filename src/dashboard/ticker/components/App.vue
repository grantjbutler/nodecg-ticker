<template>
    <div class="p-2">
        <div class="flex justify-end mb-2">
            <button nodecg-dialog="ticker-module-picker" class="py-2 px-4 bg-green-500 text-white">
                Add Entry
            </button>
        </div>
        <div v-if="ticker && ticker.length > 0">
            <div v-for="(item, index) in ticker" :key="item.id" class="flex items-center group" :class="{ 'bg-gray-700': index % 2 == 0, 'bg-gray-800': index % 2 == 1 }">
                <div class="flex-1 p-2">
                    {{ item.description }}
                </div>
                <div class="hidden group-hover:block pr-2">
                    <button class="w-6 h-8 text-gray-500 disabled:opacity-25" :disabled="index == ticker.length - 1" @click="moveDown(item.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="object-fill fill-current"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </button>
                    <button class="w-6 h-8 text-gray-500 disabled:opacity-25" :disabled="index == 0" @click="moveUp(item.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="object-fill fill-current"><path d="M10.707 7.05L10 6.343 4.343 12l1.414 1.414L10 9.172l4.243 4.242L15.657 12z"/></svg>
                    </button>
                    <button class="w-6 h-8 text-red-600" @click="removeItem(item.id)">
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

<script>
export default {
    replicants: [
        'ticker',
    ],
    mounted () {
        nodecg.listenFor('ticker:add-module', (moduleID) => {
            nodecg.getDialog('ticker-module-picker').close()
        })

        nodecg.listenFor('ticker:show-dialog', (info) => {
            let dialog = nodecg.getDialog(info.dialogName, info.bundleName)
            if (!dialog) {
                nodecg.log.error(`Couldn't find a dialog named ${info.dialogName} from the bundle ${info.bundleName}`)
                return
            }

            // add a delay to let the other dialogs close before opening this one.
            setTimeout(() => {
                dialog.open()
            }, 500)
        })
    },
    methods: {
        removeItem (itemID) {
            nodecg.sendMessage('ticker:delete-instance', { id: itemID })
        },
        moveDown (itemID) {
            nodecg.sendMessage('ticker:move-down', { id: itemID })
        },
        moveUp (itemID) {
            nodecg.sendMessage('ticker:move-up', { id: itemID })
        }
    }
}
</script>