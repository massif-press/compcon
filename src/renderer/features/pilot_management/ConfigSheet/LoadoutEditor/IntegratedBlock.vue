<template>
  <div>
    <v-card class="mb-2 pr-5 pl-0 pb-4" color="grey darken-2">
      <span class="mount-title pl-3 pr-3 text-uppercase">
        {{ mount.ItemSource }} Integrated Mount
      </span>
      <v-card-text class="bordered ml-3 pt-4">
        <v-layout fill-height>
          <v-flex xs2>
            <v-btn
              :ripple="false"
              color="blue-grey darken-2"
              block
              class="ma-0 pa-0"
              style="height:100%"
            >
              Integrated Weapon
            </v-btn>
          </v-flex>
          <v-flex xs10>
            <v-expansion-panel class="m-0">
              <v-expansion-panel-content>
                <v-layout slot="header">
                  <span class="subheading font-weight-bold">
                    {{ mount.Weapon.Name }}
                  </span>
                  <v-spacer />
                  <span class="mr-5" style="display: inline-flex;">
                    <range-element
                      v-if="mount.Weapon.Range"
                      dark
                      small
                      :range="getRange()"
                    />
                    <span v-if="mount.Weapon.Range && mount.Weapon.Damage">
                      &emsp;&mdash;&emsp;
                    </span>
                    <damage-element
                      v-if="mount.Weapon.Damage"
                      dark
                      small
                      size="16"
                      :dmg="mount.Weapon.Damage"
                    />
                  </span>
                </v-layout>
                <div class="ma-1">
                  <v-card flat color="#373737">
                    <v-card-text class="pb-0 pt-0">
                      <p
                        v-if="mount.Weapon.Description"
                        v-html="mount.Weapon.Description"
                        class="fluff-text"
                      />
                      <b>{{ mount.Weapon.Size }} {{ mount.Weapon.Type }}</b>
                      <br />
                      <damage-element
                        v-if="mount.Weapon.Damage"
                        dark
                        :dmg="mount.Weapon.Damage"
                      />
                      <range-element
                        v-if="mount.Weapon.Range"
                        :range="mount.Weapon.Range"
                      />
                      <p
                        v-if="mount.Weapon.effect"
                        v-html="mount.Weapon.effect"
                        class="pl-2 effect-text"
                      />
                      <v-layout class="mt-2">
                        <item-tag
                          v-for="(tag, index) in mount.Weapon.Tags"
                          :key="tag.id + index"
                          :tag-obj="tag"
                        />
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { RangeElement, DamageElement, ItemTag } from '../../components/UI'
import {
  IntegratedMount,
  RangeType,
  DamageType,
  Range,
  MechLoadout,
} from '@/class'

export default Vue.extend({
  name: 'integrated-block',
  props: {
    mount: IntegratedMount,
    loadout: MechLoadout,
  },
  components: { ItemTag, RangeElement, DamageElement },
  methods: {
    //TODO: should not be hardcoded
    getRange(): Range[] {
      const w = this.mount.Weapon
      if (!w) return []
      let bonuses = [] as { type: RangeType; val: number }[]
      if (w.Mod && w.Mod.AddedRange)
        bonuses.push({
          type: RangeType.Range,
          val: w.Mod.AddedRange,
        })
      const pilot = this.$store.getters.getPilot
      if (pilot.has('CoreBonus', 'neurolinked'))
        bonuses.push({
          type: RangeType.Range,
          val: 3,
        })
      if (pilot.has('CoreBonus', 'gyges'))
        bonuses.push({
          type: RangeType.Threat,
          val: 1,
        })
      if (
        this.loadout.HasSystem('externalbatteries') &&
        w.Damage[0].Type === DamageType.Energy
      )
        bonuses.push({
          type: RangeType.Range,
          val: 5,
        })
      return Range.AddBonuses(w.Range, bonuses)
    },
  },
})
</script>
