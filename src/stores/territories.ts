import { useIDB } from "@/composables/useIDB";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useAuthStore } from "./auth";
import type { TerritoryResponse } from "@/types/http";
import type { TerritoryRow } from "@/types/data";

export const useTerritoryStore = defineStore('territory', () => {
    const data = useIDB<TerritoryRow[]>('dcrm-data-territories', [])

    const auth = useAuthStore()
    
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const scope = ref<'fsg' | 'cong'>('fsg')


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
                    action: 'get-territories',
                    token: auth.token,
                })
            })
            if (!response.ok) throw new Error('Network response was not ok')

            const resp = await response.json() as TerritoryResponse

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

    const handledTerritoryIds = computed(() => {
        let userFsgAssignment = ''

        if (scope.value == 'fsg') {
            userFsgAssignment = auth.associatedPublisher?.[8] ?? ''
        }

        return data.value
            .filter(t => Boolean(t[4]) && (userFsgAssignment ? userFsgAssignment == t[4] : true))
            .map(m => (m[0]))
    })

    return {
        data,
        isLoading,
        scope,
        fetchFromServer,
        handledTerritoryIds
    }
})