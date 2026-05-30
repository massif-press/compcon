<template>
  <v-row no-gutters>
    <v-col cols="auto"
      class="mr-n3">
      <v-menu :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn tile
            flat
            :readonly="readonly"
            class="pl-6"
            width="178px"
            :class="`bg-${bgColor}  ${reverse ? 'reverse-btn-body-clip' : noClip ? 'btn-body' : 'btn-body-clip'}`"
            v-bind="props">
            <span class="pr-7 heading">
              <v-icon v-if="icon"
                :icon="icon"
                class="mr-2 mt-n1" />
              <span v-if="display">
                {{ modelValue }}
                <div class="text-cc-overline d-inline-block ml-n2"
                  style="line-height: 0; opacity: 0.5">
                  /{{ ticks }}
                </div>
              </span>
              <v-icon v-else-if="!icon && !readonly"
                icon="mdi-keyboard-variant"
                style="opacity: 0.3" />
            </span>
          </v-btn>
        </template>

        <tickbar-menu :icon="icon"
          :label="label"
          :editable="editable"
          @set="setVal($event)"
          @reset="$emit('reset')">
          <v-text-field v-model.number="internalValue"
            variant="outlined"
            type="number"
            tile
            hide-details
            autofocus
            density="compact"
            @focus="$event.target.select()"
            @update:model-value="setVal(Number($event))" />
          <template #edit-max-value>
            <v-text-field :model-value.number="internalValue"
              variant="outlined"
              type="number"
              tile
              hide-details
              autofocus
              density="compact"
              @focus="$event.target.select()"
              @update:model-value="setVal(Number($event))" />
          </template>
        </tickbar-menu>
      </v-menu>
    </v-col>

    <v-col>
      <div v-if="ticks > tickThreshold"
        class="angled"
        style="height: 36px"
        :style="pctBackground" />
      <div v-for="i in ticks"
        :key="`tick-${i}`"
        v-else
        class="d-inline-block"
        :style="`width: ${100 / ticks}%;`">
        <v-tooltip location="top"
          :open-delay="400">
          <template #activator="{ props }">
            <v-btn v-bind="props"
              tile
              flat
              :readonly="readonly ||
                disabled ||
                loading ||
                (!!maxSelectable && modelValue + i - 1 >= maxSelectable)
                "
              style="width: calc(100% - 6px)"
              class="tick"
              :class="`${isHovered(i) && 'hovered'} ${isMouseovered(i) || (isActive(i) && 'highlighted')} ${isHovered(i) || isActive(i) ? `bg-${color}` : `bg-${bgColor}`} ${reverse ? 'reverse ml-1' : 'angled'}  px-0 `"
              @mouseover="hover = i"
              @mouseleave="hover = null"
              @click="setVal(i)" />
          </template>
          <div class="heading h3 text-center">
            <div class="text-cc-overline text-disabled">{{ label }}</div>
            {{ i }}
          </div>
        </v-tooltip>
      </div>
    </v-col>

    <v-col cols="auto">
      <div class="end-cap"
        :class="`bg-${bgColor}`"
        :style="reverse
          ? `clip-path: polygon(70% 0, 100% 0, 100% 100%, 4px 100%)`
          : `clip-path: polygon(10% 0%, 100% 0%, 100% 100%, 38px 100%)`
          " />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import TickbarMenu from './_tickbarMenu.vue';

const _display = useDisplay()

defineOptions({ name: 'CcTickbarCenter' })

const props = withDefaults(defineProps<{
  modelValue?: number
  label?: string
  color?: string
  bgColor?: string
  disabled?: boolean
  loading?: boolean
  icon?: string
  ticks?: number
  controls?: boolean
  clearable?: boolean
  display?: boolean
  valueTooltips?: boolean
  stopAdd?: boolean
  maxSelectable?: number
  readonly?: boolean
  reverse?: boolean
  minWidth?: string
  noClip?: boolean
  editable?: boolean
}>(), {
  modelValue: 0,
  color: 'primary',
  bgColor: 'panel',
  ticks: 6,
  display: true,
  valueTooltips: false,
  reverse: false,
  editable: false
})

const emit = defineEmits<{
  'update:modelValue': []
  'reset': []
}>()

const hover = ref(null as number | null)
const internalValue = ref(props.modelValue)

const tickThreshold = computed(() => {
      if (_display.mdAndDown.value) return 20;
      if (_display.lgAndDown.value) return 25;
      return 35;
    })
const pctBackground = computed(() => {
      const pct = Math.round((props.modelValue / props.ticks) * 100);

      return `background: linear-gradient(to right, rgb(var(--v-theme-${props.color})) ${pct}%, rgb(var(--v-theme-${props.bgColor})) ${pct}%)`;
    })

function isHovered(i: number) {
      return hover.value && hover.value >= i;
    }
function isMouseovered(i: number) {
      return hover.value === i;
    }
function isActive(i: number) {
      return props.modelValue && props.modelValue >= i;
    }
function setVal(val: number) {
      if (props.stopAdd && val > props.modelValue) return;
      if (val > props.ticks) val = props.ticks;
      if (val < 0) val = 0;
      if (props.modelValue === 1 && val === 1) val = 0;
      emit('update:modelValue', val);
    }
</script>

<style scoped>
@import './tickbar.css';

.light {
  width: 13.5px;
  height: 13.5px;
}

.reverse-light {
  width: 13.5px;
  height: 13.5px;
}

.btn-body {
  clip-path: polygon(0px 0, calc(100% - 33px) 0, 100% 100%, 0 100%, 0 16px);
  font-size: 1.75rem;
  margin-right: -20px !important;
}

.btn-body-clip {
  clip-path: polygon(16px 0, calc(100% - 33px) 0, 100% 100%, 0 100%, 0 16px);
  font-size: 1.75rem;
  margin-right: -20px !important;
}

.reverse-btn-body-clip {
  clip-path: polygon(0 0, 100% 0, calc(100% - 33px) 100%, 16px 100%, 0 calc(100% - 16px));
  font-size: 1.75rem;
  margin-right: -20px !important;
  min-width: 150px !important;
}

.angled {
  min-width: 0px !important;
  transform: skew(42deg) translateZ(0);

  backface-visibility: hidden;

  filter: blur(0.5px);
}

.reverse {
  min-width: 0px !important;
  transform: skew(-42deg) translateZ(0);

  backface-visibility: hidden;

  filter: blur(0.5px);
}

.angled {
  margin: 0 4px 0 4px;
}

.end-cap {
  height: 100%;
  max-height: 44px;
  width: 52px;
  margin-left: -16px !important;
}

</style>
