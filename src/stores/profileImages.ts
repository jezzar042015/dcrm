import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { get, set } from 'idb-keyval'

export const useProfileImageStore = defineStore('profileImages', () => {
    // Reactive cache for currently loaded images in memory (reactive UI updates)
    // Structure: { [filename: string]: string (base64 data URI) }
    const imageCache = ref<Record<string, string>>({})
    const loadingFiles = ref<Record<string, boolean>>({})

    /**
     * Fetches the image from IndexedDB, or drops back to Google Apps Script if missing.
     */
    async function getProfileImg(targetFile: string, authToken: string): Promise<string | undefined> {
        if (!targetFile) return

        const file = targetFile.split('/')[1]
        if (!file) return

        // 1. Check in-memory cache first (super fast)
        if (imageCache.value[file]) {
            return imageCache.value[file]
        }

        // 2. Check IndexedDB cache
        try {
            const cachedImg = await get<string>(`img_${file}`)
            if (cachedImg) {
                imageCache.value[file] = cachedImg // Hydrate in-memory cache
                return cachedImg
            }
        } catch (err) {
            console.error('IndexedDB read error:', err)
        }

        // 3. Prevent duplicate simultaneous network requests for the exact same file
        if (loadingFiles.value[file]) {
            return new Promise((resolve) => {
                const unwatch = watch(() => imageCache.value[file], (newVal) => {
                    if (newVal) {
                        unwatch()
                        resolve(newVal)
                    }
                })
            })
        }

        // 4. Fallback: Request from Apps Script
        loadingFiles.value[file] = true
        try {
            const url = `https://script.google.com/macros/s/AKfycbyZReqXsUttX2Gp4ujW7DKCIt-HZD0IZYkEALekOzEurZamWAQepA3UE684AO-GOkh-/exec?token=${authToken}&action=get-img&file=${file}`
            const resp = await fetch(url)
            const result = await resp.json()

            if (result.status === 'success') {
                const dataUri = `data:${result.mimeType};base64,${result.base64String}`

                // Save to memory cache for immediate rendering
                imageCache.value[file] = dataUri

                // Persist individually to IndexedDB asynchronously (don't await it, block nothing)
                set(`img_${file}`, dataUri).catch((err) =>
                    console.error(`IDB Write Error for file ${file}:`, err)
                )

                return dataUri
            }
        } catch (error) {
            console.error(`Failed fetching image ${file} from network:`, error)
        } finally {
            loadingFiles.value[file] = false
        }
    }

    async function getCachedProfileImgOnly(targetFile: string): Promise<string | undefined> {
        if (!targetFile) return;

        const file = targetFile.split('/')[1];
        if (!file) return;

        // 1. Check in-memory cache first (super fast)
        if (imageCache.value[file]) {
            return imageCache.value[file];
        }

        // 2. Check IndexedDB cache only
        try {
            const cachedImg = await get<string>(`img_${file}`);
            if (cachedImg) {
                imageCache.value[file] = cachedImg; // Hydrate memory cache for subsequent requests
                return cachedImg;
            }
        } catch (err) {
            console.error('IndexedDB read error:', err);
        }

        // If it's not anywhere locally, return undefined immediately
        return undefined;
    }

    return {
        imageCache,
        getProfileImg,
        getCachedProfileImgOnly
    }
})