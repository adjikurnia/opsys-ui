import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { powerSystems } from '@/data/systems'
import { upbs } from '@/data/upbs'
import { subsystems } from '@/data/subsystems'
import { substations } from '@/data/substations'
import { risks } from '@/data/risks'
import { ibts } from '@/data/ibts'
import { sldGraphs } from '@/data/sld'
import type { RiskCounts, RiskItem } from '@/types'

/**
 * Store data hardcode. Nantinya getter di sini diganti pemanggilan BE;
 * komponen hanya bergantung pada bentuk return-nya.
 */
export const useOpsysStore = defineStore('opsys', () => {
  const riskDialogOpen = ref(false)

  const systemById = (id: string) => powerSystems.find((s) => s.id === id)
  const upbById = (id: string) => upbs.find((u) => u.id === id)
  const subsystemById = (id: string) => subsystems.find((s) => s.id === id)

  const upbsBySystem = (systemId: string) => upbs.filter((u) => u.systemId === systemId)
  const subsystemsByUpb = (upbId: string) => subsystems.filter((s) => s.upbId === upbId)
  const substationsByUpb = (upbId: string) => substations.filter((g) => g.upbId === upbId)

  const risksBySystem = (systemId: string) => risks.filter((r) => r.systemId === systemId)
  const risksByUpb = (upbId: string) => risks.filter((r) => r.upbId === upbId)
  const risksBySubsystem = (subsystemId: string) => risks.filter((r) => r.subsystemId === subsystemId)
  const risksByView = (viewId: string) => risks.filter((r) => r.viewId === viewId)
  const riskByNumber = (n: number) => risks.find((r) => r.number === n)

  const ibtsBySystem = (systemId: string) => {
    const upbIds = new Set(upbsBySystem(systemId).map((u) => u.id))
    return ibts.filter((i) => upbIds.has(i.upbId))
  }

  const graphsBySubsystem = (subsystemId: string) => sldGraphs.filter((g) => g.subsystemId === subsystemId)
  const graphById = (id: string) => sldGraphs.find((g) => g.id === id)

  const totalRisks = computed(() => risks.length)

  /** Rekap N-1/N-2/N-1-2 dihitung langsung dari data kerawanan — satu sumber kebenaran, tidak ada angka hardcode terpisah yang bisa berbeda. */
  const countByCategory = (list: RiskItem[]): RiskCounts => ({
    n1: list.filter((r) => r.category === 'N-1').length,
    n2: list.filter((r) => r.category === 'N-2').length,
    n12: list.filter((r) => r.category === 'N-1-2').length,
  })
  const riskCountsBySystem = (systemId: string) => countByCategory(risksBySystem(systemId))
  const riskCountsByUpb = (upbId: string) => countByCategory(risksByUpb(upbId))
  const riskCountsBySubsystem = (subsystemId: string) => countByCategory(risksBySubsystem(subsystemId))

  return {
    riskDialogOpen,
    systems: powerSystems,
    allRisks: risks,
    totalRisks,
    systemById,
    upbById,
    subsystemById,
    upbsBySystem,
    subsystemsByUpb,
    substationsByUpb,
    risksBySystem,
    risksByUpb,
    risksBySubsystem,
    risksByView,
    riskByNumber,
    riskCountsBySystem,
    riskCountsByUpb,
    riskCountsBySubsystem,
    ibtsBySystem,
    graphsBySubsystem,
    graphById,
  }
})
