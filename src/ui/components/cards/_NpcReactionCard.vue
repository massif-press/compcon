<template>
  <equipment-card-base :item="item" small-tags>
    <v-col cols="auto" class="ml-auto text-right">
      <div v-if="item.InLcp" class="flavor-text subtle--text">{{ item.LcpName }}</div>
    </v-col>
    <div slot="statblock">
      <span class="overline ml-n2">TRIGGER</span>
      <p v-html-safe="`<b>Trigger:&nbsp;</b>${item.Trigger}`" class="text--text body-text" />
    </div>
  </equipment-card-base>
</template>

<script lang="ts">
import Vue from 'vue'
import EquipmentCardBase from './_EquipmentCardBase.vue'

export default Vue.extend({
  name: 'cc-npc-weapon-card',
  components: { EquipmentCardBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
})
</script>
