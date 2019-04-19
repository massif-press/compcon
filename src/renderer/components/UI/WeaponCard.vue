<template>
    <v-card flat :color="tableItem ? '' : '#373737'">
      <v-card-text class="pb-0 pt-0">
        <div class="pt-2">
          <em v-if="!itemData.license">{{itemData.source}}<br></em>
          <em v-else>{{itemData.source}} {{itemData.license}}, RANK <span v-for="n in itemData.license_level" :key="n">I</span><br></em>
        </div>
        <p v-if="itemData.description" v-html="itemData.description" class="fluff-text" />
        <p v-if="itemData.effect" v-html="itemData.effect" class="pt-1 pl-2 pr-2 effect-text font-weight-bold"/>
        <b>{{itemData.mount}} {{itemData.type}} <span v-if="itemData.sp">({{itemData.sp}} SP)</span></b>
        <br>
        <damage-element dark :dmg="itemData.damage" />
        <range-element :range="itemData.range" :bonuses="rangeBonuses" :show-cb="!tableItem"/>
        <v-layout class="pb-2">
          <item-tag v-for="(t, index) in itemData.tags" :key="t.id + index" :tag-obj="t"/>
        </v-layout>
      </v-card-text>
    </v-card>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {RangeElement, DamageElement} from './'
  import ItemTag from './ItemTag.vue'

  export default Vue.extend({
    name: 'system-card',
    props: {
      itemData: Object,
      tableItem: Boolean
    },
    components: { ItemTag, RangeElement, DamageElement },
    computed: {
      rangeBonuses (): any {
        return {
          neurolinked: (this.$store.getters.getPilot.core_bonuses.includes('neurolinked') && this.itemData.type !== 'Melee'),
          gyges: (this.$store.getters.getPilot.core_bonuses.includes('gyges') && this.itemData.type === 'Melee')
        }
      }
    }
  })
</script>
