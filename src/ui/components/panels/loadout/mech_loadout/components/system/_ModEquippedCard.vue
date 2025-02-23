<template>
  <slot-card-base
    ref="base"
    :item="item"
    :mech="mech"
    :readonly="readonly"
    title-color="weapon-mod">
    <template #header>
      <v-icon icon="cc:weaponmod" class="py-1 mr-2" />
      {{ item.Name }}
      <span v-if="item.FlavorName" class="text-caption text-disabled text-uppercase">
        //{{ item.TrueName }}
      </span>
    </template>
    <template v-if="item" #header-items>
      {{ item.SP }}
      <span style="font-size: 13px; margin-left: 2px">SP</span>
      <v-divider v-if="!readonly" vertical class="ml-3" />
      <div v-if="!readonly">
        <v-btn v-if="item" size="x-small" icon variant="plain" @click.stop="$emit('remove')">
          <v-icon icon="mdi-delete" />
        </v-btn>
      </div>
    </template>

    <v-alert
      v-if="item.IsCascading"
      density="compact"
      tile
      color="error"
      class="text-center text-white stat-text"
      style="letter-spacing: 3px">
      / / AI IN CASCADE / /
    </v-alert>
    <div class="text-caption mt-1">
      APPLIED TO:
      <b class="heading text-accent">
        {{ weapon.Name }}
      </b>
    </div>
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
    item: {
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
