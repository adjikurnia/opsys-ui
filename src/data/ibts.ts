import type { Ibt } from '@/types'

export const ibts: Ibt[] = [
  { id: 'ibt-kmbgn', name: 'IBT 1 & 2 Kembangan', substation: 'GITET Kembangan', upbId: 'upb-jakban', subsystemId: 'ss-lbk', capacityMVA: 1000, voltage: '500/150 kV', units: 2, loadingPct: 86, riskNumber: 1, riskLevel: 'Sangat Rawan', status: 'Beroperasi' },
  { id: 'ibt-blrja-12', name: 'IBT 1 & 2 Balaraja', substation: 'GITET Balaraja', upbId: 'upb-jakban', subsystemId: 'ss-lbk', capacityMVA: 1000, voltage: '500/150 kV', units: 2, loadingPct: 68, riskLevel: 'Sedang', status: 'Beroperasi' },
  { id: 'ibt-blrja-34', name: 'IBT 3 & 4 Balaraja', substation: 'GITET Balaraja', upbId: 'upb-jakban', subsystemId: 'ss-bll', capacityMVA: 1000, voltage: '500/150 kV', units: 2, loadingPct: 81, riskNumber: 7, riskLevel: 'Rawan', status: 'Beroperasi' },
  { id: 'ibt-lgkng', name: 'IBT 1 & 2 Lengkong', substation: 'GITET Lengkong', upbId: 'upb-jakban', subsystemId: 'ss-bll', capacityMVA: 1000, voltage: '500/150 kV', units: 2, loadingPct: 57, riskLevel: 'Aman', status: 'Beroperasi' },
  { id: 'ibt-srlya', name: 'IBT 1 & 2 Suralaya', substation: 'GITET Suralaya', upbId: 'upb-jakban', subsystemId: 'ss-srlya', capacityMVA: 500, voltage: '500/150 kV', units: 2, loadingPct: 84, riskLevel: 'Sangat Rawan', status: 'Beroperasi' },
  { id: 'ibt-clgon', name: 'IBT 4 Cilegon Baru', substation: 'GITET Cilegon', upbId: 'upb-jakban', subsystemId: 'ss-srlya', capacityMVA: 500, voltage: '500/150 kV', units: 1, loadingPct: 62, riskLevel: 'Sedang', status: 'Beroperasi' },
  { id: 'ibt-dksbi', name: 'IBT 1 & 2 Duri Kosambi', substation: 'GITET Duri Kosambi', upbId: 'upb-jakban', capacityMVA: 1000, voltage: '500/150 kV', units: 2, loadingPct: 55, riskLevel: 'Sedang', status: 'Beroperasi' },
  { id: 'ibt-cibng', name: 'IBT 1 & 2 Cibinong', substation: 'GITET Cibinong', upbId: 'upb-jabar', subsystemId: 'ss-bogor', capacityMVA: 1000, voltage: '500/150 kV', units: 2, loadingPct: 74, riskLevel: 'Rawan', status: 'Beroperasi' },
  { id: 'ibt-ungrn', name: 'IBT 1 & 2 Ungaran', substation: 'GITET Ungaran', upbId: 'upb-jateng', subsystemId: 'ss-ungaran', capacityMVA: 1000, voltage: '500/150 kV', units: 2, loadingPct: 48, riskLevel: 'Aman', status: 'Pemeliharaan' },
  { id: 'ibt-krian', name: 'IBT 1, 2 & 3 Krian', substation: 'GITET Krian', upbId: 'upb-jatim', subsystemId: 'ss-krian', capacityMVA: 1500, voltage: '500/150 kV', units: 3, loadingPct: 70, riskLevel: 'Rawan', status: 'Beroperasi' },
]
