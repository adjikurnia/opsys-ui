<script setup lang="ts">
import AppHeader from '@/layouts/AppHeader.vue'
import SystemRiskDialog from '@/components/risk/SystemRiskDialog.vue'
</script>

<template>
  <v-app>
    <AppHeader />
    <v-main class="d-flex flex-column" style="height: 100vh">
      <router-view v-slot="{ Component }">
        <component :is="Component" class="flex-grow-1" style="min-height: 0" />
      </router-view>
    </v-main>
    <SystemRiskDialog />
  </v-app>
</template>
