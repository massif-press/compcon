<template>
  <equipment-card-base :item="item">
    <v-col cols="auto">
      <cc-range-element :range="item.Range" />
    </v-col>
    <v-divider vertical class="mx-4" />
    <v-col cols="auto">
      <div class="text-center ml-auto mr-auto" style="display: inline-block">
        <div class="clip-icon">
          <v-icon x-large :color="`damage--${item.DamageType}`">cci-{{ item.DamageType }}</v-icon>
        </div>
        <span>
          {{ item.Damage(1) }}/{{ item.Damage(2) }}/{{ item.Damage(3) }}
          <br />
          <div class="overline mt-n1">
            <b>{{ item.DamageType }}</b>
            Damage
          </div>
        </span>
      </div>
    </v-col>
    <v-divider vertical class="mx-4" />
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
    <v-divider vertical class="mx-4" />
    <v-col cols="auto">
      <div class="text-center ml-auto mr-auto" style="display: inline-block">
        <div class="clip-icon">
          <v-icon x-large>cci-accuracy</v-icon>
        </div>
        <span>
          +{{ item.Advantage(1) }}/+{{ item.Advantage(2) }}/+{{ item.Advantage(3) }}
          <br />
          <div class="overline mt-n1">
            Advantage
          </div>
        </span>
      </div>
    </v-col>
    <v-col cols="auto" class="ml-auto text-right">
      <div class="heading h2">{{ item.WeaponType }}</div>
      <span class="flavor-text grey--text">// {{ item.Origin }}</span>
    </v-col>
    <p
      slot="statblock"
      class="panel text--text"
      style="font-size: 20px"
      v-html="`<b>On Hit:&nbsp;</b>${item.OnHit}`"
    />
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
