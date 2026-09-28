import type { Subsystem } from '@/types'

export const subsystems: Subsystem[] = [
  // UP2B Jakarta & Banten
  {
    id: 'ss-lbk',
    upbId: 'upb-jakban',
    code: 'SS_LBK',
    name: 'Subsistem Lontar - Balaraja 1,2 - Kembangan 1,2',
    giCount: 21,
    ibtCount: 4,
    riskLevel: 'Sangat Rawan',
    peakLoadMW: 2150,
    description:
      'Dipasok IBT 1,2 Kembangan dan IBT 1,2 Balaraja serta PLTU Lontar. Satu SS digambar pada dua halaman buku (dua sudut pandang).',
    sourceRef: 'Buku Kerawanan SJB 2026 §2.5',
    views: [{ id: 'lbk-full', name: 'SLD lengkap' }],
  },
  {
    id: 'ss-bll',
    upbId: 'upb-jakban',
    code: 'SS_BLL',
    name: 'Subsistem Balaraja 3,4 - Lengkong 1,2',
    giCount: 9,
    ibtCount: 4,
    riskLevel: 'Rawan',
    peakLoadMW: 1320,
    description: 'Dua sumber Tier-1 independen (IBT 3,4 Balaraja dan IBT 1,2 Lengkong) yang bertemu jauh di hilir.',
    sourceRef: 'Buku Kerawanan SJB 2026 §2.6',
    views: [{ id: 'bll-full', name: 'SLD lengkap' }],
  },
  {
    id: 'ss-srlya',
    upbId: 'upb-jakban',
    code: 'SS_SRLYA',
    name: 'Subsistem Suralaya 1,2 - Cilegon 4',
    giCount: 16,
    ibtCount: 3,
    riskLevel: 'Sangat Rawan',
    peakLoadMW: 1850,
    description: 'Evakuasi daya PLTU Suralaya Unit 3, IBT 1 & 2 Suralaya, dan IBT 4 Cilegon Baru melayani kawasan industri Cilegon.',
    sourceRef: 'Buku Kerawanan SJB 2026 §2.1',
    views: [{ id: 'srlya-full', name: 'SLD lengkap' }],
  },
]
