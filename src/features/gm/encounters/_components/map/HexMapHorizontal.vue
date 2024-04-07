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

<script>
import { EncounterMap } from '@/classes/encounter/EncounterMap';
import InfiniteCanvas from 'ef-infinite-canvas';

const findNearest = (target, arr) => {
  let nearestPoint = null;
  let minDistance = Infinity;

  for (let i = 0; i < arr.length; i++) {
    const point = arr[i];
    const distance = Math.sqrt(Math.pow(target.x - point.x, 2) + Math.pow(target.y - point.y, 2));

    if (distance < minDistance) {
      nearestPoint = point;
      minDistance = distance;
    }
  }

  return nearestPoint;
};

export default {
  name: 'hex-map-horizontal-editor',
  props: {
    sizeX: {
      type: Number,
      default: 45,
    },
    sizeY: {
      type: Number,
      default: 20,
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
  data: () => ({
    cellSize: 30,
    canvas: null,
    context: null,
    centers: [],
  }),
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
          type: 'HexH',
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
      this.context.clearRect(-Infinity, -Infinity, Infinity, Infinity);
      await this.$nextTick();
      this.centers = [];

      this.context.strokeStyle = 'rgba(135, 135, 135, 0.3)';

      const s = this.cellSize;

      for (let row = 0; row < this.sizeY; row++) {
        for (let col = 0; col < this.sizeX; col++) {
          const w = 2 * s;
          const h = Math.sqrt(3) * s;

          let x = 2 * (col * ((3 / 2) * s));
          let y = row * 0.5 * h;

          if (row % 2 === 1) {
            x += 1.5 * s;
          }

          const coord = `${col + 1},${row + 1}`;
          const xOffset = coord.length * 2;

          this.context.beginPath();
          this.context.moveTo(x, y);
          this.context.lineTo(x + 0.5 * w, y);
          this.context.lineTo(x + w * 0.75, y - h / 2);
          this.context.lineTo(x + 0.5 * w, y - h);
          this.context.lineTo(x, y - h);
          this.context.lineTo(x - 0.25 * w, y - h / 2);
          this.context.lineTo(x, y);
          this.context.stroke();

          if (this.mapData.HasTile(col, row)) {
            const tile = this.mapData.GetTile(col, row);
            const flags = this.mapData.FromBitmask(tile.Flags);

            this.context.fillStyle = this.getColor(flags);
            this.context.fill();

            this.context.fillStyle = 'rgba(255, 255, 255, 0.5)';

            if (flags.length > 2) {
              this.context.fillText('ALL', x + xOffset - 1, y - 2);
            } else if (flags.includes('Player')) {
              this.context.fillText('PC', x + xOffset + 1, y - 2);
            } else if (flags.includes('Enemy')) {
              this.context.fillText('NPC', x + xOffset - 1, y - 2);
            }
          } else {
            this.context.fillStyle = 'rgba(135, 135, 135, 0.5)';
          }

          this.context.fillText(coord, x + xOffset, y - s - 13);

          this.centers.push({ x, y: y - s, row, col });
        }
      }
    },

    async HandleClick(event) {
      const canvasTransform = this.canvas.transformation;

      const mouseX = event.offsetX * canvasTransform.a + canvasTransform.e;
      const mouseY = event.offsetY * canvasTransform.a + canvasTransform.f;

      const extentsX = this.sizeX * this.cellSize * 3;
      const extentsY = this.sizeY * this.cellSize * (4 / 5);

      if (mouseX < 0.5 * -this.cellSize || mouseX > extentsX) {
        return;
      }
      if (mouseY < -2 * this.cellSize || mouseY > extentsY) {
        return;
      }

      const hex = findNearest({ x: mouseX, y: mouseY }, this.centers);

      if (!hex) return;

      if (this.mapData.HasTile(hex.col, hex.row)) {
        this.mapData.ClearTile(hex.col, hex.row);
      } else {
        this.mapData.SetTile(hex.col, hex.row, [this.cellType].concat(this.cellSubtype));
      }

      await this.DrawGrid();
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
