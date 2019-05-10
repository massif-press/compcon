<template>
    <v-layout fill-height>
      <v-flex xs2>
        <v-tooltip top>
          <v-btn slot="activator" color="blue-grey darken-2" v-if="!item || itemData.err" block @click="clicked" class="ma-0 pa-0" style="height:100%">{{ fittingType }} Weapon</v-btn>
          <v-btn slot="activator" color="blue-grey darken-2" v-else block @click="clicked" class="ma-0 pa-0" style="height:100%">{{ fittingType }}</v-btn>
          <span v-if="!item">Equip {{fittingType}} Mech Weapon</span>
          <span v-else>Change Equipped {{fittingType}} Mech Weapon</span>
        </v-tooltip>
      </v-flex>
      <v-flex xs10>
        <div v-if="!item">
          <v-expansion-panel class="ma-0">
            <v-expansion-panel-content disabled>
              <span slot="header" class="subheading"> EMPTY </span> 
            </v-expansion-panel-content>
          </v-expansion-panel>
        </div>
        <div v-else-if="itemData.err">
          <v-expansion-panel class="ma-0">
            <v-expansion-panel-content disabled>
              <span slot="header" class="subheading grey--text">// MISSING WEAPON DATA //&emsp;<span v-if="item.brew" class="caption grey--text">({{item.brew}})</span></span>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </div>
        <div v-else>
          <v-expansion-panel class="m-0">
              <v-expansion-panel-content>
            <v-layout slot="header"> 
              <span class="subheading font-weight-bold">{{itemData.name}}
                <span class="subheading font-weight-bold" v-if="item.mod && modData.err">
                  <span class="subheading grey--text">// MISSING MOD DATA //</span>
                </span>
                <span class="subheading font-weight-bold" v-if="item.mod && !modData.err">
                  <span class="grey--text font-weight-regular">//</span> 
                  <span class="blue-grey--text text--lighten-3">{{modData.name}}</span> 
                  <span class="caption">({{modData.sp}} SP)</span>
                </span>
              </span> 
              <v-spacer />
              <span class="mr-5" style="display: inline-flex;">
                <range-element dark small :range="itemData.range" :bonuses="rangeBonuses" show-cb/>
                &emsp;&mdash;&emsp;
                <damage-element dark small size="16" :dmg="itemData.damage" />
                <v-spacer class="mr-3"/>
                <v-tooltip top>
                  <div slot="activator">
                    <v-btn @click.stop="openMod" flat icon small absolute class="ma-0 pa-0" style="top: 10px"><v-icon small>build</v-icon></v-btn>
                  </div>
                  <span>Add/Change Weapon Mods</span>
                </v-tooltip>
              </span>
            </v-layout>
                <mod-card v-if="item.mod && modData.err" missing/>
                <mod-card v-if="item.mod && !modData.err" :modData="modData"/>
                <weapon-card :itemData="itemData" :mod="item.mod" />
              </v-expansion-panel-content>
            </v-expansion-panel>
        </div>
      </v-flex>
    </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import {RangeElement, DamageElement, WeaponCard, ModCard} from '../../components/UI'

export default Vue.extend({
  name: 'mech-weapon-item',
  components: { WeaponCard, ModCard, RangeElement, DamageElement },
  props: {
    item: Object,
    fittingType: String,
    index: Number
  },
  computed: {
    itemData (): Weapon {
      if (!this.item) return {} as Weapon
      return (this as any).getWeapon(this.item.id)
    },
    modData (): WeaponMod {
      if (!this.item.mod) return {} as WeaponMod
      return (this as any).getMod(this.item.mod)
    },
    rangeBonuses (): {stabilizer: boolean, neurolinked: boolean, gyges: boolean} {
      return {
        stabilizer: (
          this.item.mod && this.item.mod === 'stabilizer'
        ),
        neurolinked: (
          this.$store.getters['getPilot'].core_bonuses.includes('neurolinked') && 
          this.itemData.type !== 'Melee'
        ),
        gyges: (
          this.$store.getters['getPilot'].core_bonuses.includes('gyges') && 
          this.itemData.type === 'Melee'
        )
      }
    }
  },
  methods: {
    clicked () {
      this.$emit('clicked')
    },
    openMod: function () {
      this.$emit('open-mod')
    }
  }
})
</script>
