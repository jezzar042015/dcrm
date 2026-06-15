<template>
    <div>
        <div @click="setOnDetail" class="flex items-center gap-2 py-2 px-3 border-b border-b-gray-100 cursor-pointer">
            <div class="w-15 h-15 bg-gray-100 rounded-full overflow-hidden">
                <img :src="imgSrc" alt="" v-if="imgSrc" class="h-full w-full object-cover">
                <template v-else>
                    <MaleProfile v-if="contact[17] === 'Male'" class="h-full text-gray-300" />
                    <FemaleProfile v-if="contact[17] === 'Female'" class="h-full text-gray-300" />
                </template>
            </div>
            <div class="p-4">
                {{ `${contact[1]} ${contact[2]}` }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import FemaleProfile from '@/icon/FemaleProfile.vue';
    import MaleProfile from '@/icon/MaleProfile.vue';
    import { useAuthStore } from '@/stores/auth';
    import { useContactStore } from '@/stores/contacts';
    import { usePageStore } from '@/stores/pages';
    import { useProfileImageStore } from '@/stores/profileImages';
    import type { ContactRow } from '@/types/data';
    import { onMounted, ref } from 'vue';

    const contacts = useContactStore()
    const pages = usePageStore()
    const auth = useAuthStore()

    const profile = useProfileImageStore()
    const imgSrc = ref<string>('')

    const { contact } = defineProps<{
        contact: ContactRow
    }>()

    const setOnDetail = () => {
        contacts.onDetail = contact
        pages.active = 'contact-details'
    }

    onMounted(async () => {
        if (contact[3]) {
            const src = await profile.getProfileImg(contact[3], auth.token)

            if (src) {
                imgSrc.value = src
            }
        }
    })
</script>