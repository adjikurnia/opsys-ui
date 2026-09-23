import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
import { useOpsysStore } from '@/stores/opsys'

export interface Crumb {
  title: string
  to?: RouteLocationRaw
  disabled?: boolean
}

/** Breadcrumb hirarki diturunkan dari param route (menggantikan sidebar). */
export function useBreadcrumbs() {
  const route = useRoute()
  const store = useOpsysStore()

  const crumbs = computed<Crumb[]>(() => {
    const items: Crumb[] = [{ title: 'Indonesia', to: { name: 'national' } }]
    const systemId = route.params.systemId as string | undefined
    const upbId = route.params.upbId as string | undefined
    const subsystemId = route.params.subsystemId as string | undefined

    if (systemId) {
      const sys = store.systemById(systemId)
      items.push({ title: sys?.name ?? systemId, to: { name: 'system', params: { systemId } } })
    }
    if (route.name === 'ibt-list' && systemId) {
      items.push({ title: 'Daftar IBT' })
    }
    if (upbId && systemId) {
      const upb = store.upbById(upbId)
      items.push({ title: upb?.name ?? upbId, to: { name: 'upb', params: { systemId, upbId } } })
    }
    if (subsystemId) {
      const sub = store.subsystemById(subsystemId)
      items.push({ title: sub?.name ?? subsystemId })
    }
    const last = items[items.length - 1]
    if (last) last.disabled = true
    return items
  })

  const pageTitle = computed(() => {
    switch (route.name) {
      case 'national':
        return 'Peta Kerawanan Nasional'
      case 'system':
        return 'Peta Kerawanan Sistem'
      case 'upb':
        return 'Unit Pelaksana Pengatur Beban (UP2B)'
      case 'subsystem':
        return 'Subsistem & Single Line Diagram'
      case 'ibt-list':
        return 'Daftar Interbus Transformer (IBT)'
      default:
        return 'Operation System'
    }
  })

  return { crumbs, pageTitle }
}
