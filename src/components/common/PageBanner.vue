<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

/** Banner atas halaman: nomor level, judul, subjudul, tombol kembali & slot kanan. */
defineProps<{
  step: string | number
  title: string
  subtitle?: string
  backTo?: RouteLocationRaw
  backLabel?: string
}>()
</script>

<template>
  <div class="bg-surface border-b px-6 py-3 d-flex align-center justify-space-between flex-shrink-0" style="z-index: 2">
    <div class="d-flex align-center ga-3">
      <v-avatar size="28" color="blue-lighten-5" class="text-primary font-weight-bold text-caption border">
        {{ step }}
      </v-avatar>
      <div>
        <div class="text-subtitle-1 font-weight-black text-high-emphasis text-uppercase" style="line-height: 1.2; letter-spacing: -0.01em">
          {{ title }}
        </div>
        <div v-if="subtitle" class="text-caption text-medium-emphasis">{{ subtitle }}</div>
      </div>
    </div>

    <div class="d-flex align-center ga-2">
      <slot />
      <v-btn v-if="backTo" :to="backTo" variant="outlined" color="grey-darken-1" prepend-icon="mdi-arrow-left" size="small" class="bg-surface">
        {{ backLabel ?? 'Kembali' }}
      </v-btn>
    </div>
  </div>
</template>
