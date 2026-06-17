<template>
    <div class="h-screen overflow-hidden flex flex-col relative">
        <div class="p-5 shadow flex items-center gap-5">
            <div class="bg-gray-100 h-8 w-8 rounded-full"></div>
            <div class="text-lg font-bold">Locations</div>
        </div>

        <div class="flex-1">
            <div id="map" class="h-full"></div>
        </div>

        <BottomNav />
    </div>
</template>

<script setup lang="ts">
    import BottomNav from '@/components/BottomNav.vue';
    import "leaflet/dist/leaflet.css"
    import * as L from 'leaflet';
    import { onMounted, ref } from 'vue';

    const initialMap = ref(null);

    onMounted(() => {
        initialMap.value = L.map('map').setView([11.22027,125.0034878], 16);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(initialMap.value);
    });
</script>