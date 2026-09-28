<script setup lang="ts">
import { sldStatusLabel } from '@/composables/useRiskStyle'
import { computed, onBeforeUnmount, onMounted, ref, toRef, watch } from 'vue'
import type { RiskItem, SldGraph, SldSelection } from '@/types'
import { SLD, tierLineY, useSldLayout } from '@/composables/useSldLayout'

/**
 * Kanvas SLD (SVG) ala engine MANTAPS: busbar per Tier, warna tegangan P2B,
 * simbol IBT / trafo / kapasitor, bay stub, pin kerawanan, pan & zoom.
 */
const props = defineProps<{
  graph: SldGraph | undefined
  risks: RiskItem[]
  selection: SldSelection
  layers: { tier: boolean; risk: boolean; labels: boolean }
}>()
const emit = defineEmits<{ 'update:selection': [s: SldSelection] }>()

const { nodes, circuits, ibtLinks, bays, riskPins, tiers, bounds } = useSldLayout(toRef(props, 'graph'), toRef(props, 'risks'))

// ---------- pan & zoom lewat viewBox ----------
const wrap = ref<HTMLDivElement>()
const vb = ref({ x: 0, y: 0, w: 1200, h: 800 })
const zoomPct = computed(() => (wrap.value ? Math.round((wrap.value.clientWidth / vb.value.w) * 100) : 100))

function fit() {
  const el = wrap.value
  if (!el) return
  const { width, height } = bounds.value
  const aspect = el.clientWidth / Math.max(el.clientHeight, 1)
  let w = width
  let h = width / aspect
  if (h < height) {
    h = height
    w = height * aspect
  }
  vb.value = { x: (width - w) / 2, y: (height - h) / 2, w, h }
}

function zoomAt(factor: number, cx?: number, cy?: number) {
  const el = wrap.value
  if (!el) return
  const px = cx ?? el.clientWidth / 2
  const py = cy ?? el.clientHeight / 2
  const sx = vb.value.x + (px / el.clientWidth) * vb.value.w
  const sy = vb.value.y + (py / el.clientHeight) * vb.value.h
  const w = vb.value.w * factor
  const h = vb.value.h * factor
  vb.value = { x: sx - (px / el.clientWidth) * w, y: sy - (py / el.clientHeight) * h, w, h }
}

function onWheel(e: WheelEvent) {
  e.preventDefault()
  const r = wrap.value!.getBoundingClientRect()
  zoomAt(e.deltaY > 0 ? 1.12 : 1 / 1.12, e.clientX - r.left, e.clientY - r.top)
}

let drag: { x: number; y: number; vx: number; vy: number } | null = null
let moved = false
function onDown(e: MouseEvent) {
  drag = { x: e.clientX, y: e.clientY, vx: vb.value.x, vy: vb.value.y }
  moved = false
}
function onMove(e: MouseEvent) {
  if (!drag || !wrap.value) return
  const k = vb.value.w / wrap.value.clientWidth
  const dx = (e.clientX - drag.x) * k
  const dy = (e.clientY - drag.y) * k
  if (Math.abs(dx) + Math.abs(dy) > 2) moved = true
  vb.value = { ...vb.value, x: drag.vx - dx, y: drag.vy - dy }
}
function onUp() {
  drag = null
}
function onBackgroundClick() {
  if (!moved) emit('update:selection', null)
}
function select(s: SldSelection, e: MouseEvent) {
  e.stopPropagation()
  if (!moved) emit('update:selection', s)
}

/** Geser & zoom-in viewport agar sebuah titik terlihat jelas (tidak zoom-out bila sudah lebih dekat). */
function centerOn(x: number, y: number) {
  const targetW = Math.min(vb.value.w, bounds.value.width * 0.35)
  const w = Math.max(targetW, 320)
  const h = w * (vb.value.h / vb.value.w)
  vb.value = { x: x - w / 2, y: y - h / 2, w, h }
}

function focusRisk(number: number) {
  const pin = riskPins.value.find((p) => p.risk.number === number)
  if (pin) centerOn(pin.x, pin.y)
}

/** Zoom ke objek yang sedang terpilih (dipakai saat lompat dari tab "Aset Terkait" / navigasi lain). */
function focusSelection(sel: SldSelection) {
  if (!sel) return
  if (sel.kind === 'risk') {
    focusRisk(sel.risk.number)
  } else if (sel.kind === 'node') {
    const g = nodes.value.find((n) => n.node.code === sel.node.code)
    if (g) centerOn((g.x1 + g.x2) / 2, g.y)
  } else if (sel.kind === 'circuit') {
    const g = circuits.value.find((c) => c.circuit.id === sel.circuit.id)
    const w = g?.wires[0]
    if (w) centerOn(w.mid.x, w.mid.y)
  } else if (sel.kind === 'ibt') {
    const g = ibtLinks.value.find((i) => i.ibt.id === sel.ibt.id)
    if (g) centerOn(sel.ibt.x, (g.y1 + g.y2) / 2)
  } else if (sel.kind === 'bay') {
    const g = bays.value.find((b) => b.bay.id === sel.bay.id)
    if (g) centerOn(sel.bay.x, g.y)
  }
}

onMounted(fit)
watch(() => props.graph?.id, () => setTimeout(fit, 0))
defineExpose({ fit, focusRisk, focusSelection, zoomIn: () => zoomAt(1 / 1.25), zoomOut: () => zoomAt(1.25) })

// ---------- cetak A4: paksa fit ke area cetak sesaat sebelum print ----------
const printedAt = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
function onBeforePrint() {
  fit()
}
onMounted(() => window.addEventListener('beforeprint', onBeforePrint))
onBeforeUnmount(() => window.removeEventListener('beforeprint', onBeforePrint))

// ---------- helpers seleksi ----------
const sel = computed(() => props.selection)
const isSelNode = (code: string) => sel.value?.kind === 'node' && sel.value.node.code === code
const isSelCircuit = (id: string) => sel.value?.kind === 'circuit' && sel.value.circuit.id === id
const isSelIbt = (id: string) => sel.value?.kind === 'ibt' && sel.value.ibt.id === id
const isSelBay = (id: string) => sel.value?.kind === 'bay' && sel.value.bay.id === id
const isSelRisk = (n: number) => sel.value?.kind === 'risk' && sel.value.risk.number === n
const viewBoxStr = computed(() => `${vb.value.x} ${vb.value.y} ${vb.value.w} ${vb.value.h}`)
</script>

<template>
  <div ref="wrap" class="position-relative w-100 h-100 overflow-hidden bg-white ops-print-area" style="cursor: grab" @wheel="onWheel" @mousedown="onDown" @mousemove="onMove" @mouseup="onUp" @mouseleave="onUp">
    <svg v-if="graph" class="w-100 h-100" :viewBox="viewBoxStr" font-family="Arial, Helvetica, sans-serif" @click="onBackgroundClick">
      <text x="18" y="26" font-size="14" font-weight="700" fill="#0f274a">{{ graph.title }} — {{ graph.viewName }}</text>

      <!-- Overlay Tier -->
      <g v-if="layers.tier" id="overlay-tier">
        <g v-for="t in tiers" :key="t">
          <line :x1="16" :y1="tierLineY(t)" :x2="bounds.width - 16" :y2="tierLineY(t)" stroke="#b9c6d8" stroke-width="1.2" stroke-dasharray="6 5" />
          <rect x="14" :y="tierLineY(t) - 9" width="54" height="17" rx="3" fill="#eef2f7" stroke="#c9d4e2" stroke-width="0.8" />
          <text x="41" :y="tierLineY(t) + 3" font-size="10.5" fill="#5a6b80" font-weight="700" text-anchor="middle">TIER {{ t }}</text>
        </g>
      </g>

      <!-- Penghantar -->
      <g id="circuits">
        <g v-for="c in circuits" :key="c.circuit.id" class="sld-hit" @click="select({ kind: 'circuit', circuit: c.circuit }, $event)">
          <template v-for="(w, i) in c.wires" :key="i">
            <path :d="w.d" fill="none" stroke="transparent" stroke-width="16" stroke-linejoin="round" />
            <path :d="w.d" fill="none" stroke="white" stroke-width="7" stroke-linejoin="round" />
            <path v-if="isSelCircuit(c.circuit.id)" :d="w.d" fill="none" stroke="#0046ad" stroke-opacity="0.35" stroke-width="10" stroke-linejoin="round" />
            <path :d="w.d" fill="none" :stroke="c.color" :stroke-width="SLD.wireStroke" :stroke-dasharray="c.dash">
              <title>{{ c.circuit.name }} - {{ c.circuit.type }}, {{ sldStatusLabel[c.circuit.status] }}</title>
            </path>
            <rect v-for="(p, j) in w.pmts" :key="j" :x="p.x" :y="p.y" :width="SLD.pmt" :height="SLD.pmt" :fill="c.color" />
          </template>
        </g>
      </g>

      <!-- IBT 500/150 -->
      <g id="ibt-links">
        <g v-for="g in ibtLinks" :key="g.ibt.id" class="sld-hit" @click="select({ kind: 'ibt', ibt: g.ibt }, $event)">
          <rect v-if="isSelIbt(g.ibt.id)" :x="g.ibt.x - 18" :y="g.y1 + 6" width="36" :height="g.y2 - g.y1 - 12" rx="4" fill="#0046ad" fill-opacity="0.08" stroke="#0046ad" stroke-width="1.5" stroke-dasharray="4 3" />
          <rect :x="g.ibt.x - 14" :y="g.y1 + 4" width="28" :height="g.y2 - g.y1 - 8" fill="transparent" />
          <path :d="`M${g.ibt.x},${g.y1} V${g.y2}`" fill="none" stroke="#8a6a3a" stroke-width="1.6"><title>{{ g.ibt.name }} - {{ sldStatusLabel[g.ibt.status] }}</title></path>
          <rect :x="g.ibt.x - 5" :y="g.y1 + 7" width="10" height="10" fill="#0047AB" />
          <g fill="#ffffff" stroke-width="1.7">
            <circle :cx="g.ibt.x" :cy="g.y1 + (g.y2 - g.y1) * 0.47" r="7.5" stroke="#0047AB" />
            <circle :cx="g.ibt.x - 4.5" :cy="g.y1 + (g.y2 - g.y1) * 0.47 + 8" r="7.5" stroke="#C00000" />
            <circle :cx="g.ibt.x + 4.5" :cy="g.y1 + (g.y2 - g.y1) * 0.47 + 8" r="7.5" stroke="#E0A400" />
          </g>
          <rect :x="g.ibt.x - 5" :y="g.y2 - 17" width="10" height="10" fill="#C00000" />
          <text :x="g.ibt.x" :y="g.y1 + (g.y2 - g.y1) * 0.47 + 24" font-size="8.5" fill="#8a6a3a" font-weight="700" text-anchor="middle">{{ g.ibt.name.split(' ').slice(0, 2).join(' ') }}</text>
        </g>
      </g>

      <!-- Busbar -->
      <g id="busbars">
        <g v-for="g in nodes" :key="g.node.code" class="sld-hit" @click="select({ kind: 'node', node: g.node }, $event)">
          <rect v-if="isSelNode(g.node.code)" :x="g.x1 - 8" :y="g.y - 14" :width="g.x2 - g.x1 + 16" :height="g.node.transformers || g.node.capacitors ? 62 : 28" rx="5" fill="#0046ad" fill-opacity="0.07" stroke="#0046ad" stroke-width="1.5" stroke-dasharray="4 3" />
          <title>{{ g.node.name }} [{{ g.node.code }}] {{ g.node.type }} {{ g.node.voltageKv }} kV - {{ sldStatusLabel[g.node.status] }} - role {{ g.node.role }}</title>
          <text v-if="layers.labels" :x="g.labelX" :y="g.labelY" font-size="12.5" font-weight="700" paint-order="stroke" stroke="#ffffff" stroke-width="3" stroke-linejoin="round" :text-anchor="g.labelAnchor" fill="#0f274a">{{ g.node.code }}</text>
          <rect :x="g.x1 - 6" :y="g.y - 12" :width="g.x2 - g.x1 + 12" :height="g.node.transformers || g.node.capacitors ? 50 : 24" fill="transparent" />
          <line :x1="g.x1" :x2="g.x2" :y1="g.y" :y2="g.y" :stroke="g.node.status === 'ENERGIZED' ? g.color : '#9AA0A6'" :stroke-width="SLD.busStroke" />
          <!-- trafo beban (150 kV) / IBT (500 kV) -->
          <g v-for="(tx, i) in g.transformers" :key="'t' + i" fill="none" stroke-width="1.7">
            <template v-if="g.node.voltageKv === 500">
              <line :x1="tx" :y1="g.y + 3" :x2="tx" :y2="g.y + 12" :stroke="g.color" />
              <circle :cx="tx" :cy="g.y + 21" r="7.5" stroke="#0047AB" fill="#fff" />
              <circle :cx="tx - 4.5" :cy="g.y + 29" r="7.5" stroke="#C00000" fill="#fff" />
              <circle :cx="tx + 4.5" :cy="g.y + 29" r="7.5" stroke="#E0A400" fill="#fff" />
            </template>
            <template v-else>
              <line :x1="tx" :y1="g.y + 3" :x2="tx" :y2="g.y + 10" :stroke="g.color" />
              <circle :cx="tx" :cy="g.y + 19" r="9" :stroke="g.color" />
              <circle :cx="tx" :cy="g.y + 27" r="9" stroke="#E67300" />
            </template>
          </g>
          <!-- shunt capacitor -->
          <g v-for="(cx, i) in g.capacitors" :key="'c' + i" :stroke="g.color" fill="none" stroke-width="1.7">
            <line :x1="cx" :y1="g.y + 3" :x2="cx" :y2="g.y + 13" />
            <line :x1="cx - 8" :y1="g.y + 13" :x2="cx + 8" :y2="g.y + 13" />
            <line :x1="cx - 8" :y1="g.y + 18" :x2="cx + 8" :y2="g.y + 18" />
            <line :x1="cx" :y1="g.y + 18" :x2="cx" :y2="g.y + 25" />
            <path :d="`M${cx - 6},${g.y + 25} h12 M${cx - 4},${g.y + 28} h8 M${cx - 2},${g.y + 31} h4`" />
          </g>
          <text v-if="g.node.role === 'BOUNDARY'" :x="g.x1" :y="g.y + 15" font-size="7.5" fill="#b06a00" font-weight="700">BOUNDARY</text>
        </g>
      </g>

      <!-- Bay / spur -->
      <g id="bays">
        <g v-for="b in bays" :key="b.bay.id" class="sld-hit" @click="select({ kind: 'bay', bay: b.bay }, $event)">
          <rect v-if="isSelBay(b.bay.id)" :x="b.bay.x - 20" :y="b.y + 4" width="40" :height="SLD.bayLen + 20" rx="4" fill="#0046ad" fill-opacity="0.08" stroke="#0046ad" stroke-width="1.5" stroke-dasharray="4 3" />
          <title>{{ b.bay.name }} [{{ b.bay.code }}] - bay di bus {{ b.bay.busCode }} ({{ sldStatusLabel[b.bay.status] }})</title>
          <rect :x="b.bay.x - 16" :y="b.y + 3" width="32" :height="SLD.bayLen + 18" fill="transparent" />
          <template v-for="x in b.xs" :key="x">
            <path :d="`M${x},${b.y} V${b.y + SLD.bayLen}`" fill="none" :stroke="b.color" stroke-width="2.1" :stroke-dasharray="b.bay.status === 'PLANNED' ? '2 4' : undefined" />
            <rect :x="x - 5" :y="b.y + 7" width="10" height="10" :fill="b.color" />
            <circle :cx="x" :cy="b.y + SLD.bayLen" r="3" :fill="b.color" />
          </template>
          <text v-if="layers.labels" :x="b.bay.x" :y="b.y + SLD.bayLen + 15" font-size="10" font-weight="700" paint-order="stroke" stroke="#ffffff" stroke-width="3" text-anchor="middle" fill="#334155">{{ b.bay.code }}</text>
        </g>
      </g>

      <!-- Pin kerawanan -->
      <g v-if="layers.risk" id="overlay-risk">
        <g v-for="p in riskPins" :key="p.risk.id" class="sld-hit" @click="select({ kind: 'risk', risk: p.risk }, $event)">
          <circle :cx="p.x" :cy="p.y" r="22" fill="transparent" />
          <circle v-if="isSelRisk(p.risk.number)" :cx="p.x" :cy="p.y" r="15" fill="#F6C000" fill-opacity="0.25" class="sld-ping" />
          <circle :cx="p.x" :cy="p.y" r="9" fill="#F6C000" :stroke="isSelRisk(p.risk.number) ? '#7c2d12' : '#B8860B'" :stroke-width="isSelRisk(p.risk.number) ? 2.5 : 1.5" />
          <text :x="p.x" :y="p.y + 3" font-size="9" font-weight="700" text-anchor="middle" fill="#5a4500">{{ p.risk.number }}</text>
        </g>
      </g>
    </svg>

    <!-- Kontrol zoom -->
    <div class="position-absolute d-flex align-center ga-1 d-print-none" style="right: 12px; bottom: 12px">
      <v-btn icon="mdi-minus" size="small" variant="outlined" class="bg-surface" @click.stop="zoomAt(1.25)" />
      <v-btn size="small" variant="outlined" class="bg-surface font-weight-black text-caption" @click.stop="fit">FIT</v-btn>
      <v-btn icon="mdi-plus" size="small" variant="outlined" class="bg-surface" @click.stop="zoomAt(1 / 1.25)" />
    </div>
    <v-chip class="position-absolute ops-mono font-weight-bold d-print-none" style="left: 12px; bottom: 12px" size="small" variant="outlined">{{ zoomPct }}%</v-chip>

    <!-- Footer khusus cetak: legenda ringkas + info cetak (diagram sudah bawa judul di dalam SVG) -->
    <div class="d-none d-print-flex align-center justify-space-between ops-print-footer">
      <div class="d-flex align-center ga-4">
        <span class="d-flex align-center ga-1"><span class="ops-print-swatch" style="background: #0047ab" />SUTET 500 kV</span>
        <span class="d-flex align-center ga-1"><span class="ops-print-swatch" style="background: #c00000" />SUTT 150 kV</span>
        <span class="d-flex align-center ga-1"><span class="ops-print-swatch" style="border-top: 1.5px dashed #c00000; background: none; height: 0" />SKTT</span>
        <span class="d-flex align-center ga-1"><span class="ops-print-swatch" style="background: #9aa0a6" />Non-aktif</span>
        <span class="d-flex align-center ga-1"><span class="ops-print-dot" style="background: #f6c000; border-color: #b8860b" />Titik kerawanan</span>
      </div>
      <span>Dicetak {{ printedAt }} &bull; MANTAPS Operation System</span>
    </div>
  </div>
</template>

<style scoped>
.sld-hit {
  cursor: pointer;
}
.ops-print-footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 5px 12px;
  border-top: 1px solid #cbd5e1;
  background: #fff;
  font-size: 9px;
  color: #475569;
}
.ops-print-swatch {
  display: inline-block;
  width: 14px;
  height: 3px;
}
.ops-print-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid;
}
@media print {
  .ops-print-area {
    padding-bottom: 24px;
    cursor: default !important;
  }
}
.sld-ping {
  animation: sld-ping 1.2s ease-out infinite;
  transform-box: fill-box;
  transform-origin: center;
}
@keyframes sld-ping {
  0% {
    transform: scale(0.6);
    opacity: 0.9;
  }
  100% {
    transform: scale(1.8);
    opacity: 0;
  }
}
</style>
