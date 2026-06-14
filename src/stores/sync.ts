import type { Queue } from "@/types/data";
import { useOnline } from "@vueuse/core";
import { defineStore } from "pinia";
import { watch } from "vue";
import { useIDB } from '@/composables/useIDB'

export const useSyncStore = defineStore('sync', () => {
    const queue = useIDB<Queue[]>('dcrm-offline-queue', [])
    const isOnline = useOnline()


    const enqueue = async (url: string, method: 'POST' | 'PUT', payload: [any][]) => {
        queue.value.push({
            id: crypto.randomUUID(), // Unique tracker
            url,
            method,
            payload,
            timestamp: new Date().toISOString()
        })
    }

    const processQueue = async () => {
        if (queue.value.length === 0 || !isOnline.value) return

        while (queue.value.length > 0) {
            const nextRequest = queue.value[0]

            try {
                if (nextRequest) {
                    const response = await fetch(nextRequest.url, {
                        method: nextRequest.method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(nextRequest.payload)
                    })

                    if (response.ok) {
                        // Success! Remove it from the queue
                        queue.value.shift()
                    } else {
                        // Server rejected it (e.g., 400 Bad Request). 
                        // Break out to prevent infinite loops, handle or log error.
                        console.error('Server rejected offline mutation', await response.text())
                        break
                    }
                }
            } catch (err) {
                // Network fetch failed again (intermittent connection). Stop processing for now.
                console.error('Sync failed, will retry later.', err)
                break
            }
        }
    }

    watch(isOnline, (online) => {
        if (online) processQueue()
    })

    return {
        queue,
        enqueue,
        processQueue
    }
})