<template>
    <div>
        <div @click="setOnDetail" class="flex items-center gap-2 py-2 px-3 border-b border-b-gray-100 cursor-pointer">
            <div class="w-15 h-15 bg-gray-100 rounded-full overflow-hidden">
                <img :src="imgSrc" alt="" v-if="imgSrc" class="h-full w-full object-cover">
                <template v-else>
                    <FemaleProfile v-if="contact[17] === 'Female'" class="h-full text-gray-300" />
                    <MaleProfile v-else class="h-full text-gray-300" />
                </template>
            </div>
            <div class="p-4">
                <div class="text-sm"> {{ `${contact[1]} ${contact[2]}` }}</div>
                <div v-if="contact[8] === 'Territory'" class="text-xs" :class="{'text-gray-400': daysAgo === 'No Call Visit'}">{{ daysAgo }}</div>
                <div v-if="isBSorRV" class="text-xs">{{ pubName }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import FemaleProfile from '@/icon/FemaleProfile.vue';
    import MaleProfile from '@/icon/MaleProfile.vue';
    import type { ContactRow } from '@/types/data';
    import { computed, onMounted, ref } from 'vue';
    import { useAuthStore } from '@/stores/auth';
    import { useContactCallStore } from '@/stores/calls';
    import { useContactStore } from '@/stores/contacts';
    import { usePageStore } from '@/stores/pages';
    import { useProfileImageStore } from '@/stores/profileImages';
    import { useDaysAgo } from '@/composables/useDaysAgo';
    import { usePublishersStore } from '@/stores/pubs';

    const contacts = useContactStore()
    const pages = usePageStore()
    const auth = useAuthStore()
    const calls = useContactCallStore()
    const pubs = usePublishersStore()

    const profile = useProfileImageStore()
    const imgSrc = ref<string>('')

    const { contact } = defineProps<{
        contact: ContactRow
    }>()

    const setOnDetail = () => {
        contacts.onDetail = contact
        if (pages.active == 'contacts-list') pages.previous = 'contacts-list'
        pages.active = 'contact-details'

            
    }

    const latestCall = computed(() => {
        return calls.latestCallMap.get(contact[0]) ?? ''
    })

    const { daysAgo } = useDaysAgo(latestCall)

    const isBSorRV = computed(() => ['Bible Study', 'Return Visit'].includes(contact[8]))

    const pubName = computed(() => {
        const pub = pubs.data.find(p => p[2] === contact[9])
        return `${pub?.[3]} ${pub?.[4]}` 
    })

    onMounted(async () => {
        if (contact[3]) {
            const src = await profile.getProfileImg(contact[3], auth.token)

            if (src) {
                imgSrc.value = src
            }
        }
    })
</script>