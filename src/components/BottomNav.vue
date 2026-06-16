<template>
    <div class="p-6 flex justify-center shadow rotate-180">
        <div @click="pages.active = 'dashboard'" class="rotate-180">Home</div>
    </div>
</template>

<script setup lang="ts">
    import { usePageStore } from '@/stores/pages';

    const pages = usePageStore()
</script>
