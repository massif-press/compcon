<template>
  <div class="panel-toggle"
    :class="side"
    role="button"
    tabindex="0"
    :aria-label="$t('common.a11y.toggleNavigation')"
    :aria-expanded="modelValue"
    :style="stripStyle"
    @click="toggle()"
    @keydown.enter="toggle()"
    @keydown.space.prevent="toggle()">
    <div class="panel-toggle-chevron"
      :style="chevronStyle">
      <cc-button :icon="icon"
        color="primary"
        size="large"
        hide-light
        tabindex="-1"
        aria-hidden="true"
        @click="toggle()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'CCPanelToggle' })

const props = withDefaults(defineProps<{
  modelValue: boolean
  side?: 'left' | 'right'
  openOffset: number
  closedOffset: number
  bottomInset?: number
}>(), {
  side: 'left',
  bottomInset: 0,
})

const emit = defineEmits<{ 'update:modelValue': [val: boolean] }>()

const offset = computed(() => (props.modelValue ? props.openOffset : props.closedOffset))
const stripStyle = computed(() => ({
  [props.side]: `${offset.value}px`,
  width: props.modelValue ? '14px' : '22px',
  bottom: `calc(30% + ${props.bottomInset}px)`,
}))
const chevronStyle = computed(() => ({
  [props.side]: props.modelValue ? '-9px' : '2px',
}))
const icon = computed(() => {
  const collapse = props.side === 'left' ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'
  const expand = props.side === 'left' ? 'mdi-chevron-double-right' : 'mdi-chevron-double-left'
  return props.modelValue ? collapse : expand
})

function toggle() {
  emit('update:modelValue', !props.modelValue)
}
</script>

<style scoped>
.panel-toggle {
  position: absolute;
  z-index: 999;
  top: 30%;
  bottom: 30%;
  cursor: pointer;
  background-color: rgb(var(--v-theme-primary));
  transition: background-color 0.3s ease;
  corner-shape: bevel;
}

.panel-toggle.left {
  border-top-right-radius: 14px;
  border-bottom-right-radius: 14px;
}

.panel-toggle.right {
  border-top-left-radius: 14px;
  border-bottom-left-radius: 14px;
}

.panel-toggle:hover {
  background-color: rgb(var(--v-theme-accent))
}

.panel-toggle-chevron {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.panel-toggle :deep(.v-btn) {
  transition: background-color 0.3s ease;
}

.panel-toggle:hover :deep(.v-btn) {
  background-color: rgb(var(--v-theme-accent)) !important;
}
</style>
