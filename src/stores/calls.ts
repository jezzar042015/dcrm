import type { ContactCallResponse } from "@/types/http";
import type { ContactCallRow } from "@/types/data";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./auth";
import { useIDB } from "@/composables/useIDB";

export const useContactCallStore = defineStore('calls', () => {
    const data = useIDB<ContactCallRow[]>('dcrm-data-calls', [])
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const auth = useAuthStore()

    const fetchCalls = async () => {
        isLoading.value = true
        error.value = null

        try {
            const url = 'https://script.google.com/macros/s/AKfycbyZReqXsUttX2Gp4ujW7DKCIt-HZD0IZYkEALekOzEurZamWAQepA3UE684AO-GOkh-/exec'
            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify({
                    data: {
                    },
                    action: 'get-calls',
                    token: auth.token,
                })
            })
            if (!response.ok) throw new Error('Network response was not ok')

            const resp = await response.json() as ContactCallResponse

            if (resp.status === 200) {
                data.value = resp.data
            }

        } catch (err) {
            if (err instanceof Error)
                error.value = err.message
        } finally {
            isLoading.value = false
        }
    }

    return {
        data,
        isLoading,
        fetchCalls
    }
})