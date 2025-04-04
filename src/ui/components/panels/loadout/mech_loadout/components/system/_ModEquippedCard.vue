<template>
  <slot-card-base ref="base" :item="item" :mech="mech" :readonly="readonly" title-color="mod">
    <template #header>
      <div v-if="item" class="pt-1">
        <v-icon icon="cc:weaponmod" />
        {{ item.Name }}
      </div>
      <div v-else class="text-disabled">&nbsp;EMPTY SYSTEM SLOT</div>
    </template>

    <template v-if="item" #header-items>
      <div v-if="!mobile" style="margin-top: -2px">
        {{ item.SP }}
        <span style="font-size: 13px; margin-left: 2px">SP</span>
      </div>
      <v-divider v-if="!readonly && !mobile" vertical class="ml-3" />
      <div v-if="!readonly" :class="!mobile && 'mt-n1'">
        <v-btn
          v-if="item"
          size="x-small"
          icon
          tile
          variant="plain"
          color="error"
          class="d-inline"
          @click.stop="$emit('remove')">
          <v-icon icon="mdi-delete" />
        </v-btn>
      </div>
    </template>

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
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>
