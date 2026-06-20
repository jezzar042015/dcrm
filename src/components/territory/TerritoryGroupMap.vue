<template>
    <div @click.self="emits('closeViewer')"
        class="absolute h-dvh w-full overflow-hidden bg-black/80 top-0 right-0 flex items-center justify-center z-10">
        <div class="w-11/12 h-[90%] bg-gray-50 flex flex-col">
            <div class="flex gap-2 items-center justify-between bg-gray-100 py-3 px-4 font-semibold text-sm">
                <div>
                    {{ groupedTerritory.territoryName || 'No Territory Assignment' }}
                </div>
                <div class="flex items-center gap-5">
                    <div>{{ groupedTerritory.contacts.length }}</div>
                </div>
            </div>
            <div v-if="true" id="tg-map" class="z-0 flex-1">
                <!-- Map will display here -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import "leaflet/dist/leaflet.css"
    import L, { type LatLngExpression } from 'leaflet'
    import type { ContactLocationRow, GroupedContactsByTerritory } from '@/types/data';
    import { computed, onMounted } from "vue";
    import { useContactLocationsStore } from "@/stores/locations";

    let map: L.Map | null = null

    const { groupedTerritory } = defineProps<{
        groupedTerritory: GroupedContactsByTerritory
    }>()

    const coordinates = useContactLocationsStore()

    const contactsLocations = computed<ContactLocationRow[]>(() => {
        const locations: ContactLocationRow[] = []

        for (const contact of groupedTerritory.contacts) {
            const matches = coordinates.data.filter(
                coord => coord[1] === contact[0]
            )

            locations.push(
                ...matches
            )
        }

        return locations
    })

    interface ContactMapCoordinates {
        contactId: string
        contactName: string
        latLong: LatLngExpression
        type: string
        locationId: string
        icon: L.Icon<L.IconOptions>
    }
    const mapCoordinates = computed<ContactMapCoordinates[]>(() => {
        const io: ContactMapCoordinates[] = []
        for (const item of contactsLocations.value) {
            io.push({
                contactId: item[1],
                locationId: item[0],
                contactName: getContactName(item[1]),
                type: item[2],
                latLong: convertLatLong(item[3]),
                icon: getMarkerIcon(item[1])
            })
        }
        return io
    })

    const getContactName = (contactId: string): string => {
        const c = groupedTerritory.contacts.find(f => f[0] == contactId)
        if (!c) return ''
        return `${c[1]} ${c[2]}`
    }

    const convertLatLong = (latLong: string): LatLngExpression => {
        const splitted = latLong.split(',')
        const output: LatLngExpression = [0, 0]
        output[0] = Number(splitted[0])
        output[1] = Number(splitted[1])
        return output
    }

    const getMarkerIcon = (contactId: string): L.Icon<L.IconOptions> => {
        const scr = coordinates.imgMapped.find(f => f[1] === contactId)

        const DEFAULT_AVATAR = '/dcrm/user-circle.png'

        const iconUrlToUse = (scr && (scr[5].trim() !== ""))
            ? scr[5].trim()
            : DEFAULT_AVATAR


        return L.icon({
            iconUrl: iconUrlToUse, // Safe! Never undefined or ""
            iconSize: [45, 45],
            iconAnchor: [19, 38],
            popupAnchor: [0, -38],
            className: 'map-profile-avatar'
        })
    }

    const emits = defineEmits<{
        'closeViewer': []
    }>()

    const initMap = () => {
        if (mapCoordinates.value) {

            // Destroy previous map instance
            if (map) {
                map.remove()
                map = null
            }

            const firstMap = mapCoordinates.value[0]?.latLong
            const defaulLatLong: LatLngExpression = [11.22027, 125.0034878]
            map = L.map('tg-map').setView(
                firstMap ?? defaulLatLong,
                14
            )

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution:
                    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map)

            for (const item of mapCoordinates.value) {
                L.marker(item.latLong, { icon: item.icon })
                    .addTo(map)
                    .bindTooltip(item.contactName)
            }
            // L.marker(primaryCoordinates.value, { icon: markerIcon.value })
            //     .addTo(map)
            // .bindPopup('Primary Location')
        }
    }

    onMounted(() => {
        initMap()
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