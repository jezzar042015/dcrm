<template>
    <div class="relative h-screen overflow-hidden flex flex-col items-center justify-center">
        <BlobAmber />
        <div class="w-full px-10">
            <div class="font-extrabold text-xl w-full mb-8">SLC Tacloban City</div>
            <div class="font-extrabold text-3xl w-full">New account</div>
            <div class="text-gray-600">Start by creating an account</div>

            <div class="py-4"></div>

            <div v-if="errorMessage"
                class="mb-4 p-3 rounded-md bg-red-50 text-red-600 text-sm font-semibold transition-all">
                {{ errorMessage }}
            </div>

            <div class="space-y-6">
                <div class="space-y-0.5">
                    <div class="text-xs uppercase pl-1 text-gray-600">Preferred Username</div>
                    <div class="flex min-h-10 shadow rounded-md bg-white items-center border transition-colors"
                        :class="errorMessage && errorMessage.includes('Username') ? 'border-red-500 bg-red-50/10' : 'border-transparent'">
                        <div class="w-10 flex items-center justify-center">
                            <UserIcon class="w-5 h-5"
                                :class="errorMessage && errorMessage.includes('Username') ? 'text-red-500' : 'text-gray-400'" />
                        </div>
                        <div class="flex-1">
                            <input type="text" v-model="username" :disabled="auth.requesting"
                                class="py-2 w-full outline-0 font-extrabold disabled:opacity-50">
                        </div>
                    </div>
                </div>

                <div class="space-y-0.5">
                    <div class="text-xs uppercase pl-1 text-gray-600">Name</div>
                    <div class="flex min-h-10 shadow rounded-md bg-white items-center border border-transparent">
                        <div class="w-10 flex items-center justify-center text-gray-400">
                            <UserIcon class="w-5 h-5" />
                        </div>
                        <div class="flex-1">
                            <input type="text" v-model="name" :disabled="auth.requesting"
                                class="py-2 w-full outline-0 font-extrabold disabled:opacity-50">
                        </div>
                    </div>
                </div>

                <div class="space-y-0.5">
                    <div class="text-xs uppercase pl-1 text-gray-600">Create Password</div>
                    <div class="flex min-h-10 shadow rounded-md bg-white items-center border transition-colors"
                        :class="errorMessage && errorMessage.includes('Password') ? 'border-red-500 bg-red-50/10' : 'border-transparent'">
                        <div class="w-10 flex items-center justify-center">
                            <LockIcon class="w-5 h-5"
                                :class="errorMessage && errorMessage.includes('Password') ? 'text-red-500' : 'text-gray-400'" />
                        </div>
                        <div class="flex-1">
                            <input type="password" v-model="password" :disabled="auth.requesting"
                                class="py-2 w-full outline-0 font-extrabold disabled:opacity-50">
                        </div>
                    </div>
                </div>

                <div class="space-y-0.5">
                    <div class="text-xs uppercase pl-1 text-gray-600">Confirm Password</div>
                    <div class="flex min-h-10 shadow rounded-md bg-white items-center border transition-colors"
                        :class="errorMessage && errorMessage.includes('Password') ? 'border-red-500 bg-red-50/10' : 'border-transparent'">
                        <div class="w-10 flex items-center justify-center">
                            <LockIcon class="w-5 h-5"
                                :class="errorMessage && errorMessage.includes('Password') ? 'text-red-500' : 'text-gray-400'" />
                        </div>
                        <div class="flex-1">
                            <input type="password" v-model="passwordConfirmation" :disabled="auth.requesting"
                                class="py-2 w-full outline-0 font-extrabold disabled:opacity-50">
                        </div>
                    </div>
                </div>

                <div class="space-y-1 pt-2">
                    <button @click="register" :disabled="auth.requesting"
                        class="uppercase text-sm py-3 px-10 rounded-3xl shadow-md bg-linear-to-r from-amber-400 to-amber-600 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                        <span>{{ auth.requesting ? 'Registering...' : 'Register' }}</span>
                    </button>
                    <div>
                        <button @click="goLogin" :disabled="auth.requesting"
                            class="text-sm cursor-pointer p-2 underline disabled:opacity-50">
                            I already have an account!
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
    import { usePageStore } from '@/stores/pages';
    import { ref } from 'vue';

    const username = ref('')
    const name = ref('')
    const password = ref('')
    const passwordConfirmation = ref('')

    const errorMessage = ref('')
    // const loading = ref(false)

    const pages = usePageStore()
    const auth = useAuthStore()

    const goLogin = () => pages.active = 'login'

    const register = async () => {
        // Reset message on new submit
        errorMessage.value = ''

        // Simple Frontend Validation
        if (!username.value || !name.value || !password.value) {
            errorMessage.value = 'All fields are required.'
            return
        }

        if (password.value !== passwordConfirmation.value) {
            errorMessage.value = 'Passwords do not match.'
            return
        }

        try {
            // loading.value = true
            const resp = await auth.register(name.value, username.value, password.value)

            if (resp === 'pending') {
                pages.active = 'user-pending'
            } else if (resp === 'username-not-unique') {
                errorMessage.value = `Username "${username.value}" is already taken.`
            } else {
                errorMessage.value = 'An unexpected error occurred. Please try again.'
            }
        } catch (error) {
            errorMessage.value = 'Failed to connect to server.'
            console.error(error)
        } finally {
            // loading.value = false
        }
    }
</script>