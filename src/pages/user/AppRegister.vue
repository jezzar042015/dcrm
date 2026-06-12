<template>
    <div class="relative h-screen overflow-hidden flex flex-col items-center justify-center">
        <BlobAmber />
        <div class="w-full px-10">
            <div class="font-extrabold text-xl w-full mb-8">SLC Tacloban City</div>
            <div class="font-extrabold text-3xl w-full">New account</div>
            <div class="text-gray-600">Start by creating an account</div>

            <div class="py-6"></div>

            <div class="space-y-8">
                <div class="space-y-0.5">
                    <div class="text-xs uppercase pl-1 text-gray-600">Preferred Username</div>
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
                    <div class="text-xs uppercase pl-1 text-gray-600">Name</div>
                    <div class="flex min-h-10 shadow rounded-md bg-white items-center">
                        <div class="w-10 flex items-center justify-center">
                            <UserIcon class="w-5 h-5" />
                        </div>
                        <div class="flex-1">
                            <input type="text" v-model="name" class="py-2 w-full outline-0 font-extrabold">
                        </div>
                    </div>
                </div>

                <div class="space-y-0.5">
                    <div class="text-xs uppercase pl-1 text-gray-600">Create Password</div>
                    <div class="flex min-h-10 shadow rounded-md bg-white items-center">
                        <div class="w-10 flex items-center justify-center">
                            <LockIcon class="w-5 h-5" />
                        </div>
                        <div class="flex-1">
                            <input type="password" v-model="password" class="py-2 w-full outline-0 font-extrabold">
                        </div>
                    </div>
                </div>

                <div class="space-y-0.5">
                    <div class="text-xs uppercase pl-1 text-gray-600">Confirm Password</div>
                    <div class="flex min-h-10 shadow rounded-md bg-white items-center">
                        <div class="w-10 flex items-center justify-center">
                            <LockIcon class="w-5 h-5" />
                        </div>
                        <div class="flex-1">
                            <input type="password" v-model="passwordConfirmation"
                                class="py-2 w-full outline-0 font-extrabold">
                        </div>
                    </div>
                </div>


                <div class="space-y-1">
                    <button @click="register"
                        class="uppercase text-sm py-3 px-10 rounded-3xl shadow-md bg-linear-to-r from-amber-400 to-amber-600 text-white cursor-pointer ">Login</button>
                    <div>
                        <button @click="goLogin" class="text-sm cursor-pointer p-2 underline">
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
    import { usePageStore } from '@/stores/pages';
    import { ref } from 'vue';

    const username = ref('')
    const name = ref('')
    const password = ref('')
    const passwordConfirmation = ref('')

    const pages = usePageStore()

    const goLogin = () => pages.active = 'login'
    const register = async () => {

    }
</script>