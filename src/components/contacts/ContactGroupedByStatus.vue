<template>
    <div class="mt-1">
        <div v-for="value in groupedByStatus" :key="value.status" v-show="value.contacts.length > 0"
            @click="emits('selectStatus', value.status)"
            class="flex items-center justify-between py-4 px-3 border-b border-b-gray-100 cursor-pointer">
            <div class="flex flex-col gap-0 px-3">
                <div @click.stop="switchScope" v-if="value.status === 'Territory'"
                    class="py-2 px-4 rounded-sm text-xs bg-amber-500 text-center w-fit shadow mb-2 flex gap-2 items-center text-white">
                    <span> {{ territoryScopeDisplay }}</span>
                    <span>
                        <ArrowsHorizontal class="w-4"/>
                    </span>
                </div>
                <div class="px-1 font-semibold"> {{ pluralization(value.status) }} </div>
                <div class="text-sm py-0.5 px-1 ">{{ value.contacts.length }}</div>
            </div>
            <div>
                <CaretSmall class="h-6 w-6" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import ArrowsHorizontal from '@/icon/ArrowsHorizontal.vue';
import CaretSmall from '@/icon/CaretSmall.vue';
    import { useAuthStore } from '@/stores/auth';
    import { useTerritoryStore } from '@/stores/territories';
    import type { GroupedContactsByStatus } from '@/types/data';
    import { computed } from 'vue';

    const { groupedByStatus } = defineProps<{
        groupedByStatus: GroupedContactsByStatus[]
    }>()

    const emits = defineEmits<{
        selectStatus: [status: string]
    }>()

    const terr = useTerritoryStore()
    const auth = useAuthStore()

    const territoryScopeDisplay = computed(() => {
        const userFSG = auth.associatedPublisher?.[8]
        if (terr.scope == 'cong') {
            return 'Congregation'
        } else {
            return `${userFSG} Group`
        }
    })

    const switchScope = () => {
        if (terr.scope === 'cong') {
            terr.scope = 'fsg'
        } else {
            terr.scope = 'cong'
        }
    }

    const pluralization = (orig: string) => {
        const keys: Record<string, string> = {
            'Territory': 'Territory Contacts',
            'Return Visit': 'Return Visits',
            'Bible Study': 'Bible Students',
            'Baptized Publisher': 'Baptized Publishers',
            'Moved': 'Moved Contacts',
            'Deceased': 'Deceased Contacts',
        }

        return keys[orig] ?? orig
    }
</script>