<template>
    <div class="h-screen overflow-hidden flex flex-col relative">
        <ImageViewer :src="targetImg" v-if="imgViewer" @close-viewer="closeViewer" />
        <div class="px-3 py-5 border-b border-b-gray-200">
            <div class="flex gap-2 items-center">
                <div @click="stepBack" class="cursor-pointer rounded-full p-2">
                    <ArrowIcon class="h-5 w-5 rotate-180" />
                </div>
                <div class="font-bold text-lg">{{ fullName }}</div>
            </div>
        </div>
        <div class="flex-1 overflow-auto pb-8">
            <div v-if="contacts.onDetail" class="">
                <div class="p-6 space-y-4">
                    <div class="flex justify-between">
                        <div class="space-y-4 w-1/3">
                            <ContactDetailField label="Nickname" :value="contacts.onDetail[4]" />
                            <ContactDetailField label="Sign name" :value="contacts.onDetail[5]" />
                            <ContactDetailField label="Signing" :value="contacts.onDetail[19]" />
                        </div>

                        <div class="flex h-35 w-35 rounded-full bg-gray-200 overflow-hidden">
                            <img v-if="imgSrc" :src="imgSrc" alt="" class="h-full w-full object-cover"
                                @click="showViewer(imgSrc)">
                            <template v-else>
                                <FemaleProfile v-if="contacts.onDetail[17] === 'Female'"
                                    class="h-full w-full text-gray-300" />
                                <MaleProfile v-if="contacts.onDetail[17] === 'Male'"
                                    class="h-full w-full text-gray-300" />
                            </template>
                        </div>

                    </div>

                    <div class="grid grid-cols-2 gap-5">
                        <ContactDetailField label="Birthdate" :value="birthDate" />
                        <ContactDetailField label="Age" :value="contacts.onDetail[7] ?? 'Not Provided'" />
                    </div>

                    <ContactDetailField label="Deaf is" :value="contacts.onDetail[21]" />
                    <ContactDetailField label="About their family" :value="contacts.onDetail[20]" />
                    <ContactDetailField v-if="contacts.onDetail[8] === 'Bible Study'" label="Bible teacher"
                        :value="contacts.onDetail[9]" />
                </div>

                <ContactDetailSectionShutter @click="setSection('location')" title="Location"
                    :expanded="activeSection === 'location'" />
                <div v-if="activeSection === 'location'" class="p-6 space-y-4">
                    <ContactDetailField label="Territory" :value="displayTerritories" />
                    <ContactDetailField label="Street/Sitio" :value="contacts.onDetail[13]" />
                    <ContactDetailField label="Address" :value="address" />
                    <ContactDetailField label="Landmark" :value="contacts.onDetail[12]" />
                </div>

                <ContactDetailSectionShutter @click="setSection('calls')" title="Visits"
                    :expanded="activeSection === 'calls'" :count="relatedCalls.length" />
                <div v-if="activeSection === 'calls'" class="py-6 px-4 space-y-2">
                    <template v-for="call in relatedCalls" :key="call[0]">
                        <CallItem :call />
                    </template>
                </div>

                <ContactDetailSectionShutter @click="setSection('guardians')" title="Guardians"
                    :expanded="activeSection === 'guardians'" />

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import ArrowIcon from '@/icon/ArrowIcon.vue';
    import CallItem from '@/components/calls/CallItem.vue';
    import ContactDetailField from '../../../components/contacts/ContactDetailField.vue';
    import ContactDetailSectionShutter from '../../../components/contacts/ContactDetailSectionShutter.vue';
    import FemaleProfile from '@/icon/FemaleProfile.vue';
    import ImageViewer from '@/components/contacts/ImageViewer.vue';
    import MaleProfile from '@/icon/MaleProfile.vue';
    import { computed, onMounted, ref } from 'vue';
    import { useAuthStore } from '@/stores/auth.ts';
    import { useContactCallStore } from '@/stores/calls.ts';
    import { useContactStore } from '@/stores/contacts';
    import { usePageStore } from '@/stores/pages';
    import { useProfileImageStore } from '@/stores/profileImages.ts';
    import { useTerritoryStore } from '@/stores/territories.ts';

    const contacts = useContactStore()
    const pages = usePageStore()
    const terr = useTerritoryStore()
    const calls = useContactCallStore()
    const auth = useAuthStore()
    const profile = useProfileImageStore()

    type DetailSections = 'location' | 'guardians' | 'calls' | ''
    const activeSection = ref<DetailSections>('location')
    const imgSrc = ref<string>('')
    const imgViewer = ref(false)
    const targetImg = ref('')

    const showViewer = (src: string) => {
        targetImg.value = src
        imgViewer.value = true
    }

    const closeViewer = () => {
        imgViewer.value = false
        targetImg.value = ''
    }

    const setSection = (s: DetailSections) => {
        if (activeSection.value === s) {
            activeSection.value = ''
        } else {
            activeSection.value = s
        }
    }

    const fullName = computed(() => {
        if (!contacts.onDetail) return ''
        return `${contacts.onDetail[1]} ${contacts.onDetail[2]}`
    })

    const birthDate = computed(() => {
        if (!contacts.onDetail) return ''
        if (!contacts.onDetail[6]) return 'Not Provided'
        const d = new Date(contacts.onDetail[6])
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    })

    const address = computed(() => {
        if (!contacts.onDetail) return ''
        if (!contacts.onDetail[14] && !contacts.onDetail[15] && !contacts.onDetail[16]) return 'No Address Provided'
        return `Brgy ${contacts.onDetail[14]}, ${contacts.onDetail[15]}, ${contacts.onDetail[16]}`
    })

    const relatedTerritories = computed(() => {
        if (!contacts.onDetail) return []
        const currentTerrs = contacts.onDetail[10]?.split(',') ?? ['']
        const terrs = []
        for (const t of currentTerrs) {
            const target = terr.data.find(f => f[0] === t)
            if (target && target[0]) terrs.push(target)
        }
        return terrs
    })

    const displayTerritories = computed(() => {
        if (!relatedTerritories.value || relatedTerritories.value.length == 0) return ['No Territory Assignment']
        return relatedTerritories.value.map(m => m[2])
    })

    const stepBack = () => {
        if (pages.previous) {
            pages.active = pages.previous
        } else {
            pages.active = 'contacts-list'
        }
    }

    const relatedCalls = computed(() => {
        return calls.data
            .filter(c => c[1] === contacts.onDetail?.[0])
            .sort((a, b) => b[4].localeCompare(a[4]))
    })

    const getProfileImg = async () => {
        if (!contacts.onDetail || !contacts.onDetail[3]) return undefined
        if (contacts.onDetail[3]) {
            const src = await profile.getProfileImg(contacts.onDetail[3], auth.token)

            if (src) imgSrc.value = src
        }
    }

    onMounted(() => {
        getProfileImg()
    })
</script>