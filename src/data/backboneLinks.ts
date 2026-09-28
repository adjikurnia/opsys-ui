/**
 * Topologi ruas antar GI/GITET 500 kV (dan interkoneksi kabel laut 150 kV Jawa-Bali) untuk
 * kebutuhan peta (garis saluran) — disederhanakan/ilustratif, terpisah dari graph SLD di sld.ts
 * supaya tidak mengubah tata letak SLD yang sudah ada. Mengikuti kode `Substation.code`.
 */
export interface BackboneLink {
  from: string
  to: string
  voltageKv: 500 | 150
}

export const backboneLinks: BackboneLink[] = [
  // UP2B Jakarta & Banten
  { from: 'SRLYA', to: 'CLGON', voltageKv: 500 },
  { from: 'SRLYA', to: 'BLRJA', voltageKv: 500 },
  { from: 'BLRJA', to: 'GNDUL', voltageKv: 500 },
  { from: 'BLRJA', to: 'KMBGN', voltageKv: 500 },
  { from: 'GNDUL', to: 'KMBGN', voltageKv: 500 },
  { from: 'GNDUL', to: 'CWANG', voltageKv: 500 },
  { from: 'KMBGN', to: 'DKSBI', voltageKv: 500 },
  { from: 'DKSBI', to: 'MKRNG', voltageKv: 500 },
]
