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
                <div> {{ `${contact[1]} ${contact[2]}` }}</div>
                <div>{{ daysAgo }}</div>
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
    import { useDaysAgo } from '@/composables/useDaysAgo';
    import { usePageStore } from '@/stores/pages';
    import { useProfileImageStore } from '@/stores/profileImages';

    const contacts = useContactStore()
    const pages = usePageStore()
    const auth = useAuthStore()
    const calls = useContactCallStore()

    const profile = useProfileImageStore()
    const imgSrc = ref<string>('')

    const { contact } = defineProps<{
        contact: ContactRow
    }>()

    const setOnDetail = () => {
        contacts.onDetail = contact
        pages.active = 'contact-details'
    }

    const latestCall = computed(() => {
        const rec = calls.data
            .filter(c => c[1] === contact[0])
            .sort((a, b) => b[4].localeCompare(a[4]))

        return rec.length > 0 ? (rec[0]?.[4] ?? "") : ""
    })

    const { daysAgo } = useDaysAgo(latestCall)


    onMounted(async () => {
        if (contact[3]) {
            const src = await profile.getProfileImg(contact[3], auth.token)

            if (src) {
                imgSrc.value = src
            }
        }
    })
</script>