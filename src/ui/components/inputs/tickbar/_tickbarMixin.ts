export const tickbarMixin = {
  data() {
    return {
      hover: null as number | null,
      internalValue: (this as any).modelValue,
    };
  },
  computed: {
    tickThreshold(this: any) {
      if (this.$vuetify.display.mdAndDown) return 1;
      if (this.$vuetify.display.lgAndDown) return 4;
      return 6;
    },
    pctBackground(this: any) {
      if (!this.ticks || this.ticks <= 0) return '';
      const pct = Math.round((this.modelValue / this.ticks) * 100);
      return `background: linear-gradient(45deg, rgb(var(--v-theme-${this.color})) ${pct}%, rgb(var(--v-theme-${this.bgColor})) ${pct}%)`;
    },
  },
  watch: {
    modelValue(this: any, val: number) {
      this.internalValue = val;
    },
    internalValue(this: any, val: number) {
      this.$emit('update:modelValue', val);
    },
  },
  methods: {
    isHovered(this: any, i: number) {
      return this.hover && this.hover >= i;
    },
    isMouseovered(this: any, i: number) {
      return this.hover === i;
    },
    isActive(this: any, i: number) {
      return this.modelValue && this.modelValue >= i;
    },
    setVal(this: any, val: number) {
      if (this.stopAdd && val > this.modelValue) return;
      if (this.ticks && val > this.ticks) val = this.ticks;
      if (val < 0) val = 0;
      if (this.modelValue === 1 && val === 1) val = 0;
      this.$emit('update:modelValue', val);
    },
  },
};
