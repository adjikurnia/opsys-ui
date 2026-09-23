import { computed, type Ref } from 'vue'
import type { RiskItem, SldBay, SldCircuit, SldGraph, SldIbtLink, SldNode } from '@/types'
import { voltageHex } from './useRiskStyle'

// Konstanta geometri meniru renderer engine (unit SVG).
export const SLD = {
  sourceY: 80, // bus 500 kV sumber (di atas Tier 1)
  tierTop: 150, // garis Tier 1
  tierGap: 220,
  busStroke: 6,
  wireStroke: 2.2,
  pitch: 14, // jarak antar sirkit dalam satu bundel
  pmt: 10, // ukuran kotak PMT
  bayLen: 42,
  padX: 60,
}

export const busY = (tier: number) => (tier === 0 ? SLD.sourceY : SLD.tierTop + SLD.tierGap * (tier - 1) + 60)
export const tierLineY = (tier: number) => SLD.tierTop + SLD.tierGap * (tier - 1)

export interface WireGeom {
  d: string
  /** titik tengah (untuk pin kerawanan) */
  mid: { x: number; y: number }
  pmts: { x: number; y: number }[]
}
export interface CircuitGeom {
  circuit: SldCircuit
  color: string
  dash?: string
  wires: WireGeom[]
}
export interface NodeGeom {
  node: SldNode
  y: number
  x1: number
  x2: number
  color: string
  labelX: number
  labelY: number
  labelAnchor: 'start' | 'middle'
  transformers: number[] // x positions
  capacitors: number[]
}
export interface IbtGeom {
  ibt: SldIbtLink
  y1: number
  y2: number
}
export interface BayGeom {
  bay: SldBay
  y: number
  color: string
  xs: number[]
}
export interface RiskPinGeom {
  risk: RiskItem
  x: number
  y: number
}

function orthoPath(x1: number, y1: number, x2: number, y2: number, bend: number): string {
  if (Math.abs(x1 - x2) < 0.5) return `M${x1},${y1} L${x2},${y2}`
  return `M${x1},${y1} L${x1},${bend} L${x2},${bend} L${x2},${y2}`
}

/**
 * Menurunkan geometri gambar dari graph deklaratif: bus per Tier, routing
 * orthogonal berpasangan (pitch 14), simbol trafo/kapasitor, bay stub, pin.
 */
export function useSldLayout(graph: Ref<SldGraph | undefined>, risks: Ref<RiskItem[]>) {
  const nodeMap = computed(() => new Map((graph.value?.nodes ?? []).map((n) => [n.code, n])))

  const nodes = computed<NodeGeom[]>(() =>
    (graph.value?.nodes ?? []).map((node) => {
      const y = busY(node.tier)
      const x1 = node.x - node.halfWidth
      const x2 = node.x + node.halfWidth
      const symbolCount = (node.transformers ?? 0) + (node.capacitors ?? 0)
      const step = 46
      const start = x1 + 46
      const xs = Array.from({ length: symbolCount }, (_, i) => start + i * step)
      return {
        node,
        y,
        x1,
        x2,
        color: voltageHex(node.voltageKv),
        labelX: node.labelTop ? node.x : x2 + 6,
        labelY: node.labelTop ? y - 12 : y + 3,
        labelAnchor: node.labelTop ? 'middle' : 'start',
        transformers: xs.slice(0, node.transformers ?? 0),
        capacitors: xs.slice(node.transformers ?? 0),
      }
    }),
  )

  const circuits = computed<CircuitGeom[]>(() =>
    (graph.value?.circuits ?? []).flatMap((c) => {
      const a = nodeMap.value.get(c.from)
      const b = nodeMap.value.get(c.to)
      if (!a || !b) return []
      const y1 = busY(a.tier)
      const y2 = busY(b.tier)
      const x1 = a.x + c.fromPort
      const x2 = b.x + c.toPort
      const sameRow = Math.abs(y1 - y2) < 1
      const n = c.circuitCount
      const wires: WireGeom[] = []
      for (let i = 0; i < n; i++) {
        const off = n === 1 ? 0 : (i === 0 ? -1 : 1) * (SLD.pitch / 2)
        const wx1 = x1 + off
        const wx2 = x2 + off
        // Bundel: sirkit kedua dibelokkan 14 unit lebih jauh dari bus asal
        const bend = sameRow ? y1 + 73 + (i === 0 ? 0 : SLD.pitch) : y1 + (y2 - y1) * 0.73 + (i === 0 ? 0 : SLD.pitch) * Math.sign(y2 - y1)
        const d = orthoPath(wx1, y1, wx2, y2, bend)
        const dir1 = sameRow ? 1 : Math.sign(y2 - y1)
        const pmts = [
          { x: wx1 - 5, y: y1 + dir1 * 7 - 5 },
          { x: wx2 - 5, y: y2 - (sameRow ? -1 : dir1) * 7 - 5 },
        ]
        const mid = Math.abs(wx1 - wx2) < 0.5 ? { x: wx1, y: (y1 + y2) / 2 } : { x: (wx1 + wx2) / 2, y: bend }
        wires.push({ d, mid, pmts })
      }
      const isCable = c.type === 'SKTT'
      const color = c.status === 'DE_ENERGIZED' ? '#9AA0A6' : c.status === 'PLANNED' ? '#9AA0A6' : voltageHex(c.voltageKv)
      return [{ circuit: c, color, dash: isCable ? '7 5' : c.status === 'PLANNED' ? '2 4' : undefined, wires }]
    }),
  )

  const ibtLinks = computed<IbtGeom[]>(() =>
    (graph.value?.ibtLinks ?? []).flatMap((ibt) => {
      const a = nodeMap.value.get(ibt.from)
      const b = nodeMap.value.get(ibt.to)
      if (!a || !b) return []
      return [{ ibt, y1: busY(a.tier), y2: busY(b.tier) }]
    }),
  )

  const bays = computed<BayGeom[]>(() =>
    (graph.value?.bays ?? []).flatMap((bay) => {
      const bus = nodeMap.value.get(bay.busCode)
      if (!bus) return []
      const xs = bay.circuitCount === 2 ? [bay.x - 7, bay.x + 7] : [bay.x]
      const color = bay.status === 'ENERGIZED' ? voltageHex(bus.voltageKv) : '#9AA0A6'
      return [{ bay, y: busY(bus.tier), color, xs }]
    }),
  )

  const riskPins = computed<RiskPinGeom[]>(() =>
    risks.value.flatMap((risk) => {
      const at = risk.attach
      if (!at) return []
      if (at.kind === 'SUBSTATION') {
        const g = nodes.value.find((n) => n.node.code === at.code)
        return g ? [{ risk, x: g.x2 + (g.node.labelTop ? 12 : 70), y: g.y + 22 }] : []
      }
      if (at.kind === 'CIRCUIT') {
        const g = circuits.value.find((c) => c.circuit.code === at.code)
        const w = g?.wires[g.wires.length - 1]
        return w ? [{ risk, x: w.mid.x + 14, y: w.mid.y }] : []
      }
      if (at.kind === 'TRANSFORMER') {
        const g = ibtLinks.value.find((i) => i.ibt.code === at.code)
        return g ? [{ risk, x: g.ibt.x - 26, y: (g.y1 + g.y2) / 2 + 5 }] : []
      }
      if (at.kind === 'BAY') {
        const g = bays.value.find((b) => b.bay.code === at.code)
        return g ? [{ risk, x: g.bay.x + 24, y: g.y + SLD.bayLen + 4 }] : []
      }
      return []
    }),
  )

  const tiers = computed(() => Array.from({ length: graph.value?.tierCount ?? 0 }, (_, i) => i + 1))

  const bounds = computed(() => {
    const g = graph.value
    if (!g) return { width: 1200, height: 800 }
    const maxX = Math.max(...g.nodes.map((n) => n.x + n.halfWidth + 120), 800)
    const maxTier = Math.max(...g.nodes.map((n) => n.tier), g.tierCount)
    return { width: maxX + SLD.padX, height: busY(maxTier) + 140 }
  })

  return { nodes, circuits, ibtLinks, bays, riskPins, tiers, bounds }
}
