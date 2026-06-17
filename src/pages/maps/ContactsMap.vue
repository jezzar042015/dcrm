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
    import L from 'leaflet'
    import 'leaflet.markercluster/dist/MarkerCluster.css';
    import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
    import "leaflet.markercluster";
    import { onMounted } from 'vue';
    import { useContactLocationsStore } from '@/stores/locations';

    const locations = useContactLocationsStore()
    let map: L.Map

    onMounted(() => {
        map = L.map('map').setView(
            [11.22027, 125.0034878],
            16
        )

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map)

        // 2. Access markerClusterGroup via the L namespace
        const markers = (L as any).markerClusterGroup ? (L as any).markerClusterGroup() : null;

        // Alternative standard way if types are correctly set up:
        // const markers = L.markerClusterGroup();

        if (markers && locations.imgMapped) {
            locations.imgMapped.forEach((gps) => {
                if (gps[3]) {
                    const parts = gps[3].split(',');
                    if (parts.length === 2) {
                        const lat = Number.parseFloat(parts[0] ?? "");
                        const lng = Number.parseFloat(parts[1] ?? "");

                        if (!Number.isNaN(lat) && !Number.isNaN(lng)) {

                            // 1. Get your base64 string (Replace gps[4] with your actual image data path)
                            const base64Image = gps[5];

                            // 2. Create a custom Leaflet icon configuration
                            const customIcon = L.icon({
                                iconUrl: base64Image, // Pass the base64 string directly here
                                iconSize: [38, 38],   // Size of the icon in pixels [width, height]
                                iconAnchor: [19, 38], // Point of the icon which will correspond to marker's location (usually bottom-center)
                                popupAnchor: [0, -38], // Point from which the popup should open relative to the iconAnchor
                                className: 'map-profile-avatar'
                            });

                            // 3. Pass the icon into the marker options
                            const marker = L.marker([lat, lng], { icon: customIcon });

                            markers.addLayer(marker);
                        }
                    }
                }
            });

            markers.addTo(map);
        }
    })
</script>

<style scoped>
    :deep(.map-profile-avatar)
    {
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        object-fit: cover;
        /* Prevents stretching if the image isn't perfectly square */
    }
</style>