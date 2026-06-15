<template>
    <div class="relative h-screen overflow-hidden flex flex-col items-center justify-center">
        <BlobAmber />
        <div class="w-full px-10">
            <div class="font-extrabold text-xl w-full mb-8">SLC Tacloban City</div>

            <div class="font-extrabold text-3xl w-full">Login</div>
            <div class="text-gray-600">Please sign in to continue</div>

            <div class="py-4"></div>

            <div v-if="errorMessage"
                class="mb-4 p-3 rounded-md bg-red-50 text-red-600 text-sm font-semibold transition-all">
                {{ errorMessage }}
            </div>

            <div class="space-y-6">
                <div class="space-y-0.5">
                    <div class="text-xs uppercase pl-1 text-gray-600">Username</div>
                    <div class="flex min-h-10 shadow rounded-md bg-white items-center border transition-colors"
                        :class="errorMessage ? 'border-red-500 bg-red-50/10' : 'border-transparent'">
                        <div class="w-10 flex items-center justify-center">
                            <UserIcon class="w-5 h-5" :class="errorMessage ? 'text-red-500' : 'text-gray-400'" />
                        </div>
                        <div class="flex-1">
                            <input type="text" v-model="username" :disabled="auth.requesting"
                                class="py-2 w-full outline-0 font-extrabold disabled:opacity-50">
                        </div>
                    </div>
                </div>

                <div class="space-y-0.5">
                    <div class="text-xs uppercase pl-1 text-gray-600">Password</div>
                    <div class="flex min-h-10 shadow rounded-md bg-white items-center border transition-colors"
                        :class="errorMessage ? 'border-red-500 bg-red-50/10' : 'border-transparent'">
                        <div class="w-10 flex items-center justify-center">
                            <LockIcon class="w-5 h-5" :class="errorMessage ? 'text-red-500' : 'text-gray-400'" />
                        </div>
                        <div class="flex-1">
                            <input type="password" v-model="password" :disabled="auth.requesting"
                                class="py-2 w-full outline-0 font-extrabold disabled:opacity-50">
                        </div>
                    </div>
                </div>

                <div class="space-y-1 pt-2">
                    <button @click="login" :disabled="auth.requesting"
                        class="uppercase text-sm py-3 px-10 rounded-3xl shadow-md bg-gradient-to-r from-amber-400 to-amber-600 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                        <span>{{ auth.requesting ? 'Signing in...' : 'Login' }}</span>
                    </button>
                    <div>
                        <button @click="goRegister" :disabled="auth.requesting"
                            class="text-sm cursor-pointer p-2 underline disabled:opacity-50">
                            I don't have an account!
                        </button>
                    </div>
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
    import { useContactStore } from '@/stores/contacts';
    import { usePageStore } from '@/stores/pages';
    import { ref } from 'vue';

    const auth = useAuthStore()
    const pages = usePageStore()
    const contacts = useContactStore()

    const username = ref('')
    const password = ref('')
    const errorMessage = ref('')

    const login = async () => {
        errorMessage.value = ''

        // Client-side guard
        if (!username.value || !password.value) {
            errorMessage.value = 'Please fill out all fields.'
            return
        }

        try {
            const resp = await auth.login(username.value, password.value)

            if (resp) {
                pages.active = 'dashboard'
                contacts.fetchContacts()
            } else if (auth.userIsPending) {
                pages.active = 'user-pending'
            } else if (auth.userIsDeactivated) {
                pages.active = 'user-deactivated'
            } else {
                errorMessage.value = 'Invalid username or password.'
            }
        } catch (error) {
            errorMessage.value = 'Failed to connect to the server.'
            console.error(error)
        }
    }

    const goRegister = () => pages.active = 'register'
</script>