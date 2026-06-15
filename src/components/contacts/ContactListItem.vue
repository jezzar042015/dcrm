<template>
    <div>
        <div @click="setOnDetail"
            class="flex items-center justify-between py-2 px-3 border-b border-b-gray-100 cursor-pointer">
            <div class="p-4">
                {{ `${contact[1]} ${contact[2]}` }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useContactStore } from '@/stores/contacts';
    import { usePageStore } from '@/stores/pages';
    import type { ContactRow } from '@/types/data';

    const contacts = useContactStore()
    const pages = usePageStore()

    const { contact } = defineProps<{
        contact: ContactRow
    }>()

    const setOnDetail = () => {
        contacts.onDetail = contact
        pages.active = 'contact-details'
    }
</script>