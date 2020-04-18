<template>
  <equipment-card-base :item="item">
    <v-col cols="auto">
      <cc-range-element :range="item.Range" />
    </v-col>
    <v-divider vertical class="mx-4" />
    <v-col cols="auto">
      <div class="text-center ml-auto mr-auto" style="display: inline-block">
        <span>
          <cc-damage-element :damage="item.Damage(1)" />
          <cc-damage-element :damage="item.Damage(2)" />
          <cc-damage-element :damage="item.Damage(3)" />
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
          +{{ item.AttackBonus(1) }}/+{{ item.AttackBonus(2) }}/+{{ item.AttackBonus(3) }}
          <br />
          <div class="overline mt-n1">
            Attack Bonus
          </div>
        </span>
      </div>
    </v-col>
    <v-divider vertical class="mx-4" />
    <v-col cols="auto">
      <div
        v-if="item.Accuracy(1) > 0"
        class="text-center ml-auto mr-auto"
        style="display: inline-block"
      >
        <div class="clip-icon">
          <v-icon x-large>cci-accuracy</v-icon>
        </div>
        <span>
          +{{ item.Accuracy(1) }}/+{{ item.Accuracy(2) }}/+{{ item.Accuracy(3) }}
          <br />
          <div class="overline mt-n1">
            Accuracy
          </div>
        </span>
      </div>
      <div
        v-else-if="item.Accuracy(1) < 0"
        class="text-center ml-auto mr-auto"
        style="display: inline-block"
      >
        <div class="clip-icon">
          <v-icon x-large>cci-difficulty</v-icon>
        </div>
        <span>
          +{{ Math.abs(item.Accuracy(1)) }}/+{{ Math.abs(item.Accuracy(2)) }}/+{{
            Math.abs(item.Accuracy(3))
          }}
          <br />
          <div class="overline mt-n1">
            Difficulty
          </div>
        </span>
      </div>
    </v-col>
    <v-col cols="auto" class="ml-auto text-right">
      <div class="heading h2">{{ item.WeaponType }}</div>
      <span class="flavor-text subtle--text">// {{ item.Origin }}</span>
    </v-col>
    <p
      v-if="item.OnHit"
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
