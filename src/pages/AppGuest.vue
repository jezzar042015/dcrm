<template>
    <div>
        Hello! Welcome
    </div>

    <div>
        <button @click="toLogin">
            Go to login
        </button>
    </div>
</template>

<script setup lang="ts">
import { usePageStore } from '@/stores/pages';

    const pages = usePageStore()
    const toLogin = () => pages.active= 'login'
</script>