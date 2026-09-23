<script setup lang="ts">
/** Tab vertikal di tepi kanan kanvas untuk membuka drawer info (mode list). */
defineProps<{ label: string }>()
const emit = defineEmits<{ click: [] }>()
</script>

<template>
  <v-btn
    class="position-absolute font-weight-black rounded-s-xl rounded-e-0 border"
    style="right: 0; top: 50%; transform: translateY(-50%); z-index: 3; height: auto; padding: 12px 8px; letter-spacing: 0.15em"
    color="primary"
    variant="outlined"
    elevation="2"
    :title="`Buka ${label}`"
    @click="emit('click')"
  >
    <div class="d-flex flex-column align-center ga-1 bg-surface">
      <v-icon icon="mdi-information-outline" size="18" />
      <span class="text-caption font-weight-black" style="writing-mode: vertical-rl; transform: rotate(180deg)">{{ label }}</span>
    </div>
  </v-btn>
</template>
