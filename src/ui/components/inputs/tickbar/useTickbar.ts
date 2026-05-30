import { computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'

interface TickbarProps {
  modelValue: number
  ticks?: number
  color?: string
  bgColor?: string
  stopAdd?: boolean
}

function useTickbar(props: TickbarProps, emit: (event: 'update:modelValue', val: number) => void) {
  const { mdAndDown, lgAndDown } = useDisplay()
  const hover = ref<number | null>(null)
  const internalValue = ref(props.modelValue)

  watch(() => props.modelValue, (val) => {
    internalValue.value = val
  })

  watch(internalValue, (val) => {
    emit('update:modelValue', val)
  })

  const tickThreshold = computed(() => {
    if (mdAndDown.value) return 1
    if (lgAndDown.value) return 4
    return 6
  })

  const pctBackground = computed(() => {
    if (!props.ticks || props.ticks <= 0) return ''
    const pct = Math.round((props.modelValue / props.ticks) * 100)
    return `background: linear-gradient(45deg, rgb(var(--v-theme-${props.color})) ${pct}%, rgb(var(--v-theme-${props.bgColor})) ${pct}%)`
  })

  function isHovered(i: number) {
    return hover.value !== null && hover.value >= i
  }

  function isMouseovered(i: number) {
    return hover.value === i
  }

  function isActive(i: number) {
    return props.modelValue !== undefined && props.modelValue >= i
  }

  function setVal(val: number) {
    if (props.stopAdd && val > props.modelValue) return
    if (props.ticks && val > props.ticks) val = props.ticks
    if (val < 0) val = 0
    if (props.modelValue === 1 && val === 1) val = 0
    emit('update:modelValue', val)
  }

  return { hover, internalValue, tickThreshold, pctBackground, isHovered, isMouseovered, isActive, setVal }
}

export { useTickbar }
