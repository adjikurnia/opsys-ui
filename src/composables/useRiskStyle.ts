import type { RiskCategory, RiskLevel, SldStatus, SubstationStatus } from '@/types'

/** Warna Vuetify (nama theme) untuk tingkat kerawanan. */
export function levelColor(level: RiskLevel): string {
  switch (level) {
    case 'Sangat Rawan':
      return 'error'
    case 'Rawan':
      return 'deep-orange'
    case 'Sedang':
      return 'amber-darken-2'
    default:
      return 'success'
  }
}

/** Warna theme untuk kategori N-1 / N-2 / N-1-2. */
export function categoryColor(cat: RiskCategory | null | undefined): string {
  switch (cat) {
    case 'N-1':
      return 'risk-n1'
    case 'N-2':
      return 'risk-n2'
    case 'N-1-2':
      return 'risk-n12'
    default:
      return 'grey'
  }
}

export const categoryLabel: Record<RiskCategory, string> = {
  'N-1': 'Merah (N-1) — Kerawanan Tunggal',
  'N-2': 'Kuning (N-2) — Kerawanan Ganda',
  'N-1-2': 'Abu-Abu (N-1-2) — Kerawanan Kombinasi',
}

/** Hex untuk marker Leaflet / SVG (tidak lewat theme Vuetify). */
export const categoryHex: Record<RiskCategory, string> = {
  'N-1': '#dc2626',
  'N-2': '#eab308',
  'N-1-2': '#64748b',
}

export function statusHex(status: SubstationStatus): string {
  switch (status) {
    case 'Rawan':
      return '#dc2626'
    case 'Waspada':
      return '#f59e0b'
    default:
      return '#16a34a'
  }
}

/** Label Bahasa Indonesia untuk status objek SLD (ENERGIZED dll.). */
export const sldStatusLabel: Record<SldStatus, string> = {
  ENERGIZED: 'Bertegangan',
  DE_ENERGIZED: 'Tidak bertegangan',
  PLANNED: 'Rencana',
}

/** Warna chip status objek SLD. */
export function sldStatusColor(status: SldStatus): string {
  if (status === 'ENERGIZED') return 'success'
  if (status === 'PLANNED') return 'info'
  return 'grey'
}

/** Warna tegangan P2B: 500 kV biru, 150 kV merah, 70 kV kuning. */
export function voltageHex(kv: number): string {
  if (kv >= 500) return '#0047AB'
  if (kv >= 150) return '#C00000'
  return '#E0A400'
}
