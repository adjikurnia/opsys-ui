<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { RiskItem } from '@/types'
import { categoryColor, levelColor } from '@/composables/useRiskStyle'

/** Detail kerawanan bertab (Informasi / Kerawanan / Aset Terkait / Riwayat) — dipakai saat pin kerawanan dipilih di SLD. */
const props = defineProps<{ risk: RiskItem }>()
const emit = defineEmits<{ selectAsset: [code: string] }>()

const tab = ref<'info' | 'risk' | 'assets' | 'history'>('info')
watch(() => props.risk.id, () => (tab.value = 'info'))

const lines = (t: string) => t.split('\n').filter((l) => l.trim())
const segments = computed(() => props.risk.lineGiSegment.split('→').map((s) => s.trim()))

const assetKindLabel: Record<string, string> = { GITET: 'GITET', GI: 'GI', GIS: 'GIS', IBT: 'IBT', PEMBANGKIT: 'PLT' }
</script>

<template>
  <div>
    <!-- Header ringkas -->
    <div class="d-flex align-start ga-3 pa-3 rounded-lg bg-surface-light border mb-3">
      <v-avatar size="34" :color="categoryColor(risk.category)" class="text-white font-weight-black flex-shrink-0">{{ risk.number }}</v-avatar>
      <div class="flex-grow-1" style="min-width: 0">
        <div class="d-flex align-center ga-2 flex-wrap">
          <span class="text-caption font-weight-black text-amber-darken-4 text-uppercase ops-mono" style="letter-spacing: 0.06em">Kerawanan #{{ risk.number }}</span>
          <v-chip size="x-small" :color="levelColor(risk.riskLevel)" variant="tonal" class="font-weight-bold">{{ risk.riskLevel }}</v-chip>
        </div>
        <div class="text-body-2 font-weight-black mt-1" style="line-height: 1.3">{{ risk.title }}</div>
        <div class="text-caption text-medium-emphasis mt-1">{{ risk.assetType }} · {{ risk.voltage }} · {{ risk.location }}</div>
      </div>
    </div>

    <v-tabs v-model="tab" color="primary" density="compact" class="border-b mb-3">
      <v-tab value="info" class="text-caption font-weight-bold"><v-icon icon="mdi-information-outline" size="15" class="mr-1" />Informasi</v-tab>
      <v-tab value="risk" class="text-caption font-weight-bold"><v-icon icon="mdi-shield-alert-outline" size="15" class="mr-1" />Kerawanan</v-tab>
      <v-tab value="assets" class="text-caption font-weight-bold"><v-icon icon="mdi-layers-outline" size="15" class="mr-1" />Aset Terkait</v-tab>
      <v-tab value="history" class="text-caption font-weight-bold"><v-icon icon="mdi-history" size="15" class="mr-1" />Riwayat</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <!-- INFORMASI -->
      <v-window-item value="info">
        <v-sheet class="rounded-lg border pa-3 bg-surface-light text-caption">
          <v-row dense>
            <v-col cols="6"><div class="text-medium-emphasis" style="font-size: 10px">No. Kerawanan</div><div class="font-weight-black text-error">#{{ risk.number }}</div></v-col>
            <v-col cols="6"><div class="text-medium-emphasis" style="font-size: 10px">Tegangan Operasi</div><div class="font-weight-bold text-primary">{{ risk.voltage }}</div></v-col>
            <v-col cols="6"><div class="text-medium-emphasis" style="font-size: 10px">Dari</div><div class="font-weight-bold">{{ segments[0] ?? '-' }}</div></v-col>
            <v-col cols="6"><div class="text-medium-emphasis" style="font-size: 10px">Ke</div><div class="font-weight-bold">{{ segments[segments.length - 1] ?? '-' }}</div></v-col>
            <v-col cols="6" v-if="risk.lengthKm"><div class="text-medium-emphasis" style="font-size: 10px">Panjang Saluran</div><div class="ops-mono">{{ risk.lengthKm }} km</div></v-col>
            <v-col cols="6" v-if="risk.circuits"><div class="text-medium-emphasis" style="font-size: 10px">Jumlah Sirkit</div><div class="font-weight-bold">{{ risk.circuits }} Sirkit</div></v-col>
            <v-col cols="6"><div class="text-medium-emphasis" style="font-size: 10px">Status Operasi</div><div class="font-weight-bold text-success d-flex align-center ga-1"><span class="rounded-circle bg-success" style="width: 6px; height: 6px" />{{ risk.status }}</div></v-col>
            <v-col cols="6"><div class="text-medium-emphasis" style="font-size: 10px">Tingkat Kerawanan</div><div class="font-weight-black" :class="`text-${levelColor(risk.riskLevel)}`">{{ risk.riskLevel }}</div></v-col>
          </v-row>

          <div v-if="risk.loadingPct != null" class="border-t pt-2 mt-2">
            <div class="font-weight-bold mb-1">Pembebanan Saat Ini:</div>
            <div class="d-flex justify-space-between mb-1"><span class="text-medium-emphasis">Beban</span><span class="font-weight-black text-primary">{{ risk.loadingPct }}%</span></div>
            <v-progress-linear :model-value="risk.loadingPct" height="8" rounded :color="risk.loadingPct > 80 ? 'error' : 'primary'" />
          </div>
        </v-sheet>
      </v-window-item>

      <!-- KERAWANAN -->
      <v-window-item value="risk">
        <div class="d-flex flex-column ga-2">
          <v-sheet class="rounded-lg border pa-3" color="amber-lighten-5">
            <div class="d-flex align-center ga-1 font-weight-black text-uppercase text-amber-darken-3 text-caption mb-1" style="letter-spacing: 0.06em"><v-icon icon="mdi-alert-outline" size="15" />Kondisi / Permasalahan</div>
            <p class="text-caption mb-0">{{ risk.condition }}</p>
          </v-sheet>
          <v-sheet class="rounded-lg border pa-3" color="red-lighten-5">
            <div class="d-flex align-center ga-1 font-weight-black text-uppercase text-error text-caption mb-1" style="letter-spacing: 0.06em"><v-icon icon="mdi-shield-alert-outline" size="15" />Dampak</div>
            <div v-for="(l, i) in lines(risk.impact)" :key="i" class="text-caption">{{ l }}</div>
          </v-sheet>
          <v-sheet class="rounded-lg border pa-3" color="blue-lighten-5">
            <div class="d-flex align-center ga-1 font-weight-black text-uppercase text-primary text-caption mb-1" style="letter-spacing: 0.06em"><v-icon icon="mdi-check-circle-outline" size="15" />Mitigasi</div>
            <div v-for="(l, i) in lines(risk.mitigation)" :key="i" class="text-caption">{{ l }}</div>
          </v-sheet>
          <v-sheet class="rounded-lg border pa-3" color="green-lighten-5">
            <div class="font-weight-black text-uppercase text-success text-caption mb-2" style="letter-spacing: 0.06em">Usulan / Solusi (Jangka Pendek)</div>
            <div class="d-flex flex-column ga-1">
              <v-sheet v-for="(s, i) in risk.solution.shortTerm" :key="i" class="rounded-lg border pa-2 bg-surface text-caption">{{ s }}</v-sheet>
            </div>
            <template v-if="risk.solution.mediumTerm?.length || risk.solution.longTerm?.length">
              <div class="text-caption font-weight-bold text-medium-emphasis mt-2 pt-2 border-t">Jangka Menengah / Panjang:</div>
              <div v-for="(s, i) in [...(risk.solution.mediumTerm ?? []), ...(risk.solution.longTerm ?? [])]" :key="'ml' + i" class="text-caption text-medium-emphasis">• {{ s }}</div>
            </template>
          </v-sheet>
        </div>
      </v-window-item>

      <!-- ASET TERKAIT -->
      <v-window-item value="assets">
        <div v-if="risk.relatedAssets?.length" class="d-flex flex-column ga-2">
          <div class="text-caption text-medium-emphasis mb-1">Aset sistem tenaga listrik yang terdampak pada jalur kerawanan ini:</div>
          <v-card
            v-for="a in risk.relatedAssets"
            :key="a.name"
            class="rounded-lg border pa-3 d-flex align-center justify-space-between"
            :class="a.code ? 'cursor-pointer' : ''"
            :hover="!!a.code"
            @click="a.code && emit('selectAsset', a.code)"
          >
            <div>
              <div class="font-weight-bold d-flex align-center ga-2">
                <v-chip size="x-small" variant="tonal" color="grey-darken-1" class="ops-mono font-weight-bold">{{ assetKindLabel[a.kind] }}</v-chip>
                {{ a.name }}
              </div>
              <div class="text-caption text-medium-emphasis mt-1">{{ a.role }}</div>
            </div>
            <v-icon v-if="a.code" icon="mdi-arrow-right" size="16" color="primary" />
          </v-card>
        </div>
        <div v-else class="text-caption text-medium-emphasis text-center py-6">Data aset terkait belum tersedia untuk kerawanan ini.</div>
      </v-window-item>

      <!-- RIWAYAT -->
      <v-window-item value="history">
        <div class="text-caption text-medium-emphasis mb-2">Catatan evaluasi operasi dan kerawanan sistem:</div>
        <div class="border-s pl-3" style="border-width: 2px !important; margin-left: 4px">
          <div class="position-relative pb-3">
            <span class="position-absolute rounded-circle bg-primary" style="width: 10px; height: 10px; left: -21px; top: 3px" />
            <div class="font-weight-bold text-caption">Kajian Buku Kerawanan Tahun 2026</div>
            <div class="text-medium-emphasis" style="font-size: 10px">{{ risk.updatedAt }} • Tim Operasi Sistem UIP2B {{ risk.uit }}</div>
            <p class="text-caption mt-1 mb-0">{{ risk.condition }} Status kerawanan ditetapkan <b>{{ risk.riskLevel }}</b>.</p>
          </div>
          <div class="position-relative">
            <span class="position-absolute rounded-circle bg-grey" style="width: 10px; height: 10px; left: -21px; top: 3px" />
            <div class="font-weight-bold text-caption">Status Mitigasi Saat Ini</div>
            <div class="text-medium-emphasis" style="font-size: 10px">{{ risk.updatedAt }} • Prioritas {{ risk.priority }}</div>
            <p class="text-caption mt-1 mb-0">Status kerawanan: <b>{{ risk.status }}</b>. Rincian riwayat lengkap belum tersedia pada prototipe.</p>
          </div>
        </div>
      </v-window-item>
    </v-window>
  </div>
</template>
