<template>
    <div class="h-screen overflow-hidden flex flex-col">
        <div class="px-3 py-5 border-b border-b-gray-200">
            <div class="flex gap-2 items-center">
                <div @click="stepBack" class="cursor-pointer">
                    <ArrowIcon class="h-5 w-5 rotate-180" />
                </div>
                <div>Contacts</div>
            </div>
            <div class="pl-7 flex items-center gap-2">
                <div v-for="(title, i) in pageTitle" :key="title" class="flex gap-1 items-center text-xs">
                    <CaretSmall class="h-4 w-4" v-if="i > 0" />
                    <span class="">
                        {{ title }}
                    </span>
                </div>
            </div>
        </div>
        <div class="flex-1 overflow-auto">

            <template v-if="section === 'status'">
                <ContactGroupedByStatus :grouped-by-status="contacts.groupedByStatus" @select-status="selectStatus" />
            </template>

            <template v-if="section === 'towns'">
                <ContactGroupedByTown :towns @select-town="selectTown" />
            </template>

            <template v-if="section === 'contacts'">
                <template v-for="contact in townContacts" :key="contact[0]">
                    <ContactListItem :contact />
                </template>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
    import ArrowIcon from '@/icon/ArrowIcon.vue';
    import CaretSmall from '@/icon/CaretSmall.vue';
    import ContactGroupedByStatus from '@/components/contacts/ContactGroupedByStatus.vue';
    import ContactGroupedByTown from '@/components/contacts/ContactGroupedByTown.vue';
    import ContactListItem from '@/components/contacts/ContactListItem.vue';
    import type { ContactRow } from '@/types/data';
    import { computed, ref } from 'vue';
    import { useContactStore } from '@/stores/contacts';
    import { usePageStore } from '@/stores/pages';

    const contacts = useContactStore()
    const pages = usePageStore()
    const section = ref<'status' | 'towns' | 'contacts'>('status')
    const status = ref('')
    const town = ref('')

    const selectStatus = (stat: string) => {
        status.value = stat
        section.value = 'towns'
    }

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

    const stepBack = () => {
        if (section.value == 'status') {
            pages.active = 'dashboard'
        }

        if (section.value == 'towns') {
            section.value = 'status'
        }

        if (section.value == 'contacts') {
            section.value = 'towns'
        }
    }

    const pageTitle = computed(() => {
        if (section.value === 'status') return []
        if (section.value === 'towns') return [status.value]
        if (section.value === 'contacts') return [status.value, town.value]
        return 'Contacts'
    })
</script>