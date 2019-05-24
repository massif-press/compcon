<template>
    <v-card flat :color="tableItem ? '' : '#373737'">
      <v-card-text class="pb-0 pt-0">
        <div class="pt-2">
          <em v-if="!item.License">{{item.Source}}<br></em>
          <em v-else>{{item.Source}} {{item.License}}, RANK <span v-for="n in item.LicenseLevel" :key="n">I</span><br></em>
        </div>
        <b>{{item.Size}} {{item.Type}} <span v-if="item.SP">({{item.SP}} SP)</span></b>
        <p v-if="item.Description" v-html="item.Description" class="fluff-text" />
        <damage-element dark :dmg="item.damage" />
        <range-element :range="item.range" :show-cb="!tableItem"/>
        <p v-if="item.Effect" v-html="item.Effect" class="pl-1 ml-1 pb-1 mb-1 effect-text"/>

        <!-- <div v-if="item.actions">
          <div v-for="a in item.actions" :key="a.name" class="ma-1 pl-3 effect-text">
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
        </div> -->

          <v-layout class="pb-2">
            <item-tag v-for="(t, index) in item.Tags" :key="t.id + index" :tag-obj="t"/>
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
      item: Object,
      tableItem: Boolean,
      mod: String
    },
    components: { ItemTag, RangeElement, DamageElement },
    computed: {
      // rangeBonuses (): any {
      //   return {
      //     stabilizer: this.mod && this.mod === 'stabilizer',
      //     neurolinked: (this.$store.getters['getPilot'].core_bonuses.includes('neurolinked') && this.item.type !== 'Melee'),
      //     gyges: (this.$store.getters['getPilot'].core_bonuses.includes('gyges') && this.item.type === 'Melee')
      //   }
      // }
    }
  })
</script>
