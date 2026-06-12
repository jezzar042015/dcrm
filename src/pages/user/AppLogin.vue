<template>
    <div class="relative h-screen overflow-hidden flex flex-col items-center justify-center">
        <BlobAmber />
        <div class="w-full px-10">
            <div class="font-extrabold text-xl w-full mb-8">SLC Tacloban City</div>

            <div class="font-extrabold text-3xl w-full">Login</div>
            <div class="text-gray-600">Please sign in to continue</div>

            <div class="py-6"></div>

            <div class="space-y-8">
                <div class="space-y-0.5">
                    <div class="text-xs uppercase pl-1 text-gray-600">Username</div>
                    <div class="flex min-h-10 shadow rounded-md bg-white items-center">
                        <div class="w-10 flex items-center justify-center">
                            <UserIcon class="w-5 h-5" />
                        </div>
                        <div class="flex-1">
                            <input type="text" v-model="username" class="py-2 w-full outline-0 font-extrabold">
                        </div>
                    </div>
                </div>
                <div class="space-y-0.5">
                    <div class="text-xs uppercase pl-1 text-gray-600">Password</div>
                    <div class="flex min-h-10 shadow rounded-md bg-white items-center">
                        <div class="w-10 flex items-center justify-center">
                            <LockIcon class="w-5 h-5" />
                        </div>
                        <div class="flex-1">
                            <input type="password" v-model="password" class="py-2 w-full outline-0 font-extrabold">
                        </div>
                    </div>
                </div>
                <div>
                    <button @click="login"
                        class="uppercase text-sm py-3 px-10 rounded-3xl shadow-md bg-linear-to-r from-amber-400 to-amber-600 text-white cursor-pointer ">Login</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import BlobAmber from '@/components/decors/BlobAmber.vue';
    import LockIcon from '@/icon/LockIcon.vue';
    import UserIcon from '@/icon/UserIcon.vue';
    import { useAuthStore } from '@/stores/auth';
    import { usePageStore } from '@/stores/pages';
    import { ref } from 'vue';

    const auth = useAuthStore()
    const pages = usePageStore()

    const username = ref('')
    const password = ref('')

    const login = async () => {
        const resp = await auth.login(username.value, password.value)

        if (resp) pages.active = 'dashboard'
    }
</script>