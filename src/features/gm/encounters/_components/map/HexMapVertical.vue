<template>
  <div
    id="container"
    ref="container"
    class="my-4 mx-2"
    style="position: relative; border: 1px solid #ffffff44; height: calc(100vh - 350px)">
    <canvas
      id="canvas"
      ref="canvas"
      style="height: 100%; width: 100%"
      @click="HandleClick($event)"
      @contextmenu.prevent />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, nextTick } from 'vue'
import { EncounterMap } from '@/classes/encounter/EncounterMap'
import InfiniteCanvas from 'ef-infinite-canvas'

const props = withDefaults(defineProps<{
  sizeX?: number
  sizeY?: number
  cellType?: string
  cellSubtype?: any[]
  map?: Record<string, any>
  preview?: boolean
}>(), { sizeX: 45, sizeY: 20, cellType: '', cellSubtype: () => [] })

const cellSize = 30
let canvas: any = null
let context: any = null
let centers: any[] = []
let mapData: any = null

function findNearest(target: { x: number; y: number }, arr: any[]) {
  let nearestPoint = null
  let minDistance = Infinity
  for (let i = 0; i < arr.length; i++) {
    const point = arr[i]
    const distance = Math.sqrt(Math.pow(target.x - point.x, 2) + Math.pow(target.y - point.y, 2))
    if (distance < minDistance) { nearestPoint = point; minDistance = distance }
  }
  return nearestPoint
}

function init() {
  if (props.map) {
    mapData = props.map
  } else {
    mapData = new EncounterMap({ type: 'HexV', x: props.sizeX, y: props.sizeY, tiles: [] })
  }
  canvas = new InfiniteCanvas(document.getElementById('canvas'), { rotationEnabled: false, greedyGestureHandling: true })
  context = canvas.getContext('2d')
  context.font = '8px Arial'
  const container = document.getElementById('container')
  const canvasEl = document.getElementById('canvas') as HTMLCanvasElement
  canvasEl.width = container!.offsetWidth
  canvasEl.height = container!.offsetHeight
}

function resetView() {
  init()
  DrawGrid()
}

async function DrawGrid() {
  const s = cellSize
  context.clearRect(-Infinity, -Infinity, Infinity, Infinity)
  await nextTick()
  centers = []
  context.strokeStyle = 'rgba(135, 135, 135, 0.3)'
  for (let row = 0; row < props.sizeY!; row++) {
    for (let col = 0; col < props.sizeX!; col++) {
      const w = Math.sqrt(3) * s
      const h = 2 * s
      let y = row * s * 1.5
      let x = col * w
      const coord = `${col + 1},${row + 1}`
      const xOffset = coord.length * 2
      if (row % 2 === 1) x += 0.5 * w
      context.beginPath()
      context.moveTo(x, y)
      context.lineTo(x + 0.5 * w, y - h * 0.25)
      context.lineTo(x + 0.5 * w, y - h * 0.75)
      context.lineTo(x, y - h)
      context.lineTo(x - 0.5 * w, y - h * 0.75)
      context.lineTo(x - 0.5 * w, y - h * 0.25)
      context.lineTo(x, y)
      context.stroke()
      if (mapData.HasTile(col, row)) {
        const tile = mapData.GetTile(col, row)
        const flags = mapData.FromBitmask(tile.Flags)
        context.fillStyle = getColor(flags)
        context.fill()
        context.fillStyle = 'rgba(255, 255, 255, 0.5)'
        if (flags.length > 2) { context.fillText('ALL', x - xOffset + 1, y - 13) }
        else if (flags.includes('Player')) { context.fillText('PC', x - xOffset + 1, y - 13) }
        else if (flags.includes('Enemy')) { context.fillText('NPC', x - xOffset + 1, y - 13) }
      } else {
        context.fillStyle = 'rgba(135, 135, 135, 0.5)'
      }
      context.fillText(coord, x - xOffset, y - s - 13)
      centers.push({ x, y: y - s, row, col })
    }
  }
}

async function HandleClick(event: MouseEvent) {
  const canvasTransform = canvas.transformation
  const mouseX = event.offsetX * canvasTransform.a + canvasTransform.e
  const mouseY = event.offsetY * canvasTransform.a + canvasTransform.f
  const extentsX = props.sizeX! * cellSize * Math.sqrt(3)
  const extentsY = props.sizeY! * cellSize * (4 / 3)
  if (mouseX < -cellSize || mouseX > extentsX) return
  if (mouseY < -2 * cellSize || mouseY > extentsY) return
  const hex = findNearest({ x: mouseX, y: mouseY }, centers)
  if (!hex) return
  if (mapData.HasTile(hex.col, hex.row)) {
    mapData.ClearTile(hex.col, hex.row)
  } else {
    mapData.SetTile(hex.col, hex.row, [props.cellType].concat(props.cellSubtype!))
  }
  await DrawGrid()
}

function getColor(flags: string[]) {
  if (flags.includes('Deployment')) return '#B71C1C'
  if (flags.includes('Ingress')) return '#0277BD'
  if (flags.includes('Egress')) return '#00C853'
  if (flags.includes('Objective')) return '#F57F17'
  if (flags.includes('Obstruction')) return '#546E7A'
  return 'rgba(0, 0, 0, 0)'
}

function getCanvas() {
  return canvas
}

watch(() => props.sizeX, () => DrawGrid())
watch(() => props.sizeY, () => DrawGrid())

onMounted(async () => {
  init()
  await DrawGrid()
})

defineExpose({
  get mapData() { return mapData },
  set mapData(val: any) { mapData = val },
  getCanvas,
  resetView,
  DrawGrid,
})
</script>
