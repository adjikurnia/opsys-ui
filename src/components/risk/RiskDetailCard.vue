<script setup lang="ts">
import type { RiskItem } from '@/types'
import { categoryColor, levelColor } from '@/composables/useRiskStyle'

/** Kartu kerawanan ringkas dengan detail kondisi/dampak/mitigasi/usulan (expandable). */
defineProps<{ risk: RiskItem; active?: boolean; muted?: boolean; expanded?: boolean }>()
const emit = defineEmits<{ select: [risk: RiskItem] }>()

const lines = (t: string) => t.split('\n').filter((l) => l.trim())
</script>

<template>
  <v-card
    class="rounded-lg border pa-3"
    :class="[active ? 'border-primary bg-blue-lighten-5' : 'bg-surface', muted ? 'opacity-60' : '']"
    :style="active ? 'border-color: rgb(var(--v-theme-primary)) !important' : ''"
    hover
    @click="emit('select', risk)"
  >
    <div class="d-flex align-start ga-2">
      <v-avatar size="30" :color="categoryColor(risk.category)" class="text-white font-weight-black text-caption flex-shrink-0">
        {{ risk.number }}
      </v-avatar>
      <div class="flex-grow-1" style="min-width: 0">
        <div class="text-body-2 font-weight-bold text-high-emphasis" style="line-height: 1.3">{{ risk.title }}</div>
        <div class="text-caption text-medium-emphasis mt-1 text-truncate">
          {{ risk.assetType }} {{ risk.voltage }} · {{ risk.lineGiSegment }}
        </div>
        <div class="d-flex flex-wrap ga-1 mt-1">
          <v-chip size="x-small" :color="categoryColor(risk.category)" variant="flat" class="font-weight-black">{{ risk.category }}</v-chip>
          <v-chip size="x-small" :color="levelColor(risk.riskLevel)" variant="tonal" class="font-weight-bold">{{ risk.riskLevel }}</v-chip>
          <v-chip size="x-small" variant="outlined">prioritas {{ risk.priority }}</v-chip>
          <v-chip size="x-small" variant="outlined">{{ risk.status }}</v-chip>
        </div>
        <div v-if="muted" class="text-caption text-warning mt-1 font-italic">Objek tempat pin tidak ada di sudut pandang ini.</div>
      </div>
    </div>

    <v-expansion-panels v-if="expanded !== false" variant="accordion" class="mt-2" flat>
      <v-expansion-panel class="border rounded-lg" bg-color="surface-light">
        <v-expansion-panel-title class="text-caption font-weight-bold py-1" style="min-height: 32px">
          kondisi / dampak / mitigasi / usulan
        </v-expansion-panel-title>
        <v-expansion-panel-text class="text-caption">
          <p class="mb-2"><b>Kondisi:</b> {{ risk.condition }}</p>
          <p class="mb-1"><b>Dampak:</b></p>
          <div v-for="(l, i) in lines(risk.impact)" :key="'i' + i" class="pl-2">{{ l }}</div>
          <p class="mb-1 mt-2"><b>Mitigasi:</b></p>
          <div v-for="(l, i) in lines(risk.mitigation)" :key="'m' + i" class="pl-2">{{ l }}</div>
          <p class="mb-1 mt-2"><b>Usulan / solusi:</b></p>
          <div v-for="(s, i) in risk.solution.shortTerm" :key="'s' + i" class="pl-2">• {{ s }}</div>
          <div v-for="(s, i) in risk.solution.mediumTerm ?? []" :key="'md' + i" class="pl-2 text-medium-emphasis">• {{ s }}</div>
          <div v-for="(s, i) in risk.solution.longTerm ?? []" :key="'l' + i" class="pl-2 text-medium-emphasis">• {{ s }}</div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>
