<script setup lang="ts">
import { categoryHex } from '@/composables/useRiskStyle'

const items = [
  { color: categoryHex['N-1'], label: 'Merah (N-1)', desc: 'Kerawanan Tunggal' },
  { color: categoryHex['N-2'], label: 'Kuning (N-2)', desc: 'Kerawanan Ganda' },
  { color: categoryHex['N-1-2'], label: 'Abu-Abu (N-1-2)', desc: 'Kerawanan Kombinasi' },
]
</script>

<template>
  <v-card class="border rounded-xl pa-3" elevation="1">
    <div class="text-caption font-weight-bold text-medium-emphasis text-uppercase mb-1" style="letter-spacing: 0.06em">
      Legenda Tingkat Kerawanan
    </div>
    <div v-for="it in items" :key="it.label" class="d-flex align-center ga-2 py-1">
      <span class="rounded-circle d-inline-block flex-shrink-0" :style="{ width: '12px', height: '12px', background: it.color }" />
      <span class="text-caption font-weight-bold">{{ it.label }}</span>
      <span class="text-caption text-medium-emphasis">— {{ it.desc }}</span>
    </div>
  </v-card>
</template>
