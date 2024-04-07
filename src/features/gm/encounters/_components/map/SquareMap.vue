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

<script>
import { EncounterMap } from '@/classes/encounter/EncounterMap';
import InfiniteCanvas from 'ef-infinite-canvas';

export default {
  name: 'square-map-editor',
  data: () => ({
    cellSize: 40,
    extentsX: 0,
    extentsY: 0,
    canvas: null,
    context: null,
    mapData: {},
    hoverTile: { row: -1, col: -1 },
  }),
  props: {
    sizeX: {
      type: Number,
      default: 30,
    },
    sizeY: {
      type: Number,
      default: 12,
    },
    cellType: {
      type: String,
      default: '',
    },
    cellSubtype: {
      type: Array,
      default: () => [],
    },
    map: {
      type: Object,
      required: false,
    },
    preview: {
      type: Boolean,
    },
  },
  watch: {
    sizeX() {
      this.DrawGrid();
    },
    sizeY() {
      this.DrawGrid();
    },
  },
  async mounted() {
    this.init();
    await this.DrawGrid();
  },
  methods: {
    init() {
      if (this.map) {
        this.mapData = this.map;
        this.extentsX = this.mapData.SizeX;
        this.extentsY = this.mapData.SizeX;
      } else {
        this.mapData = new EncounterMap({
          type: 'Square',
          x: this.sizeX,
          y: this.sizeY,
          tiles: [],
        });
        this.extentsX = this.sizeX;
        this.extentsY = this.sizeY;
      }

      this.canvas = new InfiniteCanvas(document.getElementById('canvas'), {
        rotationEnabled: false,
        greedyGestureHandling: true,
      });

      this.context = this.canvas.getContext('2d');
      this.context.font = '8px Arial';

      const container = document.getElementById('container');
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    },
    resetView() {
      this.init();
      this.DrawGrid();
    },

    async DrawGrid() {
      const s = this.cellSize;

      this.context.clearRect(-Infinity, -Infinity, Infinity, Infinity);
      await this.$nextTick();

      this.context.strokeStyle = 'rgba(135, 135, 135, 0.3)';

      //draw grid
      for (let row = 0; row < this.extentsY; row++) {
        for (let col = 0; col < this.extentsX; col++) {
          const x = col * s;
          const y = row * s;

          this.context.beginPath();
          this.context.moveTo(x, y);
          this.context.lineTo(x + s, y);
          this.context.lineTo(x + s, y + s);
          this.context.lineTo(x, y + s);
          this.context.lineTo(x, y);
          this.context.stroke();
          if (this.mapData.HasTile(col, row)) {
            const tile = this.mapData.GetTile(col, row);
            const flags = this.mapData.FromBitmask(tile.Flags);

            this.context.fillStyle = this.getColor(flags);
            this.context.fill();

            this.context.fillStyle = 'rgba(255, 255, 255, 0.5)';

            if (flags.length > 2) {
              this.context.fillText('ALL', x + 1, y + 8);
            } else if (flags.includes('Player')) {
              this.context.fillText('PC', x + 1, y + 8);
            } else if (flags.includes('Enemy')) {
              this.context.fillText('NPC', x + 1, y + 8);
            }
          } else {
            this.context.fillStyle = 'rgba(135, 135, 135, 0.5)';
          }

          const coord = `${col + 1},${row + 1}`;
          const xOffset = s - coord.length * 4 - 2;

          this.context.fillText(coord, x + xOffset, y + s - 3);
        }
      }
    },

    HandleClick(event) {
      const canvasTransform = this.canvas.transformation;

      const mouseX = event.offsetX * canvasTransform.a + canvasTransform.e;
      const mouseY = event.offsetY * canvasTransform.a + canvasTransform.f;

      const col = Math.floor(mouseX / this.cellSize);

      const row = Math.floor(mouseY / this.cellSize);

      if (col < 0 || col >= this.extentsX || row < 0 || row >= this.extentsY) {
        return;
      }

      if (this.mapData.GetTile(col, row)) {
        this.mapData.ClearTile(col, row);
      } else {
        this.mapData.SetTile(col, row, [this.cellType].concat(this.cellSubtype));
      }

      this.DrawGrid();
    },

    getColor(flags) {
      if (flags.includes('Deployment')) return '#B71C1C';
      if (flags.includes('Ingress')) return '#0277BD';
      if (flags.includes('Egress')) return '#00C853';
      if (flags.includes('Objective')) return '#F57F17';
      if (flags.includes('Obstruction')) return '#546E7A';
      return 'rgba(0, 0, 0, 0)';
    },

    getCanvas() {
      return this.canvas;
    },
  },
};
</script>
