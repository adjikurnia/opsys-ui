<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export interface MapMarker {
  id: string
  lat: number
  lng: number
  /** HTML kartu / pin (divIcon). */
  html: string
  /** Titik jangkar ikon (default tengah). */
  anchor?: [number, number]
  zIndex?: number
}

const props = defineProps<{
  center: [number, number]
  zoom: number
  markers: MapMarker[]
  /** Batas maksimal peta (opsional). Bila kosong, dihitung otomatis dari sebaran marker agar drag tetap fokus ke area tersebut. */
  maxBounds?: [[number, number], [number, number]]
  minZoom?: number
  /** Kelonggaran batas di luar sebaran marker, proporsi dari lebar/tinggi sebaran (default 0.6). */
  boundsPadding?: number
}>()
const emit = defineEmits<{ select: [id: string]; hover: [id: string | null] }>()

const el = ref<HTMLDivElement>()
let map: L.Map | undefined
let layer: L.LayerGroup | undefined

function renderMarkers() {
  if (!map) return
  layer?.remove()
  layer = L.layerGroup().addTo(map)
  for (const m of props.markers) {
    const icon = L.divIcon({ html: m.html, className: 'ops-div-icon', iconSize: undefined, iconAnchor: m.anchor })
    const marker = L.marker([m.lat, m.lng], { icon, zIndexOffset: m.zIndex ?? 0 })
    marker.on('click', () => emit('select', m.id))
    marker.on('mouseover', () => emit('hover', m.id))
    marker.on('mouseout', () => emit('hover', null))
    marker.addTo(layer)
  }
}

/** Batas drag: pakai maxBounds eksplisit bila ada, atau hitung dari sebaran marker + kelonggaran. */
function computeBounds(): L.LatLngBounds | undefined {
  if (props.maxBounds) return L.latLngBounds(props.maxBounds)
  if (!props.markers.length) return undefined
  return L.latLngBounds(props.markers.map((m) => [m.lat, m.lng] as [number, number])).pad(props.boundsPadding ?? 0.6)
}

function applyBounds() {
  const b = computeBounds()
  if (b) map?.setMaxBounds(b)
}

onMounted(() => {
  if (!el.value) return
  map = L.map(el.value, {
    center: props.center,
    zoom: props.zoom,
    minZoom: props.minZoom ?? 4,
    zoomControl: false,
    attributionControl: true,
    maxBounds: computeBounds(),
    maxBoundsViscosity: 1,
  })
  // Tile basic OSM
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map)
  L.control.zoom({ position: 'bottomright' }).addTo(map)
  renderMarkers()
  // Ukuran container bisa berubah setelah mount (flex layout)
  setTimeout(() => map?.invalidateSize(), 50)
})

watch(
  () => props.markers,
  () => {
    renderMarkers()
    applyBounds()
  },
  { deep: true },
)
watch(
  () => [props.center, props.zoom] as const,
  ([c, z]) => map?.flyTo(c, z, { duration: 0.6 }),
)

onBeforeUnmount(() => map?.remove())

defineExpose({ invalidate: () => map?.invalidateSize() })
</script>

<template>
  <div ref="el" class="w-100 h-100" />
</template>

<style>
.ops-div-icon {
  background: transparent;
  border: 0;
  /* konten diposisikan relatif ke titik marker */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 0 !important;
  height: 0 !important;
}
.ops-div-icon > * {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: max-content;
}
</style>
