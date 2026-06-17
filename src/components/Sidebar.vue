<template>
    <Transition name="overlay">
        <div v-if="show" class="w-full h-screen absolute inset-0 bg-black/60 z-10" @click.self="emits('closeSideBar')">
            <Transition name="sidebar">
                <div class="p-6 w-10/12 h-full bg-white shadow overflow-hidden flex flex-col">
                    <div></div>
                    <div class="flex-1"></div>
                    <div class="">
                        <button @click="logout" class="text-sm px-4 py-2 cursor-pointer">
                            Log out
                        </button>
                    </div>
                </div>
            </Transition>
        </div>
    </Transition>
</template>

<script setup lang="ts">
    import { useAuthStore } from '@/stores/auth'
    import { usePageStore } from '@/stores/pages'

    const auth = useAuthStore()
    const pages = usePageStore()

    const { show } = defineProps<{
        show: boolean
    }>()

    const logout = async () => {
        const resp = await auth.logout()
        if (resp) pages.active = 'home'
    }

    const emits = defineEmits<{
        closeSideBar: []
    }>()
</script>

<style scoped>

    /* Overlay fade */
    .overlay-enter-active,
    .overlay-leave-active
    {
        transition: opacity 0.25s ease;
    }

    .overlay-enter-from,
    .overlay-leave-to
    {
        opacity: 0;
    }

    /* Sidebar slide */
    .sidebar-enter-active,
    .sidebar-leave-active
    {
        transition: transform 0.3s ease;
    }

    .sidebar-enter-from,
    .sidebar-leave-to
    {
        transform: translateX(-100%);
    }
</style>