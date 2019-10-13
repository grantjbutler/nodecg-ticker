<template>
    <div>
        <div v-if="tickerRegistry">
            <button v-for="registeredModule in tickerRegistry" :key="registeredModule.id" @click="addModule(registeredModule.id)" class="w-full px-2 py-2 bg-gray-700 text-left">
                <span class="font-semibold">{{ registeredModule.name }}</span><br>
                <span class="text-sm">{{ registeredModule.description}}</span>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    replicants: ['tickerRegistry'],
    methods: {
        addModule (moduleID) {
            nodecg.sendMessage('ticker:add-module', moduleID)
        }
    }
}
</script>
