<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useOpsysStore } from '@/stores/opsys'
import PageBanner from '@/components/common/PageBanner.vue'
import RiskLevelChip from '@/components/common/RiskLevelChip.vue'

/** Daftar Interbus Transformer (IBT) 500/150 kV dalam sistem. */
const route = useRoute()
const store = useOpsysStore()

const systemId = computed(() => route.params.systemId as string)
const list = computed(() => store.ibtsBySystem(systemId.value))
const upbList = computed(() => store.upbsBySystem(systemId.value))
const search = ref('')
const upbFilter = ref<string | null>(null)
/** Opsi filter UP2B untuk combobox. */
const upbOptions = computed(() => [{ title: 'Semua UP2B', value: null }, ...upbList.value.map((u) => ({ title: u.name, value: u.id }))])

const filtered = computed(() =>
  list.value.filter((i) => (!upbFilter.value || i.upbId === upbFilter.value) && (!search.value || (i.name + i.substation).toLowerCase().includes(search.value.toLowerCase()))),
)
const headers = [
  { title: 'IBT', key: 'name' },
  { title: 'Gardu Induk', key: 'substation' },
  { title: 'UP2B', key: 'upbId' },
  { title: 'Kapasitas', key: 'capacityMVA', align: 'end' as const },
  { title: 'Tingkat', key: 'riskLevel' },
  { title: 'Status', key: 'status' },
]
const upbName = (id: string) => store.upbById(id)?.shortName ?? id
const critical = computed(() => list.value.filter((i) => i.loadingPct > 80).length)
</script>

<template>
  <div class="d-flex flex-column overflow-hidden">
    <PageBanner step="IBT" title="Daftar Interbus Transformer (IBT) 500/150 kV" subtitle="Pembebanan dan status kerawanan trafo interbus per UP2B" :back-to="{ name: 'system', params: { systemId } }" back-label="Kembali ke Sistem" />

    <div class="flex-grow-1 ops-scroll pa-6">
      <v-row density="compact" class="mb-4">
        <v-col cols="12" sm="4">
          <v-card class="rounded-xl border pa-4 d-flex align-center ga-3">
            <v-avatar rounded="lg" color="blue-lighten-5"><v-icon icon="mdi-transformer" color="primary" /></v-avatar>
            <div><div class="text-caption text-medium-emphasis">Total IBT</div><div class="text-h5 font-weight-black ops-mono">{{ list.length }}</div></div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card class="rounded-xl border pa-4 d-flex align-center ga-3">
            <v-avatar rounded="lg" color="red-lighten-5"><v-icon icon="mdi-alert-outline" color="error" /></v-avatar>
            <div><div class="text-caption text-medium-emphasis">Pembebanan &gt; 80%</div><div class="text-h5 font-weight-black ops-mono text-error">{{ critical }}</div></div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card class="rounded-xl border pa-4 d-flex align-center ga-3">
            <v-avatar rounded="lg" color="green-lighten-5"><v-icon icon="mdi-check-circle-outline" color="success" /></v-avatar>
            <div><div class="text-caption text-medium-emphasis">Beroperasi</div><div class="text-h5 font-weight-black ops-mono text-success">{{ list.filter((i) => i.status === 'Beroperasi').length }}</div></div>
          </v-card>
        </v-col>
      </v-row>

      <v-card class="rounded-xl border">
        <div class="pa-3 border-b d-flex flex-wrap align-center justify-space-between ga-2">
          <v-text-field v-model="search" placeholder="Cari IBT / gardu induk..." prepend-inner-icon="mdi-magnify" style="max-width: 300px" clearable />
          <v-select v-model="upbFilter" :items="upbOptions" label="UP2B" prepend-inner-icon="mdi-filter-variant" style="max-width: 260px" />
        </div>
        <v-data-table :headers="headers" :items="filtered" density="comfortable" items-per-page="-1" hide-default-footer>
          <template #item.name="{ item }">
            <div class="font-weight-bold text-primary">{{ item.name }}</div>
            <div class="text-caption text-medium-emphasis">{{ item.voltage }} • {{ item.units }} unit</div>
          </template>
          <template #item.upbId="{ item }"><v-chip size="x-small" variant="outlined" class="font-weight-bold">{{ upbName(item.upbId) }}</v-chip></template>
          <template #item.capacityMVA="{ item }"><span class="ops-mono font-weight-bold">{{ item.capacityMVA }} MVA</span></template>
          <template #item.riskLevel="{ item }">
            <div class="d-flex align-center ga-1">
              <RiskLevelChip :level="item.riskLevel" />
              <v-chip v-if="item.riskNumber" size="x-small" color="amber-darken-2" variant="flat" class="font-weight-black">#{{ item.riskNumber }}</v-chip>
            </div>
          </template>
          <template #item.status="{ item }"><v-chip size="x-small" :color="item.status === 'Beroperasi' ? 'success' : 'warning'" variant="tonal" class="font-weight-bold">{{ item.status }}</v-chip></template>
        </v-data-table>
      </v-card>
    </div>
  </div>
</template>
