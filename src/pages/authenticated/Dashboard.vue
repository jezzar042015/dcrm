<template>
    <div class="h-screen overflow-hidden flex flex-col relative">
        <Sidebar :show="sideBar" @close-side-bar="sideBar = false" />

        <div class="p-5 shadow flex items-center gap-5">
            <div class="bg-gray-100 h-10 w-10 rounded-full overflow-hidden" @click="sideBar = true">
                <img :src="auth.userProfileImg" alt="" v-if="auth.userProfileImg" class="h-full w-full object-cover">
            </div>
            <div class="text-lg font-bold">Hi {{ auth.user?.name }}!</div>
        </div>

        <div class="flex-1">
            <!-- <div @click="gotoContactsList" class="my-5 px-4 py-2">
                <div class="px-4 py-2 shadow round ">
                    Contacts
                </div>
            </div> -->
        </div>

        <BottomNav />
    </div>
</template>

<script setup lang="ts">
    import BottomNav from '@/components/BottomNav.vue';
    import Sidebar from '@/components/Sidebar.vue';
    import { useAuthStore } from '@/stores/auth';
    import { usePageStore } from '@/stores/pages';
    import { ref } from 'vue';

    const auth = useAuthStore()
    const pages = usePageStore()
    const sideBar = ref(false)

    const gotoContactsList = () => pages.active = 'contacts-list'

</script>