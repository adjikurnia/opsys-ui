# OPSYS UI — Operation System (Peta Kerawanan Sistem / Subsistem / GI)

Slicing UI **Vue 3 + TypeScript + Vuetify 3/4** untuk modul *Operation System*.
Belum ada BE: semua data hardcode kecil di `src/data/*` dan diakses lewat store Pinia
(`src/stores/opsys.ts`) sehingga saat dipindah ke project utama tinggal mengganti
isi getter store dengan pemanggilan API.

Acuan desain:
- Flow & UI utama → prototipe *peta-kerawanan* (mas Ridwan): Nasional → Sistem → UP2B → Subsistem, mode Maps | SLD | List Kerawanan, dialog Matriks Kerawanan, daftar IBT.
- Tampilan SLD → *SLD_engine* (mas Hafiz): busbar per Tier, warna tegangan P2B (500 kV biru, 150 kV merah), simbol IBT/trafo/kapasitor, bay stub, pin kerawanan, layer toggle, panel Detail Objek / Kerawanan.

Catatan implementasi:
- Tanpa sidebar — navigasi antar level memakai **breadcrumb** di header (`useBreadcrumbs`).
- Peta memakai **Leaflet** + tile OSM basic (`components/map/BaseMap.vue`).
- SLD di-render sebagai SVG dari data deklaratif (`data/sld.ts`) oleh `composables/useSldLayout.ts`
  (koordinat X manual, Y diturunkan dari Tier). Nantinya BE bisa mengirim graph dengan bentuk `SldGraph`.
- Style mengutamakan utility class Vuetify; CSS tambahan minimal di `src/styles/app.scss`.

## Jalankan

```bash
npm install
npm run dev      # http://localhost:5180
npm run build
```

## Struktur

```
src/
  plugins/vuetify.ts        tema (primary #0046ad, warna N-1/N-2/N-1-2, kv-500/kv-150)
  router/index.ts           / , /sistem/:id , /sistem/:id/ibt , /sistem/:id/upb/:upb , .../subsistem/:ss
  stores/opsys.ts           akses data (ganti dengan API)
  types/index.ts            tipe domain + kontrak SldGraph
  data/                     sample: systems, upbs, subsystems, substations, risks, ibts, sld
  composables/              useBreadcrumbs, useRiskStyle, useSldLayout
  layouts/AppHeader.vue     header + breadcrumb + tombol Matriks Kerawanan
  components/common/        PageBanner, ViewModeBar, SidePanel, InfoTab, RiskLegend, chips
  components/map/BaseMap    Leaflet wrapper (divIcon markers)
  components/risk/          RiskTable (format buku), RiskDetailCard, SystemRiskDialog
  components/sld/           SldCanvas (SVG + pan/zoom), SldLayerPanel, SldDetailPanel
  views/                    NationalView, SystemView, UpbView, SubsystemView, IbtListView
```

Query string yang dipakai antar halaman: `mode=maps|sld|list`, `view=<sldGraphId>`, `risk=<nomor>`.
