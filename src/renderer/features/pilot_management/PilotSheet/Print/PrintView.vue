<template>
  <div>
    <v-container fluid>
    <!-- callsign/name/level block -->
      <v-layout fill-height justify-space-between align-end>
        <v-flex shrink>
          <span class="label">CALLSIGN</span>
          <br>
          <h1 class="p-title font-weight-black">{{pilot.callsign}}</h1>
        </v-flex>
        <v-flex class="ml-3">          
          <span class="p-large font-weight-light">{{pilot.name}}, {{item('Backgrounds', pilot.background, 'name')}}</span>
        </v-flex>
        <v-flex shrink class="mr-4 text-xs-right">
          <span class="label text-xs-right">LEVEL</span>
          <br>
          <h1 class="p-large font-weight-light c">{{pilot.level}}</h1>
        </v-flex>
        <v-flex shrink>
          <span class="label">GRIT</span>
          <br>
          <h1 class="p-title font-weight-black">+{{stats.grit}}</h1>
        </v-flex>      
      </v-layout>

      <!-- pilot stats block -->
      <v-layout fill-height justify-space-between align-end class="text-xs-center mt-2 mb-1">
        <v-flex>
          <span class="label">HP</span>
          <br>
          <h1 class="p-xlarge font-weight-regular"><span style="text-decoration: underline; white-space: pre;">____</span> / {{stats.hp}}</h1>
        </v-flex>
        <v-flex>
          <span class="label">ARMOR</span>
          <br>
          <h1 class="p-xlarge font-weight-light">{{stats.armor}}</h1>
        </v-flex>        
        <v-flex>
          <span class="label">ELECTRONIC DEFENSE</span>
          <br>
          <h1 class="p-xlarge font-weight-light">{{stats.edef}}</h1>
        </v-flex>
        <v-flex>
          <span class="label">EVASION</span>
          <br>
          <h1 class="p-xlarge font-weight-light">{{stats.evasion}}</h1>
        </v-flex>
        <v-flex>
          <span class="label">SPEED</span>
          <br>
          <h1 class="p-xlarge font-weight-light">{{stats.speed}}</h1>
        </v-flex>
      </v-layout>

      <hr class="mt-2 mb-2"/>

      <!-- invocation/skill block -->
      <v-layout justify-space-between fill-height >
        <!-- invocations -->
        <v-flex xs5>
        <v-layout><span class="label">INVOCATIONS</span></v-layout>
          <v-layout wrap>
            <div v-for="i in pilot.invocations" :key="i.trigger" class="ml-2">
              <v-flex class="ma-1">
                <span class="p-large">{{i.trigger}}</span><br>
                <i v-if="i.accuracy" class="p-reg ml-2 black--text">+1 Accuracy</i>
                <i v-else class="p-reg ml-2 red--text">+1 Difficulty</i>
              </v-flex>
            </div>
          </v-layout>
        </v-flex>
        <!-- skills -->
        <v-flex>
        <v-layout><span class="label">TRIGGERS</span></v-layout>
          <v-layout wrap>
            <div v-for="(i, idx) in pilot.skills" :key="i.id + idx" class="ml-2">
              <v-flex class="ma-1">
                <span class="p-large ml-1" style="padding-top:5px">{{item('Skills', i.id, 'trigger')}}</span>
                <v-chip small outline color="indigo" class="p-large">+{{i.bonus}}</v-chip>
              </v-flex>
              <!-- <v-layout>
                <span class="label condense ml-3 mb-2">{{item('Skills', i.id).description}}</span>
              </v-layout> -->
            </div>
          </v-layout>
        </v-flex>      
      </v-layout>

      <hr class="mt-2 mb-2"/>

      <!-- talents -->
      <v-layout align-space-around justify-space-between fill-height >
        <v-flex>
          <v-layout><span class="label">TALENTS</span></v-layout>
          <div v-for="t in pilot.talents" :key="t.id" class="ml-2 mb-1">
            <v-layout>
              <v-icon v-for="n in t.rank" :key="`talstar_${n}`" small>star</v-icon>
              <v-icon v-for="n in (3) - t.rank" :key="`talnot_${n}`" color="grey lighten-1" small>star_outline</v-icon>
              <span class="p-large ml-2">{{item('Talents', t.id, 'name')}}</span>
            </v-layout>
            <div class="ml-4">
            <v-layout><span class="p-reg" v-html="item('Talents', t.id, 'r1_desc')" /></v-layout>
            <v-layout v-if="t.rank > 1"><span class="p-reg" v-html="item('Talents', t.id, 'r2_desc')" /></v-layout>
            <v-layout v-if="t.rank > 2"><span class="p-reg" v-html="item('Talents', t.id, 'r3_desc')" /></v-layout>
            </div>
          </div>
        </v-flex>
      </v-layout>

      <hr class="mt-2 mb-2"/>

      <div style="page-break-inside: avoid">

      <!-- license/mechskills/corebonus block -->
      <!-- licenses -->
      <v-layout align-space-around justify-space-between fill-height>
      <v-flex>
        <span class="label">LICENSES</span><br>
        <div v-for="l in pilot.licenses" :key="l.id">
          <v-layout>
            <v-icon v-for="n in l.level" :key="`licstar_${n}`" small>star</v-icon>
            <v-icon v-for="n in (3) - l.level" :key="`licnot_${n}`" color="grey lighten-1" small>star_outline</v-icon>
            <span class="p-large ml-2">{{l.source}} {{l.name}}</span>
          </v-layout>
        </div>

        <hr class="mr-4 mt-1 mb-1"/>

      <!-- mechskills -->
        <span class="label">MECH SKILLS</span>
        <v-layout>
          <span class="subheading">HULL: <span class="font-weight-black">{{stats.mech.hull}}</span></span>
          <span class="label ml-3 mr-2">//</span><span class="subheading">AGI: <span class="font-weight-black">{{stats.mech.agi}}</span></span>
          <span class="label ml-3 mr-2">//</span><span class="subheading">SYS: <span class="font-weight-black">{{stats.mech.sys}}</span></span>
          <span class="label ml-3 mr-2">//</span><span class="subheading">ENG: <span class="font-weight-black">{{stats.mech.eng}}</span></span>
        </v-layout>

      </v-flex>

      <hr vertical class="ma-2"/>

      <!-- core bonuses -->
      <v-flex>
        <span class="label">CORE BONUSES</span><br>
        <div v-for="b in pilot.core_bonuses" :key="b">
          <v-layout>
            <span class="p-large">{{item('CoreBonuses', b, 'name')}}</span>
          </v-layout>
          <v-layout class="ml-2">
            <span class="p-reg">{{item('CoreBonuses', b, 'effect')}}</span>
          </v-layout>
        </div>      
      </v-flex>
      
      </v-layout>

      <hr class="mt-2 mb-2"/>

      <!-- loadout -->
      <div v-if="loadout && loadout.items">
        <v-layout row>
          <v-flex xs4>
          <div v-if="loadout.items.armor" class="ma-1 ml-2">
            <span class="label">ARMOR</span><br>
            <div v-for="(i, idx) in loadout.items.armor" :key="'armor_' + idx" >
              <div v-if="i">
                <div v-if="gear(i.id).err">
                  // MISSING DATA //
                </div>
                <div v-else>
                  <v-layout class="mr-2"><span class="p-large">{{gear(i.id).name}}</span></v-layout>
                  <v-layout class="ml-2">
                  <v-flex shrink class="p-reg" v-html="`+ ${gear(i.id).armor || 0} Armor / E-Def: ${gear(i.id).edef || 'N/A'} / Evasion: ${gear(i.id).evasion || 'N/A'}`" />
                  <v-flex shrink class="p-reg ml-2" v-if="gear(i.id).hp_bonus" v-html="`HP Bonus: +${gear(i.id).hp_bonus}`" />
                  <v-flex shrink class="p-reg ml-2" v-if="gear(i.id).speed" v-html="`Speed: ${gear(i.id).speed}`" />
                  <v-flex shrink class="p-reg ml-2" v-if="gear(i.id).speed_bonus" v-html="`Speed Bonus: +${gear(i.id).speed_bonus}`" />
                  <v-flex shrink class="p-reg ml-2" v-if="gear(i.id).evasion_bonus" v-html="`Evasion Bonus: +${gear(i.id).evasion_bonus}`" />
                  <v-flex shrink class="p-reg ml-2" v-if="gear(i.id).hp" v-html="`HP: ${gear(i.id).hp}`" />
                  </v-layout>
                </div>
              </div>
            </div>
          </div>
          <hr class="ma-2" />

          <div v-if="loadout.items.weapon" class="ma-1 ml-2">
            <span class="label">WEAPONS</span><br>
            <div v-for="(i, idx) in loadout.items.weapon" :key="'weapon_' + idx">
              <div v-if="i">
                <div v-if="gear(i.id).err">
                  // MISSING DATA //
                </div>
                <div v-else>
                  <v-layout shrink class="mr-2"><span class="p-large">{{gear(i.id).name}}</span></v-layout>
                  <v-layout class="mb-1 ml-2">
                    <v-flex shrink class="mr-3"><range-element size="12" :range="gear(i.id).range" /></v-flex>
                    <v-flex shrink><damage-element size="12" :dmg="gear(i.id).damage" /></v-flex>
                    <v-flex shrink><span v-for="t in i.tags" :key="t+idx" class="ml-1 mr-1">{{item('Tags', t).name}}</span></v-flex>
                  </v-layout>
                </div>
              </div>
            </div>
          </div>
          </v-flex>

          <hr vertical class="ma-2"/>

          <v-flex xs8>
          <div v-if="loadout.items.gear" class="ma-1 ml-2">
            <span class="label">GEAR</span><br>
            <v-layout v-for="(i, idx) in loadout.items.gear" :key="'gear_' + idx">
              <div v-if="i">
                <div v-if="gear(i.id).err">
                  // MISSING DATA //
                </div>
                <div v-else>
                  <v-flex shrink class="mr-2"><span class="p-large">{{gear(i.id).name}}</span>
                  <br>
                  <p class="ml-2 mb-0 pb-0 p-small" v-html="gear(i.id).description" /></v-flex>
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
  import Stats from '../../logic/stats'
  import {RangeElement, DamageElement} from '../../components/UI'

export default Vue.extend({
    name: 'pilot-print-view',
    components: { RangeElement, DamageElement },
    data: () => ({
      pilot: {} as Pilot,
      loadout: {},
      stats: {},
      printOptions: {} as PrintOptions,
      blockPrint: false
    }),
    methods: {
      item (type: string, id: string, field: string) {
        var i = this.$store.getters['getItemById'](type, id)
        return i.err ? '// MISSING DATA //' : i[field]
      },
      gear (id: string) {
        return this.$store.getters['getItemById']('PilotGear', id)
      }
    },
    created () {
      this.pilot = this.$store.getters['getPilot']
      this.printOptions = this.$store.getters['getPrintOptions'] as PrintOptions
      this.loadout = this.pilot.loadouts[this.printOptions.loadout_index] || null
      this.stats = Stats.pilotStats(this.pilot, this.pilot.loadouts[this.printOptions.loadout_index], this.$store.getters['getState'])
      if (this.printOptions.combo) this.blockPrint = true
    },
    mounted () {
      if (!this.blockPrint) {
        window.print()
        setTimeout(() => {
          this.$router.push('/pilot')
        }, 10)
      }
    }
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
