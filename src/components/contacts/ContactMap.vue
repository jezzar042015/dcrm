<template>
    <div id="contact-map" style="height: 300px;"></div>
</template>

<script setup lang="ts">
    import "leaflet/dist/leaflet.css"
    import L, { type LatLngExpression } from 'leaflet'
    import { computed, watch } from "vue";
    import type { ContactLocationRow } from "@/types/data";

    let map: L.Map

    const { locations, profileImage } = defineProps<{
        locations: ContactLocationRow[],
        profileImage?: string
    }>()

    const DEFAULT_AVATAR = '/dcrm/user-circle.png'

    const markerIcon = computed(() => {
        const iconUrlToUse = (profileImage && (profileImage.trim() !== ""))
            ? profileImage
            : DEFAULT_AVATAR

        return L.icon({
            iconUrl: iconUrlToUse, // Safe! Never undefined or ""
            iconSize: [45, 45],
            iconAnchor: [19, 38],
            popupAnchor: [0, -38],
            className: 'map-profile-avatar'
        })
    })

    const primaryCoordinates = computed<LatLngExpression | undefined>(() => {
        const primeLocation = locations[0]  // get the first item
        const coordinates = primeLocation?.[3]
        const latLong = coordinates?.split(',')

        if (latLong?.length === 2) {
            const prime: LatLngExpression = [0, 0]
            prime[0] = Number(latLong[0])
            prime[1] = Number(latLong[1])
            return prime
        }
        return undefined
    })

    const initMap = () => {
        if (primaryCoordinates.value && markerIcon.value) {

            map = L.map('contact-map').setView(
                primaryCoordinates.value,
                16
            )

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution:
                    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map)

            L.marker(primaryCoordinates.value, { icon: markerIcon.value })
                .addTo(map)
                .bindPopup('Primary Location')
        }
    }

    watch(
        () => [primaryCoordinates.value && profileImage],
        () => {
            initMap()
        }
    )


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