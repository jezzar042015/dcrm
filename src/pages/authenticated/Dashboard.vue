<template>
    <div>
        <div>
            Dashboard
        </div>

        <div>
            <button @click="logout" class="text-sm shadow round px-4 py-2 cursor-pointer">Log out</button>
        </div>
        <div @click="gotoContactsList">
            Contacts
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