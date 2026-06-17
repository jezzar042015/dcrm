<template>
    <div class="h-screen overflow-hidden flex flex-col">
        <div class="flex flex-col border-b border-b-gray-200 shadow h-18">
            <div class="px-5 pt-5 flex items-center gap-5 relative" @click="stepBack">
                <div class="bg-gray-50 h-8 w-8 rounded-full flex items-center justify-center">
                    <PeopleIcon class="h-5 opacity-60" />
                </div>
                <div v-if="!showSearchInput" class="font-bold text-lg cursor-pointer">
                    <div>Contacts</div>
                    <div class="flex items-center font-normal gap-2 -mt-1">
                        <div v-for="(title, i) in pageTitle" :key="title" class="flex gap-1 items-center text-xs">
                            <CaretSmall class="h-4 w-4" v-if="i > 0" />
                            <span class="">
                                {{ title }}
                            </span>
                        </div>
                    </div>
                </div>
                <div v-if="!showSearchInput" class="absolute right-5 p-1 cursor-pointer"
                    @click="showSearchInput = true">
                    <SearchGlass class="h-5 w-5" />
                </div>
                <div v-else class="flex gap-4">
                    <input type="search" class="border-2 py-2 px-4 rounded-sm -mt-1 text-sm">
                    <XCloseIcon class="h-5 w-5 mt-1 cursor-pointer" @click="showSearchInput = false" />
                </div>

            </div>
        </div>

        <div class="flex-1 overflow-auto relative">
            <Transition :name="transitionName" mode="out-in">
                <div :key="section">
                    <template v-if="section === 'status'">
                        <ContactGroupedByStatus :grouped-by-status="contacts.groupedByStatus"
                            @select-status="selectStatus" />
                    </template>

                    <template v-else-if="section === 'towns'">
                        <ContactGroupedByTown :towns @select-town="selectTown" />
                    </template>

                    <template v-else-if="section === 'contacts'">
                        <template v-if="status !== 'Territory'">
                            <template v-for="contact in townContacts" :key="contact[0]">
                                <ContactListItem :contact />
                            </template>
                        </template>

                        <template v-else>
                            <div class="text-xs p-4 bg-gray-50">
                                <template v-for="tg in territoryGrouped" :key="tg.territoryId">
                                    <div class="mb-11 shadow bg-white rounded-sm">
                                        <div
                                            class="flex gap-2 items-center justify-between bg-gray-100 py-2 px-2 font-semibold">
                                            <div>
                                                {{ tg.territoryName || 'No Territory Assignment' }}
                                            </div>
                                            <div>{{ tg.contacts.length }}</div>
                                        </div>

                                        <template v-for="contact in tg.contacts" :key="contact[0]">
                                            <ContactListItem :contact />
                                        </template>
                                    </div>
                                </template>
                            </div>
                        </template>
                    </template>
                </div>
            </Transition>
        </div>
        <BottomNav />
    </div>
</template>

<script setup lang="ts">
    import BottomNav from '@/components/BottomNav.vue';
    import CaretSmall from '@/icon/CaretSmall.vue';
    import ContactGroupedByStatus from '@/components/contacts/ContactGroupedByStatus.vue';
    import ContactGroupedByTown from '@/components/contacts/ContactGroupedByTown.vue';
    import ContactListItem from '@/components/contacts/ContactListItem.vue';
    import PeopleIcon from '@/icon/PeopleIcon.vue';
    import SearchGlass from '@/icon/SearchGlass.vue';
    import type { ContactRow } from '@/types/data';
    import { computed, ref, watch } from 'vue';
    import { useContactStore } from '@/stores/contacts';
    import { useTerritoryStore } from '@/stores/territories';
    import XCloseIcon from '@/icon/XCloseIcon.vue';

    type PageSections = 'status' | 'towns' | 'contacts'
    const contacts = useContactStore()
    const terr = useTerritoryStore()
    const section = ref<PageSections>('status')
    const previousSection = ref<PageSections>(section.value)
    const status = ref('')
    const town = ref('')
    const showSearchInput = ref(false)

    const selectStatus = (stat: string) => {
        status.value = stat
        section.value = 'towns'
    }

    const sectionOrder = {
        status: 0,
        towns: 1,
        contacts: 2,
    } as const

    const selectTown = (t: string) => {
        town.value = t
        section.value = 'contacts'
    }

    const towns = computed(() => {
        const statusGroup = contacts.groupedByStatus.find(c => c.status === status.value)
        const statusContacts = statusGroup?.contacts ?? []

        const townGroups = new Map<string, ContactRow[]>();

        for (const row of statusContacts) {
            const town = `${row[15]}${row[15] ? ', ' : ''}${row[16]}`;

            if (!townGroups.has(town)) {
                townGroups.set(town, []);
            }
            townGroups.get(town)!.push(row);
        }

        return Array
            .from(townGroups, ([town, contacts]) => (
                {
                    town,
                    contacts,
                }
            ))
            .sort((a, b) => a.town.localeCompare(b.town));
    })

    const townContacts = computed(() => {
        const targetTown = towns.value.find(f => f.town === town.value)

        const targetTownContacts = targetTown?.contacts ?? []
        return targetTownContacts.sort((a, b) => a[1].localeCompare(b[1]))
    })

    const territoryGrouped = computed(() => {
        const territoryGroups = new Map<string, ContactRow[]>();

        for (const row of townContacts.value) {
            const territoryGroupId: string | string[] =
                (row[10] === "" || row[10] === null) ? ['no_territory_id'] : row[10].split(',')

            for (const id of territoryGroupId) {

                if (!territoryGroups.has(id)) {
                    territoryGroups.set(id, [])
                }

                territoryGroups.get(id)!.push(row)
            }

        }

        return Array.from(territoryGroups, ([territoryId, contacts]) => (
            {
                territoryId,
                territoryName: terr.data.find(d => d[0] == territoryId)?.[2] ?? '',
                contacts
            }
        )).sort((a, b) => a.territoryName?.localeCompare(b.territoryName))
    })

    const stepBack = () => {
        if (section.value == 'status') {
            // pages.active = 'dashboard'
        }

        if (section.value == 'towns') {
            section.value = 'status'
        }

        if (section.value == 'contacts') {
            section.value = 'towns'
        }
    }

    const pageTitle = computed(() => {
        if (section.value === 'status') return ['Select Contact Status']
        if (section.value === 'towns') return [status.value]
        if (section.value === 'contacts') return [
            status.value,
            town.value ? town.value : 'No Address'
        ]
        return 'Contacts'
    })

    watch(
        () => section,
        (_, oldValue) => {
            previousSection.value = oldValue.value
        }
    )

    const transitionName = computed(() => {
        return sectionOrder[section.value] > sectionOrder[previousSection.value]
            ? 'slide-left'
            : 'slide-right'
    })
</script>

<style scoped>

    .slide-left-enter-active,
    .slide-left-leave-active,
    .slide-right-enter-active,
    .slide-right-leave-active
    {
        transition: all 0.25s ease;
    }

    .slide-left-enter-from
    {
        opacity: 0;
        transform: translateX(40px);
    }

    .slide-left-leave-to
    {
        opacity: 0;
        transform: translateX(-40px);
    }

    .slide-right-enter-from
    {
        opacity: 0;
        transform: translateX(-40px);
    }

    .slide-right-leave-to
    {
        opacity: 0;
        transform: translateX(40px);
    }
</style>