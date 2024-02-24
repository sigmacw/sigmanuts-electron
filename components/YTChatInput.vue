<template>
    <div class="input-wrapper border-2" :class="{ 'border-primary-800': badUrl, 'border-gray-900': !badUrl}">
        <chat-input id="chat-input">
            <UInput v-model="q" name="q" placeholder="Search..." color="gray"
                size="xl" icon="i-heroicons-magnifying-glass-20-solid"
                autocomplete="off" :loading="loading"
                :ui="{ icon: { trailing: { pointer: '' } } }">
                <template #trailing>
                    <UButton v-show="q !== ''" color="gray" variant="link"
                        icon="i-heroicons-x-mark-20-solid" :padded="false"
                        @click="q = ''" />
                </template>
            </UInput>
        </chat-input>
    </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import { ipcRenderer } from 'electron';

const loading = ref(false);
const q = ref('');
const badUrl = ref(false);

const debouncedFn = useDebounceFn((url) => {

    if (url) {
        if (url.startsWith("https://youtube.com/live/")) {
            url = "https://www.youtube.com/live_chat?v=" +
                url.replace("https://youtube.com/live/", "");
        }
        else if (url.startsWith("https://www.youtube.com/watch?v=")) {
            url = "https://www.youtube.com/live_chat?v=" +
                url.replace("https://www.youtube.com/watch?v=", "");
        }
        else if (url.startsWith("https://studio.youtube.com/video/")) {
            url = "https://www.youtube.com/live_chat?v=" +
                url.replace("https://studio.youtube.com/video/", "")
                    .replace("/livestreaming", "");
        } else {
            badUrl.value = true;
            loading.value = false;
            return
        }

        badUrl.value = false;
    } else {
        return
    }

    ipcRenderer.send('url-change', url);
    loading.value = false;
}, 1000);

watch(q, (val) => {
    loading.value = true;

    debouncedFn(val);
});

</script>

<style lang="scss" scoped>
.input-wrapper {
    border-radius: 0.625rem;
    padding: 2px;
}
</style>
