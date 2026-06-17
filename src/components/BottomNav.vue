<template>
    <div class="pt-6 pb-4 flex justify-center gap-8 shadow rotate-180 bg-white">
        <div v-for="item in navItems" :key="item.id" @click="pages.active = item.id"
            class="relative w-15 rotate-180 text-xs flex flex-col items-center gap-1 cursor-pointer transition-all duration-300"
            :class="{
                'text-amber-500 scale-105': pages.active === item.id,
                'text-gray-500 hover:text-amber-400': pages.active !== item.id,
            }">
            <div class="absolute -top-4 h-1 rounded-bl-full rounded-br-full bg-amber-500 transition-all duration-300" :class="pages.active === item.id
                    ? 'w-12 opacity-100'
                    : 'w-0 opacity-0'
                " />

            <div class="p-0 rounded-full transition-all duration-300"
                :class="pages.active === item.id ? 'bg-amber-50/0' : ''">
                <component :is="item.icon" class="h-5 opacity-100" />
            </div>
            <!-- <span>{{ item.label }}</span> -->
        </div>
    </div>
</template>

<script setup lang="ts">
    import HomeIcon from '@/icon/HomeIcon.vue'
    import MapIcon from '@/icon/MapIcon.vue'
    import PeopleIcon from '@/icon/PeopleIcon.vue'
    import { usePageStore } from '@/stores/pages'

    const pages = usePageStore()

    const navItems = [
        {
            id: 'map',
            label: 'Map',
            icon: MapIcon,
        },
        {
            id: 'dashboard',
            label: 'Home',
            icon: HomeIcon,
        },
        {
            id: 'contacts-list',
            label: 'Contacts',
            icon: PeopleIcon,
        },
    ] as const
</script>