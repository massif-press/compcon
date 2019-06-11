<template>
  <div>
    <v-container fluid>
      <!-- callsign/name/level block -->
      <v-layout fill-height justify-space-between align-end>
        <v-flex shrink>
          <span class="label">CALLSIGN</span>
          <br />
          <h1 class="p-title font-weight-black">{{ pilot.Callsign }}</h1>
        </v-flex>
        <v-flex class="ml-3">
          <span class="p-large font-weight-light">
            {{ pilot.Name }}, {{ pilot.Background.Name }}
          </span>
        </v-flex>
        <v-flex shrink class="mr-4 text-xs-right">
          <span class="label text-xs-right">LEVEL</span>
          <br />
          <h1 class="p-large font-weight-light c">{{ pilot.Level }}</h1>
        </v-flex>
        <v-flex shrink>
          <span class="label">GRIT</span>
          <br />
          <h1 class="p-title font-weight-black">+{{ pilot.Grit }}</h1>
        </v-flex>
      </v-layout>

      <!-- pilot stats block -->
      <v-layout
        fill-height
        justify-space-between
        align-end
        class="text-xs-center mt-2 mb-1"
      >
        <v-flex>
          <span class="label">HP</span>
          <br />
          <h1 class="p-xlarge font-weight-regular">
            <span style="text-decoration: underline; white-space: pre;">
              ____
            </span>
            / {{ pilot.MaxHP }}
          </h1>
        </v-flex>
        <v-flex>
          <span class="label">ARMOR</span>
          <br />
          <h1 class="p-xlarge font-weight-light">{{ pilot.Armor }}</h1>
        </v-flex>
        <v-flex>
          <span class="label">ELECTRONIC DEFENSE</span>
          <br />
          <h1 class="p-xlarge font-weight-light">{{ pilot.EDefense }}</h1>
        </v-flex>
        <v-flex>
          <span class="label">EVASION</span>
          <br />
          <h1 class="p-xlarge font-weight-light">{{ pilot.Evasion }}</h1>
        </v-flex>
        <v-flex>
          <span class="label">SPEED</span>
          <br />
          <h1 class="p-xlarge font-weight-light">{{ pilot.Speed }}</h1>
        </v-flex>
      </v-layout>

      <hr class="mt-2 mb-2" />

      <!-- skill block -->
      <v-layout justify-space-between fill-height>
        <!-- skills -->
        <v-flex>
          <v-layout><span class="label">TRIGGERS</span></v-layout>
          <v-layout wrap>
            <div
              v-for="(i, idx) in pilot.Skills"
              :key="'skill' + idx"
              class="ml-2"
            >
              <v-flex class="ma-1">
                <span class="p-large ml-1" style="padding-top:5px">
                  {{ i.Skill.Trigger }}
                </span>
                <v-chip small outline color="indigo" class="p-large">
                  +{{ i.Bonus }}
                </v-chip>
              </v-flex>
            </div>
          </v-layout>
        </v-flex>
      </v-layout>

      <hr class="mt-2 mb-2" />

      <!-- talents -->
      <v-layout align-space-around justify-space-between fill-height>
        <v-flex>
          <v-layout><span class="label">TALENTS</span></v-layout>
          <div
            v-for="(t, idx) in pilot.Talents"
            :key="'talent' + idx"
            class="ml-2 mb-1"
          >
            <v-layout>
              <v-icon v-for="n in t.Rank" :key="`talstar_${n}`" small>
                star
              </v-icon>
              <v-icon
                v-for="n in 3 - t.Rank"
                :key="`talnot_${n}`"
                color="grey lighten-1"
                small
              >
                star_outline
              </v-icon>
              <span class="p-large ml-2">{{ t.Talent.Name }}</span>
            </v-layout>
            <div class="ml-4">
              <v-layout>
                <span class="p-reg" v-html="t.Talent.Ranks[0].description" />
              </v-layout>
              <v-layout v-if="t.Rank > 1">
                <span class="p-reg" v-html="t.Talent.Ranks[1].description" />
              </v-layout>
              <v-layout v-if="t.Rank > 2">
                <span class="p-reg" v-html="t.Talent.Ranks[2].description" />
              </v-layout>
            </div>
          </div>
        </v-flex>
      </v-layout>

      <hr class="mt-2 mb-2" />

      <div style="page-break-inside: avoid">
        <!-- license/mechskills/corebonus block -->
        <!-- licenses -->
        <v-layout align-space-around justify-space-between fill-height>
          <v-flex>
            <span class="label">LICENSES</span>
            <br />
            <div v-for="l in pilot.Licenses" :key="l.id">
              <v-layout>
                <v-icon v-for="n in l.Rank" :key="`licstar_${n}`" small>
                  star
                </v-icon>
                <v-icon
                  v-for="n in 3 - l.Rank"
                  :key="`licnot_${n}`"
                  color="grey lighten-1"
                  small
                >
                  star_outline
                </v-icon>
                <span class="p-large ml-2">
                  {{ l.License.Source }} {{ l.License.Name }}
                </span>
              </v-layout>
            </div>

            <hr class="mr-4 mt-1 mb-1" />

            <!-- mechskills -->
            <span class="label">MECH SKILLS</span>
            <v-layout>
              <span class="subheading">
                HULL:
                <span class="font-weight-black">
                  {{ pilot.MechSkills.Hull }}
                </span>
              </span>
              <span class="label ml-3 mr-2">//</span>
              <span class="subheading">
                AGI:
                <span class="font-weight-black">
                  {{ pilot.MechSkills.Agi }}
                </span>
              </span>
              <span class="label ml-3 mr-2">//</span>
              <span class="subheading">
                SYS:
                <span class="font-weight-black">
                  {{ pilot.MechSkills.Sys }}
                </span>
              </span>
              <span class="label ml-3 mr-2">//</span>
              <span class="subheading">
                ENG:
                <span class="font-weight-black">
                  {{ pilot.MechSkills.Eng }}
                </span>
              </span>
            </v-layout>
          </v-flex>

          <hr vertical class="ma-2" />

          <!-- core bonuses -->
          <v-flex>
            <span class="label">CORE BONUSES</span>
            <br />
            <div v-for="(cb, idx) in pilot.CoreBonuses" :key="'cb' + idx">
              <v-layout>
                <span class="p-large">{{ cb.Name }}</span>
              </v-layout>
              <v-layout class="ml-2">
                <span class="p-reg">{{ cb.Effect }}</span>
              </v-layout>
            </div>
          </v-flex>
        </v-layout>

        <hr class="mt-2 mb-2" />

        <!-- loadout -->
        <div v-if="loadout">
          <v-layout row>
            <v-flex xs4>
              <div v-if="loadout.Armor.length" class="ma-1 ml-2">
                <span class="label">ARMOR</span>
                <br />
                <div v-for="(i, idx) in loadout.Armor" :key="'armor_' + idx">
                  <div v-if="i">
                    <div v-if="i.err">
                      // MISSING DATA //
                    </div>
                    <div v-else>
                      <v-layout class="mr-2">
                        <span class="p-large">{{ i.Name }}</span>
                      </v-layout>
                      <v-layout class="ml-2">
                        <v-flex
                          shrink
                          class="p-reg"
                          v-html="
                            `+ ${i.Armor || 0} Armor / E-Def: ${i.EDefense ||
                              'N/A'} / Evasion: ${i.Evasion || 'N/A'}`
                          "
                        />
                        <v-flex
                          shrink
                          class="p-reg ml-2"
                          v-if="i.HPBonus"
                          v-html="`HP Bonus: +${i.HPBonus}`"
                        />
                        <v-flex
                          shrink
                          class="p-reg ml-2"
                          v-if="i.Speed"
                          v-html="`Speed: ${i.Speed}`"
                        />
                        <v-flex
                          shrink
                          class="p-reg ml-2"
                          v-if="i.SpeedBonus"
                          v-html="`Speed Bonus: +${i.SpeedBonus}`"
                        />
                        <v-flex
                          shrink
                          class="p-reg ml-2"
                          v-if="i.EvasionBonus"
                          v-html="`Evasion Bonus: +${i.EvasionBonus}`"
                        />
                      </v-layout>
                    </div>
                  </div>
                </div>
              </div>
              <hr class="ma-2" />

              <div v-if="loadout.Weapons.length" class="ma-1 ml-2">
                <span class="label">WEAPONS</span>
                <br />
                <div v-for="(i, idx) in loadout.Weapons" :key="'weapon_' + idx">
                  <div v-if="i">
                    <div v-if="i.err">
                      // MISSING DATA //
                    </div>
                    <div v-else>
                      <v-layout shrink class="mr-2">
                        <span class="p-large">{{ i.Name }}</span>
                      </v-layout>
                      <v-layout class="mb-1 ml-2">
                        <v-flex shrink class="mr-3">
                          <range-element size="12" :range="i.Range" />
                        </v-flex>
                        <v-flex shrink>
                          <damage-element size="12" :dmg="i.Damage" />
                        </v-flex>
                        <v-flex shrink>
                          <span
                            v-for="t in i.Tags"
                            :key="t.ID + idx"
                            class="ml-1 mr-1"
                          >
                            {{ t.Name() }}
                          </span>
                        </v-flex>
                      </v-layout>
                    </div>
                  </div>
                </div>
              </div>
            </v-flex>

            <hr vertical class="ma-2" />

            <v-flex xs8>
              <div v-if="loadout.Gear.length" class="ma-1 ml-2">
                <span class="label">GEAR</span>
                <br />
                <v-layout v-for="(i, idx) in loadout.Gear" :key="'gear_' + idx">
                  <div v-if="i">
                    <div v-if="i.err">
                      // MISSING DATA //
                    </div>
                    <div v-else>
                      <v-flex shrink class="mr-2">
                        <span class="p-large">{{ i.Name }}</span>
                        <br />
                        <p
                          class="ml-2 mb-0 pb-0 p-small"
                          v-html="i.Description"
                        />
                      </v-flex>
                    </div>
                  </div>
                </v-layout>
              </div>
            </v-flex>
          </v-layout>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { RangeElement, DamageElement } from '../../components/UI'
import { Pilot, PrintOptions, PilotLoadout } from '@/class'

export default Vue.extend({
  name: 'pilot-print-view',
  components: { RangeElement, DamageElement },
  data: () => ({
    pilot: {} as Pilot,
    loadout: {} as PilotLoadout | null,
    printOptions: {} as PrintOptions,
    blockPrint: false,
  }),
  created() {
    this.pilot = this.$store.getters.getPilot
    this.printOptions = this.$store.getters.getPrintOptions
    this.loadout = this.pilot.ActiveLoadout
    if (this.printOptions.combo) this.blockPrint = true
  },
  mounted() {
    if (!this.blockPrint) {
      window.print()
      setTimeout(() => {
        this.$router.push('/pilot')
      }, 10)
    }
  },
})
</script>

<style scoped>
.label {
  text-transform: uppercase;
  font-size: 6px;
  color: #757575;
  letter-spacing: 3px;
}

.p-title {
  font-size: 35px;
  letter-spacing: 4px;
  line-height: 30px;
}

.p-xlarge {
  font-size: 25px;
}

.p-large {
  font-weight: bold;
  font-size: 12px;
}

.p-reg {
  font-size: 10px;
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

hr {
  color: #757575;
}
</style>
