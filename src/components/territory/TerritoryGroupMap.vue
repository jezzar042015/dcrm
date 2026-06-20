<template>
    <div @click.self="emits('closeViewer')"
        class="absolute h-dvh w-full overflow-hidden bg-black/80 top-0 right-0 flex items-center justify-center z-10">
        <div class="w-11/12">

        </div>
    </div>
</template>

<script setup lang="ts">
    import type { GroupedContactsByTerritory } from '@/types/data';

    const { groupedTerritory } = defineProps<{
        groupedTerritory: GroupedContactsByTerritory
    }>()

    const emits = defineEmits<{
        'closeViewer': []
    }>()
</script>