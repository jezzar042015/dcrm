import type { ContactResponse } from "@/types/http";
import type { ContactRow } from "@/types/data";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useAuthStore } from "./auth";
import { useIDB } from "@/composables/useIDB";

export const useContactStore = defineStore('contacts', () => {

    const contacts = useIDB<ContactRow[]>('dcrm-data-contacts', [])

    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const auth = useAuthStore()

    const groupedByStatus = computed(() => {
        const groups = new Map<string, ContactRow[]>();

        for (const row of contacts.value) {
            const status = row[8]; // Accessing the 9th column (index 8)

            if (!groups.has(status)) {
                groups.set(status, []);
            }
            groups.get(status)!.push(row);
        }

        return Array.from(groups, ([status, contacts]) => ({
            status,
            contacts,
        }));
    })


    const fetchContacts = async () => {
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
                    action: 'get-contacts',
                    token: auth.token,
                })
            })
            if (!response.ok) throw new Error('Network response was not ok')

            const resp = await response.json() as ContactResponse

            if (resp.status === 200) {
                contacts.value = resp.data
            }

        } catch (err) {
            if (err instanceof Error)
                error.value = err.message
        } finally {
            isLoading.value = false
        }
    }

    return {
        contacts,
        groupedByStatus,
        isLoading,
        fetchContacts
    }
})