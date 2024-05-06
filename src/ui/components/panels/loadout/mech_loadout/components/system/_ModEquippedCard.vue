<template>
  <slot-card-base ref="base" :item="mod" :mech="mech" :readonly="readonly">
    <template #header>
      <v-row v-if="mod" dense align="center">
        <v-col cols="auto">
          <v-icon icon="cc:weaponmod" />
        </v-col>
        <v-col cols="auto">
          {{ mod.Name }}
          <span v-if="mod.FlavorName" class="text-caption text-disabled text-uppercase">
            //{{ mod.TrueName }}
          </span>
        </v-col>
      </v-row>
    </template>
    <template #header-items>
      <v-row v-if="mod" align="center" no-gutters>
        <v-col cols="auto" class="pr-4">
          <v-icon v-for="n in mod.SP" icon="cc:system_point" class="mr-1" />
        </v-col>
        <v-col cols="auto" style="border-left: 1px solid #616161">
          <v-btn
            v-if="mod"
            size="small"
            icon
            variant="plain"
            color="error"
            @click.stop="$emit('remove')">
            <v-icon icon="mdi-delete" />
          </v-btn>
        </v-col>
      </v-row>
    </template>
    <v-slide-y-transition>
      <v-row v-if="!hide" density="compact" no-gutters style="height: 100%">
        <v-col cols="auto">
          <v-alert
            v-if="mod.IsCascading"
            density="compact"
            tile
            color="error"
            class="text-center text-white stat-text"
            style="letter-spacing: 3px">
            / / AI IN CASCADE / /
          </v-alert>
          <div class="text-caption mt-2">APPLIED TO</div>
          <div class="heading h3 text-disabled ml-3">
            {{ weapon.Name }}
          </div>
        </v-col>
      </v-row>
    </v-slide-y-transition>
  </slot-card-base>
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
  emits: ['remove'],
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
