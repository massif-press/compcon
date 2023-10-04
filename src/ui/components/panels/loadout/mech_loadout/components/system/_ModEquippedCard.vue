<template>
  <div style="height: 100%" :class="readonly ? 'mt-n1' : ''">
    <slot-card-base ref="base" :item="mod" :mech="mech" :readonly="readonly" style="height: 100%">
      <div slot="header">
        <span v-if="mod">
          <equipment-options :item="mod" :readonly="readonly" :active="readonly" />
          <span v-if="!mod.Destroyed" class="ml-n2">
            {{ mod.Name }}
            <span v-if="mod.FlavorName" class="caption ml-2 my-n1">//{{ mod.TrueName }}</span>
          </span>
          <span v-else class="py-1 error" style="letter-spacing: 3px">
            &emsp;/ / {{ mod.Name }} DESTROYED / /&emsp;
          </span>
        </span>
      </div>
      <div slot="header-items" class="text-right">
        <div style="display: inline-block">
          <span class="heading h2">{{ mod.SP }}</span>
          <span class="heading h3">SP</span>
        </div>
        <div v-if="!readonly" class="d-inline pl-3 ml-3" style="border-left: 1px solid #616161">
          <v-btn v-if="mod" icon dark @click="$emit('remove')">
            <v-icon class="fade-select mt-n1">delete</v-icon>
          </v-btn>
        </div>
        <v-btn v-else right icon variant="plain" @click.stop="hide = !hide">
          <v-icon small v-html="hide ? 'mdi-eye-outline' : 'mdi-eye-off-outline'" />
        </v-btn>
      </div>
      <v-slide-y-transition>
        <v-row v-if="!hide" density="compact" no-gutters style="height: 100%">
          <v-col cols="auto">
            <v-alert
              v-if="mod.IsCascading"
              density="compact"
              tile
              color="error"
              class="text-center text-white stat-text"
              style="letter-spacing: 3px"
            >
              / / AI IN CASCADE / /
            </v-alert>
            <div class="text-overline mt-n1">APPLIED TO</div>
            <div class="heading h3 text-disabled ml-3 mt-n2 mb-1">
              {{ weapon.Name }}
            </div>
          </v-col>
        </v-row>
      </v-slide-y-transition>
    </slot-card-base>
  </div>
</template>

<script lang="ts">
import SlotCardBase from '../_SlotCardBase.vue';
import EquipmentOptions from '../_EquipmentOptions.vue';

export default {
  name: 'mod-equipped-card',
  components: {
    SlotCardBase,
    EquipmentOptions,
  },
  props: {
    mech: {
      type: Object,
      required: true,
    },
    weapon: {
      type: Object,
      required: false,
      default: null,
    },
    mod: {
      type: Object,
      required: false,
      default: null,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    readonly: { type: Boolean },
  },
  data: () => ({
    hide: false,
  }),
};
</script>
