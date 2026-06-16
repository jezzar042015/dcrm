<template>
    <div v-if="value">
        <div class="text-xs text-gray-600">{{ label }}</div>
        <div v-if="isStringArray" v-for="item in value" class="text-sm flex items-center gap-1.5">
            <!-- <span class="h-2 w-2 rounded-full border border-gray-600"></span>  -->
            <span>{{ item }}</span>
        </div>
        <div v-else class="text-sm">{{ value }}</div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';

    const { label, value } = defineProps<{
        label: string
        value: number | string | string[] | null | undefined
    }>()

    const isStringArray = computed(() => Array.isArray(value))
</script>