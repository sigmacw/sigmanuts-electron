<template>
    <div id="widget-select" style="width: 50%">
        <USelectMenu v-model="selected" :options="widgets" searchable creatable
            clear-search-on-close show-create-option-when="always" placeholder="Select widget"/>
    </div>
</template>

<script setup lang="ts">

const widgets = ['YouTube'];

const selected = ref(widgets[0])
const currentWidget = useState('current-widget', () => selected.value)

watch(selected, (val) => {
    currentWidget.value = val
})
</script>

<style lang="scss" scoped>

</style>
