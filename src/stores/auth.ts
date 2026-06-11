import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', () => {

    const token = useStorage<string>('dcrm-auth-token', '', localStorage)

    const revoke = () => token.value = ''

    const register = async (user: string, pass: string) => {
        // 
    }

    const login = async (user: string, pass: string) => {
        //
    }

    return {
        token,
        revoke,
        register,
        login
    }
})