<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useOpsysStore } from '@/stores/opsys'
import type { PowerSystem } from '@/types'
import PageBanner from '@/components/common/PageBanner.vue'
import RiskLegend from '@/components/common/RiskLegend.vue'
import RiskCountChips from '@/components/common/RiskCountChips.vue'
import RiskLevelChip from '@/components/common/RiskLevelChip.vue'
import BaseMap, { type MapMarker } from '@/components/map/BaseMap.vue'
import { categoryHex } from '@/composables/useRiskStyle'

/** Level 1 — Peta Nasional sebaran sistem tenaga listrik. */
const store = useOpsysStore()
const router = useRouter()

const infoSystem = ref<PowerSystem | null>(null)
const listOpen = ref(false)

const chip = (bg: string, fg: string, dot: string, text: string) =>
  `<span style="display:inline-flex;align-items:center;gap:4px;padding:1px 6px;border-radius:4px;background:${bg};color:${fg};font-weight:700;font-size:10px;border:1px solid ${dot}33"><span style="width:6px;height:6px;border-radius:50%;background:${dot}"></span>${text}</span>`

const markers = computed<MapMarker[]>(() =>
  store.systems.map((s) => ({
    id: s.id,
    lat: s.lat,
    lng: s.lng,
    zIndex: s.active ? 1000 : 0,
    html: `
      <div class="ops-pin-card">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="width:26px;height:26px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:#eff6ff;color:#0046ad;border:1px solid #dbeafe">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>
          </span>
          <div>
            <div style="font-weight:700">${s.name}</div>
            <div style="font-size:10px;color:#64748b;font-weight:500">${s.upbCount} UP2B • ${s.subsystemCount} Subsistem</div>
          </div>
        </div>
        <div style="margin-top:6px;padding-top:6px;border-top:1px solid #f1f5f9;display:flex;gap:4px">
          ${chip('#fee2e2', '#dc2626', categoryHex['N-1'], 'N-1: ' + s.risks.n1)}
          ${chip('#fef9c3', '#a16207', categoryHex['N-2'], 'N-2: ' + s.risks.n2)}
          ${chip('#f1f5f9', '#475569', categoryHex['N-1-2'], 'N-1-2: ' + s.risks.n12)}
        </div>
      </div>`,
  })),
)

function onSelect(id: string) {
  const s = store.systemById(id)
  if (!s) return
  infoSystem.value = s
}

function openSystem(s: PowerSystem) {
  infoSystem.value = null
  router.push({ name: 'system', params: { systemId: s.id } })
}
</script>

<template>
  <div class="d-flex flex-column overflow-hidden">
    <PageBanner step="1" title="Peta Nasional Sebaran Sistem Tenaga Listrik" subtitle="Peta risiko & sebaran sistem transmisi tenaga listrik Indonesia tahun 2026" />

    <div class="flex-grow-1 position-relative" style="min-height: 0">
      <BaseMap :center="[-2.6, 118]" :zoom="5" :min-zoom="4" :markers="markers" :max-bounds="[[-14, 90], [9, 144]]" @select="onSelect" />
      <RiskLegend class="position-absolute" style="right: 16px; top: 16px; z-index: 500" />

      <v-btn class="position-absolute font-weight-bold bg-surface" style="left: 20px; bottom: 20px; z-index: 500" color="primary" variant="outlined" prepend-icon="mdi-format-list-bulleted" @click="listOpen = true">
        Lihat Daftar Sistem
      </v-btn>
    </div>

    <!-- Dialog info sistem (klik pin/daftar): sistem aktif bisa lanjut ke detail, lainnya cuma ringkasan -->
    <v-dialog :model-value="!!infoSystem" max-width="440" @update:model-value="infoSystem = null">
      <v-card v-if="infoSystem" class="rounded-xl pa-5">
        <div class="d-flex align-center justify-space-between border-b pb-3 mb-3">
          <div class="d-flex align-center ga-2">
            <v-icon icon="mdi-map-marker" color="primary" />
            <span class="text-subtitle-1 font-weight-bold">Sistem {{ infoSystem.name }}</span>
          </div>
          <v-btn icon="mdi-close" size="small" variant="text" @click="infoSystem = null" />
        </div>
        <p class="text-caption text-medium-emphasis mb-3">{{ infoSystem.description }}</p>
        <v-row density="compact" class="text-center mb-3">
          <v-col v-for="m in [['UP2B', infoSystem.upbCount, 'text-primary'], ['Subsistem', infoSystem.subsystemCount, ''], ['GI / GITET', infoSystem.giCount, 'text-success']]" :key="m[0]" cols="4">
            <v-sheet class="rounded-lg border pa-2 bg-surface-light">
              <div class="text-caption text-medium-emphasis">{{ m[0] }}</div>
              <div class="text-body-1 font-weight-black" :class="m[2]">{{ m[1] }}</div>
            </v-sheet>
          </v-col>
        </v-row>
        <v-sheet class="rounded-lg border pa-3 bg-surface-light">
          <div class="text-caption font-weight-bold mb-2">Ringkasan Kerawanan Sistem:</div>
          <RiskCountChips :counts="infoSystem.risks" />
          <div class="mt-2"><RiskLevelChip :level="infoSystem.riskLevel" /></div>
        </v-sheet>
        <v-alert v-if="!infoSystem.active" type="info" variant="tonal" density="compact" class="text-caption mt-3">Data drill-down sistem ini belum tersedia pada prototipe.</v-alert>
        <v-btn v-else color="primary" variant="flat" class="font-weight-bold mt-3" append-icon="mdi-arrow-right" block @click="openSystem(infoSystem)">Buka Detail Sistem</v-btn>
      </v-card>
    </v-dialog>

    <!-- Daftar sistem -->
    <v-dialog v-model="listOpen" max-width="720" scrollable>
      <v-card class="rounded-xl">
        <v-card-title class="d-flex align-center justify-space-between">
          <span class="font-weight-black">Daftar Sistem Tenaga Listrik</span>
          <v-btn icon="mdi-close" size="small" variant="text" @click="listOpen = false" />
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-2" style="max-height: 60vh">
          <v-list>
            <v-list-item v-for="s in store.systems" :key="s.id" class="rounded-lg" @click="listOpen = false; onSelect(s.id)">
              <template #prepend><v-icon icon="mdi-map-marker" color="grey" /></template>
              <v-list-item-title class="font-weight-bold d-flex align-center ga-2">
                {{ s.name }} <RiskLevelChip :level="s.riskLevel" />
              </v-list-item-title>
              <v-list-item-subtitle class="text-caption">{{ s.upbCount }} UP2B • {{ s.subsystemCount }} Subsistem • {{ s.giCount }} GI</v-list-item-subtitle>
              <template #append><RiskCountChips :counts="s.risks" /></template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
