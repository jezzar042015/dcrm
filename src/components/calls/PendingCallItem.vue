<template>
    <div>
        <div class="flex items-center gap-2 py-2 px-3 border-t border-t-gray-100 cursor-pointer rounded-t-sm">
            <div class="w-15 h-15 bg-gray-100 rounded-full overflow-hidden">
                <img :src="imgSrc" alt="" v-if="imgSrc" class="h-full w-full object-cover">
                <template v-else>
                    <FemaleProfile v-if="relatedContact?.[17] === 'Female'" class="h-full text-gray-300" />
                    <MaleProfile v-else class="h-full text-gray-300" />
                </template>
            </div>
            <div class="p-4" v-if="relatedContact">
                <div class="text-sm"> {{ `${relatedContact[1]} ${relatedContact[2]}` }}</div>
                <div>{{ call[5] }}</div>
                <div class="flex gap-2 items-center pt-2">
                    <button @click="setOnDetail" class="text-xs py-1 px-2  shadow rounded-sm">DCR Details</button>
                    <button class="text-xs py-1 px-2  shadow rounded-sm">Update Visit</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import FemaleProfile from '@/icon/FemaleProfile.vue';
    import MaleProfile from '@/icon/MaleProfile.vue';
    import type { ContactCallRow } from '@/types/data';
    import { computed, onMounted, ref } from 'vue';
    import { useAuthStore } from '@/stores/auth';
    import { useContactStore } from '@/stores/contacts';
    import { useProfileImageStore } from '@/stores/profileImages';
    import { usePublishersStore } from '@/stores/pubs';
    import { usePageStore } from '@/stores/pages';

    const { call } = defineProps<{
        call: ContactCallRow
    }>()

    const contact = useContactStore()
    const profile = useProfileImageStore()
    const auth = useAuthStore()
    const pubs = usePublishersStore()
    const pages = usePageStore()

    const imgSrc = ref<string>('')

    const relatedContact = computed(() => {
        return contact.contacts.find(c => c[0] === call[1])
    })

    const setOnDetail = () => {
        if (relatedContact.value) {
            contact.onDetail = relatedContact.value
            pages.previous = 'user-pending-coverage-updates'
            pages.active = 'contact-details'
        }
    }

    onMounted(async () => {
        if (relatedContact.value && relatedContact.value[3]) {
            const src = await profile.getProfileImg(relatedContact.value[3], auth.token)
            if (src) imgSrc.value = src
        }
    })
</script>