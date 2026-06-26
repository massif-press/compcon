<template>
  <v-card color="panel"
    class="top-element"
    flat
    tile>
    <v-row dense
      justify="center"
      align="center">
      <v-col cols="auto"
        class="heading">
        <v-tooltip :text="title?.toUpperCase()">
          <template #activator="{ props }">
            <v-icon v-if="icon"
              :icon="icon"
              class="mt-n1 mx-1"
              :color="color"
              v-bind="props" />
          </template>
        </v-tooltip>
        <span v-if="!portrait"
          style="font-size: 15px">
          {{ title }}
        </span>
      </v-col>

      <v-col cols="auto"
        class="ml-auto">
        <v-row no-gutters
          align="center">
          <v-col cols="auto">
            <v-btn icon
              flat
              tile
              size="30"
              class="mx-2"
              variant="text"
              @click="setVal(internalValue - 1)">
              <v-icon size="x-large"
                icon="mdi-minus" />
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-text-field :model-value="internalValue"
              variant="outlined"
              type="text"
              tile
              hide-details
              density="compact"
              width="60"
              @focus="$event.target.select()"
              @keydown.enter="$event.target.blur()"
              @blur="handleInput($event.target.value)" />
          </v-col>
          <v-col cols="auto">
            <v-btn icon
              flat
              tile
              size="30"
              class="mx-2"
              variant="text"
              @click="setVal(internalValue + 1)">
              <v-icon size="x-large"
                icon="mdi-plus" />
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="auto"
        style="width: 50px;">
        <div v-if="max"
          class="text-disabled">
          <span class="text-body px-1">/</span><span class="heading h3">{{ max }}</span>
        </div>
      </v-col>

      <v-col cols="auto">
        <v-menu>
          <template #activator="{ props }">
            <v-btn icon
              flat
              tile
              size="x-small"
              class="mx-2 fade-select"
              variant="text"
              v-bind="props">
              <v-icon icon="mdi-cog" />
            </v-btn>
          </template>
          <v-list density="compact"
            border>
            <v-list-item prepend-icon="mdi-reload"
              @click="setVal(baseValue)">
              <v-list-item-title>{{ $t('active.miniPanel.resetBase') }}</v-list-item-title>
            </v-list-item>
            <v-list-item prepend-icon="mdi-cancel"
              @click="setVal(0)">
              <v-list-item-title>{{ $t('common.clear') }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'

const _display = useDisplay()

defineOptions({ name: 'StatMiniPanel' })

const props = withDefaults(defineProps<{
  modelValue?: number
  max?: number
  min?: number
  title?: string
  icon?: string
  color?: string
  boolean?: boolean
  baseValue?: number
}>(), {
  min: 0,
  baseValue: 0
})

const emit = defineEmits<{
  'click': []
  'update:model-value': [value: number]
}>()

const internalValue = computed(() => props.modelValue || 0)

const portrait = computed(() => {
  return _display.xs.value
})
const mobile = computed(() => {
  return _display.mdAndDown.value
})

function handleInput(val: string) {
  const m = val.trim().match(/^([+\-*/])(\d*\.?\d+)$/)
  if (m) {
    const n = parseFloat(m[2])
    const cur = internalValue.value
    setVal(m[1] === '+' ? cur + n : m[1] === '-' ? cur - n : m[1] === '*' ? Math.round(cur * n) : n ? Math.round(cur / n) : cur)
  } else {
    const n = parseFloat(val)
    if (!isNaN(n)) setVal(n)
  }
}

function setVal(val) {
  if (props.boolean) {
    val = val > 0 ? 1 : 0
  } else {
    val = Math.max(val, props.min)
    if (props.max !== undefined) {
      val = Math.min(val, props.max)
    }
  }
  emit('update:model-value', val)
}
</script>

<style scoped>
.top-element :deep(.v-input--horizontal .v-input__prepend) {
  margin-inline-end: 0px !important;
}

.top-element :deep(.v-input--horizontal .v-input__append) {
  margin-inline-start: 0px !important;
}

.top-element :deep(.v-field__input) {
  min-height: auto !important;
  height: 32px;
}
</style>
