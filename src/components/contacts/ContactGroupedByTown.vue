<template>
    <div>
        <div v-for="value in towns" :key="value.town" @click="emits('selectTown', value.town)">
            <div class="flex items-center justify-between py-2 px-3 border-b border-b-gray-100 cursor-pointer">
                <div class="flex items-center gap-3">
                    <div class="text-sm px-1"> {{ value.town || 'No Address' }} </div>
                    <div class="text-[10px] py-0.5 px-1 rounded-sm bg-gray-100">{{ value.contacts.length }}
                    </div>
                </div>
                <div>
                    <CaretSmall class="h-6 w-6" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import CaretSmall from '@/icon/CaretSmall.vue';
    import type { GroupedContactsByTown } from '@/types/data';

    const { towns } = defineProps<{
        towns: GroupedContactsByTown[]
    }>()

    const emits = defineEmits<{
        selectTown: [town: string]
    }>()

</script>