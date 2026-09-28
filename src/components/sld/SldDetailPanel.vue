<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { RiskItem, SldGraph, SldSelection } from '@/types'
import RiskDetailCard from '@/components/risk/RiskDetailCard.vue'
import RiskDetailTabs from '@/components/risk/RiskDetailTabs.vue'
import { sldStatusColor, sldStatusLabel, voltageHex } from '@/composables/useRiskStyle'

/** Panel kanan SLD: tab "Detail Objek" (objek terpilih) dan "Kerawanan" (daftar pin pada sudut pandang ini). */
const props = defineProps<{
  graph: SldGraph | undefined
  selection: SldSelection
  risks: RiskItem[]
}>()
const emit = defineEmits<{ selectRisk: [risk: RiskItem]; close: []; selectAsset: [code: string] }>()

const tab = ref<'detail' | 'risk'>('detail')
watch(
  () => props.selection,
  (s) => {
    if (s) tab.value = 'detail'
  },
)

const search = ref('')
const filteredRisks = computed(() =>
  props.risks.filter((r) => {
    const q = search.value.toLowerCase()
    const hit = !q || r.title.toLowerCase().includes(q) || String(r.number) === q || r.condition.toLowerCase().includes(q)
    return hit
  }),
)

/** Kerawanan yang menempel pada objek terpilih. */
const risksForSelection = computed(() => {
  const s = props.selection
  if (!s || s.kind === 'risk') return []
  const code = s.kind === 'node' ? s.node.code : s.kind === 'circuit' ? s.circuit.code : s.kind === 'ibt' ? s.ibt.code : s.bay.code
  return props.risks.filter((r) => r.attach?.code === code)
})

const nodeName = (code: string) => props.graph?.nodes.find((n) => n.code === code)?.name ?? code
const pct = (n?: number) => (n == null ? '-' : `${n}%`)
</script>

<template>
  <div class="d-flex flex-column h-100">
    <v-tabs v-model="tab" color="primary" density="compact" class="border-b flex-shrink-0">
      <v-tab value="detail" class="font-weight-bold text-caption">Detail Objek</v-tab>
      <v-tab value="risk" class="font-weight-bold text-caption">Kerawanan <v-chip size="x-small" class="ml-1 font-weight-black" color="error" variant="tonal">{{ risks.length }}</v-chip></v-tab>
      <v-spacer />
      <v-btn icon="mdi-close" size="small" variant="text" class="align-self-center mr-1" title="Tutup panel" @click="emit('close')" />
    </v-tabs>

    <v-window v-model="tab" class="flex-grow-1 ops-scroll">
      <!-- DETAIL OBJEK -->
      <v-window-item value="detail" class="pa-4">
        <div v-if="!selection" class="text-caption text-medium-emphasis">Klik busbar, penghantar, bay, IBT, atau titik kerawanan pada gambar.</div>

        <template v-else-if="selection.kind === 'node'">
          <div class="text-subtitle-1 font-weight-black">{{ selection.node.name }}</div>
          <div class="d-flex flex-wrap ga-1 my-2">
            <v-chip size="x-small" variant="outlined" class="ops-mono">{{ selection.node.code }}</v-chip>
            <v-chip size="x-small" variant="tonal">{{ selection.node.type }}</v-chip>
            <v-chip size="x-small" variant="flat" :style="{ background: voltageHex(selection.node.voltageKv), color: '#fff' }">{{ selection.node.voltageKv }} kV</v-chip>
            <v-chip size="x-small" :color="sldStatusColor(selection.node.status)" variant="tonal">{{ sldStatusLabel[selection.node.status] }}</v-chip>
          </div>
          <v-table density="compact" class="text-caption">
            <tbody>
              <tr><td class="text-medium-emphasis">Peran</td><td class="font-weight-bold">{{ selection.node.role }}</td></tr>
              <tr><td class="text-medium-emphasis">Tier (proyeksi ini)</td><td class="font-weight-bold">{{ selection.node.tier === 0 ? 'Sumber 500 kV' : 'Tier-' + selection.node.tier }}</td></tr>
              <tr v-if="selection.node.busbarConfig"><td class="text-medium-emphasis">Konfigurasi busbar</td><td>{{ selection.node.busbarConfig }}</td></tr>
              <tr v-if="selection.node.transformers"><td class="text-medium-emphasis">Trafo</td><td>{{ selection.node.transformers }} unit {{ selection.node.voltageKv === 500 ? 'IBT 500/150 kV' : 'trafo 150/20 kV' }}</td></tr>
              <tr v-if="selection.node.capacitors"><td class="text-medium-emphasis">Kompensator</td><td>{{ selection.node.capacitors }} shunt capacitor</td></tr>
              <tr v-if="selection.node.busbarNote"><td class="text-medium-emphasis">Catatan busbar</td><td>{{ selection.node.busbarNote }}</td></tr>
              <tr v-if="selection.node.note"><td class="text-medium-emphasis">Catatan</td><td>{{ selection.node.note }}</td></tr>
            </tbody>
          </v-table>
        </template>

        <template v-else-if="selection.kind === 'circuit'">
          <div class="text-subtitle-1 font-weight-black">{{ selection.circuit.name }}</div>
          <div class="d-flex flex-wrap ga-1 my-2">
            <v-chip size="x-small" variant="outlined" class="ops-mono">{{ selection.circuit.code }}</v-chip>
            <v-chip size="x-small" variant="tonal">{{ selection.circuit.type }}</v-chip>
            <v-chip size="x-small" variant="flat" :style="{ background: voltageHex(selection.circuit.voltageKv), color: '#fff' }">{{ selection.circuit.voltageKv }} kV</v-chip>
            <v-chip size="x-small" :color="sldStatusColor(selection.circuit.status)" variant="tonal">{{ sldStatusLabel[selection.circuit.status] }}</v-chip>
          </div>
          <v-table density="compact" class="text-caption">
            <tbody>
              <tr><td class="text-medium-emphasis">Dari</td><td class="font-weight-bold">{{ nodeName(selection.circuit.from) }}</td></tr>
              <tr><td class="text-medium-emphasis">Ke</td><td class="font-weight-bold">{{ nodeName(selection.circuit.to) }}</td></tr>
              <tr><td class="text-medium-emphasis">Jumlah sirkit</td><td>{{ selection.circuit.circuitCount }}</td></tr>
              <tr v-if="selection.circuit.lengthKm"><td class="text-medium-emphasis">Panjang</td><td>{{ selection.circuit.lengthKm }} km</td></tr>
              <tr><td class="text-medium-emphasis">Pembebanan</td><td>
                <div class="d-flex align-center ga-2">
                  <v-progress-linear :model-value="selection.circuit.loadingPct ?? 0" :color="(selection.circuit.loadingPct ?? 0) > 70 ? 'error' : 'primary'" height="6" rounded style="width: 120px" />
                  <span class="ops-mono font-weight-bold">{{ pct(selection.circuit.loadingPct) }}</span>
                </div>
              </td></tr>
              <tr v-if="selection.circuit.note"><td class="text-medium-emphasis">Catatan</td><td>{{ selection.circuit.note }}</td></tr>
            </tbody>
          </v-table>
        </template>

        <template v-else-if="selection.kind === 'ibt'">
          <div class="text-subtitle-1 font-weight-black">{{ selection.ibt.name }}</div>
          <div class="d-flex flex-wrap ga-1 my-2">
            <v-chip size="x-small" variant="outlined" class="ops-mono">{{ selection.ibt.code }}</v-chip>
            <v-chip size="x-small" variant="tonal">IBT_LINK</v-chip>
            <v-chip size="x-small" :color="sldStatusColor(selection.ibt.status)" variant="tonal">{{ sldStatusLabel[selection.ibt.status] }}</v-chip>
          </div>
          <v-table density="compact" class="text-caption">
            <tbody>
              <tr><td class="text-medium-emphasis">Sisi 500 kV</td><td class="font-weight-bold">{{ nodeName(selection.ibt.from) }}</td></tr>
              <tr><td class="text-medium-emphasis">Sisi 150 kV</td><td class="font-weight-bold">{{ nodeName(selection.ibt.to) }}</td></tr>
              <tr><td class="text-medium-emphasis">Kapasitas</td><td>{{ selection.ibt.capacityMVA }} MVA</td></tr>
              <tr><td class="text-medium-emphasis">Pembebanan</td><td>
                <div class="d-flex align-center ga-2">
                  <v-progress-linear :model-value="selection.ibt.loadingPct" :color="selection.ibt.loadingPct > 70 ? 'error' : 'primary'" height="6" rounded style="width: 120px" />
                  <span class="ops-mono font-weight-bold">{{ selection.ibt.loadingPct }}%</span>
                </div>
              </td></tr>
            </tbody>
          </v-table>
        </template>

        <template v-else-if="selection.kind === 'bay'">
          <div class="text-subtitle-1 font-weight-black">{{ selection.bay.name }}</div>
          <div class="d-flex flex-wrap ga-1 my-2">
            <v-chip size="x-small" variant="outlined" class="ops-mono">{{ selection.bay.code }}</v-chip>
            <v-chip size="x-small" variant="tonal">BAY</v-chip>
            <v-chip size="x-small" :color="sldStatusColor(selection.bay.status)" variant="tonal">{{ sldStatusLabel[selection.bay.status] }}</v-chip>
          </div>
          <v-table density="compact" class="text-caption">
            <tbody>
              <tr><td class="text-medium-emphasis">Digambar sebagai</td><td>bay / spur pada sudut pandang ini</td></tr>
              <tr><td class="text-medium-emphasis">Bus induk</td><td class="font-weight-bold">{{ nodeName(selection.bay.busCode) }}</td></tr>
              <tr><td class="text-medium-emphasis">Jumlah sirkit</td><td>{{ selection.bay.circuitCount }}</td></tr>
              <tr v-if="selection.bay.note"><td class="text-medium-emphasis">Catatan</td><td>{{ selection.bay.note }}</td></tr>
            </tbody>
          </v-table>
        </template>

        <RiskDetailTabs v-else-if="selection.kind === 'risk'" :risk="selection.risk" @select-asset="emit('selectAsset', $event)" />

        <div v-if="risksForSelection.length" class="mt-4">
          <div class="text-caption font-weight-black text-medium-emphasis text-uppercase mb-2" style="letter-spacing: 0.08em">Kerawanan pada objek ini</div>
          <RiskDetailCard v-for="r in risksForSelection" :key="r.id" :risk="r" class="mb-2" @select="emit('selectRisk', $event)" />
        </div>
      </v-window-item>

      <!-- KERAWANAN -->
      <v-window-item value="risk" class="pa-3">
        <v-text-field v-model="search" placeholder="Cari nomor, judul, atau objek..." prepend-inner-icon="mdi-magnify" class="mb-2" clearable />
        <div class="d-flex flex-column ga-2">
          <RiskDetailCard
            v-for="r in filteredRisks"
            :key="r.id"
            :risk="r"
            :active="selection?.kind === 'risk' && selection.risk.id === r.id"
            :muted="!r.attach"
            @select="emit('selectRisk', $event)"
          />
          <div v-if="!filteredRisks.length" class="text-caption text-medium-emphasis text-center py-6">Tidak ada kerawanan pada sudut pandang ini.</div>
        </div>
      </v-window-item>
    </v-window>
  </div>
</template>
