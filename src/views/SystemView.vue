<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOpsysStore } from '@/stores/opsys'
import type { RiskItem, SldSelection } from '@/types'
import PageBanner from '@/components/common/PageBanner.vue'
import ViewModeBar, { type ViewModeItem } from '@/components/common/ViewModeBar.vue'
import SidePanel from '@/components/common/SidePanel.vue'
import InfoTab from '@/components/common/InfoTab.vue'
import RiskCountChips from '@/components/common/RiskCountChips.vue'
import BaseMap, { type MapMarker } from '@/components/map/BaseMap.vue'
import RiskTable from '@/components/risk/RiskTable.vue'
import SldCanvas from '@/components/sld/SldCanvas.vue'
import SldDetailPanel from '@/components/sld/SldDetailPanel.vue'
import SldLayerPanel, { type SldLayers } from '@/components/sld/SldLayerPanel.vue'
import { findSldSelectionByCode } from '@/composables/useSldLayout'

/** Level 2 — Sistem (JAMALI): peta UP2B | SLD 500 kV | List Kerawanan. */
const route = useRoute()
const router = useRouter()
const store = useOpsysStore()

const systemId = computed(() => route.params.systemId as string)
const system = computed(() => store.systemById(systemId.value))
const upbList = computed(() => store.upbsBySystem(systemId.value))
const risks = computed(() => store.risksBySystem(systemId.value))
const totalRisks = computed(() => risks.value.length)

type Mode = 'maps' | 'sld' | 'list'
const mode = computed<Mode>(() => (['maps', 'sld', 'list'].includes(String(route.query.mode)) ? (route.query.mode as Mode) : 'maps'))
const setMode = (m: string) => router.replace({ query: { ...route.query, mode: m } })
const infoOpen = ref(false)
const printPage = () => window.print()

const modeItems = computed<ViewModeItem[]>(() => [
  { value: 'maps', label: 'Maps', icon: 'mdi-map-outline' },
  { value: 'sld', label: 'SLD 500 kV', icon: 'mdi-sitemap-outline', iconColor: 'primary' },
  { value: 'list', label: 'List Kerawanan', icon: 'mdi-filter-variant', iconColor: 'error', badge: totalRisks.value },
])

// ---------- peta ----------
const markers = computed<MapMarker[]>(() =>
  upbList.value.map((u) => {
    const uc = store.riskCountsByUpb(u.id)
    const total = uc.n1 + uc.n2 + uc.n12
    return {
      id: u.id,
      lat: u.lat,
      lng: u.lng,
      html: `
      <div class="ops-pin-card">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="width:24px;height:24px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:#eff6ff;color:#0046ad;border:1px solid #dbeafe">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>
          </span>
          <div>
            <div style="font-weight:700">${u.name}</div>
            <div style="font-size:10px;color:#64748b">${u.subsystemCount} Subsistem</div>
          </div>
        </div>
        <div style="margin-top:6px;padding-top:6px;border-top:1px solid #f1f5f9;display:flex;justify-content:space-between;gap:10px;font-size:11px">
          <span style="color:#64748b">Total Kerawanan:</span>
          <span style="padding:1px 8px;border-radius:6px;background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;font-weight:800">${total} Kerawanan</span>
        </div>
      </div>`,
    }
  }),
)
/**
 * Klik UP2B langsung membuka SLD subsistem pertama yang punya gambar —
 * SLD lebih prioritas daripada peta wilayah UP2B. Peta UP2B tetap bisa dibuka
 * lewat tombol "Maps" pada halaman subsistem atau breadcrumb.
 */
function goUpb(upbId: string) {
  const withSld = store.subsystemsByUpb(upbId).find((s) => store.graphsBySubsystem(s.id).length)
  if (withSld) router.push({ name: 'subsystem', params: { systemId: systemId.value, upbId, subsystemId: withSld.id } })
  else router.push({ name: 'upb', params: { systemId: systemId.value, upbId } })
}

// ---------- SLD 500 kV ----------
const graph = computed(() => store.graphById('backbone-500'))
const sldRisks = computed(() => store.risksByView('backbone-500'))
const selection = ref<SldSelection>(null)
const layers = ref<SldLayers>({ tier: true, risk: true, labels: true })
const canvas = ref<InstanceType<typeof SldCanvas>>()
const detailOpen = ref(true)

function selectRisk(r: RiskItem) {
  selection.value = { kind: 'risk', risk: r }
  detailOpen.value = true
  canvas.value?.focusRisk(r.number)
}
function selectAsset(code: string) {
  const found = findSldSelectionByCode(graph.value, code)
  if (found) {
    selection.value = found
    canvas.value?.focusSelection(found)
  }
}
watch(
  () => [mode.value, route.query.risk],
  ([m, n]) => {
    if (m === 'sld' && n) {
      const r = store.riskByNumber(Number(n))
      if (r) setTimeout(() => selectRisk(r), 100)
    }
  },
  { immediate: true },
)

function openRiskInSld(r: RiskItem) {
  if (r.subsystemId && r.upbId) router.push({ name: 'subsystem', params: { systemId: systemId.value, upbId: r.upbId, subsystemId: r.subsystemId }, query: { view: r.viewId, risk: r.number } })
  else router.replace({ query: { mode: 'sld', risk: r.number } })
}

const sum500 = computed(() => risks.value.filter((r) => r.voltage.startsWith('500')))
const sumIbt = computed(() => risks.value.filter((r) => r.assetType === 'IBT'))
const countBy = (list: RiskItem[]) => ({ n1: list.filter((r) => r.category === 'N-1').length, n2: list.filter((r) => r.category === 'N-2').length, n12: list.filter((r) => r.category === 'N-1-2').length })
</script>

<template>
  <div v-if="system" class="d-flex flex-column overflow-hidden">
    <PageBanner step="2" :title="`Sistem ${system.name}`" subtitle="Unit Induk Pusat Pengatur Beban (UIP2B) Jawa, Madura dan Bali" :back-to="{ name: 'national' }" back-label="Kembali ke Peta Nasional" />

    <ViewModeBar :items="modeItems" :model-value="mode" @update:model-value="setMode">
      <template #extra>
        <v-btn v-if="mode === 'list'" size="small" :variant="infoOpen ? 'flat' : 'text'" :color="infoOpen ? 'primary' : 'grey-darken-2'" class="font-weight-bold" prepend-icon="mdi-information-outline" @click="infoOpen = true">Info Sistem</v-btn>
        <v-btn v-if="mode === 'sld'" size="small" variant="text" color="grey-darken-2" class="font-weight-bold" prepend-icon="mdi-printer-outline" @click="printPage">Cetak A4</v-btn>
        <v-divider vertical class="mx-1" />
        <v-btn size="small" variant="text" color="grey-darken-2" class="font-weight-bold" prepend-icon="mdi-transformer" :to="{ name: 'ibt-list', params: { systemId } }">Daftar IBT</v-btn>
      </template>
      <template #right>
        <span>Tegangan Backbone: 500 kV</span><span>•</span><span>Interkoneksi: 150 kV</span>
      </template>
    </ViewModeBar>

    <div class="flex-grow-1 d-flex overflow-hidden position-relative" style="min-height: 0">
      <!-- Kolom kiri: layer (mode SLD) -->
      <aside v-if="mode === 'sld'" class="bg-surface border-e pa-4 flex-shrink-0 ops-scroll" style="width: 240px">
        <SldLayerPanel v-model="layers" :risk-count="sldRisks.length" />
      </aside>

      <!-- Kanvas -->
      <div class="flex-grow-1 position-relative overflow-hidden" style="min-width: 0">
        <template v-if="mode === 'maps'">
          <BaseMap :center="[-7.3, 110.3]" :zoom="7" :min-zoom="6" :markers="markers" @select="goUpb" />
        </template>

        <template v-else-if="mode === 'sld'">
          <SldCanvas ref="canvas" v-model:selection="selection" :graph="graph" :risks="sldRisks" :layers="layers" />
          <v-btn v-if="!detailOpen" class="position-absolute" style="right: 12px; top: 12px" size="small" color="primary" variant="flat" prepend-icon="mdi-dock-right" @click="detailOpen = true">Panel Detail</v-btn>
        </template>

        <template v-else>
          <RiskTable :risks="risks" caption="Tabel 2.1: Kerawanan Sistem & Subsistem Transmisi (SLD 500 kV & IBT)" @open-sld="openRiskInSld" @close="setMode('maps')" />
          <InfoTab label="INFO SISTEM" @click="infoOpen = true" />
        </template>
      </div>

      <!-- Panel kanan: detail SLD -->
      <aside v-if="mode === 'sld' && detailOpen" class="bg-surface border-s flex-shrink-0" style="width: 400px">
        <SldDetailPanel :graph="graph" :selection="selection" :risks="sldRisks" @select-risk="selectRisk" @select-asset="selectAsset" @close="detailOpen = false" />
      </aside>

      <!-- Panel kanan: info sistem (statis di maps, drawer di list) -->
      <SidePanel v-if="mode !== 'sld'" v-model="infoOpen" :overlay="mode === 'list'" :width="mode === 'list' ? 440 : 400">
        <template #default="{ isOverlay }">
          <div class="pa-5 d-flex flex-column ga-4">
            <div class="d-flex align-start justify-space-between border-b pb-3">
              <div>
                <div class="text-caption font-weight-black text-primary text-uppercase ops-mono" style="letter-spacing: 0.08em">Informasi Sistem</div>
                <div class="text-h6 font-weight-black" style="line-height: 1.2">{{ system.name }}</div>
                <p class="text-caption text-medium-emphasis mt-1">{{ system.description }}</p>
              </div>
              <v-btn v-if="isOverlay" icon="mdi-close" size="small" variant="text" @click="infoOpen = false" />
            </div>

            <v-sheet class="rounded-lg border pa-3 bg-surface-light text-caption">
              <div class="d-flex justify-space-between py-1 border-b"><span class="text-medium-emphasis">Jumlah UP2B:</span><b class="ops-mono">{{ upbList.length }} Unit</b></div>
              <div class="d-flex justify-space-between py-1 border-b"><span class="text-medium-emphasis">Jumlah Subsistem:</span><b class="ops-mono">{{ system.subsystemCount }} Subsistem</b></div>
              <div class="d-flex justify-space-between py-1"><span class="text-medium-emphasis">GI / GITET · IBT:</span><b class="ops-mono">{{ system.giCount }} · {{ system.ibtCount }}</b></div>
            </v-sheet>

            <v-card class="rounded-lg border pa-3">
              <div class="text-caption font-weight-black text-uppercase mb-2" style="letter-spacing: 0.06em">Total Kerawanan 500 kV & IBT 500/150:</div>
              <v-row density="compact">
                <v-col cols="6">
                  <v-sheet class="rounded-lg border pa-2" color="red-lighten-5">
                    <div class="d-flex justify-space-between align-center">
                      <div><div class="text-caption font-weight-bold text-error">Kerawanan 500 kV</div><div class="text-caption text-medium-emphasis" style="font-size: 10px">Jalur Transmisi</div></div>
                      <div class="text-h6 font-weight-black text-error ops-mono">{{ sum500.length }}</div>
                    </div>
                    <RiskCountChips :counts="countBy(sum500)" class="mt-1" />
                  </v-sheet>
                </v-col>
                <v-col cols="6">
                  <v-sheet class="rounded-lg border pa-2" color="orange-lighten-5">
                    <div class="d-flex justify-space-between align-center">
                      <div><div class="text-caption font-weight-bold text-deep-orange">Kerawanan IBT</div><div class="text-caption text-medium-emphasis" style="font-size: 10px">Trafo Interbus</div></div>
                      <div class="text-h6 font-weight-black text-deep-orange-darken-2 ops-mono">{{ sumIbt.length }}</div>
                    </div>
                    <RiskCountChips :counts="countBy(sumIbt)" class="mt-1" />
                  </v-sheet>
                </v-col>
              </v-row>
            </v-card>

            <div>
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-caption font-weight-black text-uppercase" style="letter-spacing: 0.06em">Rincian Kerawanan per UP2B:</span>
                <span class="text-caption text-disabled">{{ upbList.length }} Unit</span>
              </div>
              <v-card v-for="u in upbList" :key="u.id" class="rounded-lg border pa-3 mb-2 bg-surface-light" hover @click="infoOpen = false; goUpb(u.id)">
                <div class="d-flex align-center ga-1 text-body-2 font-weight-bold"><v-icon icon="mdi-map-marker" size="14" color="primary" />{{ u.name }}</div>
                <div class="text-caption text-medium-emphasis ops-mono">{{ u.subsystemCount }} Subsistem • {{ u.region }}</div>
                <div class="d-flex justify-space-between align-center pt-2 mt-2 border-t">
                  <span class="text-caption text-medium-emphasis">Total Kerawanan:</span>
                  <v-chip size="x-small" color="error" variant="tonal" class="font-weight-black ops-mono">{{ store.riskCountsByUpb(u.id).n1 + store.riskCountsByUpb(u.id).n2 + store.riskCountsByUpb(u.id).n12 }} Kerawanan</v-chip>
                </div>
              </v-card>
            </div>

            <v-card class="rounded-lg border pa-3" color="amber-lighten-5" hover @click="infoOpen = false; setMode('list')">
              <div class="d-flex align-center justify-space-between text-body-2 font-weight-bold text-amber-darken-4">
                <span class="d-flex align-center ga-2"><v-icon icon="mdi-shield-alert-outline" size="18" />Titik Kritis Utama: Kerawanan #1</span>
                <v-icon icon="mdi-arrow-right" size="16" />
              </div>
              <p class="text-caption mt-1">Pembebanan IBT-1,2 Kembangan tidak memenuhi N-1 saat PLTU Lontar -1 unit; potensi pemadaman SS Lontar-Balaraja-Kembangan.</p>
            </v-card>

            <div class="d-flex flex-column ga-2 pt-3 border-t">
              <v-btn color="primary" variant="flat" class="font-weight-bold" prepend-icon="mdi-sitemap-outline" append-icon="mdi-arrow-right" block @click="infoOpen = false; setMode('sld')">Lihat SLD 500 kV Interaktif</v-btn>
              <v-btn variant="outlined" color="grey-darken-2" class="font-weight-bold" prepend-icon="mdi-transformer" block :to="{ name: 'ibt-list', params: { systemId } }">Lihat Daftar IBT</v-btn>
            </div>
          </div>
        </template>
      </SidePanel>
    </div>
  </div>
</template>
