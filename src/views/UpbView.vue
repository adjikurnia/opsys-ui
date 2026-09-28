<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOpsysStore } from '@/stores/opsys'
import type { RiskItem } from '@/types'
import PageBanner from '@/components/common/PageBanner.vue'
import ViewModeBar, { type ViewModeItem } from '@/components/common/ViewModeBar.vue'
import SidePanel from '@/components/common/SidePanel.vue'
import InfoTab from '@/components/common/InfoTab.vue'
import RiskLevelChip from '@/components/common/RiskLevelChip.vue'
import BaseMap, { type MapMarker } from '@/components/map/BaseMap.vue'
import RiskTable from '@/components/risk/RiskTable.vue'
import { statusHex } from '@/composables/useRiskStyle'

/** Level 3 — UP2B: peta sebaran GI per wilayah | List Kerawanan. */
const route = useRoute()
const router = useRouter()
const store = useOpsysStore()

const systemId = computed(() => route.params.systemId as string)
const upbId = computed(() => route.params.upbId as string)
const upb = computed(() => store.upbById(upbId.value))
const upbList = computed(() => store.upbsBySystem(systemId.value))
const subs = computed(() => store.subsystemsByUpb(upbId.value))
const gis = computed(() => store.substationsByUpb(upbId.value))
const risks = computed(() => store.risksByUpb(upbId.value))

type Mode = 'maps' | 'list'
const mode = computed<Mode>(() => (route.query.mode === 'list' ? 'list' : 'maps'))
const setMode = (m: string) => router.replace({ query: { ...route.query, mode: m } })
const infoOpen = ref(false)

const modeItems = computed<ViewModeItem[]>(() => [
  { value: 'maps', label: 'Maps', icon: 'mdi-map-outline' },
  { value: 'sld', label: 'SLD', icon: 'mdi-sitemap-outline', iconColor: 'primary', navigate: true },
  { value: 'list', label: 'List Kerawanan', icon: 'mdi-filter-variant', iconColor: 'error', badge: risks.value.length },
])

const goUpb = (id: string) => router.push({ name: 'upb', params: { systemId: systemId.value, upbId: id }, query: route.query })
const goSubsystem = (subsystemId: string) => router.push({ name: 'subsystem', params: { systemId: systemId.value, upbId: upbId.value, subsystemId } })
function onModeSelect(v: string) {
  if (v === 'sld') {
    const first = subs.value[0]
    if (first) goSubsystem(first.id)
  }
}
function openRiskInSld(r: RiskItem) {
  if (r.subsystemId) router.push({ name: 'subsystem', params: { systemId: systemId.value, upbId: upbId.value, subsystemId: r.subsystemId }, query: { view: r.viewId, risk: r.number } })
}

const center = computed<[number, number]>(() => [upb.value?.lat ?? -6.5, upb.value?.lng ?? 107])
const markers = computed<MapMarker[]>(() =>
  gis.value.map((g) => ({
    id: g.id,
    lat: g.lat,
    lng: g.lng,
    html: `<div style="display:flex;flex-direction:column;align-items:center;cursor:pointer">
      <span class="ops-pin-dot" style="background:${statusHex(g.status)};${g.status === 'Rawan' ? 'box-shadow:0 0 0 4px rgba(220,38,38,.25)' : ''}"></span>
      <span class="ops-pin-label">${g.name}</span>
    </div>`,
  })),
)
function onGiSelect(id: string) {
  const g = gis.value.find((x) => x.id === id)
  if (g?.subsystemId) goSubsystem(g.subsystemId)
}
</script>

<template>
  <div v-if="upb" class="d-flex flex-column overflow-hidden">
    <PageBanner step="3" :title="`UP2B — ${upb.name}`" subtitle="Peta wilayah kerja dan sebaran subsistem transmisi tenaga listrik" :back-to="{ name: 'system', params: { systemId } }" back-label="Kembali ke Sistem" />

    <ViewModeBar :items="modeItems" :model-value="mode" @update:model-value="setMode" @select="onModeSelect">
      <template #extra>
        <v-btn v-if="mode === 'list'" size="small" :variant="infoOpen ? 'flat' : 'text'" :color="infoOpen ? 'primary' : 'grey-darken-2'" class="font-weight-bold" prepend-icon="mdi-information-outline" @click="infoOpen = true">Info UP2B</v-btn>
      </template>
      <template #right>
        <span>Wilayah: {{ upb.region }}</span><span>•</span><span>{{ upb.subsystemCount }} Subsistem</span>
      </template>
    </ViewModeBar>

    <div class="flex-grow-1 d-flex overflow-hidden position-relative" style="min-height: 0">
      <!-- Kiri: pilih UP2B -->
      <aside v-if="mode === 'maps'" class="bg-surface border-e pa-4 flex-shrink-0 ops-scroll d-flex flex-column" style="width: 250px">
        <div class="text-caption font-weight-black text-primary text-uppercase ops-mono mb-2" style="letter-spacing: 0.08em">Pilih UP2B ({{ upbList.length }} Unit)</div>
        <v-list density="compact" class="py-0 flex-grow-1" nav>
          <v-list-item v-for="u in upbList" :key="u.id" :active="u.id === upbId" color="primary" rounded="lg" class="mb-1 border" :class="u.id === upbId ? 'border-primary' : 'border-opacity-0'" @click="goUpb(u.id)">
            <v-list-item-title class="text-caption font-weight-bold d-flex align-center ga-1"><v-icon icon="mdi-map-marker" size="12" color="primary" />{{ u.name }}</v-list-item-title>
            <v-list-item-subtitle class="text-caption ops-mono pl-4" style="font-size: 10px">{{ u.giCount }} GI • {{ u.ibtCount }} IBT</v-list-item-subtitle>
          </v-list-item>
        </v-list>
        <v-card class="rounded-lg border pa-3 bg-surface-light text-caption mt-3">
          <div class="font-weight-bold mb-1">Legenda</div>
          <div v-for="s in (['Rawan', 'Waspada', 'Normal'] as const)" :key="s" class="d-flex align-center ga-2 py-0.5">
            <span class="rounded-circle d-inline-block" :style="{ width: '10px', height: '10px', background: statusHex(s) }" /> GI / GITET {{ s }}
          </div>
        </v-card>
      </aside>

      <!-- Kanvas -->
      <div class="flex-grow-1 position-relative overflow-hidden" style="min-width: 0">
        <template v-if="mode === 'maps'">
          <BaseMap :center="center" :zoom="9" :min-zoom="7" :markers="markers" @select="onGiSelect" />
          <div class="position-absolute pa-3 rounded-lg bg-surface border" style="left: 12px; top: 12px; z-index: 500; opacity: 0.95">
            <div class="text-subtitle-1 font-weight-black text-uppercase" style="line-height: 1.1">{{ upb.name }}</div>
            <div class="text-caption text-medium-emphasis">Jaringan interkoneksi Gardu Induk & transmisi — klik GI untuk membuka SLD subsistem</div>
          </div>
        </template>
        <template v-else>
          <RiskTable :risks="risks" :caption="`Tabel Kerawanan ${upb.name}`" @open-sld="openRiskInSld" @close="setMode('maps')" />
          <InfoTab label="INFO UP2B" @click="infoOpen = true" />
        </template>
      </div>

      <!-- Kanan: info UP2B -->
      <SidePanel v-model="infoOpen" :overlay="mode === 'list'" :width="mode === 'list' ? 440 : 380">
        <template #default="{ isOverlay }">
          <div class="pa-5 d-flex flex-column ga-4">
            <div class="d-flex align-start justify-space-between border-b pb-3">
              <div>
                <div class="text-caption font-weight-black text-primary text-uppercase ops-mono" style="letter-spacing: 0.08em">Informasi UP2B</div>
                <div class="text-h6 font-weight-black" style="line-height: 1.2">{{ upb.name }}</div>
                <p class="text-caption text-medium-emphasis mt-1">Wilayah kerja mencakup {{ upb.region }} dengan {{ upb.keySubstations.length }} GITET simpul utama.</p>
              </div>
              <v-btn v-if="isOverlay" icon="mdi-close" size="small" variant="text" @click="infoOpen = false" />
            </div>

            <v-sheet class="rounded-lg border pa-3 bg-surface-light text-caption">
              <div class="d-flex justify-space-between py-1 border-b"><span class="text-medium-emphasis">Tingkat:</span><RiskLevelChip :level="upb.riskLevel" /></div>
              <div class="d-flex justify-space-between py-1 border-b"><span class="text-medium-emphasis">Jumlah Subsistem:</span><b class="ops-mono">{{ upb.subsystemCount }} Subsistem</b></div>
              <div class="d-flex justify-space-between py-1"><span class="text-medium-emphasis">GI · IBT:</span><b class="ops-mono">{{ upb.giCount }} · {{ upb.ibtCount }}</b></div>
            </v-sheet>

            <v-card class="rounded-lg border pa-3">
              <div class="text-caption font-weight-black text-uppercase mb-2" style="letter-spacing: 0.06em">Total Kerawanan {{ upb.shortName }}:</div>
              <v-sheet class="rounded-lg border pa-3 d-flex align-center justify-space-between" color="red-lighten-5">
                <div class="d-flex align-center ga-2">
                  <v-avatar rounded="lg" color="error" size="30"><v-icon icon="mdi-fire" size="18" /></v-avatar>
                  <div><div class="text-caption font-weight-bold">Total Kerawanan</div><div class="text-caption text-medium-emphasis" style="font-size: 10px">Wilayah {{ upb.shortName }}</div></div>
                </div>
                <div class="text-h6 font-weight-black text-error ops-mono">{{ risks.length }}</div>
              </v-sheet>
            </v-card>

            <div>
              <div class="text-caption font-weight-black text-uppercase mb-2" style="letter-spacing: 0.06em">Daftar Subsistem & Kerawanan:</div>
              <v-card v-for="s in subs" :key="s.id" class="rounded-lg border pa-3 mb-2 bg-surface-light" hover @click="infoOpen = false; goSubsystem(s.id)">
                <div class="d-flex justify-space-between align-center">
                  <span class="text-body-2 font-weight-bold">{{ s.name }}</span>
                  <v-icon icon="mdi-arrow-right" size="14" color="primary" />
                </div>
                <div class="text-caption text-medium-emphasis ops-mono">{{ s.giCount }} GI • {{ s.ibtCount }} IBT • Beban: {{ s.peakLoadMW }} MW</div>
                <div class="d-flex justify-space-between align-center pt-2 mt-2 border-t">
                  <RiskLevelChip :level="s.riskLevel" />
                  <v-chip size="x-small" color="error" variant="tonal" class="font-weight-black ops-mono">{{ store.riskCountsBySubsystem(s.id).n1 + store.riskCountsBySubsystem(s.id).n2 + store.riskCountsBySubsystem(s.id).n12 }} Kerawanan</v-chip>
                </div>
              </v-card>
            </div>

            <v-btn color="primary" variant="flat" class="font-weight-bold mt-2" append-icon="mdi-arrow-right" block :disabled="!subs.length" @click="infoOpen = false; onModeSelect('sld')">Buka SLD Subsistem Interaktif</v-btn>
          </div>
        </template>
      </SidePanel>
    </div>
  </div>
</template>
