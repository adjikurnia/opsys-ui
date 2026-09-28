import type { PowerSystem } from '@/types'

export const powerSystems: PowerSystem[] = [
  {
    id: 'jamali',
    name: 'Jawa, Madura dan Bali',
    region: 'Jawa, Madura & Bali',
    riskLevel: 'Rawan',
    upbCount: 1,
    subsystemCount: 3,
    giCount: 68,
    ibtCount: 18,
    risks: { n1: 4, n2: 2, n12: 2 },
    lat: -7.25,
    lng: 110.0,
    description:
      'Sistem interkoneksi backbone 500 kV & 150 kV terbesar di Indonesia dengan beban puncak mencapai 32.500 MW.',
    active: true,
  },
]
