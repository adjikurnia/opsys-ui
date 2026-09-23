<script setup lang="ts">
export interface SldLayers {
  tier: boolean
  risk: boolean
  labels: boolean
}
defineProps<{ modelValue: SldLayers; riskCount: number }>()
const emit = defineEmits<{ 'update:modelValue': [v: SldLayers] }>()
</script>

<template>
  <div>
    <div class="text-caption font-weight-black text-medium-emphasis text-uppercase mb-1" style="letter-spacing: 0.08em">Layer</div>
    <v-checkbox :model-value="modelValue.tier" density="compact" hide-details color="primary" @update:model-value="emit('update:modelValue', { ...modelValue, tier: !!$event })">
      <template #label>
        <span class="text-body-2"><b>Tier band</b> <span class="text-caption text-medium-emphasis">hop dari sumber</span></span>
      </template>
    </v-checkbox>
    <v-checkbox :model-value="modelValue.risk" density="compact" hide-details color="primary" @update:model-value="emit('update:modelValue', { ...modelValue, risk: !!$event })">
      <template #label>
        <span class="text-body-2 d-flex align-center ga-1">
          <span class="rounded-circle d-inline-block" style="width: 10px; height: 10px; background: #f6c000; border: 1px solid #b8860b" />
          <b>Titik kerawanan</b> <span class="text-caption text-medium-emphasis">({{ riskCount }})</span>
        </span>
      </template>
    </v-checkbox>
    <v-checkbox :model-value="modelValue.labels" density="compact" hide-details color="primary" @update:model-value="emit('update:modelValue', { ...modelValue, labels: !!$event })">
      <template #label><span class="text-body-2"><b>Label kode GI</b></span></template>
    </v-checkbox>
    <v-checkbox :model-value="false" density="compact" hide-details disabled>
      <template #label><span class="text-body-2"><b>Defense scheme</b> <span class="text-caption text-disabled">belum ada data</span></span></template>
    </v-checkbox>
    <v-checkbox :model-value="false" density="compact" hide-details disabled>
      <template #label><span class="text-body-2"><b>AHI aset</b> <span class="text-caption text-disabled">belum ada data</span></span></template>
    </v-checkbox>

    <v-alert density="compact" variant="tonal" color="primary" class="text-caption mt-3" icon="mdi-lightbulb-outline">
      Scroll untuk zoom, drag untuk geser. Klik busbar / penghantar / bay / pin untuk detail.
    </v-alert>

    <div class="mt-4">
      <div class="text-caption font-weight-black text-medium-emphasis text-uppercase mb-1" style="letter-spacing: 0.08em">Legenda</div>
      <div class="text-caption d-flex flex-column ga-1">
        <div class="d-flex align-center ga-2"><span style="width: 22px; height: 5px; background: #0047ab" /> Busbar / SUTET 500 kV</div>
        <div class="d-flex align-center ga-2"><span style="width: 22px; height: 5px; background: #c00000" /> Busbar / SUTT 150 kV</div>
        <div class="d-flex align-center ga-2"><span style="width: 22px; border-top: 2px dashed #c00000" /> SKTT (kabel tanah)</div>
        <div class="d-flex align-center ga-2"><span style="width: 22px; height: 3px; background: #9aa0a6" /> Non-aktif / rencana</div>
        <div class="d-flex align-center ga-2"><span style="width: 10px; height: 10px; background: #c00000" /> PMT (pemutus)</div>
        <div class="d-flex align-center ga-2">
          <svg width="22" height="18"><circle cx="8" cy="6" r="5" fill="#fff" stroke="#0047ab" stroke-width="1.5" /><circle cx="6" cy="12" r="5" fill="#fff" stroke="#c00000" stroke-width="1.5" /><circle cx="11" cy="12" r="5" fill="#fff" stroke="#e0a400" stroke-width="1.5" /></svg>
          IBT 500/150 kV
        </div>
      </div>
    </div>
  </div>
</template>
