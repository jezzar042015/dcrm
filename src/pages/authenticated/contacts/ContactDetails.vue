<template>
    <div class="h-screen overflow-hidden flex flex-col">
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

                        <div class="flex h-35 w-35 rounded-full bg-gray-200">
                        </div>

                    </div>

                    <div class="grid grid-cols-2 gap-5">
                        <ContactDetailField label="Birthdate" :value="birthDate" />
                        <ContactDetailField label="Age" :value="contacts.onDetail[7] ?? 'Not Provided'" />
                    </div>

                    <ContactDetailField label="Deaf is" :value="contacts.onDetail[21]" />
                    <ContactDetailField label="About their family" :value="contacts.onDetail[20]" />
                </div>

                <ContactDetailSectionShutter @click="setSection('location')" title="Location"
                    :expanded="activeSection === 'location'" />
                <div v-if="activeSection === 'location'" class="p-6 space-y-4">
                    <ContactDetailField label="Territory" :value="relatedTerritory?.[2] ?? 'No Territory Assignment'" />
                    <ContactDetailField label="Street/Sitio" :value="contacts.onDetail[13]" />
                    <ContactDetailField label="Address" :value="address" />
                    <ContactDetailField label="Landmark" :value="contacts.onDetail[12]" />
                </div>

                <ContactDetailSectionShutter @click="setSection('guardians')" title="Guardians"
                    :expanded="activeSection === 'guardians'" />


                <ContactDetailSectionShutter @click="setSection('calls')" title="Visits"
                    :expanded="activeSection === 'calls'" />
                <div v-if="activeSection === 'calls'" class="p-6 space-y-4">
                    <template v-for="call in relatedCalls" :key="call[0]">
                        <CallItem :call />
                    </template>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import ArrowIcon from '@/icon/ArrowIcon.vue';
    import ContactDetailField from '../../../components/contacts/ContactDetailField.vue';
    import ContactDetailSectionShutter from '../../../components/contacts/ContactDetailSectionShutter.vue';
    import { computed, ref } from 'vue';
    import { useContactStore } from '@/stores/contacts';
    import { usePageStore } from '@/stores/pages';
    import { useTerritoryStore } from '@/stores/territories.ts';
    import { useContactCallStore } from '@/stores/calls.ts';
    import CallItem from '@/components/calls/CallItem.vue';

    const contacts = useContactStore()
    const pages = usePageStore()
    const terr = useTerritoryStore()
    const calls = useContactCallStore()

    type DetailSections = 'location' | 'guardians' | 'calls' | ''
    const activeSection = ref<DetailSections>('location')

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
        return `Brgy ${contacts.onDetail[14]}, ${contacts.onDetail[15]}, ${contacts.onDetail[16]}`
    })

    const relatedTerritory = computed(() => {
        if (!contacts.onDetail) return undefined
        const currentTerr = contacts.onDetail[10] ?? ''
        return terr.data.find(f => f[0] === currentTerr)
    })

    const stepBack = () => {
        pages.active = 'contacts-list'
    }

    const relatedCalls = computed(() => {
        return calls.data
            .filter(c => c[1] === contacts.onDetail?.[0])
            .sort((a, b) => b[4].localeCompare(a[4]))
    })
</script>