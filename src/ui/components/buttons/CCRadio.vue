<template>
  <div style="display: flex">
    <v-icon
      v-if="prependIcon"
      style="align-self: center"
      :size="iconSize(prependIcon)"
      :class="iconOffset(prependIcon)"
      :start="!label"
      :icon="prependIcon" />
    <div v-if="label" class="d-inline-block text-cc-overline ml-3" style="align-self: center">
      {{ label }}
      <cc-slashes class="mr-2 ml-1" />
    </div>
    <v-hover>
      <template #default="{ props, isHovering }">
        <div
          v-bind="props"
          class="top-element"
          :style="`display: inline-block; position: relative`">
          <span :class="`light ${size} bg-${getLightColor(isHovering)}`" />
          <v-btn
            icon
            tile
            :size="iconSize('btn')"
            :class="`${size} ${isOn && 'on'} size-${size} bg-${bgColor}`"
            @click="toggle">
            <v-fade-transition leave-absolute>
              <v-btn v-if="isOn" icon tile :color="activeColor" :size="iconSize('btn')" />
            </v-fade-transition>
          </v-btn>
        </div>
      </template>
    </v-hover>

    <v-tooltip v-if="tooltip" location="top" max-width="300px">
      <template v-slot:activator="{ props }">
        <v-icon
          style="align-self: center"
          :size="iconSize('tt')"
          v-bind="props"
          class="fade-select mx-1"
          :icon="tooltipIcon || 'mdi-information-slab-box-outline'" />
      </template>
      {{ tooltip }}
    </v-tooltip>
  </div>
</template>

<script lang="ts">
export default {
  name: 'cc-switch',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    size: {
      type: String,
      default: 'default',
    },
    bgColor: {
      type: String,
      default: 'panel',
    },
    color: {
      type: String,
      default: 'primary',
    },
    activeColor: {
      type: String,
      default: 'success',
    },
    prependIcon: {
      type: String,
    },
    tooltip: {
      type: String,
    },
    tooltipIcon: {
      type: String,
    },
    label: {
      type: String,
    },
  },
  computed: {
    isOn() {
      return this.modelValue;
    },
  },
  methods: {
    toggle() {
      this.$emit('update:modelValue', !this.isOn);
    },
    iconSize(icon: string) {
      let size = 24;
      if (icon === 'btn') size += 8;

      switch (this.size) {
        case 'x-small':
          size = 10;
          if (icon === 'btn') size += 6;
          break;
        case 'small':
          size = 16;
          if (icon === 'btn') size += 6;
          break;
        case 'large':
          size = 28;
          if (icon === 'btn') size += 8;
          break;
        case 'x-large':
          size = 32;
          if (icon === 'btn') size += 12;

          break;
        case 'xx-large':
          size = 40;
          if (icon === 'btn') size += 16;

          break;
      }
      if (icon.includes('cc:')) size += 4;
      return `${size}px`;
    },
    iconOffset(icon: string) {
      return icon.includes('cc:') ? 'offset' : '';
    },
    getLightColor(isHovering: null | boolean) {
      if (isHovering && !this.isOn) return this.activeColor;
      return this.isOn ? this.activeColor : this.color;
    },
  },
};
</script>

<style scoped>
.v-btn {
  position: relative;
}

.light {
  position: absolute;
  clip-path: polygon(0 50%, 50% 0, 100% 0, 0% 100%);
  border-top-left-radius: 1px;
  transition: filter 0.2s ease-in-out;
}

.top-element:hover .light {
  filter: brightness(2) saturate(200%) hue-rotate(20deg);
}

.light.x-small {
  top: 2px;
  width: 8px;
  height: 8px;
}

.light.small {
  width: 9.5px;
  height: 9.5px;
}

.light.default {
  width: 13.5px;
  height: 13.5px;
}

.light.large {
  width: 17px;
  height: 17px;
}

.light.x-large {
  width: 21px;
  height: 21px;
}

.light.xx-large {
  width: 27px;
  height: 27px;
}

.size-x-small {
  clip-path: polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px);
}

.size-small {
  clip-path: polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px);
}

.size-default {
  clip-path: polygon(16px 0, 100% 0, 100% 100%, 0 100%, 0 16px);
}

.size-large {
  clip-path: polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px);
}

.size-x-large {
  clip-path: polygon(24px 0, 100% 0, 100% 100%, 0 100%, 0 24px);
}

.size-xx-large {
  clip-path: polygon(30px 0, 100% 0, 100% 100%, 0 100%, 0 30px);
}
</style>
