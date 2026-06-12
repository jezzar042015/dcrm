import type { AuthenticatedUser, AuthResponse } from "@/types/auth";
import { StorageSerializers, useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore('auth', () => {

    const token = useStorage<string>('dcrm-auth-token', '', localStorage)
    const tokenTs = useStorage<string>('dcrm-auth-tokenTs', '', localStorage, {
        serializer: StorageSerializers.object
    })
    const user = useStorage<AuthenticatedUser | undefined>('dcrm-auth-user', undefined, localStorage)
    const requesting = ref(false)
    const scriptID = 'AKfycbyhQ9uI3zv1QGq_Yqb8wxj_nwLFskKL0OBc5CYDz8xVOC2EMQ1uFVtgseBm038bqHq8sA'

    const revoke = () => {
        token.value = ''
        tokenTs.value = ''
        user.value = undefined
    }

    const register = async (user: string, pass: string) => {
        // 
    }

    const login = async (username: string, password: string) => {
        try {
            const url = `https://script.google.com/macros/s/${scriptID}/exec`;

            requesting.value = true
            const response = await fetch(url, {
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

            if (result.status == 200) {
                token.value = result.token?.token ?? ''
                tokenTs.value = result.token?.ts ?? ''
                user.value = result.data
                return true
            } else if (result.status == 400) {
                return false
            }

            requesting.value = true
        } catch (error) {
            console.error(error);
        }
    }

    const logout = async () => {
        const url = `https://script.google.com/macros/s/${scriptID}/exec`;

        requesting.value = true
        const response = await fetch(url, {
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

    return {
        token,
        requesting,
        revoke,
        register,
        login,
        logout
    }
})