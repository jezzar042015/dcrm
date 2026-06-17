import type { ContactResponse } from "@/types/http";
import type { ContactRow } from "@/types/data";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useAuthStore } from "./auth";
import { useIDB } from "@/composables/useIDB";
import { useTerritoryStore } from "./territories";

export const useContactStore = defineStore('contacts', () => {

    const auth = useAuthStore()
    const terr = useTerritoryStore()

    const contacts = useIDB<ContactRow[]>('dcrm-data-contacts', [])

    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const onDetail = ref<null | ContactRow>(null)
    const searchKeyWords = ref('')

    const statusOrder = [
        'Territory',
        'Return Visit',
        'Bible Study',
        'Baptized Publisher',
        'Moved',
        'Deceased',
    ];

    const groupedByStatus = computed(() => {
        const groups = new Map<string, ContactRow[]>();

        for (const row of contacts.value) {
            const status = row[8]; // Accessing the 9th column (index 8)

            if (!groups.has(status)) {
                groups.set(status, []);
            }

            let isOnSearch = true
            let isResponsible = true 
            
            if (status == 'Territory') {
                isResponsible = row[10] ? terr.handledTerritoryIds.includes(row[10]) : true
            }
            

            if (searchKeyWords.value) {
                isOnSearch = row
                    .toString()
                    .toLowerCase()
                    .includes(searchKeyWords.value.toLowerCase())
            }

            /* if (row[8] !== 'Territory') { **/
            if (isOnSearch && isResponsible) {
                groups.get(status)!.push(row);
            }
            // } 
        }

        return Array.from(groups, ([status, contacts]) => ({
            status,
            contacts,
        })).sort((a, b) => {
            let indexA = statusOrder.indexOf(a.status);
            let indexB = statusOrder.indexOf(b.status);

            // If a status isn't in your list, push it to the very end
            if (indexA === -1) indexA = Infinity;
            if (indexB === -1) indexB = Infinity;

            return indexA - indexB;
        });
    })


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
        onDetail,
        searchKeyWords,
        fetchFromServer
    }
})