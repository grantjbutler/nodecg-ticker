<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { createInstance } from '../../browser-api';

const text = ref('');

onMounted(() => {
    document.addEventListener('dialog-confirmed', () => {
        if (text.value.length == 0) {
            return;
        }

        createInstance('com.grantjbutler.nodecg-ticker.text', { text: text.value });

        text.value = '';
    });

    document.addEventListener('dialog-dismissed', () => {
        text.value = '';
    });

});
</script>

<template>
    <div>
        <label for="text">Ticker Text</label>
        <input type="text" id="text" v-model.trim="text">
    </div>
</template>