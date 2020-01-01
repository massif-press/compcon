<template>
  <equipment-card-base :item="item">
    <v-col cols="auto">
      <div class="text-center ml-auto mr-auto" style="display: inline-block">
        <div class="clip-icon">
          <v-icon x-large>cci-reticle</v-icon>
        </div>
        <span>
          +{{ item.Accuracy(1) }}/+{{ item.Accuracy(2) }}/+{{ item.Accuracy(3) }}
          <br />
          <div class="overline mt-n1">
            Accuracy
          </div>
        </span>
      </div>
    </v-col>
    <v-col cols="auto" class="ml-auto text-right">
      <div class="heading h2">{{ item.TechType }} Tech</div>
      <span class="flavor-text grey--text">// {{ item.Origin }}</span>
    </v-col>
  </equipment-card-base>
</template>

<script lang="ts">
import Vue from 'vue'
import EquipmentCardBase from './_EquipmentCardBase.vue'

export default Vue.extend({
  name: 'cc-npc-tech-card',
  components: { EquipmentCardBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
})
</script>
