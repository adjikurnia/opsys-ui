<script setup lang="ts">
import type { RiskLevel } from '@/types'
import { levelColor } from '@/composables/useRiskStyle'

defineProps<{ level: RiskLevel; size?: string }>()
</script>

<template>
  <v-chip :color="levelColor(level)" variant="tonal" :size="size ?? 'x-small'" class="font-weight-bold" prepend-icon="mdi-circle">
    {{ level }}
  </v-chip>
</template>
