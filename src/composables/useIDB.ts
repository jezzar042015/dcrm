import { ref, watch, type Ref } from 'vue'
import { get, set } from 'idb-keyval'

/**
 * Custom composable to sync state with IndexedDB
 * @param key The IndexedDB key
 * @param defaultValue The initial value if DB is empty
 */
export function useIDB<T>(key: string, defaultValue: T): Ref<T> {
    // 1. Initialize with default value
    const data = ref<T>(defaultValue) as Ref<T>

    // 2. Hydrate from IndexedDB asynchronously
    get<T>(key).then((val) => {
        if (val !== undefined) {
            data.value = val
        }
    })

    // 3. Sync to IndexedDB on change
    // We use deep: true to catch object property mutations
    watch(
        data,
        (newVal) => {
            // JSON cloning ensures we don't save Vue proxy objects to IndexedDB
            set(key, JSON.parse(JSON.stringify(newVal))).catch((err) =>
                console.error(`IDB Write Error [${key}]:`, err)
            )
        },
        { deep: true }
    )

    return data
}