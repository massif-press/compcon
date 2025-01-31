<template>
  <div style="display: flex">
    <v-icon
      v-if="prependIcon"
      style="align-self: center"
      :size="size"
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
          style="display: inline-block; position: relative; align-self: center">
          <span :class="`light ${size} bg-${getLightColor(isHovering)}`" />
          <div
            class="toggle"
            :class="`${size} ${isOn && 'on'} size-${size} bg-${bgColor}`"
            @click="toggle">
            <div class="toggle-knob" :class="`${size} bg-${isOn ? activeColor : color}`" />
          </div>
        </div>
      </template>
    </v-hover>
    <v-slide-x-transition leave-absolute>
      <v-icon v-if="isOn && onIcon" style="align-self: center" end :size="size" :icon="onIcon" />
      <v-icon v-if="!isOn && offIcon" style="align-self: center" end :size="size" :icon="offIcon" />
    </v-slide-x-transition>

    <v-tooltip v-if="tooltip" location="top" max-width="300px">
      <template v-slot:activator="{ props }">
        <v-icon
          style="align-self: center"
          :size="size"
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
    onIcon: {
      type: String,
    },
    offIcon: {
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

.offset {
  margin-top: -5px;
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

.toggle {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle.x-small {
  width: 30px;
  height: 10px;
}

.toggle.small {
  width: 40px;
  height: 14px;
}

.toggle.default {
  width: 60px;
  height: 18px;
}

.toggle.large {
  width: 80px;
  height: 22px;
}

.toggle.x-large {
  width: 120px;
  height: 30px;
}

.toggle.xx-large {
  width: 160px;
  height: 36px;
}

.toggle-knob {
  opacity: 0.5;
  height: 80px;
  transition: all 0.2s ease-in-out;
}

.toggle-knob.x-small {
  width: 8px;
}

.toggle-knob.small {
  width: 10px;
}

.toggle-knob.default {
  width: 14px;
}

.toggle-knob.large {
  width: 19px;
}

.toggle-knob.x-large {
  width: 22px;
}

.toggle-knob.xx-large {
  width: 28px;
}

.toggle.on .toggle-knob {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 100%);
  opacity: 1;
}

.toggle.on .toggle-knob.x-small {
  transform: translateX(22px);
}

.toggle.on .toggle-knob.small {
  transform: translateX(30px);
}

.toggle.on .toggle-knob.default {
  transform: translateX(50px);
}

.toggle.on .toggle-knob.large {
  transform: translateX(70px);
}

.toggle.on .toggle-knob.x-large {
  transform: translateX(105px);
}

.toggle.on .toggle-knob.xx-large {
  transform: translateX(140px);
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
