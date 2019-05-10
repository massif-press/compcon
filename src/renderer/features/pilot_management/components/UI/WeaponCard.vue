<template>
    <v-card flat :color="tableItem ? '' : '#373737'">
      <v-card-text class="pb-0 pt-0">
        <div class="pt-2">
          <em v-if="!itemData.license">{{itemData.source}}<br></em>
          <em v-else>{{itemData.source}} {{itemData.license}}, RANK <span v-for="n in itemData.license_level" :key="n">I</span><br></em>
        </div>
        <b>{{itemData.mount}} {{itemData.type}} <span v-if="itemData.sp">({{itemData.sp}} SP)</span></b>
        <p v-if="itemData.description" v-html="itemData.description" class="fluff-text" />
        <damage-element v-if="itemData.damage && itemData.damage[0].val !== '*'" dark :dmg="itemData.damage" />
        <range-element  v-if="itemData.range && itemData.range[0].val !== '*'" :range="itemData.range" :bonuses="rangeBonuses" :show-cb="!tableItem"/>
        <p v-if="itemData.effect" v-html="itemData.effect" class="pl-1 ml-1 pb-1 mb-1 effect-text"/>

        <div v-if="itemData.actions">
          <div v-for="a in itemData.actions" :key="a.name" class="ma-1 pl-3 effect-text">
            <span class="font-weight-bold">{{a.name}}</span> 
            <span class="font-weight-light text-capitalize">&nbsp; // &nbsp; {{a.action}} Action </span>
            <br>
            <span v-if="a.effect">{{a.effect}}<br></span>
            <damage-element :dmg="a.damage" />
            <range-element :range="a.range" :bonuses="rangeBonuses" :show-cb="!tableItem"/>
            <v-layout class="pb-2">
              <item-tag v-for="at in a.tags" :key="at.id" :tag-obj="at" />
            </v-layout>
          </div>
        </div>

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
      tableItem: Boolean,
      mod: String
    },
    components: { ItemTag, RangeElement, DamageElement },
    computed: {
      rangeBonuses (): any {
        return {
          stabilizer: this.mod && this.mod === 'stabilizer',
          neurolinked: (this.$store.getters['getPilot'].core_bonuses.includes('neurolinked') && this.itemData.type !== 'Melee'),
          gyges: (this.$store.getters['getPilot'].core_bonuses.includes('gyges') && this.itemData.type === 'Melee')
        }
      }
    }
  })
</script>
