<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOpsysStore } from '@/stores/opsys'
import type { RiskItem, SldSelection } from '@/types'
import PageBanner from '@/components/common/PageBanner.vue'
import ViewModeBar, { type ViewModeItem } from '@/components/common/ViewModeBar.vue'
import SidePanel from '@/components/common/SidePanel.vue'
import InfoTab from '@/components/common/InfoTab.vue'
import RiskLevelChip from '@/components/common/RiskLevelChip.vue'
import RiskTable from '@/components/risk/RiskTable.vue'
import SldCanvas from '@/components/sld/SldCanvas.vue'
import SldDetailPanel from '@/components/sld/SldDetailPanel.vue'
import SldLayerPanel, { type SldLayers } from '@/components/sld/SldLayerPanel.vue'
import { findSldSelectionByCode } from '@/composables/useSldLayout'

/** Level 4 — Subsistem: SLD per sudut pandang (tampilan engine MANTAPS) | List Kerawanan. */
const route = useRoute()
const router = useRouter()
const store = useOpsysStore()

const systemId = computed(() => route.params.systemId as string)
const upbId = computed(() => route.params.upbId as string)
const subsystemId = computed(() => route.params.subsystemId as string)
const upb = computed(() => store.upbById(upbId.value))
const sub = computed(() => store.subsystemById(subsystemId.value))
const subs = computed(() => store.subsystemsByUpb(upbId.value))
const risks = computed(() => store.risksBySubsystem(subsystemId.value))

type Mode = 'sld' | 'list'
const mode = computed<Mode>(() => (route.query.mode === 'list' ? 'list' : 'sld'))
const setMode = (m: string) => router.replace({ query: { ...route.query, mode: m } })
const infoOpen = ref(false)

const modeItems = computed<ViewModeItem[]>(() => [
  { value: 'maps', label: 'Maps', icon: 'mdi-map-outline', navigate: true },
  { value: 'sld', label: 'SLD', icon: 'mdi-sitemap-outline' },
  { value: 'list', label: 'List Kerawanan', icon: 'mdi-filter-variant', iconColor: 'error', badge: risks.value.length },
])
const onModeSelect = (v: string) => v === 'maps' && router.push({ name: 'upb', params: { systemId: systemId.value, upbId: upbId.value } })
const goSubsystem = (id: string) => router.push({ name: 'subsystem', params: { systemId: systemId.value, upbId: upbId.value, subsystemId: id } })

// ---------- sudut pandang / graph ----------
const graphs = computed(() => store.graphsBySubsystem(subsystemId.value))
const viewId = computed(() => (typeof route.query.view === 'string' && graphs.value.some((g) => g.id === route.query.view) ? route.query.view : graphs.value[0]?.id))
const setView = (id: string) => router.replace({ query: { ...route.query, view: id, risk: undefined } })
const graph = computed(() => (viewId.value ? store.graphById(viewId.value) : undefined))
const viewRisks = computed(() => (viewId.value ? store.risksByView(viewId.value) : []))
const printPage = () => window.print()

const selection = ref<SldSelection>(null)
const layers = ref<SldLayers>({ tier: true, risk: true, labels: true })
const canvas = ref<InstanceType<typeof SldCanvas>>()
const detailOpen = ref(true)

function selectRisk(r: RiskItem) {
  if (r.viewId && r.viewId !== viewId.value) {
    router.replace({ query: { ...route.query, view: r.viewId, risk: r.number } })
    return
  }
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
  () => [viewId.value, route.query.risk, mode.value],
  ([, n, m]) => {
    selection.value = null
    if (m === 'sld' && n) {
      const r = store.riskByNumber(Number(n))
      if (r) setTimeout(() => selectRisk(r), 120)
    }
  },
  { immediate: true },
)
function openRiskInSld(r: RiskItem) {
  router.replace({ query: { mode: 'sld', view: r.viewId, risk: r.number } })
}

// validasi proyeksi (ringkas, meniru panel engine)
const stats = computed(() => {
  const nodes = graph.value?.nodes ?? []
  return {
    total: nodes.length,
    tier1: nodes.filter((n) => n.tier === 1).length,
    source500: nodes.filter((n) => n.tier === 0).length,
    boundary: nodes.filter((n) => n.role === 'BOUNDARY').length,
    circuits: graph.value?.circuits.length ?? 0,
  }
})
</script>

<template>
  <div v-if="sub && upb" class="d-flex flex-column overflow-hidden">
    <PageBanner step="3" :title="`${upb.name} — ${sub.name}`" subtitle="Single Line Diagram (SLD) subsistem interkoneksi tegangan tinggi — Tier per sudut pandang · overlay kerawanan" :back-to="{ name: 'system', params: { systemId } }" back-label="Kembali ke Sistem">
      <v-btn v-if="mode === 'sld'" variant="outlined" color="grey-darken-1" size="small" prepend-icon="mdi-printer-outline" class="bg-surface" @click="printPage">Cetak A4</v-btn>
    </PageBanner>

    <ViewModeBar :items="modeItems" :model-value="mode" @update:model-value="setMode" @select="onModeSelect">
      <template #extra>
        <v-btn v-if="mode === 'list'" size="small" :variant="infoOpen ? 'flat' : 'text'" :color="infoOpen ? 'primary' : 'grey-darken-2'" class="font-weight-bold" prepend-icon="mdi-information-outline" @click="infoOpen = true">Info Subsistem</v-btn>
      </template>
      <template #right>
        <span>{{ sub.code }}</span><span>•</span><span>Beban: {{ sub.peakLoadMW }} MW</span><span>•</span><span>{{ sub.sourceRef }}</span>
      </template>
    </ViewModeBar>

    <div class="flex-grow-1 d-flex overflow-hidden position-relative" style="min-height: 0">
      <!-- Kiri: pilih subsistem + sudut pandang + layer -->
      <aside v-if="mode === 'sld'" class="bg-surface border-e flex-shrink-0 ops-scroll d-flex flex-column" style="width: 270px">
        <div class="pa-4 border-b">
          <div class="text-caption font-weight-black text-primary text-uppercase ops-mono mb-2" style="letter-spacing: 0.08em">{{ upb.name }}</div>
          <v-list density="compact" class="py-0" nav>
            <template v-for="s in subs" :key="s.id">
              <v-list-item :active="s.id === subsystemId" color="primary" rounded="lg" class="border" :class="s.id === subsystemId ? 'border-primary' : 'border-opacity-0'" style="--v-list-prepend-gap: 8px" @click="goSubsystem(s.id)">
                <v-list-item-title class="text-caption font-weight-bold text-wrap" style="line-height: 1.25">{{ s.name.replace('Subsistem ', 'SS ') }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption" style="font-size: 10px">{{ s.views.length ? s.giCount + ' GI · ' + s.ibtCount + ' IBT' : 'SLD belum tersedia' }}</v-list-item-subtitle>
              </v-list-item>
              <!-- Sudut pandang hanya ditampilkan bila subsistem digambar lebih dari satu halaman -->
              <div v-if="s.id === subsystemId && s.views.length > 1" class="pl-6 pr-1 py-1 d-flex flex-column ga-1">
                <v-sheet v-for="v in s.views" :key="v.id" class="rounded-lg border pa-2 cursor-pointer" :class="v.id === viewId ? 'bg-blue-lighten-5 border-primary' : 'bg-surface-light'" style="cursor: pointer" @click="setView(v.id)">
                  <div class="text-caption font-weight-bold">{{ v.name }}</div>
                  <div class="text-caption text-medium-emphasis" style="font-size: 10px">sudut pandang</div>
                </v-sheet>
              </div>
            </template>
          </v-list>
        </div>
        <div class="pa-4 border-b">
          <SldLayerPanel v-model="layers" :risk-count="viewRisks.length" />
        </div>
        <div class="pa-4">
          <div class="text-caption font-weight-black text-medium-emphasis text-uppercase mb-1" style="letter-spacing: 0.08em">Validasi Proyeksi</div>
          <div class="text-caption d-flex justify-space-between py-1 border-b"><span>GI ber-Tier</span><b class="text-success ops-mono">{{ stats.total }} / {{ stats.total }}</b></div>
          <div class="text-caption d-flex justify-space-between py-1 border-b"><span>Sumber (Tier-1)</span><b class="text-success ops-mono">{{ stats.tier1 }}</b></div>
          <div class="text-caption d-flex justify-space-between py-1 border-b"><span>Bus 500 kV</span><b class="ops-mono">{{ stats.source500 }}</b></div>
          <div class="text-caption d-flex justify-space-between py-1 border-b"><span>GI batas (boundary)</span><b class="ops-mono">{{ stats.boundary }}</b></div>
          <div class="text-caption d-flex justify-space-between py-1"><span>Penghantar</span><b class="ops-mono">{{ stats.circuits }}</b></div>
        </div>
      </aside>

      <!-- Kanvas -->
      <div class="flex-grow-1 position-relative overflow-hidden d-flex flex-column" style="min-width: 0">
        <template v-if="mode === 'sld'">
          <!-- Tab sudut pandang -->
          <div class="bg-surface border-b px-4 py-2 d-flex align-center justify-space-between flex-shrink-0">
            <div class="d-flex align-center ga-2">
              <!-- Tab hanya perlu bila ada lebih dari satu gambar -->
              <template v-if="graphs.length > 1">
                <v-btn v-for="g in graphs" :key="g.id" size="small" :variant="g.id === viewId ? 'flat' : 'text'" :color="g.id === viewId ? 'primary' : 'grey-darken-2'" class="font-weight-bold" @click="setView(g.id)">{{ g.viewName }}</v-btn>
              </template>
              <span v-else-if="graph" class="text-body-2 font-weight-bold">{{ graph.title }}</span>
              <span v-if="!graphs.length" class="text-caption text-medium-emphasis">Belum ada gambar SLD untuk subsistem ini.</span>
            </div>
            <div class="d-flex align-center ga-2 text-caption text-medium-emphasis">
              <v-chip size="x-small" variant="outlined" class="ops-mono">{{ graph?.ruleProfile ?? '-' }}</v-chip>
              <v-chip size="x-small" variant="tonal" color="success" prepend-icon="mdi-check-circle-outline">Versi topologi AKTIF</v-chip>
            </div>
          </div>

          <div class="flex-grow-1 position-relative" style="min-height: 0">
            <SldCanvas v-if="graph" ref="canvas" v-model:selection="selection" :graph="graph" :risks="viewRisks" :layers="layers" />
            <v-empty-state v-else icon="mdi-sitemap-outline" title="SLD belum tersedia" text="Subsistem ini belum memiliki gambar SLD pada prototipe. Pilih subsistem lain di panel kiri." class="h-100" />
            <v-btn v-if="graph && !detailOpen" class="position-absolute" style="right: 12px; top: 12px" size="small" color="primary" variant="flat" prepend-icon="mdi-dock-right" @click="detailOpen = true">Panel Detail</v-btn>
          </div>
        </template>

        <template v-else>
          <RiskTable :risks="risks" :caption="`Tabel Kerawanan ${sub.name}`" @open-sld="openRiskInSld" @close="setMode('sld')" />
          <InfoTab label="INFO SUBSISTEM" @click="infoOpen = true" />
        </template>
      </div>

      <!-- Kanan: detail objek / kerawanan -->
      <aside v-if="mode === 'sld' && graph && detailOpen" class="bg-surface border-s flex-shrink-0" style="width: 400px">
        <SldDetailPanel :graph="graph" :selection="selection" :risks="viewRisks" @select-risk="selectRisk" @select-asset="selectAsset" @close="detailOpen = false" />
      </aside>

      <!-- Drawer info subsistem (mode list) -->
      <SidePanel v-if="mode === 'list'" v-model="infoOpen" overlay :width="440">
        <div class="pa-5 d-flex flex-column ga-4">
          <div class="d-flex align-start justify-space-between border-b pb-3">
            <div>
              <div class="text-caption font-weight-black text-primary text-uppercase ops-mono" style="letter-spacing: 0.08em">Informasi Subsistem</div>
              <div class="text-h6 font-weight-black" style="line-height: 1.2">{{ sub.name }}</div>
              <p class="text-caption text-medium-emphasis mt-1">{{ sub.description }}</p>
            </div>
            <v-btn icon="mdi-close" size="small" variant="text" @click="infoOpen = false" />
          </div>
          <v-sheet class="rounded-lg border pa-3 bg-surface-light text-caption">
            <div class="d-flex justify-space-between py-1 border-b"><span class="text-medium-emphasis">Kode:</span><b class="ops-mono">{{ sub.code }}</b></div>
            <div class="d-flex justify-space-between py-1 border-b"><span class="text-medium-emphasis">UP2B:</span><b>{{ upb.name }}</b></div>
            <div class="d-flex justify-space-between py-1 border-b"><span class="text-medium-emphasis">Jumlah GI · IBT:</span><b class="ops-mono text-primary">{{ sub.giCount }} · {{ sub.ibtCount }}</b></div>
            <div class="d-flex justify-space-between py-1 border-b"><span class="text-medium-emphasis">Beban Puncak:</span><b class="ops-mono">{{ sub.peakLoadMW }} MW</b></div>
            <div class="d-flex justify-space-between py-1 align-center"><span class="text-medium-emphasis">Tingkat:</span><RiskLevelChip :level="sub.riskLevel" /></div>
          </v-sheet>
          <v-btn color="primary" variant="flat" class="font-weight-bold" append-icon="mdi-arrow-right" block @click="infoOpen = false; setMode('sld')">Buka SLD Subsistem</v-btn>
        </div>
      </SidePanel>
    </div>

  </div>
</template>
