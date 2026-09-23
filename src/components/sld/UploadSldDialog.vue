<script setup lang="ts">
import { ref } from 'vue'

/** Dialog unggah SLD dari Excel (satu jalur input dahulu). Belum diparsing ke graph — prototipe. */
const props = defineProps<{ modelValue: boolean; contextName: string; viewName?: string }>()
const emit = defineEmits<{ 'update:modelValue': [v: boolean] }>()

type Status = 'idle' | 'uploading' | 'success' | 'error'
const status = ref<Status>('idle')
const file = ref<File | null>(null)
const errorMsg = ref('')
const dragging = ref(false)
const input = ref<HTMLInputElement>()

const ACCEPTED = ['.xlsx', '.xls']

function reset() {
  status.value = 'idle'
  file.value = null
  errorMsg.value = ''
  dragging.value = false
}

function close() {
  emit('update:modelValue', false)
  setTimeout(reset, 200)
}

function pick(f: File | undefined | null) {
  if (!f) return
  const ok = ACCEPTED.some((ext) => f.name.toLowerCase().endsWith(ext))
  if (!ok) {
    errorMsg.value = `Format file tidak didukung. Gunakan ${ACCEPTED.join(' atau ')}.`
    status.value = 'error'
    return
  }
  file.value = f
  status.value = 'idle'
  errorMsg.value = ''
}

function onDrop(e: DragEvent) {
  dragging.value = false
  pick(e.dataTransfer?.files?.[0])
}
function onInputChange(e: Event) {
  pick((e.target as HTMLInputElement).files?.[0])
}

function removeFile() {
  file.value = null
  status.value = 'idle'
  if (input.value) input.value.value = ''
}

function upload() {
  if (!file.value) return
  status.value = 'uploading'
  setTimeout(() => (status.value = 'success'), 1100)
}

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="480" @update:model-value="close">
    <v-card class="rounded-xl">
      <div class="pa-4 bg-surface-light border-b d-flex align-center justify-space-between">
        <div class="d-flex align-center ga-3">
          <v-avatar rounded="lg" color="green-lighten-5" class="border">
            <v-icon icon="mdi-file-excel-outline" color="success" />
          </v-avatar>
          <div>
            <div class="text-subtitle-1 font-weight-black">Upload SLD (Excel)</div>
            <div class="text-caption text-medium-emphasis">{{ contextName }}<template v-if="viewName"> — {{ viewName }}</template></div>
          </div>
        </div>
        <v-btn icon="mdi-close" size="small" variant="text" @click="close" />
      </div>

      <div class="pa-4">
        <template v-if="status !== 'success'">
          <div
            class="rounded-lg pa-6 d-flex flex-column align-center text-center cursor-pointer"
            :class="dragging ? 'border-primary bg-blue-lighten-5' : 'border bg-surface-light'"
            style="border-width: 2px; border-style: dashed; cursor: pointer"
            @click="input?.click()"
            @dragover.prevent="dragging = true"
            @dragleave.prevent="dragging = false"
            @drop.prevent="onDrop"
          >
            <v-icon icon="mdi-tray-arrow-up" size="32" color="primary" class="mb-2" />
            <div class="text-body-2 font-weight-bold">Tarik &amp; lepas file Excel di sini</div>
            <div class="text-caption text-medium-emphasis">atau klik untuk memilih file (.xlsx, .xls)</div>
            <input ref="input" type="file" accept=".xlsx,.xls" class="d-none" @change="onInputChange" />
          </div>

          <v-alert v-if="status === 'error'" type="error" variant="tonal" density="compact" class="text-caption mt-3">{{ errorMsg }}</v-alert>

          <v-sheet v-if="file" class="rounded-lg border pa-3 mt-3 d-flex align-center ga-3">
            <v-icon icon="mdi-file-excel" color="success" size="22" />
            <div class="flex-grow-1" style="min-width: 0">
              <div class="text-body-2 font-weight-bold text-truncate">{{ file.name }}</div>
              <div class="text-caption text-medium-emphasis">{{ fmtSize(file.size) }}</div>
            </div>
            <v-btn icon="mdi-close" size="x-small" variant="text" :disabled="status === 'uploading'" @click="removeFile" />
          </v-sheet>

          <v-progress-linear v-if="status === 'uploading'" indeterminate color="primary" class="mt-3" rounded />

          <v-alert type="info" variant="tonal" density="compact" class="text-caption mt-3" icon="mdi-information-outline">
            Format kolom Excel mengikuti templat Buku Kerawanan Sistem. Hasil unggahan akan diverifikasi sebelum diterapkan ke SLD.
          </v-alert>
        </template>

        <template v-else>
          <div class="d-flex flex-column align-center text-center py-4">
            <v-icon icon="mdi-check-circle" size="40" color="success" class="mb-2" />
            <div class="text-body-1 font-weight-bold">File berhasil diunggah</div>
            <p class="text-caption text-medium-emphasis mt-1">{{ file?.name }} sedang menunggu proses validasi. Pemrosesan data SLD dari Excel belum tersedia pada prototipe ini.</p>
          </div>
        </template>
      </div>

      <div class="pa-4 pt-0 d-flex justify-end ga-2">
        <v-btn variant="text" color="grey-darken-2" @click="close">{{ status === 'success' ? 'Tutup' : 'Batal' }}</v-btn>
        <v-btn v-if="status !== 'success'" color="primary" variant="flat" class="font-weight-bold" :disabled="!file" :loading="status === 'uploading'" @click="upload">Unggah</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
