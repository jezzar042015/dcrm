<template>
    <div class="border-b border-b-gray-300 p-2">
        <div class="text-xs flex justify-between">
            <div >{{ date }}</div>
            <div>{{ call[5] }}</div>
        </div>
        <div class="text-sm mt-1">{{ call[8] }}</div>
    </div>
</template>

<script setup lang="ts">
    import type { ContactCallRow } from '@/types/data';
    import { computed } from 'vue';

    const { call } = defineProps<{
        call: ContactCallRow
    }>()

    const date = computed(() => {
        const d = new Date(call[4]);
        return d.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    })
</script>