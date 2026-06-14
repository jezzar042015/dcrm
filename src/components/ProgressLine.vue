<template>
    <div v-show="loading"
        class="absolute h-1 w-full bg-amber-500 origin-[0%_50%] animate-[progress_1s_infinite_linear]"></div>
</template>

<script setup lang="ts">
    const { loading } = defineProps<{
        loading: boolean
    }>()
</script>

<style>
    @keyframes progress
    {
        0%
        {
            transform: translateX(0) scaleX(0);
        }

        40%
        {
            transform: translateX(0) scaleX(0.4);
        }

        100%
        {
            transform: translateX(100%) scaleX(0.5);
        }
    }
</style>