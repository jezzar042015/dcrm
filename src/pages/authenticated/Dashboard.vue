<template>
    <div class="h-screen overflow-hidden">
        <div class="p-6">

            <div class="text-lg font-bold">Hello {{ auth.user?.name }}!</div>

            <div @click="gotoContactsList" class="my-5 shadow round px-4 py-2">
                Contacts
            </div>
            
            
            <div class="mt-20">
                <button @click="logout" class="text-sm shadow round px-4 py-2 cursor-pointer">Log out</button>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
    import { useAuthStore } from '@/stores/auth';
    import { usePageStore } from '@/stores/pages';

    const auth = useAuthStore()
    const pages = usePageStore()

    const gotoContactsList = () => pages.active = 'contacts-list'

    const logout = async () => {
        const resp = await auth.logout()
        if (resp) pages.active = 'home'
    }
</script>