<template>
  <div id="previewContainer" ref="previewContainer" class="my-4 mx-2" style="position: relative">
    <canvas
      id="previewCanvas"
      ref="previewCanvas"
      style="height: 100%; width: 100%"
      @contextmenu.prevent />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'

const props = defineProps<{ map?: Record<string, any> }>()

const previewCanvas = ref<HTMLCanvasElement | null>(null)

const cellSize = 20
let canvas: HTMLCanvasElement | null = null
let context: CanvasRenderingContext2D | null = null
let mapData: any = null
let extentsX = 0
let extentsY = 0

function init() {
  if (!props.map) return
  mapData = props.map
  extentsX = mapData.SizeX
  extentsY = mapData.SizeX
  canvas = previewCanvas.value
  if (!canvas) return
  context = canvas.getContext('2d')!
  context.font = '8px Arial'
  const container = document.getElementById('previewContainer')
  canvas.width = container!.offsetWidth
  canvas.height = container!.offsetHeight
  scaleExtents(canvas.width, canvas.height)
  if (mapData.Type === 'Square') DrawSquares()
  else if (mapData.Type === 'HexH') DrawHexH()
  else if (mapData.Type === 'HexV') DrawHexV()
}

async function update() {
  if (!mapData || !context) return
  if (mapData.MapType === 'Square') await DrawSquares()
  else if (mapData.MapType === 'HexH') await DrawHexH()
  else if (mapData.MapType === 'HexV') await DrawHexV()
}

async function DrawSquares() {
  const s = cellSize
  context!.clearRect(-Infinity, -Infinity, Infinity, Infinity)
  await nextTick()
  context!.strokeStyle = 'rgba(135, 135, 135, 0.3)'
  for (let row = 0; row < extentsY; row++) {
    for (let col = 0; col < extentsX; col++) {
      const x = col * s
      const y = row * s
      context!.beginPath()
      context!.moveTo(x, y)
      context!.lineTo(x + s, y)
      context!.lineTo(x + s, y + s)
      context!.lineTo(x, y + s)
      context!.lineTo(x, y)
      context!.stroke()
      if (mapData.HasTile(col, row)) {
        const tile = mapData.GetTile(col, row)
        const flags = mapData.FromBitmask(tile.Flags)
        context!.fillStyle = getColor(flags)
        context!.fill()
        context!.fillStyle = 'rgba(255, 255, 255, 0.5)'
      }
    }
  }
}

async function DrawHexH() {
  context!.clearRect(-Infinity, -Infinity, Infinity, Infinity)
  await nextTick()
  context!.strokeStyle = 'rgba(135, 135, 135, 0.3)'
  const s = cellSize
  for (let row = 0; row < extentsY; row++) {
    for (let col = 0; col < extentsX; col++) {
      const w = 2 * s
      const h = Math.sqrt(3) * s
      let x = 2 * (col * ((3 / 2) * s))
      let y = row * 0.5 * h
      if (row % 2 === 1) x += 1.5 * s
      context!.beginPath()
      context!.moveTo(x, y)
      context!.lineTo(x + 0.5 * w, y)
      context!.lineTo(x + w * 0.75, y - h / 2)
      context!.lineTo(x + 0.5 * w, y - h)
      context!.lineTo(x, y - h)
      context!.lineTo(x - 0.25 * w, y - h / 2)
      context!.lineTo(x, y)
      context!.stroke()
      if (mapData.HasTile(col, row)) {
        const tile = mapData.GetTile(col, row)
        const flags = mapData.FromBitmask(tile.Flags)
        context!.fillStyle = getColor(flags)
        context!.fill()
        context!.fillStyle = 'rgba(255, 255, 255, 0.5)'
      }
    }
  }
}

async function DrawHexV() {
  context!.clearRect(-Infinity, -Infinity, Infinity, Infinity)
  await nextTick()
  context!.strokeStyle = 'rgba(135, 135, 135, 0.3)'
  const s = cellSize
  for (let row = 0; row < extentsY; row++) {
    for (let col = 0; col < extentsX; col++) {
      const w = Math.sqrt(3) * s
      const h = 2 * s
      let y = row * s * 1.5
      let x = col * w
      if (row % 2 === 1) x += 0.5 * w
      context!.beginPath()
      context!.moveTo(x, y)
      context!.lineTo(x + 0.5 * w, y - h * 0.25)
      context!.lineTo(x + 0.5 * w, y - h * 0.75)
      context!.lineTo(x, y - h)
      context!.lineTo(x - 0.5 * w, y - h * 0.75)
      context!.lineTo(x - 0.5 * w, y - h * 0.25)
      context!.lineTo(x, y)
      context!.stroke()
      if (mapData.HasTile(col, row)) {
        const tile = mapData.GetTile(col, row)
        const flags = mapData.FromBitmask(tile.Flags)
        context!.fillStyle = getColor(flags)
        context!.fill()
        context!.fillStyle = 'rgba(255, 255, 255, 0.5)'
      }
    }
  }
}

function scaleExtents(canvasWidth: number, canvasHeight: number) {
  const type = mapData.MapType
  let originalWidth = extentsX * cellSize
  let originalHeight = extentsY * cellSize
  if (type === 'HexV') { originalWidth *= Math.sqrt(3); originalHeight *= 4 / 3 }
  else if (type === 'HexH') { originalWidth *= 3; originalHeight *= 4 / 5 }
  const scale = Math.min(canvasWidth / originalWidth, canvasHeight / originalHeight)
  if (type === 'Square') {
    context!.translate(canvasWidth / 2, canvasHeight / 2)
    context!.scale(scale, scale)
    context!.translate(-originalWidth / 2, -originalHeight / 2)
  } else if (type === 'HexV') {
    context!.translate(canvasWidth / 2, canvasHeight / 2)
    context!.scale(scale * 0.85, scale * 0.85)
    context!.translate(-originalWidth / 2 + cellSize / 2, -originalHeight / 2 + cellSize * 1.25)
  } else if (type === 'HexH') {
    context!.translate(canvasWidth / 2, canvasHeight / 2)
    context!.scale(scale * 0.95, scale * 0.95)
    context!.translate(-originalWidth / 2 + cellSize / 3, -originalHeight / 2 + cellSize)
  }
}

function getColor(flags: string[]) {
  if (flags.includes('Deployment')) return '#B71C1C'
  if (flags.includes('Ingress')) return '#0277BD'
  if (flags.includes('Egress')) return '#00C853'
  if (flags.includes('Objective')) return '#F57F17'
  if (flags.includes('Obstruction')) return '#546E7A'
  return 'rgba(0, 0, 0, 0)'
}

watch(() => props.map, () => { init() }, { deep: true })

onMounted(async () => {
  init()
  await update()
})

defineExpose({ update })
</script>
