<template>
  <equipment-card-base :item="item" :dense="dense" :hide-tags="dense">
    <v-row align="center" :no-gutters="dense">
      <v-col cols="auto">
        <cc-range-element :range="item.Range" :dense="dense" />
      </v-col>
      <v-divider vertical class="mx-4" />
      <v-col cols="auto">
        <cc-damage-element
          :damage="item.Damage"
          :type-override="item.DamageTypeOverride"
          :dense="dense"
        />
      </v-col>
      <v-col v-if="item.InLcp && !dense" cols="auto" class="ml-auto text-right">
        <div class="heading h3 text-text">{{ item.LcpName }}</div>
      </v-col>
      <v-col v-if="dense && item.Tags && item.Tags.length" cols="auto" class="ml-auto">
        <cc-tags :tags="item.Tags" small />
      </v-col>
    </v-row>
  </equipment-card-base>
</template>

<script lang="ts">
import EquipmentCardBase from './_EquipmentCardBase.vue';

export default {
  name: 'cc-pilot-weapon-card',
  components: { EquipmentCardBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
    dense: {
      type: Boolean,
    },
  },
};
</script>
