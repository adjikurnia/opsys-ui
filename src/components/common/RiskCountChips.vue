<script setup lang="ts">
import type { RiskCounts } from '@/types'

/** Tiga chip N-1 / N-2 / N-1-2 (merah / kuning / abu). */
defineProps<{ counts: RiskCounts; dense?: boolean }>()
</script>

<template>
  <div class="d-flex align-center ga-1 flex-wrap">
    <v-chip color="risk-n1" variant="tonal" size="x-small" class="font-weight-bold ops-mono" prepend-icon="mdi-circle">
      N-1: {{ counts.n1 }}
    </v-chip>
    <v-chip color="amber-darken-3" variant="tonal" size="x-small" class="font-weight-bold ops-mono" prepend-icon="mdi-circle">
      N-2: {{ counts.n2 }}
    </v-chip>
    <v-chip color="risk-n12" variant="tonal" size="x-small" class="font-weight-bold ops-mono" prepend-icon="mdi-circle">
      N-1-2: {{ counts.n12 }}
    </v-chip>
  </div>
</template>
