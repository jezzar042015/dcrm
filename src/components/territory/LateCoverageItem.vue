<template>

    <div class="mb-5 shadow bg-white rounded-sm" v-show="(coverage[11] ?? []).length > 0">
        <div class="flex gap-2 items-center justify-between bg-gray-100 py-2 px-2 font-semibold">
            <div>
                <div>{{ relatedTerritory?.[2] }}</div>
                <div class="font-normal">{{ displayAssignmentDate }}</div>
            </div>
            <div>{{ coverage[11]?.length }}</div>
        </div>

        <template v-for="call in coverage[11]" :key="call[0]">
            <PendingCallItem :call />
        </template>
    </div>
</template>

<script setup lang="ts">
    import PendingCallItem from '../calls/PendingCallItem.vue';
    import type { TerritoryCoverageRow } from '@/types/data';
    import { computed } from 'vue';
    import { useTerritoryStore } from '@/stores/territories';

    const terr = useTerritoryStore()

    const { coverage } = defineProps<{
        coverage: TerritoryCoverageRow
    }>()

    const relatedTerritory = computed(() => {
        return terr.data.find(f => f[0] === coverage[1])
    })

    const displayAssignmentDate = computed(() => {
        const d = new Date(coverage[2]);
        return d.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    })
</script>