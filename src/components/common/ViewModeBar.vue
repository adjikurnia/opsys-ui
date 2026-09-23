<script setup lang="ts">
export interface ViewModeItem {
  value: string
  label: string
  icon: string
  iconColor?: string
  badge?: number | string
  /** Item yang hanya menavigasi (tidak jadi mode aktif). */
  navigate?: boolean
}

defineProps<{ items: ViewModeItem[]; modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [v: string]; select: [v: string] }>()
</script>

<template>
  <div class="bg-surface border-b px-6 py-2 d-flex align-center justify-space-between flex-shrink-0">
    <div class="ops-segment d-flex align-center ga-1">
      <v-btn
        v-for="it in items"
        :key="it.value"
        size="small"
        :variant="modelValue === it.value ? 'flat' : 'text'"
        :color="modelValue === it.value ? 'primary' : 'grey-darken-2'"
        class="font-weight-bold"
        :prepend-icon="it.icon"
        @click="it.navigate ? emit('select', it.value) : emit('update:modelValue', it.value)"
      >
        <template v-if="it.iconColor && modelValue !== it.value" #prepend>
          <v-icon :icon="it.icon" :color="it.iconColor" />
        </template>
        {{ it.label }}
        <v-chip
          v-if="it.badge !== undefined"
          size="x-small"
          class="ml-1 font-weight-black ops-mono"
          :color="modelValue === it.value ? 'white' : 'error'"
          :variant="modelValue === it.value ? 'outlined' : 'tonal'"
        >
          {{ it.badge }}
        </v-chip>
      </v-btn>
      <slot name="extra" />
    </div>
    <div class="text-caption text-medium-emphasis ops-mono d-none d-md-flex align-center ga-2">
      <slot name="right" />
    </div>
  </div>
</template>
