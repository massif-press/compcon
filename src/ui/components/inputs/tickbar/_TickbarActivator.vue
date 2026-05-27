<template>
  <v-tooltip location="top"
    :text="label"
    :open-delay="400">
    <template #activator="{ props }">
      <div v-bind="props">
        <v-menu :close-on-content-click="false">
          <template #activator="{ props }">
            <v-btn v-bind="props"
              size="small"
              tile
              flat
              :readonly="readonly"
              class="d-block pl-5"
              :class="`bg-${bgColor}${clip ? ' modelValue-clip' : ''}`"
              height="24px"
              :style="`width: ${width}`">
              <v-icon start
                :icon="icon"
                size="20" />
              <span v-if="valueAtlas?.length"
                class="heading"
                style="font-size: 14px">
                {{ valueAtlas[modelValue] }}
              </span>
              <span v-else
                class="heading"
                style="font-size: 14px">{{ modelValue }}</span>
            </v-btn>
          </template>
          <tickbar-menu :icon="icon"
            :label="label"
            :editable="editable"
            @set="$emit('set', $event)"
            @reset="$emit('reset')">
            <v-text-field v-model.number="localValue"
              variant="outlined"
              type="number"
              tile
              hide-details
              autofocus
              density="compact"
              @focus="$event.target.select()"
              @update:model-value="$emit('set', Number($event))" />
            <slot name="menu-content" />
            <template #edit-max-value>
              <v-text-field v-model.number="localValue"
                variant="outlined"
                type="number"
                tile
                hide-details
                autofocus
                density="compact"
                @focus="$event.target.select()"
                @update:model-value="$emit('set', Number($event))" />
            </template>
          </tickbar-menu>
        </v-menu>
      </div>
    </template>
  </v-tooltip>
</template>

<script lang="ts">
import TickbarMenu from './_tickbarMenu.vue';

export default {
  name: 'TickbarActivator',
  components: { TickbarMenu },
  props: {
    label: { type: String },
    icon: { type: String },
    readonly: { type: Boolean },
    bgColor: { type: String, default: 'panel' },
    editable: { type: Boolean, default: false },
    modelValue: { type: Number, default: 0 },
    internalValue: { type: Number, default: 0 },
    width: { type: String, default: '158px' },
    clip: { type: Boolean, default: false },
    valueAtlas: { type: Array, default: null },
  },
  emits: ['set', 'reset'],
  data() {
    return { localValue: this.internalValue };
  },
  watch: {
    internalValue(val) { this.localValue = val; },
  },
};
</script>

<style scoped>
.modelValue-clip {
  clip-path: polygon(17px 0, 100% 0, 100% 100%, 0 100%, 0 17px);
}
</style>
