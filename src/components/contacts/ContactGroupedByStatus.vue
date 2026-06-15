<template>
    <div>
        <div v-for="value in groupedByStatus" :key="value.status" @click="emits('selectStatus', value.status)"
            class="flex items-center justify-between py-2 px-3 border-b border-b-gray-100 cursor-pointer">
            <div class="flex items-center gap-3">
                <div class="text-sm px-1"> {{ value.status }} </div>
                <div class="text-[10px] py-0.5 px-1 rounded-sm bg-gray-100">{{ value.contacts.length }}</div>
            </div>
            <div>
                <CaretSmall class="h-6 w-6" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import CaretSmall from '@/icon/CaretSmall.vue';
    import type { GroupedContactsByStatus } from '@/types/data';

    const { groupedByStatus } = defineProps<{
        groupedByStatus: GroupedContactsByStatus[]
    }>()

    const emits = defineEmits<{
        selectStatus: [status: string]
    }>()
</script>