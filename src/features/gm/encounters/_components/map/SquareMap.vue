<template>
  <div
    id="container"
    ref="container"
    class="my-4 mx-2"
    style="position: relative; border: 1px solid #ffffff44"
    :style="preview ? 'height:350px' : 'height: calc(100vh - 350px)'">
    <canvas
      id="canvas"
      ref="canvas"
      style="height: 100%; width: 100%"
      @click="HandleClick($event)"
      @contextmenu.prevent
      @wheel="wheel" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, nextTick } from 'vue'
import { EncounterMap } from '@/classes/encounter/EncounterMap'
import InfiniteCanvas from 'ef-infinite-canvas'
import { getColor } from './mapUtils'

const props = withDefaults(defineProps<{
  sizeX?: number
  sizeY?: number
  cellType?: string
  cellSubtype?: any[]
  map?: Record<string, any>
  preview?: boolean
}>(), { sizeX: 30, sizeY: 12, cellType: '', cellSubtype: () => [] })

const cellSize = 40
let extentsX = 0
let extentsY = 0
let canvas: any = null
let context: any = null
let mapData: any = {}

function init() {
  if (props.map) {
    mapData = props.map
    extentsX = mapData.SizeX
    extentsY = mapData.SizeX
  } else {
    mapData = new EncounterMap({ type: 'Square', x: props.sizeX, y: props.sizeY, tiles: [] })
    extentsX = props.sizeX!
    extentsY = props.sizeY!
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
  context.strokeStyle = 'rgba(135, 135, 135, 0.3)'
  for (let row = 0; row < extentsY; row++) {
    for (let col = 0; col < extentsX; col++) {
      const x = col * s
      const y = row * s
      context.beginPath()
      context.moveTo(x, y)
      context.lineTo(x + s, y)
      context.lineTo(x + s, y + s)
      context.lineTo(x, y + s)
      context.lineTo(x, y)
      context.stroke()
      if (mapData.HasTile(col, row)) {
        const tile = mapData.GetTile(col, row)
        const flags = mapData.FromBitmask(tile.Flags)
        context.fillStyle = getColor(flags)
        context.fill()
        context.fillStyle = 'rgba(255, 255, 255, 0.5)'
        if (flags.length > 2) {
          context.fillText('ALL', x + 1, y + 8)
        } else if (flags.includes('Player')) {
          context.fillText('PC', x + 1, y + 8)
        } else if (flags.includes('Enemy')) {
          context.fillText('NPC', x + 1, y + 8)
        }
      } else {
        context.fillStyle = 'rgba(135, 135, 135, 0.5)'
      }
      const coord = `${col + 1},${row + 1}`
      const xOffset = s - coord.length * 4 - 2
      context.fillText(coord, x + xOffset, y + s - 3)
    }
  }
}

function HandleClick(event: MouseEvent) {
  const canvasTransform = canvas.transformation
  const mouseX = event.offsetX * canvasTransform.a + canvasTransform.e
  const mouseY = event.offsetY * canvasTransform.a + canvasTransform.f
  const col = Math.floor(mouseX / cellSize)
  const row = Math.floor(mouseY / cellSize)
  if (col < 0 || col >= extentsX || row < 0 || row >= extentsY) return
  if (mapData.GetTile(col, row)) {
    mapData.ClearTile(col, row)
  } else {
    mapData.SetTile(col, row, [props.cellType].concat(props.cellSubtype!))
  }
  DrawGrid()
}

function wheel(_event: WheelEvent) {}


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
