<template>
    <div class="wrapper">
        <div class="settings">
            <div class="main">
                <div class="main__title">
                    <h1 class="text-primary-50 text-2xl font-extrabold">Chat setup</h1>
                    <WidgetSelect />
                </div>
                <div class="main__input">
                    <YTChatInput />
                </div>
                <div class="main__actions"></div>
            </div>
            <div class="fields">
                <!-- Field settings will be displayed in this 
                container -->
            </div>
        </div>
        <div class="preview-container">
            <PreviewElement />
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.wrapper {
    display: grid;
    grid-template-columns: 50% auto;

    padding: 2rem;

    .settings {
        padding: 1rem;

        .main__title {
            padding: 1rem 0;
            width: 100%;

            display: flex;
            justify-content: space-between;
        }
    }

    .preview-container {
        padding-top: 2rem;
    }
}
</style>
