<template>
  <div class="top-element"
    :style="`display: ${block ? 'block' : 'inline-block'}; position: relative`">
    <span v-if="!text"
      :class="`${disabled && 'disabled'} light ${size} ${bgColor} ${tonal && 'light-tonal'}`" />
    <v-btn
      :class="`${disabled && 'disabled'} ${colorClass} ${sizeStyle} px-0  ${outlined && `border-sm text-${color}`}`"
      :style="outlined ? `border-color: ${borderColor}!important` : ''"
      :color="text || tonal || outlined ? color : 'transparent'"
      :variant="<any>variant"
      tile
      :size="size"
      stacked
      :loading="loading"
      :disabled="disabled"
      :href="href"
      :to="to"
      :target="target"
      @click.stop="!disabled && !loading && $emit('click', $event)">
      <v-icon v-if="prependIcon"
        :icon="prependIcon"
        :size="iconSize(prependIcon)" />
      <slot />
    </v-btn>

    <v-menu v-if="$slots.options"
      offset-y>
      <template v-slot:activator="{ props }">
        <v-btn :variant="variant === 'default' ? 'tonal' : (variant as any)"
          style="text-transform: uppercase; clip-path: none; "
          tile
          :color="color"
          height="100%"
          :class="sizeStyle"
          :size="optionsSize"
          flat
          v-bind="props">
          <v-divider vertical />
          &nbsp;
          <v-icon :icon="optionsIcon || 'mdi-chevron-down'"
            :size="optionsSize - 6" />
          &nbsp;

        </v-btn>
      </template>
      <slot name="options" />
    </v-menu>
  </div>
</template>

<script lang="ts">
import { btnSubMixin, calcIconSize } from './_btnSubMixin';

export default {
  name: 'cc-btn-std',
  mixins: [btnSubMixin],
  props: {
    optionsIcon: { type: String, default: 'mdi-chevron-down' },
    optionsText: { type: String },
  },
  computed: {
    optionsSize(this: any): number {
      switch (this.size) {
        case 'x-small': return 24;
        case 'small': return 30;
        case 'large': return 36;
        case 'x-large': return 42;
        case 'xx-large': return 60;
        default: return 30;
      }
    },
    colorClass(this: any) {
      if (this.outlined || this.text || this.tonal) return '';
      return this.bgColor;
    },
    text(this: any) {
      return this.variant === 'text';
    },
    tonal(this: any) {
      return this.variant === 'tonal';
    },
  },
  methods: {
    iconSize(this: any, icon: string) {
      return calcIconSize(this.size, icon, 2);
    },
  },
};
</script>

<style scoped>
@import './cc_btn_base.css';

.disabled {
  filter: grayscale(100%);
  opacity: 0.5;
}

.v-btn {
  position: relative;
}

.offset {
  margin-top: -5px;
}

.light {
  top: 0px;
  width: 13.5px;
  height: 13.5px;
  position: absolute;
  clip-path: polygon(0 50%, 50% 0, 100% 0, 0% 100%);
  border-top-left-radius: 1px;
  transition: filter 0.2s ease-in-out;
}

.light-tonal {
  opacity: 0.35;
}

.light.x-small {
  width: 8px;
  height: 8px;
}

.light.small {
  width: 9.5px;
  height: 9.5px;
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
  font-size: 0.6rem;
  letter-spacing: 3px;
  height: 30px !important;
  padding-left: 10px !important;
  padding-right: 4px !important;
}

.size-small {
  clip-path: polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px);
  font-size: 0.75rem;
  letter-spacing: 4px;
  height: 45px !important;
  padding-left: 10px !important;
  padding-right: 6px !important;
  height: 48px !important;
}

.size-default {
  clip-path: polygon(16px 0, 100% 0, 100% 100%, 0 100%, 0 16px);
  font-size: 0.85rem;
  letter-spacing: 3px;
  padding-left: 12px !important;
  padding-right: 8px !important;
}

.size-large {
  clip-path: polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px);
  font-size: 1.2rem;
  letter-spacing: 4px;
  font-weight: 500;
  padding-left: 16px !important;
  padding-right: 8px !important;
}

.size-x-large {
  clip-path: polygon(24px 0, 100% 0, 100% 100%, 0 100%, 0 24px);
  font-size: 1.6rem;
  letter-spacing: 6px;
  font-weight: 600;
  height: 100px !important;
  padding-left: 23px !important;
  padding-right: 10px !important;
}

.size-xx-large {
  clip-path: polygon(30px 0, 100% 0, 100% 100%, 0 100%, 0 30px);
  font-size: 2.3rem;
  letter-spacing: 10px;
  font-weight: 600;
  height: 150px !important;
  padding-left: 26px !important;
  padding-right: 10px !important;
}
</style>
