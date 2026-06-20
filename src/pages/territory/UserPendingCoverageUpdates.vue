<template>
    <div class="h-[100dvh] overflow-hidden flex flex-col relative">
        <div class="p-5 shadow flex items-center gap-5">
            <div class="bg-gray-100 h-8 w-8 rounded-full"></div>
            <div class="text-lg font-bold">Pending Visits</div>
        </div>

        <div class="flex-1 h-full overflow-hidden">
            <div class="text-xs p-4 bg-gray-300 h-full overflow-auto">
                <template v-for="coverage in coverages.userLateAssignments" :key="coverage[0]">
                    <LateCoverageItem :coverage />
                </template>
            </div>
        </div>

        <BottomNav />
    </div>
</template>

<script setup lang="ts">
    import BottomNav from '@/components/BottomNav.vue';
    import LateCoverageItem from '@/components/territory/LateCoverageItem.vue';
    import { useTerritoryCoveragesStore } from '@/stores/territory-coverages';

    const coverages = useTerritoryCoveragesStore()
</script>