<template>
  <div style="line-height: 1.2">
    <v-container fluid>
      <!-- callsign/name/level block -->
      <v-row fill-height justify-space-between>
        <v-col cols="3">
          <span class="p-reg">
            {{ config.Frame.Source }} {{ config.Frame.Name }} //
            {{ pilot.Callsign }}
          </span>
          <br />
          <h1 class="p-mechname font-weight-black" :style="`font-size: ${calcSize(config.Name)}px`">
            {{ config.Name }}
          </h1>
        </v-col>
        <v-col class="ml-5">
          <v-row justify-space-between class="text-center">
            <v-col class="p-reg">
              <b>HULL</b>
              <br />
              <span class="p-title font-weight-regular">{{ config.Hull }}</span>
            </v-col>
            <v-col class="p-reg">
              <b>AGI</b>
              <br />
              <span class="p-title font-weight-regular">{{ config.Agi }}</span>
            </v-col>
            <v-col class="p-reg">
              <b>SYS</b>
              <br />
              <span class="p-title font-weight-regular">{{ config.Sys }}</span>
            </v-col>
            <v-col class="p-reg">
              <b>ENG</b>
              <br />
              <span class="p-title font-weight-regular">{{ config.Eng }}</span>
            </v-col>
            <hr vertical />
            <v-col class="p-reg">
              <b>ATK</b>
              BONUS
              <br />
              <span class="p-title font-weight-regular">
                {{ signed(config.AttackBonus) }}
              </span>
            </v-col>
            <v-col class="p-reg">
              <b>TECH</b>
              ATK
              <br />
              <span class="p-title font-weight-regular">
                {{ signed(config.TechAttack) }}
              </span>
            </v-col>
            <v-col class="p-reg">
              <b>SAVE</b>
              TARGET
              <br />
              <span class="p-title font-weight-regular">
                {{ config.SaveTarget }}
              </span>
            </v-col>
          </v-row>
          <v-row justify-space-between class="text-center mt-2">
            <v-col class="p-reg">
              <b>SPEED</b>
              <br />
              <span class="p-title font-weight-regular">
                {{ config.Speed }}
              </span>
            </v-col>
            <v-col class="p-reg">
              <b>EVASION</b>
              <br />
              <span class="p-title font-weight-regular">
                {{ config.Evasion }}
              </span>
            </v-col>
            <v-col class="p-reg">
              <b>E-DEFENSE</b>
              <br />
              <span class="p-title font-weight-regular">
                {{ config.EDefense }}
              </span>
            </v-col>
            <v-col class="p-reg">
              <b>SENSOR RANGE</b>
              <br />
              <span class="p-title font-weight-regular">
                {{ config.SensorRange }}
              </span>
            </v-col>
            <v-col class="p-reg">
              <b>LTD SYS BONUS</b>
              <br />
              <span class="p-title font-weight-regular">
                {{ signed(config.LimitedBonus) }}
              </span>
            </v-col>
            <v-col class="p-reg">
              <b>SIZE</b>
              <br />
              <span class="p-title font-weight-regular">{{ config.Size }}</span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <hr class="ma-2" />
      <v-row justify-space-around class="text-center">
        <v-col shrink>
          <span class="p-reg">STRUCTURE</span>
          <br />
          <v-icon v-for="n in config.MaxStructure" :key="'structure_' + n">
            crop_din
          </v-icon>
        </v-col>
        <v-col shrink class="ml-2">
          <span class="p-reg">HP</span>
          <br />
          <h1 class="p-large font-weight-bold">
            <span style="text-decoration: underline; white-space: pre; font-size:16px">
              ____
            </span>
            / {{ config.MaxHP }}
          </h1>
          <span class="p-large">{{ config.Armor }} ARMOR</span>
          <br />
        </v-col>
        <hr vertical />
        <v-col shrink>
          <span class="p-reg">REACTOR STRESS</span>
          <br />
          <v-icon v-for="n in config.MaxStress" :key="'structure_' + n">
            crop_din
          </v-icon>
        </v-col>
        <v-col shrink class="ml-2">
          <span class="p-reg">HEAT</span>
          <br />
          <h1 class="p-large font-weight-bold">
            <span style="text-decoration: underline; white-space: pre; font-size:16px">
              ____
            </span>
            / {{ config.HeatCapacity }}
          </h1>
        </v-col>
        <hr vertical />
        <v-col shrink>
          <span class="p-reg">REPAIR CAPACITY</span>
          <br />
          <h1 class="p-large font-weight-bold">
            <span style="text-decoration: underline; white-space: pre; font-size:16px">
              ____
            </span>
            / {{ config.RepairCapacity }}
          </h1>
        </v-col>
        <hr vertical />
        <v-col shrink class="ml-2">
          <span class="p-reg">OVERCHARGE</span>
          <br />
          <v-icon>crop_din</v-icon>
          <v-icon>crop_din</v-icon>
          <v-icon>crop_din</v-icon>
          <v-icon>crop_din</v-icon>
          <br />
          <span class="p-reg">1 / 1d3 / 1d6 / 1d6+4</span>
        </v-col>
        <hr vertical />
        <v-col shrink class="ml-2">
          <span class="p-reg">CORE POWER</span>
          <br />
          <v-icon>crop_din</v-icon>
        </v-col>
      </v-row>
      <v-row></v-row>

      <hr class="ma-2" />

      <v-row>
        <v-col cols="6">
          <span class="label">TRAITS</span>
          <br />
          <v-col v-for="trait in config.Frame.Traits" :key="trait.Name">
            <span class="p-large">{{ trait.name }}</span>
            <br />
            <p class="p-reg ml-2 mt-0 mb-0" v-html="trait.description" />
          </v-col>
        </v-col>

        <v-col cols="6">
          <span class="label">CORE System</span>
          <br />
          <v-col class="text-center">
            <span class="p-large">{{ config.Frame.CoreSystem.Name }}</span>
            <br />
          </v-col>
          <v-col v-if="config.Frame.CoreSystem.Passive">
            <span class="p-reg font-weight-bold">Passive:</span>
            <p class="p-reg ml-2 mt-0 mb-0" v-html="config.Frame.CoreSystem.Passive" />
          </v-col>
          <v-col>
            <span class="p-reg font-weight-bold">
              {{ config.Frame.CoreSystem.Active }} (Requires 1 CORE Power):
            </span>
            <p class="p-reg ml-2 mt-0 mb-0" v-html="config.Frame.CoreSystem.Effect" />
          </v-col>
          <v-col>
            <span v-for="t in config.Frame.CoreSystem.tags" :key="t.id" small class="print-tag">
              {{ t.Name }}
            </span>
          </v-col>
        </v-col>
      </v-row>

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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { RangeElement, DamageElement } from '../../components/UI'
import { PrintOptions, Pilot, Mech, MechLoadout, EquippableMount } from '@/class'

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
      return this.loadout.AllEquippableMounts(this.hasImpArm(), this.hasIntWeapon())
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
    hasIntWeapon(): boolean {
      return this.pilot.has('CoreBonus', 'intweapon')
    },
  },
  created() {
    this.printOptions = this.$store.getters.getPrintOptions
    this.pilot = this.$store.getters.getPilot
    this.config = this.printOptions.mech
    if (this.config && this.config.Loadouts)
      this.loadout = this.config.ActiveLoadout || this.config.Loadouts[0]
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
