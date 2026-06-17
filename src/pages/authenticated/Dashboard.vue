<template>
    <div class="h-screen overflow-hidden flex flex-col relative">
        <div v-if="false" class="absolute p-6 w-4/5 h-full top-0 left-0 bg-white shadow z-10">
            <div class="mt-20">
                <button @click="logout" class="text-sm shadow round px-4 py-2 cursor-pointer">Log out</button>
            </div>
        </div>

        <div class="p-5 shadow flex items-center gap-5">
            <div class="bg-gray-100 h-8 w-8 rounded-full"></div>
            <div class="text-lg font-bold">Hello {{ auth.user?.name }}!</div>
        </div>

        <div class="flex-1">
            <div @click="gotoContactsList" class="my-5 px-4 py-2">
                <div class="px-4 py-2 shadow round ">
                    Contacts
                </div>
            </div>



        </div>
        <div class="p-6 flex justify-center shadow rotate-180">
            <div class="rotate-180">Home</div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useAuthStore } from '@/stores/auth';
    import { usePageStore } from '@/stores/pages';
    import { ref } from 'vue';

    const auth = useAuthStore()
    const pages = usePageStore()

    const gotoContactsList = () => pages.active = 'contacts-list'

    const sideBar = ref(true)

    const logout = async () => {
        const resp = await auth.logout()
        if (resp) pages.active = 'home'
    }
</script>