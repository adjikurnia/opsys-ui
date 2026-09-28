// ---------------------------------------------------------------------------
// Domain types — Operation System (Peta Kerawanan Sistem / Subsistem / GI)
// Semua data masih hardcode; shape ini nantinya dipetakan ke response BE.
// ---------------------------------------------------------------------------

/** Kategori kerawanan sesuai Buku Kerawanan (N-1 merah, N-2 kuning, N-1-2 abu). */
export type RiskCategory = 'N-1' | 'N-2' | 'N-1-2'

/** Tingkat kerawanan agregat sebuah entitas. */
export type RiskLevel = 'Sangat Rawan' | 'Rawan' | 'Sedang' | 'Aman'

/** Unit Induk Transmisi. */
export type Uit = 'JBB' | 'JBT' | 'JATIM'

export interface RiskCounts {
  n1: number
  n2: number
  n12: number
}

export interface PowerSystem {
  id: string
  name: string
  region: string
  riskLevel: RiskLevel
  upbCount: number
  subsystemCount: number
  giCount: number
  ibtCount: number
  risks: RiskCounts
  lat: number
  lng: number
  description: string
  /** Hanya sistem aktif yang punya drill-down data. */
  active: boolean
}

export interface Upb {
  id: string
  systemId: string
  name: string
  shortName: string
  region: string
  giCount: number
  ibtCount: number
  subsystemCount: number
  riskLevel: RiskLevel
  lat: number
  lng: number
  keySubstations: string[]
}

export interface Subsystem {
  id: string
  upbId: string
  code: string
  name: string
  giCount: number
  ibtCount: number
  riskLevel: RiskLevel
  peakLoadMW: number
  description: string
  sourceRef: string
  /** Sudut pandang (halaman SLD buku) yang tersedia. */
  views: { id: string; name: string }[]
}

export type SubstationStatus = 'Rawan' | 'Waspada' | 'Normal'

export interface Substation {
  id: string
  code: string
  name: string
  type: 'GITET' | 'GI' | 'GIS'
  voltageKv: number
  upbId: string
  subsystemId?: string
  lat: number
  lng: number
  status: SubstationStatus
}

export interface RiskSolution {
  shortTerm: string[]
  mediumTerm?: string[]
  longTerm?: string[]
}

export type RiskAttachKind = 'SUBSTATION' | 'CIRCUIT' | 'TRANSFORMER' | 'BAY'

/** Aset yang terdampak/terlibat pada jalur kerawanan (tab "Aset Terkait"). */
export interface RelatedAsset {
  /** Kode objek SLD bila ada (untuk lompat-pilih di kanvas); kosongkan bila aset di luar SLD (mis. pembangkit). */
  code?: string
  name: string
  role: string
  kind: 'GITET' | 'GI' | 'GIS' | 'IBT' | 'PEMBANGKIT'
}

export interface RiskItem {
  id: number
  /** Nomor urut di buku kerawanan. */
  number: number
  title: string
  lineGiSegment: string
  uit: Uit
  assetType: 'SUTET' | 'SUTT' | 'SKTT' | 'IBT' | 'GI' | 'GITET' | 'Pembangkit'
  voltage: string
  category: RiskCategory
  riskLevel: RiskLevel
  priority: 'High' | 'Medium' | 'Low'
  status: 'OPEN' | 'MITIGATED' | 'CLOSED'
  systemId: string
  upbId?: string
  subsystemId?: string
  viewId?: string
  lengthKm?: number
  circuits?: number
  loadingPct?: number
  condition: string
  impact: string
  mitigation: string
  solution: RiskSolution
  location: string
  updatedAt: string
  /** Objek SLD tempat pin kerawanan ditempel. */
  attach?: { kind: RiskAttachKind; code: string }
  /** Aset-aset yang terlibat di jalur kerawanan (tab "Aset Terkait"). */
  relatedAssets?: RelatedAsset[]
}

export interface Ibt {
  id: string
  name: string
  substation: string
  upbId: string
  subsystemId?: string
  capacityMVA: number
  voltage: string
  units: number
  loadingPct: number
  riskNumber?: number
  riskLevel: RiskLevel
  status: 'Beroperasi' | 'Pemeliharaan'
}

// ---------------------------------------------------------------------------
// SLD (Single Line Diagram) — mengikuti kontrak /api/views/{id}/graph engine
// ---------------------------------------------------------------------------

export type SldStatus = 'ENERGIZED' | 'DE_ENERGIZED' | 'PLANNED'
export type SldNodeRole = 'SOURCE' | 'CORE' | 'BOUNDARY'

export interface SldNode {
  code: string
  name: string
  type: 'GITET' | 'GI' | 'GIS'
  voltageKv: 500 | 150 | 70
  role: SldNodeRole
  /** Tier band (1..n). 500 kV source digambar di atas Tier 1 (tier 0). */
  tier: number
  status: SldStatus
  /** Pusat busbar pada sumbu X (unit SVG). */
  x: number
  /** Setengah panjang busbar. */
  halfWidth: number
  /** Jumlah trafo beban 150/20 kV yang digambar di bawah bus. */
  transformers?: number
  /** Jumlah shunt capacitor. */
  capacitors?: number
  busbarConfig?: string
  busbarNote?: string
  note?: string
  /** Label diletakkan di atas bus (default: kanan bus). */
  labelTop?: boolean
}

export interface SldCircuit {
  id: string
  code: string
  name: string
  type: 'SUTT' | 'SKTT' | 'SUTET'
  voltageKv: 500 | 150 | 70
  from: string
  to: string
  /** Offset port dari pusat bus asal / tujuan. */
  fromPort: number
  toPort: number
  circuitCount: 1 | 2
  status: SldStatus
  lengthKm?: number
  loadingPct?: number
  note?: string
}

export interface SldIbtLink {
  id: string
  code: string
  name: string
  from: string
  to: string
  x: number
  capacityMVA: number
  loadingPct: number
  status: SldStatus
}

export interface SldBay {
  id: string
  code: string
  name: string
  busCode: string
  x: number
  circuitCount: 1 | 2
  status: SldStatus
  note?: string
}

export interface SldGraph {
  id: string
  subsystemId: string
  title: string
  viewName: string
  ruleProfile: 'SUBSYSTEM_150' | 'SUBSYSTEM_500_150' | 'BACKBONE_500'
  tierCount: number
  nodes: SldNode[]
  circuits: SldCircuit[]
  ibtLinks: SldIbtLink[]
  bays: SldBay[]
}

/** Objek yang sedang dipilih pada kanvas SLD. */
export type SldSelection =
  | { kind: 'node'; node: SldNode }
  | { kind: 'circuit'; circuit: SldCircuit }
  | { kind: 'ibt'; ibt: SldIbtLink }
  | { kind: 'bay'; bay: SldBay }
  | { kind: 'risk'; risk: RiskItem }
  | null
