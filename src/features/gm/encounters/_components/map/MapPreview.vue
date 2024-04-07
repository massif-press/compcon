<template>
  <div id="previewContainer" ref="previewContainer" class="my-4 mx-2" style="position: relative">
    <canvas
      id="previewCanvas"
      ref="previewCanvas"
      style="height: 100%; width: 100%"
      @contextmenu.prevent />
  </div>
</template>

<script>
export default {
  name: 'square-map-editor',
  data: () => ({
    cellSize: 20,
    canvas: null,
    context: null,
  }),
  props: {
    map: {
      type: Object,
      required: false,
    },
  },
  watch: {
    map: {
      handler() {
        this.init();
      },
      deep: true,
    },
  },
  async mounted() {
    this.init();
    await this.update();
  },
  methods: {
    async update() {
      if (this.mapData.MapType === 'Square') {
        await this.DrawSquares();
      } else if (this.mapData.MapType === 'HexH') {
        await this.DrawHexH();
      } else if (this.mapData.MapType === 'HexV') {
        await this.DrawHexV();
      }
    },
    init() {
      this.mapData = this.map;
      this.extentsX = this.mapData.SizeX;
      this.extentsY = this.mapData.SizeX;
      this.canvas = this.$refs.previewCanvas;

      this.context = this.canvas.getContext('2d');
      this.context.font = '8px Arial';

      const container = document.getElementById('previewContainer');
      previewCanvas.width = container.offsetWidth;
      previewCanvas.height = container.offsetHeight;

      this.scaleExtents(previewCanvas.width, previewCanvas.height);

      if (this.mapData.Type === 'Square') {
        this.DrawSquares();
      } else if (this.mapData.Type === 'HexH') {
        this.DrawHexH();
      } else if (this.mapData.Type === 'HexV') {
        this.DrawHexV();
      }
    },

    async DrawSquares() {
      const s = this.cellSize;

      this.context.clearRect(-Infinity, -Infinity, Infinity, Infinity);
      await this.$nextTick();

      this.context.strokeStyle = 'rgba(135, 135, 135, 0.3)';

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
          }
        }
      }
    },

    async DrawHexH() {
      this.context.clearRect(-Infinity, -Infinity, Infinity, Infinity);
      await this.$nextTick();

      this.context.strokeStyle = 'rgba(135, 135, 135, 0.3)';

      const s = this.cellSize;

      for (let row = 0; row < this.extentsY; row++) {
        for (let col = 0; col < this.extentsX; col++) {
          const w = 2 * s;
          const h = Math.sqrt(3) * s;

          let x = 2 * (col * ((3 / 2) * s));
          let y = row * 0.5 * h;

          if (row % 2 === 1) {
            x += 1.5 * s;
          }

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
          }
        }
      }
    },

    async DrawHexV() {
      this.context.clearRect(-Infinity, -Infinity, Infinity, Infinity);
      await this.$nextTick();

      this.context.strokeStyle = 'rgba(135, 135, 135, 0.3)';

      const s = this.cellSize;

      for (let row = 0; row < this.extentsY; row++) {
        for (let col = 0; col < this.extentsX; col++) {
          const w = Math.sqrt(3) * s;
          const h = 2 * s;

          let y = row * s * 1.5;
          let x = col * w;

          if (row % 2 === 1) x += 0.5 * w;

          this.context.beginPath();
          this.context.moveTo(x, y);
          this.context.lineTo(x + 0.5 * w, y - h * 0.25);
          this.context.lineTo(x + 0.5 * w, y - h * 0.75);
          this.context.lineTo(x, y - h);
          this.context.lineTo(x - 0.5 * w, y - h * 0.75);
          this.context.lineTo(x - 0.5 * w, y - h * 0.25);
          this.context.lineTo(x, y);
          this.context.stroke();

          if (this.mapData.HasTile(col, row)) {
            const tile = this.mapData.GetTile(col, row);
            const flags = this.mapData.FromBitmask(tile.Flags);

            this.context.fillStyle = this.getColor(flags);
            this.context.fill();

            this.context.fillStyle = 'rgba(255, 255, 255, 0.5)';
          }
        }
      }
    },

    scaleExtents(canvasWidth, canvasHeight) {
      const type = this.mapData.MapType;
      let originalWidth = this.extentsX * this.cellSize;
      let originalHeight = this.extentsY * this.cellSize;

      if (type === 'HexV') {
        originalWidth *= Math.sqrt(3);
        originalHeight *= 4 / 3;
      } else if (type === 'HexH') {
        originalWidth *= 3;
        originalHeight *= 4 / 5;
      }

      const scale = Math.min(canvasWidth / originalWidth, canvasHeight / originalHeight);

      if (type === 'Square') {
        this.context.translate(canvasWidth / 2, canvasHeight / 2);
        this.context.scale(scale, scale);
        this.context.translate(-originalWidth / 2, -originalHeight / 2);
      } else if (type === 'HexV') {
        this.context.translate(canvasWidth / 2, canvasHeight / 2);
        this.context.scale(scale * 0.85, scale * 0.85);
        this.context.translate(
          -originalWidth / 2 + this.cellSize / 2,
          -originalHeight / 2 + this.cellSize * 1.25
        );
      } else if (type === 'HexH') {
        this.context.translate(canvasWidth / 2, canvasHeight / 2);
        this.context.scale(scale * 0.95, scale * 0.95);
        this.context.translate(
          -originalWidth / 2 + this.cellSize / 3,
          -originalHeight / 2 + this.cellSize
        );
      }
    },

    getColor(flags) {
      if (flags.includes('Deployment')) return '#B71C1C';
      if (flags.includes('Ingress')) return '#0277BD';
      if (flags.includes('Egress')) return '#00C853';
      if (flags.includes('Objective')) return '#F57F17';
      if (flags.includes('Obstruction')) return '#546E7A';
      return 'rgba(0, 0, 0, 0)';
    },
  },
};
</script>
