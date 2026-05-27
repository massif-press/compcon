export const btnSubMixin = {
  emits: ['click'],
  props: {
    color: { type: String },
    disabled: { type: Boolean },
    block: { type: Boolean },
    loading: { type: Boolean },
    size: { type: String },
    variant: { type: String },
    prependIcon: { type: String },
    appendIcon: { type: String },
    optionsIcon: { type: String },
    tooltip: { type: String },
    tooltipIcon: { type: String },
    href: { type: String },
    to: { type: [String, Object] },
    target: { type: String },
  },
  computed: {
    sizeStyle(this: any): string {
      return this.size ? `size-${this.size}` : 'size-default'
    },
    optionsSize(this: any): string {
      return this.size ? `options-${this.size}` : 'options-default'
    },
    bgColor(this: any): string {
      return `bg-${this.color}`
    },
    outlined(this: any): boolean {
      return this.variant === 'outlined'
    },
    borderColor(this: any): string {
      if (!this.color) return ''
      if (this.color[0] === '#') return this.color
      return `rgb(var(--v-theme-${this.color})`
    },
  },
}

export function calcIconSize(size: string | undefined, icon: string, ccOffset: number): string {
  let s = 24
  switch (size) {
    case 'x-small': s = 11; break
    case 'small': s = 16; break
    case 'large': s = 20; break
    case 'x-large': s = 32; break
    case 'xx-large': s = 40; break
  }
  if (icon.includes('cc:')) s += ccOffset
  return `${s}px`
}
