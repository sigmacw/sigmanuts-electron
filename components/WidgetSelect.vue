<template>
    <div id="widget-select" style="width: 50%">
        <USelectMenu v-model="selected" :options="widgets" searchable creatable
            clear-search-on-close show-create-option-when="always" placeholder="Select widget"/>
    </div>
</template>

<script setup lang="ts">
const widgets = ['Default'];

const selected = ref(widgets[0])
</script>

<style lang="scss" scoped>

</style>
