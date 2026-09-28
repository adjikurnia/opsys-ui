import * as XLSX from 'xlsx'
import type { RiskItem } from '@/types'

/** Ekspor daftar kerawanan ke .xlsx — kolom mengikuti format resmi Buku Kerawanan. */
export function exportRisksToExcel(risks: RiskItem[], title: string, filename: string) {
  const rows = risks.map((r) => ({
    No: r.number,
    'Line / Segmen GI': r.lineGiSegment,
    UIT: r.uit,
    Kategori: r.category,
    'Tingkat Kerawanan': r.riskLevel,
    'Jenis Aset': r.assetType,
    Tegangan: r.voltage,
    Sirkit: r.circuits ?? '',
    'Panjang (km)': r.lengthKm ?? '',
    'Pembebanan (%)': r.loadingPct ?? '',
    'Kondisi / Permasalahan': r.condition,
    Dampak: r.impact,
    Mitigasi: r.mitigation,
    'Usulan Jangka Pendek': r.solution.shortTerm.join('; '),
    'Usulan Jangka Menengah': r.solution.mediumTerm?.join('; ') ?? '',
    'Usulan Jangka Panjang': r.solution.longTerm?.join('; ') ?? '',
    Lokasi: r.location,
    Status: r.status,
    Prioritas: r.priority,
    'Update Terakhir': r.updatedAt,
  }))

  const ws = XLSX.utils.json_to_sheet(rows)
  ws['!cols'] = [
    { wch: 5 }, { wch: 28 }, { wch: 8 }, { wch: 8 }, { wch: 15 }, { wch: 10 }, { wch: 12 }, { wch: 7 }, { wch: 10 }, { wch: 10 },
    { wch: 40 }, { wch: 35 }, { wch: 35 }, { wch: 35 }, { wch: 35 }, { wch: 35 }, { wch: 30 }, { wch: 10 }, { wch: 9 }, { wch: 12 },
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, title.slice(0, 31))
  XLSX.writeFile(wb, filename)
}
