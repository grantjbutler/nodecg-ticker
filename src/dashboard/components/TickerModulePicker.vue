<script setup lang="ts">
import { TickerModuleRegistry } from '@nodecg-ticker/types/schemas';
import { useReplicant } from '@nodecg-ticker/utils/useReplicant';

const tickerModuleRegistry = useReplicant<TickerModuleRegistry | null>('ticker-module-registry', { defaultValue: null });

const addModule = (moduleId: string) => {
    nodecg.sendMessage('ticker:add-module', moduleId);
}
</script>

<template>
    <div>
        <div v-if="tickerModuleRegistry">
            <div v-if="tickerModuleRegistry.length">
                <button v-for="registeredModule in tickerModuleRegistry" :key="registeredModule.id" @click="addModule(registeredModule.id)" class="w-full px-2 py-2 bg-gray-700 text-left">
                    <span class="font-semibold">{{ registeredModule.name }}</span><br>
                    <span class="text-sm">{{ registeredModule.description }}</span>
                </button>
            </div>
            <div v-else class="h-16 text-gray-500 w-full flex justify-center items-center">
                No modules registered.
            </div>
        </div>
        <div v-else class="h-16 text-gray-500 w-full flex justify-center items-center">
            Loading modules...
        </div>
    </div>
</template>