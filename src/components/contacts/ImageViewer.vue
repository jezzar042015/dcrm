<template>
    <div @click.self="emits('closeViewer')"
        class="absolute h-[100dvh] w-full overflow-hidden bg-black/80 top-0 right-0 flex items-center justify-center z-10">
        <div class="w-11/12">
            <img :src alt="" class="w-full">
        </div>
    </div>
</template>

<script setup lang="ts">
    const { src } = defineProps<{
        src: string
    }>()

    const emits = defineEmits<{
        'closeViewer': []
    }>()
</script>