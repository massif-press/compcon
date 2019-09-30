<template>
  <div>
    <v-container fluid>
      <!-- callsign/name/level block -->
      <v-row fill-height justify-space-between align-end>
        <v-col shrink>
          <span class="label">CALLSIGN</span>
          <br />
          <h1 class="p-title font-weight-black">{{ pilot.Callsign }}</h1>
        </v-col>
        <v-col class="ml-3">
          <span class="p-large font-weight-light">{{ pilot.Name }}, {{ pilot.Background.Name }}</span>
        </v-col>
        <v-col shrink class="mr-4 text-xs-right">
          <span class="label text-xs-right">LEVEL</span>
          <br />
          <h1 class="p-large font-weight-light c">{{ pilot.Level }}</h1>
        </v-col>
        <v-col shrink>
          <span class="label">GRIT</span>
          <br />
          <h1 class="p-title font-weight-black">+{{ pilot.Grit }}</h1>
        </v-col>
      </v-row>

      <!-- pilot stats block -->
      <v-row fill-height justify-space-between align-end class="text-center mt-2 mb-1">
        <v-col>
          <span class="label">HP</span>
          <br />
          <h1 class="p-xlarge font-weight-regular">
            <span>
              <span style="text-decoration: underline; white-space: pre;">____</span>
              / {{ pilot.MaxHP }}
            </span>
          </h1>
        </v-col>
        <v-col>
          <span class="label">ARMOR</span>
          <br />
          <h1 class="p-xlarge font-weight-light">{{ pilot.Armor }}</h1>
        </v-col>
        <v-col>
          <span class="label">ELECTRONIC DEFENSE</span>
          <br />
          <h1 class="p-xlarge font-weight-light">{{ pilot.EDefense }}</h1>
        </v-col>
        <v-col>
          <span class="label">EVASION</span>
          <br />
          <h1 class="p-xlarge font-weight-light">{{ pilot.Evasion }}</h1>
        </v-col>
        <v-col>
          <span class="label">SPEED</span>
          <br />
          <h1 class="p-xlarge font-weight-light">{{ pilot.Speed }}</h1>
        </v-col>
      </v-row>

      <hr class="mt-2 mb-2" />

      <!-- skill block -->
      <v-row justify-space-between fill-height>
        <!-- skills -->
        <v-col>
          <v-row><span class="label">TRIGGERS</span></v-row>
          <v-row wrap>
            <div v-for="(i, idx) in pilot.Skills" :key="'skill' + idx" class="ml-2">
              <v-col class="ma-1">
                <span class="p-large ml-1" style="padding-top:5px">
                  {{ i.Skill.Trigger }}
                </span>
                <v-chip small outline color="indigo" class="p-large">+{{ i.Bonus }}</v-chip>
              </v-col>
            </div>
          </v-row>
        </v-col>
      </v-row>

      <hr class="mt-2 mb-2" />

      <!-- talents -->
      <v-row align-space-around justify-space-between fill-height>
        <v-col>
          <v-row><span class="label">TALENTS</span></v-row>
          <div v-for="(t, idx) in pilot.Talents" :key="'talent' + idx" class="ml-2 mb-1">
            <v-row>
              <v-icon v-for="n in t.Rank" :key="`talstar_${n}`" small>
                star
              </v-icon>
              <v-icon v-for="n in 3 - t.Rank" :key="`talnot_${n}`" color="grey lighten-1" small>
                star_outline
              </v-icon>
              <span class="p-large ml-2">{{ t.Talent.Name }}</span>
            </v-row>
            <div class="ml-4">
              <v-row>
                <span class="p-reg" v-html="t.Talent.Ranks[0].description" />
              </v-row>
              <v-row v-if="t.Rank > 1">
                <span class="p-reg" v-html="t.Talent.Ranks[1].description" />
              </v-row>
              <v-row v-if="t.Rank > 2">
                <span class="p-reg" v-html="t.Talent.Ranks[2].description" />
              </v-row>
            </div>
          </div>
        </v-col>
      </v-row>

      <hr class="mt-2 mb-2" />

      <div style="page-break-inside: avoid">
        <!-- license/mechskills/corebonus block -->
        <!-- licenses -->
        <v-row align-space-around justify-space-between fill-height>
          <v-col>
            <span class="label">LICENSES</span>
            <br />
            <div v-for="l in pilot.Licenses" :key="l.id">
              <v-row>
                <v-icon v-for="n in l.Rank" :key="`licstar_${n}`" small>
                  star
                </v-icon>
                <v-icon v-for="n in 3 - l.Rank" :key="`licnot_${n}`" color="grey lighten-1" small>
                  star_outline
                </v-icon>
                <span class="p-large ml-2">{{ l.License.Source }} {{ l.License.Name }}</span>
              </v-row>
            </div>

            <hr class="mr-4 mt-1 mb-1" />

            <!-- mechskills -->
            <span class="label">MECH SKILLS</span>
            <v-row>
              <span class="subheading">
                HULL:
                <span class="font-weight-black">{{ pilot.MechSkills.Hull }}</span>
              </span>
              <span class="label ml-3 mr-2">//</span>
              <span class="subheading">
                AGI:
                <span class="font-weight-black">{{ pilot.MechSkills.Agi }}</span>
              </span>
              <span class="label ml-3 mr-2">//</span>
              <span class="subheading">
                SYS:
                <span class="font-weight-black">{{ pilot.MechSkills.Sys }}</span>
              </span>
              <span class="label ml-3 mr-2">//</span>
              <span class="subheading">
                ENG:
                <span class="font-weight-black">{{ pilot.MechSkills.Eng }}</span>
              </span>
            </v-row>
          </v-col>

          <hr vertical class="ma-2" />

          <!-- core bonuses -->
          <v-col>
            <span class="label">CORE BONUSES</span>
            <br />
            <div v-for="(cb, idx) in pilot.CoreBonuses" :key="'cb' + idx">
              <v-row>
                <span class="p-large">{{ cb.Name }}</span>
              </v-row>
              <v-row class="ml-2">
                <span class="p-reg">{{ cb.Effect }}</span>
              </v-row>
            </div>
          </v-col>
        </v-row>

        <hr class="mt-2 mb-2" />

        <!-- loadout -->
        <div v-if="loadout">
          <v-row>
            <v-col cols="4">
              <div v-if="loadout.Armor.length" class="ma-1 ml-2">
                <span class="label">ARMOR</span>
                <br />
                <div v-for="(i, idx) in loadout.Armor" :key="'armor_' + idx">
                  <div v-if="i">
                    <div v-if="i.err">// MISSING DATA //</div>
                    <div v-else>
                      <v-row class="mr-2">
                        <span class="p-large">{{ i.Name }}</span>
                      </v-row>
                      <v-row class="ml-2">
                        <v-col
                          shrink
                          class="p-reg"
                          v-html="
                            `+ ${i.Armor || 0} Armor / E-Def: ${i.EDefense ||
                              'N/A'} / Evasion: ${i.Evasion || 'N/A'}`
                          "
                        />
                        <v-col
                          shrink
                          class="p-reg ml-2"
                          v-if="i.HPBonus"
                          v-html="`HP Bonus: +${i.HPBonus}`"
                        />
                        <v-col
                          shrink
                          class="p-reg ml-2"
                          v-if="i.Speed"
                          v-html="`Speed: ${i.Speed}`"
                        />
                        <v-col
                          shrink
                          class="p-reg ml-2"
                          v-if="i.SpeedBonus"
                          v-html="`Speed Bonus: +${i.SpeedBonus}`"
                        />
                        <v-col
                          shrink
                          class="p-reg ml-2"
                          v-if="i.EvasionBonus"
                          v-html="`Evasion Bonus: +${i.EvasionBonus}`"
                        />
                      </v-row>
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
                    <div v-if="i.err">// MISSING DATA //</div>
                    <div v-else>
                      <v-row shrink class="mr-2">
                        <span class="p-large">{{ i.Name }}</span>
                      </v-row>
                      <v-row class="mb-1 ml-2">
                        <v-col shrink class="mr-3">
                          <range-element size="12" :range="i.Range" />
                        </v-col>
                        <v-col shrink>
                          <damage-element size="12" :dmg="i.Damage" />
                        </v-col>
                        <v-col shrink>
                          <span
                            v-for="t in i.Tags"
                            :key="t.ID + idx"
                            class="ml-1 mr-1"
                          >{{ t.Name() }}</span>
                        </v-col>
                      </v-row>
                    </div>
                  </div>
                </div>
              </div>
            </v-col>

            <hr vertical class="ma-2" />

            <v-col cols="8">
              <div v-if="loadout.Gear.length" class="ma-1 ml-2">
                <span class="label">GEAR</span>
                <br />
                <v-row v-for="(i, idx) in loadout.Gear" :key="'gear_' + idx">
                  <div v-if="i">
                    <div v-if="i.err">// MISSING DATA //</div>
                    <div v-else>
                      <v-col shrink class="mr-2">
                        <span class="p-large">{{ i.Name }}</span>
                        <br />
                        <p class="ml-2 mb-0 pb-0 p-small" v-html="i.Description" />
                      </v-col>
                    </div>
                  </div>
                </v-row>
              </div>
            </v-col>
          </v-row>
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
