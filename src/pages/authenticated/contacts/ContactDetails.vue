<template>
    <div class="h-screen overflow-hidden flex flex-col">
        <div class="px-3 py-5 border-b border-b-gray-200">
            <div class="flex gap-2 items-center">
                <div @click="stepBack" class="cursor-pointer">
                    <ArrowIcon class="h-5 w-5 rotate-180" />
                </div>
                <div>{{ fullName }}</div>
            </div>
        </div>
        <div class="flex-1 overflow-auto">
            <div v-if="contacts.onDetail" class="">
                <div class="p-6 space-y-4">
                    <div>
                        <div class="text-xs text-gray-600">Nickname</div>
                        <div class="">{{ contacts.onDetail[4] }}</div>
                    </div>

                    <div>
                        <div class="text-xs text-gray-600">Sign name</div>
                        <div class="">{{ contacts.onDetail[5] }}</div>
                    </div>

                    <div class="flex gap-5">
                        <div class="w-1/2">
                            <div class="text-xs text-gray-600">Birthday</div>
                            <div class="">{{ birthDate }}</div>
                        </div>

                        <div>
                            <div class="text-xs text-gray-600">Age</div>
                            <div class="">{{ contacts.onDetail[7] ?? 'Not Provided' }}</div>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-100 py-2 px-6 flex items-center justify-between">
                    <div>Location</div>
                    <div>
                        <CaretSmall class="h-6 w-6 rotate-180" />
                    </div>
                </div>
            </div>

            <pre>
                {{ contacts.onDetail }}
            </pre>
        </div>
    </div>
</template>

<script setup lang="ts">
    import ArrowIcon from '@/icon/ArrowIcon.vue';
    import CaretSmall from '@/icon/CaretSmall.vue';
    import { useContactStore } from '@/stores/contacts';
    import { usePageStore } from '@/stores/pages';
    import { computed } from 'vue';

    const contacts = useContactStore()
    const pages = usePageStore()

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

    const stepBack = () => {
        pages.active = 'contacts-list'
    }
</script>