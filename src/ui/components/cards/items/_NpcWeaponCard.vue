<template>
  <equipment-card-base :item="item" class="pt-2" small-tags>
    <v-col cols="auto">
      <cc-range-element :range="item.Range" />
    </v-col>
    <v-divider vertical class="mx-4" />
    <v-col cols="auto">
      <div class="text-center ml-auto mr-auto" style="display: inline-block">
        <span>
          <cc-damage-element :damage="item.Damage(1)" inline />
          <cc-slashes class="heading h1 px-1" />
          <cc-damage-element :damage="item.Damage(2)" inline />
          <cc-slashes class="heading h1 px-1" />
          <cc-damage-element :damage="item.Damage(3)" inline />
        </span>
      </div>
    </v-col>
    <v-divider vertical class="mx-4" />
    <v-col cols="auto">
      <div class="text-center ml-auto mr-auto" style="display: inline-block">
        <div class="clip-icon">
          <v-icon x-large>cc:reticule</v-icon>
        </div>
        <span>
          +{{ item.AttackBonus(1) }}/+{{ item.AttackBonus(2) }}/+{{
            item.AttackBonus(3)
          }}
          <br />
          <div class="text-overline mt-n1">Attack Bonus</div>
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
          <v-icon x-large>cc:accuracy</v-icon>
        </div>
        <span>
          +{{ item.Accuracy(1) }}/+{{ item.Accuracy(2) }}/+{{
            item.Accuracy(3)
          }}
          <br />
          <div class="text-overline mt-n1">Accuracy</div>
        </span>
      </div>
      <div
        v-else-if="item.Accuracy(1) < 0"
        class="text-center ml-auto mr-auto"
        style="display: inline-block"
      >
        <div class="clip-icon">
          <v-icon x-large>cc:difficulty</v-icon>
        </div>
        <span>
          +{{ Math.abs(item.Accuracy(1)) }}/+{{
            Math.abs(item.Accuracy(2))
          }}/+{{ Math.abs(item.Accuracy(3)) }}
          <br />
          <div class="text-overline mt-n1">Difficulty</div>
        </span>
      </div>
    </v-col>
    <v-col cols="auto" class="ml-auto text-right">
      <div class="heading h2">{{ item.WeaponType }}</div>
      <div v-if="item.InLcp" class="flavor-text text-subtle">
        {{ item.LcpName }}
      </div>
    </v-col>
    <p
      v-if="item.OnHit"
      slot="statblock"
      v-html-safe="`<b>On Hit:&nbsp;</b>${item.OnHit}`"
      class="panel text-text"
      style="font-size: 20px"
    />
  </equipment-card-base>
</template>

<script lang="ts">
import EquipmentCardBase from './_EquipmentCardBase.vue';

export default {
  name: 'cc-npc-weapon-card',
  components: { EquipmentCardBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
