<template>
  <div class="ma-1">
    <v-card flat color="transparent">
      <v-card-text class="pa-0 mb-1">
        <p class="subheading pa-0 ml-3 mr-3 mt-1 mb-2" style="font-style: italic" v-if="itemData.description" v-html="itemData.description" />
        <div v-if="itemData.type === 'armor'">
          <v-card color="grey lighten-3 mt-3 pt-1 pb-1 mb-2">
            <v-layout class="title font-weight-regular text-xs-center">
              <v-flex v-if="itemData.hp_bonus">HP Bonus</v-flex>
              <v-flex >Armor</v-flex>
              <v-flex>Evasion</v-flex>
              <v-flex v-if="itemData.evasion_bonus">Evasion Bonus</v-flex>
              <v-flex>E-Defense</v-flex>
              <v-flex>Speed</v-flex>
              <v-flex v-if="itemData.speed_bonus">Speed Bonus</v-flex>
            </v-layout>
          </v-card>
          <v-layout class="title text-xs-center pa-0 ma-0">
            <v-flex v-if="itemData.hp_bonus">+{{itemData.hp_bonus}}</v-flex>
            <v-flex>+{{itemData.armor || 0}}</v-flex>
            <v-flex>{{itemData.evasion || 'N/A'}}</v-flex>
            <v-flex v-if="itemData.evasion_bonus">+{{itemData.evasion_bonus}}</v-flex>
            <v-flex>{{itemData.edef || 'N/A'}}</v-flex>
            <v-flex>{{itemData.speed}}</v-flex>
            <v-flex v-if="itemData.speed_bonus">{itemData.speed_bonus}}</v-flex>
          </v-layout>
        </div>
        <div v-else-if="itemData.type === 'weapon'">
          <damage-element :dmg="itemData.damage" />
          <range-element :range="itemData.range" />
        </div>
        <div v-else>
          <p v-if="itemData.uses" v-html="`${itemData.uses} Uses`" />
        </div>
        <p v-if="itemData.effect" v-html="itemData.effect" />
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
    props: {
      itemData: Object
    },
    components: { DamageElement, RangeElement, Tag },
    computed: {
      pilot: function () {
        return this.$store.getters.getPilot
      }
    }
  }
</script>
