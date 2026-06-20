<template>
    <div class="min-h-[100dvh] overflow-hidden flex flex-col relative">
        <Sidebar :show="sideBar" @close-side-bar="sideBar = false" />

        <div class="p-5 shadow flex items-center gap-5">
            <div class="bg-gray-100 h-10 w-10 rounded-full overflow-hidden" @click="sideBar = true">
                <img :src="auth.userProfileImg" alt="" v-if="auth.userProfileImg" class="h-full w-full object-cover">
            </div>
            <div class="text-lg font-bold">Hi {{ auth.associatedPublisher?.[3] }}!</div>
        </div>

        <div class="flex-1 overflow-auto">
            <div class="p-5">

                <div class="p-3 shadow bg-amber-100" @click="gotoUserPendingUpdates" v-if="coverages.userLateAssignmentsCallsCount > 0">
                    <div class="text-xs">
                        You have pending assigned visits to update
                    </div>
                    <div class="font-bold text-lg">
                        {{ coverages.userLateAssignmentsCallsCount }}
                    </div>
                </div>
            </div>
        </div>

        <BottomNav />
    </div>
</template>

<script setup lang="ts">
    import BottomNav from '@/components/BottomNav.vue';
    import Sidebar from '@/components/Sidebar.vue';
    import { useAuthStore } from '@/stores/auth';
    import { usePageStore } from '@/stores/pages';
    import { useTerritoryCoveragesStore } from '@/stores/territory-coverages';
    import { ref } from 'vue';

    const auth = useAuthStore()
    const pages = usePageStore()
    const sideBar = ref(false)

    const coverages = useTerritoryCoveragesStore()

    const gotoUserPendingUpdates = () => pages.active = 'user-pending-coverage-updates'
</script>