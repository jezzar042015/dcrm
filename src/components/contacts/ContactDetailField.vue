<template>
    <div v-if="value">
        <div class="text-xs text-gray-600">{{ label }}</div>
        <div class="text-sm">{{ value }}</div>
    </div>
</template>

<script setup lang="ts">
    const { label, value } = defineProps<{
        label: string
        value: number | string | null | undefined
    }>()
</script>