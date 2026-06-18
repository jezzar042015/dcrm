import { useIDB } from "@/composables/useIDB";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useAuthStore } from "./auth";
import type { TerritoryCoveragesResponse } from "@/types/http";
import type { TerritoryCoverageRow } from "@/types/data";
import { useContactCallStore } from "./calls";

export const useTerritoryCoveragesStore = defineStore('coverages', () => {
    const data = useIDB<TerritoryCoverageRow[]>('dcrm-data-coverages', [])

    const auth = useAuthStore()
    const calls = useContactCallStore()

    const isLoading = ref(false)
    const error = ref<string | null>(null)

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
                    action: 'get-coverages',
                    token: auth.token,
                })
            })
            if (!response.ok) throw new Error('Network response was not ok')

            const resp = await response.json() as TerritoryCoveragesResponse

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

    const incompleteAssignedCoverages = computed<TerritoryCoverageRow[]>(() => {
        // 1. Guard clause handles the empty array case
        if (!data.value) return []

        return data.value
            .filter(c => (c[6] !== 'Completed' || c[7] !== c[9]) && c[4] !== '')
            .sort((a, b) => b[2].localeCompare(a[2]))
            .map((m) => {
                const clonedRow = [...m]

                clonedRow[11] = calls.data.filter(d => d[2] === m[0] && ((d[5] ?? '') !== '') && d[4] === '')

                // 2. Type assertion if TypeScript struggles to infer the tuple/object mapping
                return clonedRow as TerritoryCoverageRow
            })
    })

    const upcomingAssignedCoverages = computed(() => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        return incompleteAssignedCoverages.value.filter((c) => {
            if (!c[2]) return false

            const assignDate = new Date(c[2].toString())
            assignDate.setHours(0, 0, 0, 0)

            return assignDate.getTime() >= today.getTime()
        })
    })


    const lateAssignedCoverages = computed(() => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        return incompleteAssignedCoverages.value.filter((c) => {
            if (!c[2]) return false

            const assignDate = new Date(c[2].toString())
            assignDate.setHours(0, 0, 0, 0)

            return assignDate.getTime() < today.getTime()
        })
    })

    const userUpcomingAssignments = computed(() => {
        const user = auth.associatedPublisher

        if (!user) return []

        return upcomingAssignedCoverages.value.filter(
            c => c[4].split(',').includes(user[2])
        )
    })

    const userLateAssignments = computed(() => {
        const user = auth.associatedPublisher

        if (!user) return []

        return lateAssignedCoverages.value.filter(
            c => c[4].split(',').includes(user[2])
        )
    })

    return {
        data,
        isLoading,
        incompleteAssignedCoverages,
        upcomingAssignedCoverages,
        lateAssignedCoverages,
        userUpcomingAssignments,
        userLateAssignments,
        fetchFromServer,
    }
})