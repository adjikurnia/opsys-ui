<script setup lang="ts">
/**
 * Panel info kanan. Mode `static` = kolom tetap di kanan kanvas;
 * mode `overlay` = drawer geser (dipakai saat mode List Kerawanan).
 */
defineProps<{ overlay: boolean; modelValue: boolean; width?: number }>()
const emit = defineEmits<{ 'update:modelValue': [v: boolean] }>()
</script>

<template>
  <aside
    v-if="!overlay"
    class="bg-surface border-s d-flex flex-column flex-shrink-0 ops-scroll"
    :style="{ width: (width ?? 400) + 'px', zIndex: 2 }"
  >
    <slot :is-overlay="false" />
  </aside>

  <v-navigation-drawer
    v-else
    :model-value="modelValue"
    location="right"
    temporary
    :width="width ?? 440"
    class="ops-scroll"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <slot :is-overlay="true" />
  </v-navigation-drawer>
</template>
