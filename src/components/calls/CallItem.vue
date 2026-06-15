<template>
    <div>
        <div>{{ call[4] }}</div>
        <div>{{ call[8] }}</div>
    </div>
</template>

<script setup lang="ts">
    import type { ContactCallRow } from '@/types/data';

    const { call } = defineProps<{
        call: ContactCallRow
    }>()
</script>