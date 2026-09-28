import type { Substation } from '@/types'

/** Sebaran GI / GITET untuk peta wilayah UP2B (posisi perkiraan). */
export const substations: Substation[] = [
  // Jakarta & Banten
  { id: 'gi-gndul', code: 'GNDUL', name: 'GITET Gandul', type: 'GITET', voltageKv: 500, upbId: 'upb-jakban', lat: -6.334, lng: 106.751, status: 'Rawan' },
  { id: 'gi-kmbgn', code: 'KMBGN', name: 'GITET Kembangan', type: 'GITET', voltageKv: 500, upbId: 'upb-jakban', subsystemId: 'ss-lbk', lat: -6.19, lng: 106.735, status: 'Rawan' },
  { id: 'gi-dksbi', code: 'DKSBI', name: 'GITET Duri Kosambi', type: 'GITET', voltageKv: 500, upbId: 'upb-jakban', subsystemId: 'ss-lbk', lat: -6.16, lng: 106.72, status: 'Rawan' },
  { id: 'gi-mkrng', code: 'MKRNG', name: 'GITET Muara Karang', type: 'GITET', voltageKv: 500, upbId: 'upb-jakban', lat: -6.105, lng: 106.78, status: 'Waspada' },
  { id: 'gi-cwang', code: 'CWANG', name: 'GITET Cawang', type: 'GITET', voltageKv: 500, upbId: 'upb-jakban', lat: -6.245, lng: 106.87, status: 'Normal' },
  { id: 'gi-blrja', code: 'BLRJA', name: 'GITET Balaraja', type: 'GITET', voltageKv: 500, upbId: 'upb-jakban', subsystemId: 'ss-bll', lat: -6.19, lng: 106.45, status: 'Waspada' },
  { id: 'gi-srlya', code: 'SRLYA', name: 'GITET Suralaya', type: 'GITET', voltageKv: 500, upbId: 'upb-jakban', subsystemId: 'ss-srlya', lat: -5.89, lng: 106.03, status: 'Rawan' },
  { id: 'gi-clgon', code: 'CLGON', name: 'GITET Cilegon', type: 'GITET', voltageKv: 500, upbId: 'upb-jakban', subsystemId: 'ss-srlya', lat: -6.01, lng: 106.05, status: 'Waspada' },
  { id: 'gi-lgkng', code: 'LGKNG', name: 'GITET Lengkong', type: 'GITET', voltageKv: 500, upbId: 'upb-jakban', subsystemId: 'ss-bll', lat: -6.29, lng: 106.63, status: 'Normal' },
]
