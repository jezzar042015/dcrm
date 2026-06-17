import type { AuthenticatedUser, AuthResponse, DisallowedUser } from "@/types/auth";
import { StorageSerializers, useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { usePublishersStore } from "./pubs";
import { useProfileImageStore } from "./profileImages";

export const useAuthStore = defineStore('auth', () => {

    const pubs = usePublishersStore()
    const profile = useProfileImageStore()
    const auth = useAuthStore()

    const token = useStorage<string>('dcrm-auth-token', '', localStorage)
    const tokenTs = useStorage<string>(
        'dcrm-auth-tokenTs',
        '',
        localStorage,
        {
            serializer: StorageSerializers.object
        }
    )

    const user = useStorage<AuthenticatedUser | undefined>(
        'dcrm-auth-user',
        undefined,
        localStorage,
        {
            serializer: StorageSerializers.object
        }
    )

    const disallowedUser = useStorage<DisallowedUser | undefined>(
        'dcrm-auth-disallowed',
        undefined,
        localStorage,
        {
            serializer: StorageSerializers.object
        }
    )

    const requesting = ref(false)
    const scriptID = 'AKfycbyhQ9uI3zv1QGq_Yqb8wxj_nwLFskKL0OBc5CYDz8xVOC2EMQ1uFVtgseBm038bqHq8sA'
    const serverURL = `https://script.google.com/macros/s/${scriptID}/exec`;

    const revoke = () => {
        token.value = ''
        tokenTs.value = ''
        user.value = undefined
    }

    const register = async (name: string, username: string, password: string) => {
        try {
            requesting.value = true
            const response = await fetch(serverURL, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'text/plain', // Using text/plain avoids CORS "preflight" issues with GAS
                },
                body: JSON.stringify({
                    data: {
                        name, username, password
                    },
                    action: 'register'
                })
            });

            requesting.value = false

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json() as AuthResponse

            if (result.status == 200) {
                disallowedUser.value = result.data as DisallowedUser
                return 'pending'
            } else if (result.status == 409) {
                return 'username-not-unique'
            } else if (result.status == 500) {
                return 'server-error'
            } else {
                return 'unknown'
            }

        } catch (e) {
            console.error(e);
            return 'server-error'
        }
    }

    const login = async (username: string, password: string) => {
        try {
            requesting.value = true
            const response = await fetch(serverURL, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'text/plain', // Using text/plain avoids CORS "preflight" issues with GAS
                },
                body: JSON.stringify({
                    data: {
                        username, password
                    },
                    action: 'login'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json() as AuthResponse
            requesting.value = false

            if (result.status == 200) {
                token.value = result.token?.token ?? ''
                tokenTs.value = result.token?.ts ?? ''
                user.value = result.data as AuthenticatedUser
                return true
            } else if (result.status == 202 || result.status == 403) {
                disallowedUser.value = result.data as DisallowedUser
                return false
            } else if (result.status == 400) {
                return false
            }


        } catch (error) {
            console.error(error);
            requesting.value = false
        }
    }

    const associatedPublisher = computed(() => {
        const f = pubs.data.find(p => p[1] === user.value?.id)
        return f
    })

    const userProfileImg = ref('')

    const getProfileImg = async () => {
        if (!associatedPublisher.value) {
            userProfileImg.value = '';
            return
        }

        const path = associatedPublisher.value[5]

        if (path) {
            const src = await profile.getProfileImg(path, auth.token)
            if (src) userProfileImg.value = src
        }
    }

    watch(
        () => associatedPublisher.value,
        () => getProfileImg()
    )


    const logout = async () => {

        requesting.value = true
        const response = await fetch(serverURL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify({
                data: {
                    token: token.value
                },
                action: 'logout'
            })
        });

        requesting.value = false

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json() as AuthResponse

        if (result.status == 200) {
            revoke()
            return true
        } else if (result.status == 400) {
            return false
        }
    }

    const checkPendingUserStatus = async () => {
        requesting.value = true
        if (!disallowedUser.value) return
        const response = await fetch(`${serverURL}?target=check-user-status&username=${disallowedUser.value.username}`)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        requesting.value = false

        const result = await response.json() as AuthResponse
        const data = result.data as DisallowedUser

        if (data.accountStatus === 'active') {
            disallowedUser.value = undefined
        }

        return data.accountStatus
    }

    const userIsPending = computed(() => {
        if (!disallowedUser.value) return false
        return disallowedUser.value.accountStatus == 'pending'
    })

    const userIsDeactivated = computed(() => {
        if (!disallowedUser.value) return false
        return disallowedUser.value.accountStatus == 'inactive'
    })

    const pendingUserName = computed(() => disallowedUser.value?.username)


    return {
        token,
        requesting,
        user,
        userProfileImg,
        revoke,
        register,
        login,
        logout,
        checkPendingUserStatus,
        userIsPending,
        userIsDeactivated,
        pendingUserName,
        associatedPublisher
    }
})