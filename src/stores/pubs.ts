
import type { PublisherRow } from "@/types/data";
import type { PublishersResponse } from "@/types/http";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./auth";
import { useIDB } from "@/composables/useIDB";

export const usePublishersStore = defineStore('pubs', () => {
    const data = useIDB<PublisherRow[]>('dcrm-data-pubs', [])
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const auth = useAuthStore()

    const fetchFromServer = async () => {
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
                    action: 'get-pubs',
                    token: auth.token,
                })
            })
            if (!response.ok) throw new Error('Network response was not ok')

            const resp = await response.json() as PublishersResponse

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
        fetchFromServer
    }
})