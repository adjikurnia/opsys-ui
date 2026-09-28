import { backboneLinks } from '@/data/backboneLinks'
import type { Substation } from '@/types'

export type LineRiskStatus = 'critical' | 'warning' | 'normal'

export interface TransmissionLine {
  id: string
  from: [number, number]
  to: [number, number]
  voltageKv: number
  name: string
  /** Tingkat kerawanan koridor, diturunkan dari status kedua GI/GITET ujungnya. */
  status: LineRiskStatus
}

/**
 * Ruas saluran (garis peta) yang kedua ujungnya cocok dengan kode substation pada daftar yang
 * diberikan. Warna/keparahan garis mengikuti status kedua GI ujungnya (mis. app referensi):
 * kedua ujung Rawan → critical (merah, putus-putus), salah satu Rawan/Waspada → warning (kuning),
 * selain itu → normal (biru).
 */
export function transmissionLinesFor(subs: Substation[]): TransmissionLine[] {
  const byCode = new Map(subs.map((s) => [s.code, s]))
  const lines: TransmissionLine[] = []
  for (const link of backboneLinks) {
    const a = byCode.get(link.from)
    const b = byCode.get(link.to)
    if (!a || !b || a.code === b.code) continue
    const bothRawan = a.status === 'Rawan' && b.status === 'Rawan'
    const anyRisk = a.status !== 'Normal' || b.status !== 'Normal'
    const status: LineRiskStatus = bothRawan ? 'critical' : anyRisk ? 'warning' : 'normal'
    lines.push({
      id: `${link.from}-${link.to}`,
      from: [a.lat, a.lng],
      to: [b.lat, b.lng],
      voltageKv: link.voltageKv,
      name: `${a.name} - ${b.name}`,
      status,
    })
  }
  return lines
}
