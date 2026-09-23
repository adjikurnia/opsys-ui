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
  // Jawa Barat
  { id: 'gi-cibng', code: 'CIBNG', name: 'GITET Cibinong', type: 'GITET', voltageKv: 500, upbId: 'upb-jabar', subsystemId: 'ss-bogor', lat: -6.48, lng: 106.85, status: 'Rawan' },
  { id: 'gi-bksi', code: 'BKSI', name: 'GITET Bekasi', type: 'GITET', voltageKv: 500, upbId: 'upb-jabar', lat: -6.24, lng: 107.0, status: 'Waspada' },
  { id: 'gi-crata', code: 'CRATA', name: 'GITET Cirata', type: 'GITET', voltageKv: 500, upbId: 'upb-jabar', subsystemId: 'ss-bdsel', lat: -6.7, lng: 107.37, status: 'Normal' },
  { id: 'gi-sglng', code: 'SGLNG', name: 'GITET Saguling', type: 'GITET', voltageKv: 500, upbId: 'upb-jabar', subsystemId: 'ss-bdsel', lat: -6.9, lng: 107.37, status: 'Normal' },
  { id: 'gi-bdsel', code: 'BDSEL', name: 'GITET Bandung Selatan', type: 'GITET', voltageKv: 500, upbId: 'upb-jabar', subsystemId: 'ss-bdsel', lat: -7.02, lng: 107.6, status: 'Waspada' },
  { id: 'gi-tsik', code: 'TSIK', name: 'GITET Tasikmalaya', type: 'GITET', voltageKv: 500, upbId: 'upb-jabar', lat: -7.33, lng: 108.2, status: 'Normal' },
  // Jawa Tengah
  { id: 'gi-ungrn', code: 'UNGRN', name: 'GITET Ungaran', type: 'GITET', voltageKv: 500, upbId: 'upb-jateng', subsystemId: 'ss-ungaran', lat: -7.14, lng: 110.4, status: 'Waspada' },
  { id: 'gi-pedan', code: 'PEDAN', name: 'GITET Pedan', type: 'GITET', voltageKv: 500, upbId: 'upb-jateng', lat: -7.72, lng: 110.68, status: 'Normal' },
  { id: 'gi-ksghn', code: 'KSGHN', name: 'GITET Kesugihan', type: 'GITET', voltageKv: 500, upbId: 'upb-jateng', lat: -7.68, lng: 109.07, status: 'Normal' },
  { id: 'gi-pmlng', code: 'PMLNG', name: 'GITET Pemalang', type: 'GITET', voltageKv: 500, upbId: 'upb-jateng', lat: -6.93, lng: 109.36, status: 'Normal' },
  { id: 'gi-tjati', code: 'TJATI', name: 'GITET Tanjung Jati', type: 'GITET', voltageKv: 500, upbId: 'upb-jateng', lat: -6.45, lng: 110.75, status: 'Normal' },
  // Jawa Timur
  { id: 'gi-krian', code: 'KRIAN', name: 'GITET Krian', type: 'GITET', voltageKv: 500, upbId: 'upb-jatim', subsystemId: 'ss-krian', lat: -7.4, lng: 112.58, status: 'Rawan' },
  { id: 'gi-grsik', code: 'GRSIK', name: 'GITET Gresik', type: 'GITET', voltageKv: 500, upbId: 'upb-jatim', subsystemId: 'ss-krian', lat: -7.17, lng: 112.62, status: 'Waspada' },
  { id: 'gi-ngbng', code: 'NGBNG', name: 'GITET Ngimbang', type: 'GITET', voltageKv: 500, upbId: 'upb-jatim', lat: -7.25, lng: 112.3, status: 'Normal' },
  { id: 'gi-grati', code: 'GRATI', name: 'GITET Grati', type: 'GITET', voltageKv: 500, upbId: 'upb-jatim', lat: -7.7, lng: 113.0, status: 'Normal' },
  { id: 'gi-paitn', code: 'PAITN', name: 'GITET Paiton', type: 'GITET', voltageKv: 500, upbId: 'upb-jatim', lat: -7.72, lng: 113.55, status: 'Normal' },
  // Bali
  { id: 'gi-kapal', code: 'KAPAL', name: 'GIS Kapal', type: 'GIS', voltageKv: 150, upbId: 'upb-bali', subsystemId: 'ss-bali', lat: -8.58, lng: 115.15, status: 'Waspada' },
  { id: 'gi-psgrn', code: 'PSGRN', name: 'GI Pesanggaran', type: 'GI', voltageKv: 150, upbId: 'upb-bali', subsystemId: 'ss-bali', lat: -8.73, lng: 115.21, status: 'Normal' },
  { id: 'gi-glmnk', code: 'GLMNK', name: 'GI Gilimanuk', type: 'GI', voltageKv: 150, upbId: 'upb-bali', subsystemId: 'ss-bali', lat: -8.17, lng: 114.44, status: 'Rawan' },
  { id: 'gi-antsr', code: 'ANTSR', name: 'GI Antosari', type: 'GI', voltageKv: 150, upbId: 'upb-bali', subsystemId: 'ss-bali', lat: -8.5, lng: 114.98, status: 'Normal' },
]
