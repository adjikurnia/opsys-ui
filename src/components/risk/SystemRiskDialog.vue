<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useOpsysStore } from '@/stores/opsys'
import type { RiskItem, RiskLevel } from '@/types'
import { categoryColor, levelColor } from '@/composables/useRiskStyle'

/** Dialog global "Matriks Kerawanan": daftar seluruh kerawanan + filter tingkat, klik → buka di SLD. */
const store = useOpsysStore()
const router = useRouter()

const search = ref('')
const level = ref<'Semua' | RiskLevel>('Semua')
const levels: ('Semua' | RiskLevel)[] = ['Semua', 'Sangat Rawan', 'Rawan', 'Sedang', 'Aman']

const filtered = computed(() =>
  store.allRisks.filter((r) => {
    const q = search.value.toLowerCase()
    const hit = !q || r.title.toLowerCase().includes(q) || String(r.number) === q || r.condition.toLowerCase().includes(q)
    return hit && (level.value === 'Semua' || r.riskLevel === level.value)
  }),
)

function openInSld(r: RiskItem) {
  store.riskDialogOpen = false
  if (r.subsystemId && r.upbId) {
    router.push({ name: 'subsystem', params: { systemId: r.systemId, upbId: r.upbId, subsystemId: r.subsystemId }, query: { view: r.viewId, risk: r.number } })
  } else {
    router.push({ name: 'system', params: { systemId: r.systemId }, query: { mode: 'sld', risk: r.number } })
  }
}
</script>

<template>
  <v-dialog v-model="store.riskDialogOpen" max-width="960" scrollable>
    <v-card class="rounded-xl">
      <div class="pa-4 bg-surface-light border-b d-flex align-center justify-space-between">
        <div class="d-flex align-center ga-3">
          <v-avatar rounded="lg" color="red-lighten-5" class="border">
            <v-icon icon="mdi-shield-alert-outline" color="error" />
          </v-avatar>
          <div>
            <div class="text-subtitle-1 font-weight-black">Daftar Peta Kerawanan Sistem Tenaga Listrik 2026</div>
            <div class="text-caption text-medium-emphasis">Buku Kerawanan Sistem & Subsistem Transmisi — PT PLN (Persero)</div>
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" @click="store.riskDialogOpen = false" />
      </div>

      <div class="pa-3 border-b d-flex flex-wrap align-center justify-space-between ga-2">
        <v-text-field v-model="search" placeholder="Cari nomor atau nama kerawanan..." prepend-inner-icon="mdi-magnify" style="max-width: 300px" clearable />
        <div class="d-flex align-center ga-1">
          <span class="text-caption text-medium-emphasis mr-1">Tingkat:</span>
          <v-btn v-for="l in levels" :key="l" size="small" :variant="level === l ? 'flat' : 'outlined'" :color="level === l ? 'primary' : 'grey-darken-1'" class="font-weight-bold" @click="level = l">
            {{ l }}
          </v-btn>
        </div>
      </div>

      <v-card-text class="pa-2" style="max-height: 60vh">
        <v-list lines="three" class="py-0">
          <v-list-item v-for="r in filtered" :key="r.id" class="rounded-lg mb-1 py-2" @click="openInSld(r)">
            <template #prepend>
              <v-avatar rounded="lg" :color="categoryColor(r.category)" class="text-white font-weight-black text-caption ops-mono">#{{ r.number }}</v-avatar>
            </template>
            <v-list-item-title class="font-weight-bold">{{ r.title }}</v-list-item-title>
            <div class="d-flex align-center ga-2 flex-wrap mt-2">
              <v-chip size="x-small" :color="levelColor(r.riskLevel)" variant="tonal" class="font-weight-bold" prepend-icon="mdi-circle">{{ r.riskLevel }}</v-chip>
              <v-chip size="x-small" :color="categoryColor(r.category)" variant="flat" class="font-weight-black">{{ r.category }}</v-chip>
            </div>
            <v-list-item-subtitle class="text-caption mt-2">{{ r.assetType }} {{ r.voltage }} • {{ r.location }}</v-list-item-subtitle>
            <v-list-item-subtitle class="text-caption mt-1">{{ r.condition }}</v-list-item-subtitle>
            <template #append>
              <v-btn variant="text" color="primary" size="small" class="font-weight-bold" append-icon="mdi-arrow-right">Lihat di SLD</v-btn>
            </template>
          </v-list-item>
          <div v-if="!filtered.length" class="text-center text-medium-emphasis py-8">Tidak ada kerawanan yang cocok.</div>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
