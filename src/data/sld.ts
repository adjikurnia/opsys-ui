import type { SldGraph } from '@/types'

/**
 * Graph SLD per sudut pandang. Koordinat X ditulis manual (unit SVG),
 * koordinat Y diturunkan dari Tier oleh composable useSldLayout.
 */
export const sldGraphs: SldGraph[] = [
  // -------------------------------------------------------------------------
  // SS Lontar - Balaraja 1,2 - Kembangan 1,2 — satu gambar penuh
  // (kiri: simpul Kembangan, kanan: simpul Lontar-Balaraja)
  // -------------------------------------------------------------------------
  {
    id: 'lbk-full',
    subsystemId: 'ss-lbk',
    title: 'SS Lontar - Balaraja 1,2 - Kembangan 1,2',
    viewName: 'SLD lengkap',
    ruleProfile: 'SUBSYSTEM_150',
    tierCount: 6,
    nodes: [
      { code: 'GITET_KMBGN', name: 'GITET Kembangan', type: 'GITET', voltageKv: 500, role: 'SOURCE', tier: 0, status: 'ENERGIZED', x: 688, halfWidth: 49, labelTop: true, note: 'GITET 500 kV, 2x IBT 500/150 ke bus Kembangan 150 kV.' },
      { code: 'KMBGN', name: 'Kembangan', type: 'GI', voltageKv: 150, role: 'SOURCE', tier: 1, status: 'ENERGIZED', x: 688, halfWidth: 161, transformers: 1, busbarConfig: 'DOUBLE_1CB', busbarNote: '2 bus, 1 CB kopel, tanpa section', note: 'Bus 150 kV disuplai IBT-1,2 Kembangan. Kerawanan #1.' },
      { code: 'MTLAN', name: 'Metland', type: 'GI', voltageKv: 150, role: 'CORE', tier: 2, status: 'ENERGIZED', x: 552, halfWidth: 69, transformers: 1 },
      { code: 'NSYAN', name: 'New Senayan', type: 'GI', voltageKv: 150, role: 'CORE', tier: 2, status: 'ENERGIZED', x: 823, halfWidth: 92, transformers: 1, note: 'Simpul kerawanan #2 dan #6.' },
      { code: 'CLDUG', name: 'Ciledug', type: 'GI', voltageKv: 150, role: 'CORE', tier: 3, status: 'ENERGIZED', x: 575, halfWidth: 92, transformers: 1, capacitors: 1 },
      { code: 'ULJMI', name: 'Ulujami', type: 'GI', voltageKv: 150, role: 'CORE', tier: 3, status: 'ENERGIZED', x: 823, halfWidth: 55, transformers: 1, note: 'Dead-end load (trafo 150/20 saja).' },
      { code: 'SNYAN', name: 'Senayan', type: 'GIS', voltageKv: 150, role: 'CORE', tier: 3, status: 'ENERGIZED', x: 1466, halfWidth: 138, transformers: 1, note: 'GIS kawasan Zero Down Time (ZDT), dipasok radial dari SKTT New Senayan - Senayan. Kerawanan #6.' },
      { code: 'ALTRA', name: 'Alam Sutera', type: 'GI', voltageKv: 150, role: 'CORE', tier: 4, status: 'ENERGIZED', x: 621, halfWidth: 69, transformers: 1 },
      { code: 'CKUPA', name: 'Cikupa', type: 'GI', voltageKv: 150, role: 'CORE', tier: 4, status: 'ENERGIZED', x: 1148, halfWidth: 115, transformers: 1, labelTop: true },
      { code: 'DNYSA', name: 'Danayasa', type: 'GIS', voltageKv: 150, role: 'BOUNDARY', tier: 4, status: 'ENERGIZED', x: 1488, halfWidth: 115, transformers: 1, busbarNote: 'Gap bus section di SLD' },
      { code: 'SGS', name: 'Summarecon Gading Serpong', type: 'GI', voltageKv: 150, role: 'CORE', tier: 5, status: 'ENERGIZED', x: 644, halfWidth: 69, transformers: 1 },
      { code: 'CURUG', name: 'Curug', type: 'GI', voltageKv: 150, role: 'CORE', tier: 5, status: 'ENERGIZED', x: 1041, halfWidth: 69, transformers: 1 },
      { code: 'JTAKE', name: 'Jatake', type: 'GI', voltageKv: 150, role: 'CORE', tier: 5, status: 'ENERGIZED', x: 1358, halfWidth: 138, transformers: 1, capacitors: 2 },
      { code: 'MAXIM', name: 'Maxim', type: 'GI', voltageKv: 150, role: 'CORE', tier: 6, status: 'ENERGIZED', x: 1404, halfWidth: 92, transformers: 3 },
      { code: 'GITET_BLRJA', name: 'GITET Balaraja', type: 'GITET', voltageKv: 500, role: 'SOURCE', tier: 0, status: 'ENERGIZED', x: 2100, halfWidth: 49, labelTop: true },
      { code: 'BLRJA', name: 'Balaraja', type: 'GI', voltageKv: 150, role: 'SOURCE', tier: 1, status: 'ENERGIZED', x: 2100, halfWidth: 150, transformers: 1, note: 'Bus 150 kV disuplai IBT-1,2 Balaraja dan PLTU Lontar.' },
      { code: 'TGRBR', name: 'Tangerang Baru', type: 'GI', voltageKv: 150, role: 'CORE', tier: 2, status: 'ENERGIZED', x: 1950, halfWidth: 80, transformers: 2 },
      { code: 'PSKMB', name: 'Pasar Kemis Baru', type: 'GI', voltageKv: 150, role: 'CORE', tier: 2, status: 'ENERGIZED', x: 2300, halfWidth: 80, transformers: 1 },
      { code: 'LNTAR', name: 'PLTU Lontar', type: 'GI', voltageKv: 150, role: 'SOURCE', tier: 1, status: 'ENERGIZED', x: 2560, halfWidth: 90, note: 'Pembangkit 3x315 MW, evakuasi ke bus Balaraja.' },
      { code: 'GJTGL', name: 'Gajah Tunggal', type: 'GI', voltageKv: 150, role: 'CORE', tier: 3, status: 'ENERGIZED', x: 2300, halfWidth: 60, transformers: 1 },
      { code: 'PSKMS', name: 'Pasar Kemis', type: 'GI', voltageKv: 150, role: 'BOUNDARY', tier: 4, status: 'ENERGIZED', x: 2300, halfWidth: 80, transformers: 1 },
      { code: 'TLKNG', name: 'Teluknaga', type: 'GI', voltageKv: 150, role: 'CORE', tier: 3, status: 'ENERGIZED', x: 1950, halfWidth: 70, transformers: 1 },
    ],
    circuits: [
      { id: 'c5', code: 'PHT_KMBGN_MTLAN', name: 'Kembangan - Metland', type: 'SKTT', voltageKv: 150, from: 'KMBGN', to: 'MTLAN', fromPort: -46, toPort: 0, circuitCount: 2, status: 'ENERGIZED', lengthKm: 7.2, loadingPct: 54 },
      { id: 'c7', code: 'SKTT_KMBGN_NSYAN', name: 'Kembangan - New Senayan', type: 'SKTT', voltageKv: 150, from: 'KMBGN', to: 'NSYAN', fromPort: 0, toPort: 0, circuitCount: 2, status: 'ENERGIZED', lengthKm: 9.8, loadingPct: 72 },
      { id: 'c6', code: 'PHT_MTLAN_CLDUG', name: 'Metland - Ciledug', type: 'SKTT', voltageKv: 150, from: 'MTLAN', to: 'CLDUG', fromPort: 23, toPort: 0, circuitCount: 2, status: 'ENERGIZED', lengthKm: 5.1, loadingPct: 48 },
      { id: 'c11', code: 'PHT_NSYAN_ULJMI', name: 'New Senayan - Ulujami', type: 'SKTT', voltageKv: 150, from: 'NSYAN', to: 'ULJMI', fromPort: 0, toPort: 0, circuitCount: 2, status: 'ENERGIZED', lengthKm: 4.3, loadingPct: 39 },
      { id: 'c10', code: 'SKTT_NSYAN_SNYAN', name: 'New Senayan - Senayan', type: 'SKTT', voltageKv: 150, from: 'NSYAN', to: 'SNYAN', fromPort: 46, toPort: 0, circuitCount: 2, status: 'ENERGIZED', lengthKm: 3.6, loadingPct: 58 },
      { id: 'c15', code: 'PHT_CLDUG_ALTRA', name: 'Ciledug - Alam Sutera', type: 'SKTT', voltageKv: 150, from: 'CLDUG', to: 'ALTRA', fromPort: 46, toPort: 0, circuitCount: 2, status: 'ENERGIZED', lengthKm: 8.4, loadingPct: 44 },
      { id: 'c16', code: 'PHT_ALTRA_SGS', name: 'Alam Sutera - Summarecon Gading Serpong', type: 'SKTT', voltageKv: 150, from: 'ALTRA', to: 'SGS', fromPort: 23, toPort: 0, circuitCount: 2, status: 'ENERGIZED', lengthKm: 6.0, loadingPct: 41 },
      { id: 'c17', code: 'PHT_SGS_CURUG', name: 'Summarecon Gading Serpong - Curug', type: 'SKTT', voltageKv: 150, from: 'SGS', to: 'CURUG', fromPort: 23, toPort: 23, circuitCount: 2, status: 'ENERGIZED', lengthKm: 11.2, loadingPct: 36 },
      { id: 'c18', code: 'PHT_CURUG_CKUPA', name: 'Curug - Cikupa', type: 'SKTT', voltageKv: 150, from: 'CKUPA', to: 'CURUG', fromPort: -40, toPort: 0, circuitCount: 2, status: 'ENERGIZED', lengthKm: 7.9, loadingPct: 52 },
      { id: 'c23', code: 'SKTT_CKUPA_JTAKE', name: 'Cikupa - Jatake', type: 'SKTT', voltageKv: 150, from: 'CKUPA', to: 'JTAKE', fromPort: 0, toPort: 0, circuitCount: 2, status: 'ENERGIZED', lengthKm: 6.4, loadingPct: 61 },
      { id: 'c12', code: 'SKTT_SNYAN_DNYSA_DIRECT', name: 'Senayan - Danayasa (direct)', type: 'SKTT', voltageKv: 150, from: 'SNYAN', to: 'DNYSA', fromPort: -37, toPort: -14, circuitCount: 1, status: 'ENERGIZED', lengthKm: 2.1, loadingPct: 33 },
      { id: 'c13', code: 'SKTT_SNYAN_DNYSA_SP', name: 'Senayan - Danayasa (via PLTD Senayan, single phi)', type: 'SKTT', voltageKv: 150, from: 'SNYAN', to: 'DNYSA', fromPort: -9, toPort: 14, circuitCount: 1, status: 'ENERGIZED', lengthKm: 2.4, loadingPct: 21, note: 'Single phi' },
      { id: 'c25', code: 'PHT_JTAKE_MAXIM', name: 'Jatake - Maxim', type: 'SKTT', voltageKv: 150, from: 'JTAKE', to: 'MAXIM', fromPort: 46, toPort: 0, circuitCount: 2, status: 'ENERGIZED', lengthKm: 3.8, loadingPct: 47 },
      { id: 'd1', code: 'SUTT_BLRJA_TGRBR', name: 'Balaraja - Tangerang Baru', type: 'SUTT', voltageKv: 150, from: 'BLRJA', to: 'TGRBR', fromPort: -60, toPort: 0, circuitCount: 2, status: 'ENERGIZED', lengthKm: 14.5, loadingPct: 63 },
      { id: 'd2', code: 'SUTT_BLRJA_PSKMB', name: 'Balaraja - Pasar Kemis Baru', type: 'SUTT', voltageKv: 150, from: 'BLRJA', to: 'PSKMB', fromPort: 60, toPort: 0, circuitCount: 2, status: 'ENERGIZED', lengthKm: 11.0, loadingPct: 57 },
      { id: 'd3', code: 'SUTT_LNTAR_BLRJA', name: 'PLTU Lontar - Balaraja', type: 'SUTT', voltageKv: 150, from: 'LNTAR', to: 'BLRJA', fromPort: 0, toPort: 110, circuitCount: 2, status: 'ENERGIZED', lengthKm: 21.3, loadingPct: 78 },
      { id: 'd4', code: 'SUTT_PSKMB_GJTGL', name: 'Pasar Kemis Baru - Gajah Tunggal', type: 'SUTT', voltageKv: 150, from: 'PSKMB', to: 'GJTGL', fromPort: 0, toPort: 0, circuitCount: 1, status: 'ENERGIZED', lengthKm: 4.2, loadingPct: 49, note: 'Masih single phi' },
      { id: 'd5', code: 'SUTT_GJTGL_PSKMS', name: 'Gajah Tunggal - Pasar Kemis', type: 'SUTT', voltageKv: 150, from: 'GJTGL', to: 'PSKMS', fromPort: 0, toPort: 0, circuitCount: 1, status: 'ENERGIZED', lengthKm: 3.1, loadingPct: 40, note: 'Masih single phi' },
      { id: 'd6', code: 'SUTT_TGRBR_TLKNG', name: 'Tangerang Baru - Teluknaga', type: 'SUTT', voltageKv: 150, from: 'TGRBR', to: 'TLKNG', fromPort: 0, toPort: 0, circuitCount: 2, status: 'ENERGIZED', lengthKm: 9.6, loadingPct: 35 },
    ],
    ibtLinks: [
      { id: 'ibt1', code: 'IBT_KMBGN_1', name: 'IBT 1 Kembangan 500/150 kV', from: 'GITET_KMBGN', to: 'KMBGN', x: 665, capacityMVA: 500, loadingPct: 86, status: 'ENERGIZED' },
      { id: 'ibt2', code: 'IBT_KMBGN_2', name: 'IBT 2 Kembangan 500/150 kV', from: 'GITET_KMBGN', to: 'KMBGN', x: 711, capacityMVA: 500, loadingPct: 84, status: 'ENERGIZED' },
      { id: 'ibt-b1', code: 'IBT_BLRJA_1', name: 'IBT 1 Balaraja 500/150 kV', from: 'GITET_BLRJA', to: 'BLRJA', x: 2077, capacityMVA: 500, loadingPct: 68, status: 'ENERGIZED' },
      { id: 'ibt-b2', code: 'IBT_BLRJA_2', name: 'IBT 2 Balaraja 500/150 kV', from: 'GITET_BLRJA', to: 'BLRJA', x: 2123, capacityMVA: 500, loadingPct: 66, status: 'ENERGIZED' },
    ],
    bays: [
      { id: 'b1', code: 'DKSBI', name: 'Durikosambi', busCode: 'KMBGN', x: 734, circuitCount: 2, status: 'ENERGIZED', note: 'GI batas → SS Muarakarang' },
      { id: 'b2', code: 'PKTGN', name: 'Petukangan', busCode: 'KMBGN', x: 780, circuitCount: 2, status: 'ENERGIZED' },
      { id: 'b3', code: 'PKTGN', name: 'Petukangan', busCode: 'SNYAN', x: 1489, circuitCount: 1, status: 'DE_ENERGIZED', note: 'Abu di SLD = non-aktif (SKTT rusak)' },
      { id: 'b4', code: 'ABDGP', name: 'Abadi Guna Papan', busCode: 'SNYAN', x: 1535, circuitCount: 1, status: 'DE_ENERGIZED' },
      { id: 'b5', code: 'ABDGP', name: 'Abadi Guna Papan', busCode: 'DNYSA', x: 1488, circuitCount: 2, status: 'ENERGIZED' },
      { id: 'b6', code: 'MPANG', name: 'Mampang', busCode: 'DNYSA', x: 1534, circuitCount: 2, status: 'ENERGIZED' },
      { id: 'b7', code: 'SVRNA', name: 'Suvarna Sutra', busCode: 'CKUPA', x: 1188, circuitCount: 2, status: 'ENERGIZED' },
      { id: 'b8', code: 'PSKMS', name: 'Pasar Kemis', busCode: 'CKUPA', x: 1227, circuitCount: 2, status: 'ENERGIZED' },
      { id: 'b9', code: 'JTKBR', name: 'Jatake Baru', busCode: 'JTAKE', x: 1450, circuitCount: 2, status: 'ENERGIZED' },
      { id: 'bb1', code: 'CKUPA', name: 'Cikupa', busCode: 'BLRJA', x: 2180, circuitCount: 2, status: 'ENERGIZED', note: 'Ruas menuju GI Cikupa' },
      { id: 'bb2', code: 'GJTGL', name: 'Gajah Tunggal (KTT)', busCode: 'PSKMB', x: 2340, circuitCount: 1, status: 'PLANNED', note: 'Rencana sirkit 2' },
    ],
  },

  // -------------------------------------------------------------------------
  // SS Balaraja 3,4 - Lengkong 1,2 — SLD lengkap
  // -------------------------------------------------------------------------
  {
    id: 'bll-full',
    subsystemId: 'ss-bll',
    title: 'SS Balaraja 3,4 - Lengkong 1,2',
    viewName: 'SLD lengkap',
    ruleProfile: 'SUBSYSTEM_150',
    tierCount: 3,
    nodes: [
      { code: 'GITET_BLRJA', name: 'GITET Balaraja', type: 'GITET', voltageKv: 500, role: 'SOURCE', tier: 0, status: 'ENERGIZED', x: 320, halfWidth: 49, labelTop: true },
      { code: 'BLRJA34', name: 'Balaraja (Bus 3,4)', type: 'GI', voltageKv: 150, role: 'SOURCE', tier: 1, status: 'ENERGIZED', x: 320, halfWidth: 130, transformers: 1 },
      { code: 'GITET_LGKNG', name: 'GITET Lengkong', type: 'GITET', voltageKv: 500, role: 'SOURCE', tier: 0, status: 'ENERGIZED', x: 900, halfWidth: 49, labelTop: true },
      { code: 'LGKNG', name: 'Lengkong', type: 'GI', voltageKv: 150, role: 'SOURCE', tier: 1, status: 'ENERGIZED', x: 900, halfWidth: 130, transformers: 1 },
      { code: 'SRPNG', name: 'Serpong', type: 'GI', voltageKv: 150, role: 'CORE', tier: 2, status: 'ENERGIZED', x: 320, halfWidth: 100, transformers: 2 },
      { code: 'BSD', name: 'BSD', type: 'GIS', voltageKv: 150, role: 'CORE', tier: 2, status: 'ENERGIZED', x: 900, halfWidth: 100, transformers: 2, capacitors: 1 },
      { code: 'CSAUK', name: 'Cisauk', type: 'GI', voltageKv: 150, role: 'CORE', tier: 3, status: 'ENERGIZED', x: 320, halfWidth: 70, transformers: 1 },
      { code: 'CTER', name: 'Ciater', type: 'GI', voltageKv: 150, role: 'CORE', tier: 3, status: 'ENERGIZED', x: 900, halfWidth: 70, transformers: 1 },
    ],
    circuits: [
      { id: 'e1', code: 'SUTT_BLRJA_SRPNG', name: 'Balaraja - Serpong', type: 'SUTT', voltageKv: 150, from: 'BLRJA34', to: 'SRPNG', fromPort: 0, toPort: 0, circuitCount: 2, status: 'ENERGIZED', lengthKm: 18.2, loadingPct: 66 },
      { id: 'e2', code: 'SKTT_LGKNG_BSD', name: 'Lengkong - BSD', type: 'SKTT', voltageKv: 150, from: 'LGKNG', to: 'BSD', fromPort: 0, toPort: 0, circuitCount: 2, status: 'ENERGIZED', lengthKm: 6.7, loadingPct: 52 },
      { id: 'e3', code: 'SUTT_SRPNG_BSD', name: 'Serpong - BSD', type: 'SUTT', voltageKv: 150, from: 'SRPNG', to: 'BSD', fromPort: 60, toPort: -60, circuitCount: 2, status: 'ENERGIZED', lengthKm: 7.4, loadingPct: 28, note: 'Titik temu dua sumber Tier-1' },
      { id: 'e4', code: 'SUTT_SRPNG_CSAUK', name: 'Serpong - Cisauk', type: 'SUTT', voltageKv: 150, from: 'SRPNG', to: 'CSAUK', fromPort: -40, toPort: 0, circuitCount: 2, status: 'ENERGIZED', lengthKm: 5.5, loadingPct: 31 },
      { id: 'e5', code: 'SKTT_BSD_CTER', name: 'BSD - Ciater', type: 'SKTT', voltageKv: 150, from: 'BSD', to: 'CTER', fromPort: 40, toPort: 0, circuitCount: 2, status: 'ENERGIZED', lengthKm: 4.0, loadingPct: 37 },
    ],
    ibtLinks: [
      { id: 'ibt-c3', code: 'IBT_BLRJA_3', name: 'IBT 3 Balaraja 500/150 kV', from: 'GITET_BLRJA', to: 'BLRJA34', x: 297, capacityMVA: 500, loadingPct: 81, status: 'ENERGIZED' },
      { id: 'ibt-c4', code: 'IBT_BLRJA_4', name: 'IBT 4 Balaraja 500/150 kV', from: 'GITET_BLRJA', to: 'BLRJA34', x: 343, capacityMVA: 500, loadingPct: 79, status: 'ENERGIZED' },
      { id: 'ibt-l1', code: 'IBT_LGKNG_1', name: 'IBT 1 Lengkong 500/150 kV', from: 'GITET_LGKNG', to: 'LGKNG', x: 877, capacityMVA: 500, loadingPct: 57, status: 'ENERGIZED' },
      { id: 'ibt-l2', code: 'IBT_LGKNG_2', name: 'IBT 2 Lengkong 500/150 kV', from: 'GITET_LGKNG', to: 'LGKNG', x: 923, capacityMVA: 500, loadingPct: 55, status: 'ENERGIZED' },
    ],
    bays: [
      { id: 'cb1', code: 'CKUPA', name: 'Cikupa', busCode: 'BLRJA34', x: 400, circuitCount: 2, status: 'ENERGIZED' },
      { id: 'cb2', code: 'BNTRO', name: 'Bintaro', busCode: 'LGKNG', x: 990, circuitCount: 2, status: 'ENERGIZED', note: 'GI batas → SS Gandul' },
    ],
  },

  // -------------------------------------------------------------------------
  // Backbone 500 kV Jawa Bagian Barat (Sistem 500 kV)
  // -------------------------------------------------------------------------
  {
    id: 'backbone-500',
    subsystemId: '',
    title: 'Sistem 500 kV Jawa Bagian Barat',
    viewName: 'Backbone 500 kV',
    ruleProfile: 'BACKBONE_500',
    tierCount: 3,
    nodes: [
      { code: 'SRLYA', name: 'GITET Suralaya', type: 'GITET', voltageKv: 500, role: 'SOURCE', tier: 1, status: 'ENERGIZED', x: 260, halfWidth: 110, transformers: 2, note: 'PLTU Suralaya 7x400 MW + Unit 8. IBT 1,2.' },
      { code: 'CLGON', name: 'GITET Cilegon', type: 'GITET', voltageKv: 500, role: 'CORE', tier: 1, status: 'ENERGIZED', x: 640, halfWidth: 110, transformers: 1 },
      { code: 'BLRJA', name: 'GITET Balaraja', type: 'GITET', voltageKv: 500, role: 'CORE', tier: 2, status: 'ENERGIZED', x: 260, halfWidth: 120, transformers: 4 },
      { code: 'GNDUL', name: 'GITET Gandul', type: 'GITET', voltageKv: 500, role: 'CORE', tier: 2, status: 'ENERGIZED', x: 1000, halfWidth: 120, transformers: 3 },
      { code: 'CIBNG', name: 'GITET Cibinong', type: 'GITET', voltageKv: 500, role: 'CORE', tier: 3, status: 'ENERGIZED', x: 640, halfWidth: 110, transformers: 2 },
      { code: 'KMBGN', name: 'GITET Kembangan', type: 'GITET', voltageKv: 500, role: 'CORE', tier: 3, status: 'ENERGIZED', x: 1000, halfWidth: 110, transformers: 2 },
      { code: 'DKSBI', name: 'GITET Duri Kosambi', type: 'GITET', voltageKv: 500, role: 'CORE', tier: 3, status: 'ENERGIZED', x: 1340, halfWidth: 110, transformers: 2 },
    ],
    circuits: [
      { id: 'f1', code: 'SUTET_SRLYA_CLGON', name: 'Suralaya - Cilegon', type: 'SUTET', voltageKv: 500, from: 'SRLYA', to: 'CLGON', fromPort: 70, toPort: -70, circuitCount: 2, status: 'ENERGIZED', lengthKm: 14.0, loadingPct: 71 },
      { id: 'f2', code: 'SUTET_SRLYA_BLRJA', name: 'Suralaya - Balaraja', type: 'SUTET', voltageKv: 500, from: 'SRLYA', to: 'BLRJA', fromPort: 0, toPort: 0, circuitCount: 2, status: 'ENERGIZED', lengthKm: 62.5, loadingPct: 64 },
      { id: 'f3', code: 'SUTET_CLGON_CIBNG', name: 'Cilegon - Cibinong', type: 'SUTET', voltageKv: 500, from: 'CLGON', to: 'CIBNG', fromPort: 0, toPort: 0, circuitCount: 2, status: 'ENERGIZED', lengthKm: 104.2, loadingPct: 88 },
      { id: 'f4', code: 'SUTET_BLRJA_GNDUL', name: 'Balaraja - Gandul', type: 'SUTET', voltageKv: 500, from: 'BLRJA', to: 'GNDUL', fromPort: 70, toPort: -70, circuitCount: 2, status: 'ENERGIZED', lengthKm: 48.0, loadingPct: 59 },
      { id: 'f5', code: 'SUTET_GNDUL_KMBGN', name: 'Gandul - Kembangan', type: 'SUTET', voltageKv: 500, from: 'GNDUL', to: 'KMBGN', fromPort: 0, toPort: 0, circuitCount: 2, status: 'ENERGIZED', lengthKm: 21.4, loadingPct: 58 },
      { id: 'f6', code: 'SUTET_GNDUL_CIBNG', name: 'Gandul - Cibinong', type: 'SUTET', voltageKv: 500, from: 'GNDUL', to: 'CIBNG', fromPort: 60, toPort: 60, circuitCount: 2, status: 'ENERGIZED', lengthKm: 30.2, loadingPct: 45 },
      { id: 'f7', code: 'SUTET_KMBGN_DKSBI', name: 'Kembangan - Duri Kosambi', type: 'SUTET', voltageKv: 500, from: 'KMBGN', to: 'DKSBI', fromPort: 70, toPort: -70, circuitCount: 2, status: 'ENERGIZED', lengthKm: 9.7, loadingPct: 51 },
      { id: 'f8', code: 'SUTET_BLRJA_KMBGN', name: 'Balaraja - Kembangan', type: 'SUTET', voltageKv: 500, from: 'BLRJA', to: 'KMBGN', fromPort: -60, toPort: -60, circuitCount: 2, status: 'ENERGIZED', lengthKm: 41.3, loadingPct: 67 },
    ],
    ibtLinks: [],
    bays: [
      { id: 'fb1', code: 'PLTU_JW7', name: 'PLTU Jawa 7', busCode: 'CLGON', x: 700, circuitCount: 2, status: 'ENERGIZED' },
      { id: 'fb2', code: 'MKRNG', name: 'Muara Karang', busCode: 'DKSBI', x: 1400, circuitCount: 2, status: 'ENERGIZED' },
    ],
  },
]

export const sldGraphById = (id: string) => sldGraphs.find((g) => g.id === id)
