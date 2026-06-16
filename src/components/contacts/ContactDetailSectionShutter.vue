<template>
    <div class="px-2 mt-2">
        <div class="bg-gray-100 py-3 px-4 flex items-center justify-between cursor-pointer">
            <div class="flex items-center gap-2">
                <span> {{ title }}</span>
                <span class="text-xs py-1 px-2 rounded-full bg-white" v-if="count !== undefined">{{ count }}</span>
            </div>
            <div>
                <CaretSmall class="h-6 w-6 " :class="expanded ? 'rotate-90' : 'rotate-180'" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import CaretSmall from '@/icon/CaretSmall.vue';

    const { title, expanded = false, count } = defineProps<{
        title: string
        expanded: boolean
        count?: undefined | number
    }>()
</script>
