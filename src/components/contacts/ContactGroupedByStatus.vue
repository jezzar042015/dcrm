<template>
    <div class="mt-10">
        <div v-for="value in groupedByStatus" :key="value.status" @click="emits('selectStatus', value.status)"
            class="flex items-center justify-between py-4 px-3 border-b border-b-gray-100 cursor-pointer">
            <div class="flex flex-col gap-0 px-3">
                <div class="px-1 font-semibold"> {{ value.status }} </div>
                <div class="text-sm py-0.5 px-1 ">{{ value.contacts.length }}</div>
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