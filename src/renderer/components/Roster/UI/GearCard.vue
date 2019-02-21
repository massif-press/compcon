<template>
  <div class="ma-1">
    <v-card flat>
      <v-card-text class="pb-0 pt-0">
        <p v-if="itemData.description" v-html="itemData.description" />
        <p v-if="itemData.bonus" v-html="itemData.bonus" />
        <div v-if="itemData.type === 'armor'">
          <p v-html="`+ ${itemData.armor || 0} Armor // E-Defense: ${itemData.edef || 'N/A'} // Evasion: ${itemData.evasion || 'N/A'}`" />
          <p v-if="itemData.hp_bonus" v-html="`HP Bonus: +${itemData.hp_bonus}`" />
          <p v-if="itemData.speed" v-html="`Speed: ${itemData.speed}`" />
          <p v-if="itemData.speed_bonus" v-html="`Speed Bonus: +${itemData.speed_bonus}`" />
          <p v-if="itemData.evasion_bonus" v-html="`Evasion Bonus: +${itemData.evasion_bonus}`" />
          <p v-if="itemData.hp" v-html="`HP: ${itemData.hp}`" />
        </div>
        <div v-else-if="itemData.type === 'weapon'">
          <damage-element :dmg="itemData.damage" />
          <range-element :range="itemData.range" />
        </div>
        <div v-else>
          <p v-if="itemData.uses" v-html="`${itemData.uses} Uses`" />
        </div>
        <p v-if="itemData.effect" v-html="itemData.effect" />
        <p v-if="itemData.other" v-html="itemData.other" />
        <p v-html="`Rarity ${itemData.rarity}`" />
        <v-layout>
          <tag v-for="tag in itemData.tags" :key="tag.id" :id="tag.id" :val="tag.val"/>
        </v-layout>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import DamageElement from './DamageElement'
  import RangeElement from './RangeElement'
  import Tag from './Tag'

  export default {
    name: 'gear-card',
    props: ['itemData'],
    components: { DamageElement, RangeElement, Tag },
    computed: {
      pilot: function () {
        return this.$store.getters.getPilot
      }
    }
  }
</script>
