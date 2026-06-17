import type { ContactLocationRow } from "@/types/data";
import type { ContactLocationsResponse } from "@/types/http";
import { defineStore } from "pinia";
import { ref, watchEffect } from "vue";
import { useAuthStore } from "./auth";
import { useContactStore } from "./contacts";
import { useIDB } from "@/composables/useIDB";
import { useProfileImageStore } from "./profileImages";

export const useContactLocationsStore = defineStore('locations', () => {
    const data = useIDB<ContactLocationRow[]>('dcrm-data-coordinates', [])
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const auth = useAuthStore()
    const contacts = useContactStore()
    const profile = useProfileImageStore()

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
                    action: 'get-locations',
                    token: auth.token,
                })
            })
            if (!response.ok) throw new Error('Network response was not ok')

            const resp = await response.json() as ContactLocationsResponse

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

    const imgMapped = ref<ContactLocationRow[]>([])

    // 2. Handle the async mapping inside a watcher
    watchEffect(async () => {
        if (!data.value) return

        // Explicitly type the Promise array so Promise.all knows exactly what it's resolving
        const promises: Promise<ContactLocationRow>[] = data.value.map(async (m) => {
            const relatedContact = contacts.contacts.find(c => c[0] === m[1])
            let src = ''

            if (relatedContact) {
                const pic = relatedContact[3]
                if (pic) {
                    src = await profile.getCachedProfileImgOnly(pic) ?? ''
                }
            }

            // Cast the returned structure to satisfy your tuple definition
            return [
                m[0], // id
                m[1], // contactId
                m[2], // type
                m[3], // coordinates
                m[4], // remarks
                src   // src
            ] as ContactLocationRow
        })

        // TypeScript now happily accepts the resolved array matching ContactLocationRow[]
        imgMapped.value = await Promise.all(promises)
    })

    return {
        data,
        imgMapped,
        isLoading,
        fetchFromServer,
    }
})