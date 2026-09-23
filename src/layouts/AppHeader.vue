<script setup lang="ts">
import { useBreadcrumbs } from '@/composables/useBreadcrumbs'
import { useOpsysStore } from '@/stores/opsys'

/**
 * Navbar meniru Dashboard MANTAPS: logo kiri, menu di tengah, avatar kanan.
 * Modul ini nantinya jadi salah satu item menu ("Operation System").
 * Di bawahnya: judul halaman + breadcrumb (pengganti sidebar) + Last Update.
 */
const { crumbs, pageTitle } = useBreadcrumbs()
const store = useOpsysStore()

const menus = [
  { title: 'Peta Risiko', active: false },
  { title: 'Profil Aset', active: false, dropdown: true },
  { title: 'Operation System', active: true },
]
</script>

<template>
  <v-app-bar flat height="72" color="surface" class="border-b">
    <!-- Logo -->
    <router-link :to="{ name: 'national' }" class="d-flex align-center pl-6 text-decoration-none">
      <div>
        <div class="text-medium-emphasis" style="font-size: 8px; letter-spacing: 0.35em; line-height: 1">DASHBOARD</div>
        <div class="font-weight-black text-primary" style="font-size: 26px; letter-spacing: 0.04em; line-height: 1.05">
          <span class="text-error">.</span>MANTAPS
        </div>
      </div>
    </router-link>

    <v-spacer />

    <!-- Menu tengah -->
    <div class="d-flex align-center ga-2">
      <v-btn
        v-for="m in menus"
        :key="m.title"
        variant="text"
        size="large"
        :color="m.active ? 'primary' : 'grey-darken-2'"
        :class="m.active ? 'font-weight-bold' : ''"
        :append-icon="m.dropdown ? 'mdi-chevron-down' : undefined"
        style="font-size: 14px; letter-spacing: 0.05em"
        :to="m.active ? { name: 'national' } : undefined"
      >
        {{ m.title }}
      </v-btn>
    </div>

    <v-spacer />

    <!-- User -->
    <v-btn icon variant="text" class="mr-4">
      <v-icon icon="mdi-account-circle" size="36" color="grey-darken-1" />
    </v-btn>
  </v-app-bar>

  <!-- Sub-bar: judul + breadcrumb + last update -->
  <v-app-bar flat height="44" color="surface" class="border-b">
    <div class="d-flex align-center pl-6" style="min-width: 0; overflow: hidden">
      <span class="text-body-1 font-weight-medium text-no-wrap mr-3">{{ pageTitle }}</span>
      <v-breadcrumbs :items="crumbs" density="compact" class="pa-0 ma-0 text-caption flex-nowrap text-no-wrap" divider="›">
        <template #prepend>
          <router-link :to="{ name: 'national' }" class="d-flex align-center mr-1 text-medium-emphasis" style="text-decoration: none">
            <v-icon icon="mdi-home-outline" size="14" />
          </router-link>
        </template>
        <template #title="{ item }">
          <span :class="item.disabled ? 'font-weight-bold text-primary' : 'text-medium-emphasis'">{{ item.title }}</span>
        </template>
      </v-breadcrumbs>
    </div>

    <v-spacer style="min-width: 8px" />

    <v-btn color="error" variant="tonal" size="small" class="font-weight-bold mr-4 text-no-wrap" prepend-icon="mdi-shield-alert-outline" @click="store.riskDialogOpen = true">
      Matriks Kerawanan
      <v-chip color="error" variant="flat" size="x-small" class="ml-2 font-weight-black">{{ store.totalRisks }}</v-chip>
    </v-btn>
    <span class="text-caption text-medium-emphasis text-no-wrap pr-6">Last Update: 31/8/2026, 00.00.00</span>
  </v-app-bar>
</template>
