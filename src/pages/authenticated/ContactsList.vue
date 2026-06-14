<template>
    <div class="h-screen overflow-hidden flex flex-col">
        <div class="px-3 py-5 border-b border-b-gray-200 flex gap-2 items-center">
            <div @click="toDashboard">
                <ArrowIcon class="h-5 w-5 rotate-180" />
            </div>
            <div>Contacts</div>
        </div>
        <div class="flex-1 overflow-auto">
            <div>
                <div v-for="value in contacts.groupedByStatus" :key="value.status"
                    class="flex items-center justify-between py-2 px-3 border-b border-b-gray-100 cursor-pointer">
                    <div class="flex items-center gap-3">
                        <div class="text-sm px-1"> {{ value.status }} </div>
                        <div class="text-[10px] py-0.5 px-1 rounded-sm bg-gray-100">{{ value.contacts.length }}</div>
                    </div>
                    <div>
                        <CaretSmall class="h-6 w-6"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import ArrowIcon from '@/icon/ArrowIcon.vue';
import CaretSmall from '@/icon/CaretSmall.vue';
    import { useContactStore } from '@/stores/contacts';
    import { usePageStore } from '@/stores/pages';

    const contacts = useContactStore()
    const pages = usePageStore()

    const toDashboard = () => pages.active = 'dashboard'
</script>