import type { AppModals, AppPages } from "@/types/pages";
import { defineStore } from "pinia";
import { ref } from "vue";

export const usePageStore = defineStore('pages', () => {

    const active = ref<AppPages>('home')
    const previous = ref<AppPages>('home')
    const modal = ref<AppModals | ''>('')
    
    return {
        active,
        previous,
        modal
    }
})