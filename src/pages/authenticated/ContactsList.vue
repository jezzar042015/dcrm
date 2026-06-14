<template>
    <div class="h-screen overflow-hidden flex flex-col">
        <div class="px-3 py-5 border-b border-b-gray-200 flex gap-2 items-center">
            <div @click="toDashboard" class="cursor-pointer">
                <ArrowIcon class="h-5 w-5 rotate-180" />
            </div>
            <div>Contacts</div>
            <!-- <div class="text-[10px] py-0.5 px-1 rounded-sm bg-gray-100">{{ contacts.contacts.length }}</div> -->
        </div>
        <div class="flex-1 overflow-auto">

            <template v-if="section === 'status'">
                <ContactGroupedByStatus :grouped-by-status="contacts.groupedByStatus" @select-status="selectStatus" />
            </template>

            <template v-if="section === 'towns'">
                <ContactGroupedByTown :towns @select-town="selectTown" />
            </template>

            <template v-if="section === 'contacts'">
                <div>
                    <div v-for="value in townContacts" :key="value[0]"
                        class="flex items-center justify-between py-2 px-3 border-b border-b-gray-100 cursor-pointer">
                        <div class="p-4">
                            {{ `${value[1]} ${value[2]}` }}
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
    import ArrowIcon from '@/icon/ArrowIcon.vue';
    import ContactGroupedByStatus from '@/components/contacts/ContactGroupedByStatus.vue';
    import { computed, ref } from 'vue';
    import { useContactStore } from '@/stores/contacts';
    import { usePageStore } from '@/stores/pages';
    import ContactGroupedByTown from '@/components/contacts/ContactGroupedByTown.vue';
    import type { ContactRow } from '@/types/data';

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

    const toDashboard = () => {
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
</script>