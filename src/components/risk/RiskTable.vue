<script setup lang="ts">
import { computed, ref } from 'vue'
import type { RiskItem } from '@/types'
import { categoryColor } from '@/composables/useRiskStyle'

/** Tabel kerawanan format resmi Buku Kerawanan (No, Segmen, UIT, Kondisi, Dampak, Mitigasi, Usulan, Aksi). */
const props = defineProps<{
  risks: RiskItem[]
  title?: string
  caption?: string
  closable?: boolean
}>()
const emit = defineEmits<{ openSld: [risk: RiskItem]; close: [] }>()

const search = ref('')
const uit = ref('Semua')
const asset = ref('Semua')
const uitOptions = ['Semua', 'JBB', 'JBT', 'JATIM']
const assetOptions = ['Semua', 'SUTET', 'SUTT', 'SKTT', 'IBT', 'GI']

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return props.risks.filter((r) => {
    const hay = [r.title, r.number, r.lineGiSegment, r.uit, r.condition, r.impact, r.mitigation, ...r.solution.shortTerm].join(' ').toLowerCase()
    return (!q || hay.includes(q)) && (uit.value === 'Semua' || r.uit === uit.value) && (asset.value === 'Semua' || r.assetType === asset.value)
  })
})

const lines = (t: string) => t.split('\n').filter((l) => l.trim())
</script>

<template>
  <div class="d-flex flex-column h-100 bg-surface" style="user-select: text">
    <!-- Toolbar -->
    <div class="pa-4 border-b bg-surface-light d-flex flex-wrap align-center justify-space-between ga-3 flex-shrink-0">
      <div class="d-flex align-center ga-3">
        <div>
          <div class="text-subtitle-1 font-weight-black">{{ title ?? 'Tabel Kerawanan Sistem & Subsistem Transmisi' }}</div>
          <div class="text-caption text-medium-emphasis">Format resmi berdasarkan Buku Kerawanan Sistem & Subsistem Jawa, Madura dan Bali</div>
        </div>
        <v-chip color="primary" variant="tonal" size="small" class="font-weight-bold">{{ filtered.length }} Kerawanan Terdata</v-chip>
      </div>
      <div class="d-flex flex-wrap align-center ga-2">
        <v-text-field v-model="search" placeholder="Cari segmen GI, masalah, mitigasi..." prepend-inner-icon="mdi-magnify" style="width: 260px" clearable />
        <v-select v-model="uit" :items="uitOptions" style="width: 130px" />
        <v-select v-model="asset" :items="assetOptions" style="width: 130px" />
        <v-btn v-if="closable" icon="mdi-close" variant="text" size="small" title="Tutup Tabel" @click="emit('close')" />
      </div>
    </div>

    <!-- Tabel -->
    <div class="flex-grow-1 ops-scroll pa-4 bg-surface-light">
      <v-card class="border rounded-lg overflow-hidden">
        <div class="text-center text-body-2 font-weight-black py-2 border-b bg-grey-lighten-4">
          {{ caption ?? 'Tabel 2.1: Kerawanan Sistem & Subsistem Transmisi' }}
        </div>
        <v-table density="compact" class="ops-risk-table">
          <thead>
            <tr>
              <th class="text-center" style="width: 48px">No</th>
              <th style="min-width: 220px">
                Line / Segmen GI
                <div class="text-caption font-weight-regular">(Dari GI ke GI mana)</div>
              </th>
              <th class="text-center" style="width: 64px">UIT</th>
              <th style="min-width: 230px">Kondisi / Permasalahan</th>
              <th style="min-width: 210px">Dampak</th>
              <th style="min-width: 230px">Mitigasi</th>
              <th style="min-width: 240px">Usulan / Solusi</th>
              <th class="text-center" style="width: 80px">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in filtered" :key="r.id">
              <td class="text-center font-weight-bold bg-surface-light">{{ r.number }}</td>
              <td>
                <div class="font-weight-bold text-primary">{{ r.lineGiSegment }}</div>
                <div class="d-flex flex-wrap ga-1 mt-1">
                  <v-chip size="x-small" :color="categoryColor(r.category)" variant="flat" class="font-weight-black">{{ r.category }}</v-chip>
                  <v-chip size="x-small" variant="outlined" class="ops-mono">{{ r.voltage }}</v-chip>
                  <v-chip v-if="r.circuits" size="x-small" variant="outlined" class="ops-mono">{{ r.circuits }} Sirkit</v-chip>
                  <v-chip v-if="r.lengthKm" size="x-small" variant="outlined" class="ops-mono">{{ r.lengthKm }} km</v-chip>
                </div>
                <div class="text-caption text-disabled mt-1">{{ r.location }}</div>
              </td>
              <td class="text-center"><v-chip size="x-small" variant="outlined" class="ops-mono font-weight-bold">{{ r.uit }}</v-chip></td>
              <td class="text-justify">{{ r.condition }}</td>
              <td class="text-justify"><div v-for="(l, i) in lines(r.impact)" :key="i">{{ l }}</div></td>
              <td class="text-justify"><div v-for="(l, i) in lines(r.mitigation)" :key="i">{{ l }}</div></td>
              <td class="text-justify">
                <div v-if="r.solution.shortTerm.length" class="mb-2">
                  <span class="font-weight-bold text-decoration-underline d-block">Jangka Pendek :</span>
                  <div v-for="(s, i) in r.solution.shortTerm" :key="i">{{ i + 1 }}. {{ s }}</div>
                </div>
                <div v-if="r.solution.mediumTerm?.length" class="mb-2">
                  <span class="font-weight-bold text-decoration-underline d-block">Jangka Menengah :</span>
                  <div v-for="(s, i) in r.solution.mediumTerm" :key="i" class="text-medium-emphasis">{{ i + 1 }}. {{ s }}</div>
                </div>
                <div v-if="r.solution.longTerm?.length">
                  <span class="font-weight-bold text-decoration-underline d-block">Jangka Panjang :</span>
                  <div v-for="(s, i) in r.solution.longTerm" :key="i" class="text-medium-emphasis">{{ i + 1 }}. {{ s }}</div>
                </div>
              </td>
              <td class="text-center">
                <v-btn size="x-small" color="primary" variant="tonal" prepend-icon="mdi-sitemap-outline" class="font-weight-bold" :disabled="!r.viewId" title="Buka di SLD" @click="emit('openSld', r)">
                  SLD
                </v-btn>
              </td>
            </tr>
            <tr v-if="!filtered.length">
              <td colspan="8" class="text-center text-medium-emphasis py-8">Tidak ada kerawanan yang sesuai dengan filter pencarian.</td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </div>
  </div>
</template>
