<template>
    <div class="preview bg-gray-950 border-2 border-gray-800">
        <div class="preview-actions">
            <div class="actions__wrapper">
                <div class="actions__test-buttons">
                    <UTooltip text="Test Message">
                        <UButton @click="sendTest('message')" icon="i-solar-chat-line-broken" size="xl"
                            color="primary" square variant="ghost" />
                    </UTooltip>

                    <UTooltip text="Test Superchat">
                        <UButton @click="sendTest('superchat')" icon="i-solar-dollar-linear" size="xl"
                            color="primary" square variant="ghost" />
                    </UTooltip>

                    <UTooltip text="Test Sticker">
                        <UButton @click="sendTest('sticker')" icon="i-solar-smile-circle-linear" size="xl"
                            color="primary" square variant="ghost" />
                    </UTooltip>

                    <UTooltip text="Test Membership">
                        <UButton @click="sendTest('membership')" icon="i-solar-star-linear" size="xl"
                            color="primary" square variant="ghost" />
                    </UTooltip>

                    <UTooltip text="Test Gift Membership">
                        <UButton @click="sendTest('gift')" icon="i-solar-gift-linear" size="xl"
                            color="primary" square variant="ghost" />
                    </UTooltip>
                </div>
                <div class="actions__preview-actions">

                    <UTooltip text="Copy link">
                        <UButton icon="i-solar-copy-line-duotone" size="xl"
                            color="primary" square variant="ghost" />
                    </UTooltip>

                    <UTooltip text="Toggle preview">
                        <UButton icon="i-solar-eye-linear" size="xl" color="primary"
                            square variant="ghost" />
                    </UTooltip>
                </div>
            </div>
            <div class="actions__wrapper actions__superchats">

            </div>
        </div>
        <div class="preview-frame">
            <iframe style="height: 100%; width: 100%;" :src="iframeURL"></iframe>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ipcRenderer } from 'electron';

const currentWidget = useState('current-widget')
const iframeURL = ref(`http://localhost:6969/${currentWidget.value}/widget.html`)

const sendTest = (item: string): void => {
    ipcRenderer.send('test-item', item)
}

watch(currentWidget, (val) => {
    iframeURL.value = `http://localhost:6969/${val}/widget.html`
})
</script>

<style lang="scss" scoped>
.preview {
    width: 100%;
    height: 100%;

    display: grid;
    grid-template-rows: 100px calc(100% - 100px);

    border-radius: 1rem;
    overflow: hidden;

    .preview-actions {
        display: grid;
        grid-template-rows: 50% 50%;

        padding: 1rem;

        .actions__wrapper {
            border-radius: 0.4rem;
            min-height: 40px;

            display: flex;
            justify-content: space-between;

            .actions__preview-actions {
                display: flex;
            }
        }

    }
}
</style>
