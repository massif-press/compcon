<template>
  <v-container fluid>
    <v-row dense align="center">
      <v-col cols="auto">
        <div class="overline no-height">{{ mech.Frame.Source }} {{ mech.Frame.Name }}</div>
        <div class="heading h1 mt-n5">{{ mech.Name }}</div>
      </v-col>
      <v-col cols="auto" class="ml-auto text-center">
        <div class="caption">OVERCHARGE</div>
        <span class="grey lighten-3 mx-2 oc-border">
          +1
          <v-icon small>mdi-fire</v-icon>
        </span>
        <span class="grey lighten-3 mx-2 oc-border">
          +1d3
          <v-icon small>mdi-fire</v-icon>
        </span>
        <span class="grey lighten-3 mx-2 oc-border">
          +1d6
          <v-icon small>mdi-fire</v-icon>
        </span>
        <span class="grey lighten-3 mx-2 oc-border">
          +1d6+4
          <v-icon small>mdi-fire</v-icon>
        </span>
      </v-col>
    </v-row>

    <v-row dense align="center">
      <v-col cols="1" class="mr-n5">
        <v-row dense justify="space-around" class="mt-n1 pl-3">
          <v-col class="mt-n6">
            <span class="font-weight-bold overline no-height pr-3">HULL</span>
            <div class="ml-4 mt-n3" style="position: relative; width: max-content;">
              <v-icon x-large color="grey lighten-1" class="mr-n1">mdi-hexagon-outline</v-icon>
              <div class="heading h2 icon-overlap" v-html="mech.Hull" />
            </div>
          </v-col>
          <v-col class="mt-n6">
            <span class="font-weight-bold overline no-height pr-3">AGI</span>
            <div class="ml-4 mt-n3" style="position: relative; width: max-content;">
              <v-icon x-large color="grey lighten-1" class="mr-n1">mdi-hexagon-outline</v-icon>
              <div class="heading h2 icon-overlap" v-html="mech.Agi" />
            </div>
          </v-col>
          <v-col class="mt-n6">
            <span class="font-weight-bold overline no-height pr-3">SYS</span>
            <div class="ml-4 mt-n3" style="position: relative; width: max-content;">
              <v-icon x-large color="grey lighten-1" class="mr-n1">mdi-hexagon-outline</v-icon>
              <div class="heading h2 icon-overlap" v-html="mech.Sys" />
            </div>
          </v-col>
          <v-col class="mt-n6">
            <span class="font-weight-bold overline no-height pr-3">ENG</span>
            <div class="ml-4 mt-n3" style="position: relative; width: max-content;">
              <v-icon x-large color="grey lighten-1" class="mr-n1">mdi-hexagon-outline</v-icon>
              <div class="heading h2 icon-overlap" v-html="mech.Eng" />
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="mt-n5 ml-n8">
        <v-row dense justify="space-between" align="start">
          <v-col cols="2" class="text-center">
            <div class="overline no-height mb-n2">STRUCTURE</div>
            <div>
              <v-icon size="60" color="grey lighten-3" class="mr-n1">cci-structure</v-icon>
              <b class="flavor-text pt-3" v-html="`/${mech.MaxStructure}`" />
            </div>
          </v-col>
          <v-col cols="2">
            <v-row dense no-gutters justify="center">
              <v-col cols="auto">
                <div class="overline no-height mb-n2 ml-2">ARMOR</div>
                <div style="position: relative; width: max-content;">
                  <v-icon size="60" color="grey lighten-3" class="mr-n1">mdi-shield-outline</v-icon>
                  <div class="heading p-stat icon-overlap" v-html="mech.Armor" />
                </div>
              </v-col>
              <v-col cols="auto" class="text-center">
                <div class="overline no-height mb-n2 mr-6">HP</div>
                <div>
                  <v-icon size="60" color="grey lighten-3" class="mr-n1">
                    mdi-hexagon-outline
                  </v-icon>
                  <b class="flavor-text pt-3" v-html="`/${mech.MaxHP}`" />
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="2" class="text-center">
            <div class="overline no-height mb-n2 mr-2">REACTOR</div>
            <div>
              <v-icon size="60" color="grey lighten-3" class="mr-n1">cci-reactor</v-icon>
              <b class="flavor-text pt-3" v-html="`/${mech.MaxStress}`" />
            </div>
          </v-col>
          <v-col cols="2" class="text-center">
            <div class="overline no-height mb-n2 mr-6">HEAT</div>
            <div>
              <v-icon size="50" color="grey lighten-3" class="mr-n1">mdi-fire</v-icon>
              <b class="flavor-text pt-3" v-html="`/${mech.HeatCapacity}`" />
            </div>
          </v-col>
          <v-col cols="2" class="text-center">
            <div class="overline no-height mb-n2">REPAIR CAPACITY</div>
            <div>
              <v-icon size="60" color="grey lighten-3" class="mr-n1">cci-repair</v-icon>
              <b class="flavor-text pt-3" v-html="`/${mech.RepairCapacity}`" />
            </div>
          </v-col>
          <v-col cols="2" class="text-center">
            <div class="overline no-height mb-n2">CORE POWER</div>
            <v-icon size="50" color="grey lighten-3" class="mr-n1">mdi-battery-outline</v-icon>
          </v-col>
        </v-row>
        <v-row dense class="mx-6">
          <v-col>
            <fieldset>
              <legend class="stat-text px-1">ATTACK BONUS</legend>
              <div class="heading h2 text-center mt-n2 pb-1">{{ signed(mech.AttackBonus) }}</div>
            </fieldset>
          </v-col>
          <v-col>
            <fieldset>
              <legend class="stat-text px-1">TECH ATTACK</legend>
              <div class="heading h2 text-center mt-n2 pb-1">{{ signed(mech.TechAttack) }}</div>
            </fieldset>
          </v-col>
          <v-col>
            <fieldset>
              <legend class="stat-text px-1">SAVE TARGET</legend>
              <div class="heading h2 text-center mt-n2 pb-1">{{ mech.SaveTarget }}</div>
            </fieldset>
          </v-col>
          <v-col>
            <fieldset>
              <legend class="stat-text px-1">SPEED</legend>
              <div class="heading h2 text-center mt-n2 pb-1">{{ mech.Speed }}</div>
            </fieldset>
          </v-col>
          <v-col>
            <fieldset>
              <legend class="stat-text px-1">E-DEFENSE</legend>
              <div class="heading h2 text-center mt-n2 pb-1">{{ mech.EDefense }}</div>
            </fieldset>
          </v-col>
          <v-col>
            <fieldset>
              <legend class="stat-text px-1">EVASION</legend>
              <div class="heading h2 text-center mt-n2 pb-1">{{ mech.Evasion }}</div>
            </fieldset>
          </v-col>
          <v-col>
            <fieldset>
              <legend class="stat-text px-1">LIMITED SYSTEMS</legend>
              <div class="heading h2 text-center mt-n2 pb-1">{{ signed(mech.LimitedBonus) }}</div>
            </fieldset>
          </v-col>
          <v-col cols="auto">
            <v-icon size="60">cci-size-{{ mech.size === 0.5 ? 'half' : mech.Size }}</v-icon>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <span class="overline">FRAME TRAITS</span>
    <v-row dense justify="space-between" class="caption mt-n1">
      <v-col v-for="(t, i) in mech.Frame.Traits" :key="`mt_${i}`" class="mt-n1">
        <fieldset>
          <legend class="heading ml-1 px-2">{{ t.name }}</legend>
          <span class="ml-6" v-html="t.description" />
        </fieldset>
      </v-col>
    </v-row>

    <span class="overline">CORE SYSTEM</span>
    <fieldset class="mt-n2">
      <legend class="heading h3 ml-1 px-2">{{ mech.Frame.CoreSystem.Name }}</legend>
      <div v-if="mech.Frame.CoreSystem.Passive">
        <span class="heading ml-4">CORE PASSIVE</span>
        <br />
        <span class="caption ml-6" v-html="mech.Frame.CoreSystem.Passive" />
      </div>
      <span class="caption ml-6" v-html="mech.Frame.CoreSystem.Effect" />
      <div v-if="mech.Frame.CoreSystem.Tag" class="text-right">
        <span v-for="(t, i) in mech.Frame.CoreSystem.Tags" :key="`mcst_${i}`" class="mx-1">
          {{ t.Name() }}
        </span>
      </div>
    </fieldset>
  </v-container>
  <!-- <v-container fluid>

      <hr class="mt-2 ml-2 mr-2" />
      <div v-if="loadout">
        <span class="label" style="page-break-inside: avoid">MOUNTS</span>
        <br />
        <v-row>
          <v-col>
            <v-row
              v-for="(mount, index) in loadout.IntegratedMounts"
              :key="'intmount_' + index"
              row
            >
              <div v-if="mount" style="width: 100%">
                <v-col>
                  <div class="p-bordered mt-1 mb-1 pa-0">
                    <span class="p-mount-title">{{ mount.Name }}</span>
                    <div class="mount-interior">
                      <v-row>
                        <v-col shrink class="ml-1">
                          <span class="p-large">{{ mount.Weapon.Name }}</span>
                        </v-col>
                        <v-col v-if="mount.Weapon.Range" shrink class="ml-2">
                          <range-element size="9" :range="mount.Weapon.Range" />
                        </v-col>
                        <v-col v-if="mount.Weapon.Damage" shrink class="ml-2">
                          <span>
                            <damage-element size="9" :dmg="mount.Weapon.Damage" />
                          </span>
                        </v-col>
                      </v-row>
                      <p class="p-reg ml-2 mt-0 mb-0" v-html="mount.Effect" />
                      <span
                        v-for="t in mount.Weapon.Tags"
                        :key="t.id + 'intmount'"
                        small
                        class="print-tag ml-2"
                      >
                        {{ t.Name(pilot.LimitedBonus) }}
                      </span>
                    </div>
                  </div>
                </v-col>
              </div>
            </v-row>
            <v-row v-for="(mount, index) in allMounts" :key="'mount_' + index" row>
              <div style="width: 100%">
                <v-col>
                  <div class="p-bordered mt-1 mb-1 pa-0">
                    <span class="p-mount-title">{{ mount.Type }}</span>
                    <div class="mount-interior">
                      <div v-if="mount.IsLocked" class="text-center">
                        <i style="letter-spacing: 5px; color: grey;">
                          MOUNT LOCKED &mdash; SUPERHEAVY WEAPON BRACING
                        </i>
                      </div>
                      <div v-else-if="!mount.Weapons.length">
                        <i style="letter-spacing: 5px; color: grey;">
                          &emsp;EMPTY
                        </i>
                      </div>
                      <div v-else v-for="w in mount.Slots" :key="w.id">
                        <v-row>
                          <v-col shrink class="ml-1" v-if="!w.Weapon">
                            <span class="p-large">
                              <i style="letter-spacing: 5px; color: grey;">
                                &emsp;EMPTY
                              </i>
                            </span>
                          </v-col>
                          <v-col shrink class="ml-1" v-if="!w.Weapon.err">
                            <span class="p-large">{{ w.Weapon.Name }}</span>
                            <span class="p-reg">({{ w.Weapon.Size }} {{ w.Weapon.Type }})</span>
                            <span v-if="w.Weapon.Mod" class="p-reg">
                              &nbsp;//&nbsp;{{ w.Weapon.Mod.Name }}
                            </span>
                          </v-col>
                          <v-col shrink class="ml-2" v-if="!w.Weapon.err">
                            <range-element size="9" :range="w.Weapon.Range" />
                          </v-col>
                          <v-col shrink class="ml-2" v-if="!w.Weapon.err">
                            <span>
                              <damage-element size="9" :dmg="w.Weapon.Damage" />
                            </span>
                          </v-col>
                        </v-row>
                        <p class="p-reg ml-2 mt-0 mb-0" v-html="w.Weapon.Effect" />
                        <p v-if="w.Weapon.Mod" class="p-reg ml-2 mt-0 mb-0">
                          <span class="p-large">{{ w.Weapon.Mod.Name }}:</span>
                          {{ w.Weapon.Mod.effect }}
                        </p>
                        <span
                          v-for="t in w.Weapon.Tags"
                          :key="t.id + w.id"
                          small
                          class="print-tag ml-2"
                        >
                          {{ t.Name(pilot.LimitedBonus) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </v-col>
              </div>
            </v-row>
          </v-col>
        </v-row>

        <span class="label" style="page-break-inside: avoid">SYSTEMS</span>
        <br />
        <v-row>
          <v-col>
            <v-row v-for="(sys, index) in config.IntegratedSystems" :key="'system_' + index" row>
              <v-col>
                <span class="p-large">{{ sys.Name }}</span>
                <br />
                <p class="p-reg ml-2 mt-0 mb-0" v-html="sys.Effect" />
                <span v-for="t in sys.Tags" :key="t.id + sys" small class="print-tag ml-2">
                  {{ t.Name(pilot.LimitedBonus) }}
                </span>
              </v-col>
            </v-row>
            <v-row v-for="(sys, index) in loadout.Systems" :key="'system_' + index" row>
              <v-col>
                <span class="p-large">{{ sys.Name }}</span>
                <br />
                <p class="p-reg ml-2 mt-0 mb-0" v-html="sys.Effect" />
                <span v-for="t in sys.Tags" :key="t.id + sys" small class="print-tag ml-2">
                  {{ t.Name(pilot.LimitedBonus) }}
                </span>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div> -->
</template>

<script lang="ts">
import Vue from 'vue'
// import { RangeElement, DamageElement } from '../../components/UI'
// import { PrintOptions, Pilot, Mech, MechLoadout, EquippableMount } from '@/class'

export default Vue.extend({
  name: 'mech-print-view',
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
  methods: {
    signed(val: number) {
      return val > -1 ? `+${val}` : `${val}`
    },
  },
})
</script>

<style scoped>
.no-height {
  line-height: 0;
}

.icon-overlap {
  position: absolute;
  top: -1px;
  left: 1px;
  width: -webkit-fill-available;
  text-align: center;
}

.p-stat {
  font-size: 34px;
}

fieldset {
  padding: 0 4px;
  height: 100%;
  border-radius: 3px;
  border-color: var(--v-grey-lighten2);
}

.oc-border {
  border: 1px solid;
  border-color: darkgrey;
  border-radius: 2px;
}
</style>
