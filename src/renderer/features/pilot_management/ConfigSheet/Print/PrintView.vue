<template>
  <div style="line-height: 1.2">
    <v-container fluid>
      <!-- callsign/name/level block -->
      <v-layout fill-height justify-space-between>
        <v-flex xs3>
          <span class="p-reg">
            {{ config.Frame.Source }} {{ config.Frame.Name }} //
            {{ pilot.Callsign }}
          </span>
          <br />
          <h1
            class="p-mechname font-weight-black"
            :style="`font-size: ${calcSize(config.Name)}px`"
          >
            {{ config.Name }}
          </h1>
        </v-flex>
        <v-flex class="ml-5">
          <v-layout justify-space-between class="text-xs-center">
            <v-flex class="p-reg">
              <b>HULL</b>
              <br />
              <span class="p-title font-weight-regular">{{ config.Hull }}</span>
            </v-flex>
            <v-flex class="p-reg">
              <b>AGI</b>
              <br />
              <span class="p-title font-weight-regular">{{ config.Agi }}</span>
            </v-flex>
            <v-flex class="p-reg">
              <b>SYS</b>
              <br />
              <span class="p-title font-weight-regular">{{ config.Sys }}</span>
            </v-flex>
            <v-flex class="p-reg">
              <b>ENG</b>
              <br />
              <span class="p-title font-weight-regular">{{ config.Eng }}</span>
            </v-flex>
            <hr vertical />
            <v-flex class="p-reg">
              <b>ATK</b>
              BONUS
              <br />
              <span class="p-title font-weight-regular">
                {{ signed(config.AttackBonus) }}
              </span>
            </v-flex>
            <v-flex class="p-reg">
              <b>TECH</b>
              ATK
              <br />
              <span class="p-title font-weight-regular">
                {{ signed(config.TechAttack) }}
              </span>
            </v-flex>
            <v-flex class="p-reg">
              <b>SAVE</b>
              TARGET
              <br />
              <span class="p-title font-weight-regular">
                {{ config.SaveTarget }}
              </span>
            </v-flex>
          </v-layout>
          <v-layout justify-space-between class="text-xs-center mt-2">
            <v-flex class="p-reg">
              <b>SPEED</b>
              <br />
              <span class="p-title font-weight-regular">
                {{ config.Speed }}
              </span>
            </v-flex>
            <v-flex class="p-reg">
              <b>EVASION</b>
              <br />
              <span class="p-title font-weight-regular">
                {{ config.Evasion }}
              </span>
            </v-flex>
            <v-flex class="p-reg">
              <b>E-DEFENSE</b>
              <br />
              <span class="p-title font-weight-regular">
                {{ config.EDefense }}
              </span>
            </v-flex>
            <v-flex class="p-reg">
              <b>SENSOR RANGE</b>
              <br />
              <span class="p-title font-weight-regular">
                {{ config.SensorRange }}
              </span>
            </v-flex>
            <v-flex class="p-reg">
              <b>LTD SYS BONUS</b>
              <br />
              <span class="p-title font-weight-regular">
                {{ signed(config.LimitedBonus) }}
              </span>
            </v-flex>
            <v-flex class="p-reg">
              <b>SIZE</b>
              <br />
              <span class="p-title font-weight-regular">{{ config.Size }}</span>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>

      <hr class="ma-2" />
      <v-layout justify-space-around class="text-xs-center">
        <v-flex shrink>
          <span class="p-reg">STRUCTURE</span>
          <br />
          <v-icon v-for="n in config.MaxStructure" :key="'structure_' + n">
            crop_din
          </v-icon>
        </v-flex>
        <v-flex shrink class="ml-2">
          <span class="p-reg">HP</span>
          <br />
          <h1 class="p-large font-weight-bold">
            <span
              style="text-decoration: underline; white-space: pre; font-size:16px"
            >
              ____
            </span>
            / {{ config.MaxHP }}
          </h1>
          <span class="p-large">{{ config.Armor }} ARMOR</span>
          <br />
        </v-flex>
        <hr vertical />
        <v-flex shrink>
          <span class="p-reg">REACTOR STRESS</span>
          <br />
          <v-icon v-for="n in config.MaxStress" :key="'structure_' + n">
            crop_din
          </v-icon>
        </v-flex>
        <v-flex shrink class="ml-2">
          <span class="p-reg">HEAT</span>
          <br />
          <h1 class="p-large font-weight-bold">
            <span
              style="text-decoration: underline; white-space: pre; font-size:16px"
            >
              ____
            </span>
            / {{ config.HeatCapacity }}
          </h1>
        </v-flex>
        <hr vertical />
        <v-flex shrink>
          <span class="p-reg">REPAIR CAPACITY</span>
          <br />
          <h1 class="p-large font-weight-bold">
            <span
              style="text-decoration: underline; white-space: pre; font-size:16px"
            >
              ____
            </span>
            / {{ config.RepairCapacity }}
          </h1>
        </v-flex>
        <hr vertical />
        <v-flex shrink class="ml-2">
          <span class="p-reg">OVERCHARGE</span>
          <br />
          <v-icon>crop_din</v-icon>
          <v-icon>crop_din</v-icon>
          <v-icon>crop_din</v-icon>
          <v-icon>crop_din</v-icon>
          <br />
          <span class="p-reg">1 / 1d3 / 1d6 / 1d6+4</span>
        </v-flex>
        <hr vertical />
        <v-flex shrink class="ml-2">
          <span class="p-reg">CORE POWER</span>
          <br />
          <v-icon>crop_din</v-icon>
        </v-flex>
      </v-layout>
      <v-layout></v-layout>

      <hr class="ma-2" />

      <v-layout row>
        <v-flex xs6>
          <span class="label">TRAITS</span>
          <br />
          <v-flex v-for="trait in config.Frame.Traits" :key="trait.Name">
            <span class="p-large">{{ trait.name }}</span>
            <br />
            <p class="p-reg ml-2 mt-0 mb-0" v-html="trait.description" />
          </v-flex>
        </v-flex>

        <v-flex xs6>
          <span class="label">CORE System</span>
          <br />
          <v-flex class="text-xs-center">
            <span class="p-large">{{ config.Frame.CoreSystem.Name }}</span>
            <br />
          </v-flex>
          <v-flex v-if="config.Frame.CoreSystem.Passive">
            <span class="p-reg font-weight-bold">Passive:</span>
            <p
              class="p-reg ml-2 mt-0 mb-0"
              v-html="config.Frame.CoreSystem.Passive"
            />
          </v-flex>
          <v-flex>
            <span class="p-reg font-weight-bold">
              {{ config.Frame.CoreSystem.Active }} (Requires 1 CORE Power):
            </span>
            <p
              class="p-reg ml-2 mt-0 mb-0"
              v-html="config.Frame.CoreSystem.Effect"
            />
          </v-flex>
          <v-flex>
            <span
              v-for="t in config.Frame.CoreSystem.tags"
              :key="t.id"
              small
              class="print-tag"
            >
              {{ t.Name }}
            </span>
          </v-flex>
        </v-flex>
      </v-layout>

      <hr class="mt-2 ml-2 mr-2" />
      <div v-if="loadout">
        <span class="label" style="page-break-inside: avoid">MOUNTS</span>
        <br />
        <v-layout row>
          <v-flex>
            <v-layout
              v-for="(mount, index) in loadout.IntegratedMounts"
              :key="'intmount_' + index"
              row
            >
              <div v-if="mount" style="width: 100%">
                <v-flex>
                  <div class="p-bordered mt-1 mb-1 pa-0">
                    <span class="p-mount-title">{{ mount.MountName }}</span>
                    <div class="mount-interior">
                      <v-layout>
                        <v-flex shrink class="ml-1">
                          <span class="p-large">{{ mount.Weapon.Name }}</span>
                        </v-flex>
                        <v-flex v-if="mount.Weapon.Range" shrink class="ml-2">
                          <range-element size="9" :range="mount.Weapon.Range" />
                        </v-flex>
                        <v-flex v-if="mount.Weapon.Damage" shrink class="ml-2">
                          <span>
                            <damage-element
                              size="9"
                              :dmg="mount.Weapon.Damage"
                            />
                          </span>
                        </v-flex>
                      </v-layout>
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
                </v-flex>
              </div>
            </v-layout>
            <v-layout
              v-for="(mount, index) in allMounts"
              :key="'mount_' + index"
              row
            >
              <div style="width: 100%">
                <v-flex>
                  <div class="p-bordered mt-1 mb-1 pa-0">
                    <span class="p-mount-title">{{ mount.Type }}</span>
                    <div class="mount-interior">
                      <div v-if="mount.IsLocked" class="text-xs-center">
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
                        <v-layout>
                          <v-flex shrink class="ml-1" v-if="!w.Weapon">
                            <span class="p-large">
                              <i style="letter-spacing: 5px; color: grey;">
                                &emsp;EMPTY
                              </i>
                            </span>
                          </v-flex>
                          <v-flex shrink class="ml-1" v-if="!w.Weapon.err">
                            <span class="p-large">{{ w.Weapon.Name }}</span>
                            <span class="p-reg">
                              ({{ w.Weapon.Size }} {{ w.Weapon.Type }})
                            </span>
                            <span v-if="w.Weapon.Mod" class="p-reg">
                              &nbsp;//&nbsp;{{ w.Weapon.Mod.Name }}
                            </span>
                          </v-flex>
                          <v-flex shrink class="ml-2" v-if="!w.Weapon.err">
                            <range-element size="9" :range="w.Weapon.Range" />
                          </v-flex>
                          <v-flex shrink class="ml-2" v-if="!w.Weapon.err">
                            <span>
                              <damage-element size="9" :dmg="w.Weapon.Damage" />
                            </span>
                          </v-flex>
                        </v-layout>
                        <p
                          class="p-reg ml-2 mt-0 mb-0"
                          v-html="w.Weapon.Effect"
                        />
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
                </v-flex>
              </div>
            </v-layout>
          </v-flex>
        </v-layout>

        <span class="label" style="page-break-inside: avoid">SYSTEMS</span>
        <br />
        <v-layout row>
          <v-flex>
            <v-layout
              v-for="(sys, index) in config.IntegratedSystems"
              :key="'system_' + index"
              row
            >
              <v-flex>
                <span class="p-large">{{ sys.Name }}</span>
                <br />
                <p class="p-reg ml-2 mt-0 mb-0" v-html="sys.Effect" />
                <span
                  v-for="t in sys.Tags"
                  :key="t.id + sys"
                  small
                  class="print-tag ml-2"
                >
                  {{ t.Name(pilot.LimitedBonus) }}
                </span>
              </v-flex>
            </v-layout>
            <v-layout
              v-for="(sys, index) in loadout.Systems"
              :key="'system_' + index"
              row
            >
              <v-flex>
                <span class="p-large">{{ sys.Name }}</span>
                <br />
                <p class="p-reg ml-2 mt-0 mb-0" v-html="sys.Effect" />
                <span
                  v-for="t in sys.Tags"
                  :key="t.id + sys"
                  small
                  class="print-tag ml-2"
                >
                  {{ t.Name(pilot.LimitedBonus) }}
                </span>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { RangeElement, DamageElement } from '../../components/UI'
import {
  PrintOptions,
  Pilot,
  Mech,
  MechLoadout,
  EquippableMount,
} from '@/class'

export default Vue.extend({
  name: 'mech-print-view',
  components: { RangeElement, DamageElement },
  data: () => ({
    pilot: {} as Pilot,
    config: {} as Mech,
    loadout: {} as MechLoadout,
    printOptions: {} as PrintOptions,
    blockPrint: false,
  }),
  computed: {
    allMounts(): EquippableMount[] {
      return this.loadout.AllEquippableMounts(this.hasImpArm())
    },
  },
  methods: {
    signed(val: number) {
      return val > -1 ? `+${val}` : `${val}`
    },
    calcSize(str: string) {
      if (str.length < 12) return 30
      else if (str.length < 30) return 25
      else return 20
    },
    hasImpArm(): boolean {
      return this.pilot.has('CoreBonus', 'imparm')
    },
  },
  created() {
    this.printOptions = this.$store.getters.getPrintOptions
    this.pilot = this.$store.getters.getPilot
    if (this.pilot.LoadedMech) this.config = this.pilot.LoadedMech
    if (this.config && this.config.ActiveLoadout)
      this.loadout = this.config.ActiveLoadout
    if (this.printOptions.combo) this.blockPrint = true
  },
  mounted() {
    if (!this.blockPrint) {
      window.print()
      setTimeout(() => {
        this.$router.push('/config')
      }, 10)
    }
  },
})
</script>

<style scoped>
svg {
  width: 100%;
}

.label {
  text-transform: uppercase;
  font-size: 6px;
  color: #757575;
  letter-spacing: 3px;
}

.p-title {
  font-size: 30px;
  letter-spacing: 2px;
  line-height: 30px;
}

.p-mechname {
  letter-spacing: 4px;
}

.p-xlarge {
  font-size: 22px;
}

.p-large {
  font-weight: bold;
  font-size: 11px;
}

.p-reg {
  font-size: 9px;
}

.p-small {
  font-size: 8px;
}

.condense {
  letter-spacing: 1px;
}

.pilot-header {
  font-weight: 900;
  color: #757575;
  letter-spacing: 12px;
  padding: 0;
  margin: 0;
  position: relative;
  top: -10px;
  font-size: 10px;
}

.print-tag {
  font-size: 10px;
  border: 1px grey solid;
  padding: 0px 2px 0px 2px;
  margin: 3px;
  border-radius: 5px;
}

hr {
  color: #757575;
}

.p-mount-title {
  position: relative;
  top: -10px;
  left: 30px;
  background-color: #fff;
  font-size: 10px;
  letter-spacing: 3px;
  text-transform: uppercase;
  padding: 0px 5px 0px 5px;
  margin: 0;
}
.p-bordered {
  border: solid 1px grey;
  border-radius: 3px;
}
.mount-interior {
  position: relative;
  top: -6px;
}
</style>
