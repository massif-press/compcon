<template>
  <div>
    <!-- Pilot header -->
    <v-container fluid>
      <v-layout>
        <v-flex xs1 class="pt-2"><v-divider/></v-flex>
        <v-flex shrink><span class="pilot-header">&emsp;PILOT&emsp;</span></v-flex>
        <v-flex class="pt-2"><v-divider/></v-flex>
      </v-layout>

    <!-- callsign/name/level block -->
      <v-layout fill-height justify-space-between align-end>
        <v-flex shrink>
          <span class="label">CALLSIGN</span>
          <br>
          <h1 class="display-2 font-weight-black">{{pilot.callsign}}</h1>
        </v-flex>
        <v-flex class="ml-3">          
          <span class="title font-weight-light">{{pilot.name}}, {{item('Backgrounds', pilot.background).name}}</span>
        </v-flex>
        <v-flex shrink class="mr-4">
          <span class="label">LEVEL</span>
          <br>
          <h1 class="display-2 font-weight-light">{{pilot.level}}</h1>
        </v-flex>
        <v-flex shrink>
          <span class="label">GRIT</span>
          <br>
          <h1 class="display-2 font-weight-black">+{{stats.grit}}</h1>
        </v-flex>      
      </v-layout>

      <!-- pilot stats block -->
      <v-layout fill-height justify-space-between align-end class="text-xs-center mt-2 mb-1">
        <v-flex>
          <span class="label">HP</span>
          <br>
          <h1 class="display-1 font-weight-regular"><u>___</u> / {{stats.hp}}</h1>
        </v-flex>
        <v-flex>
          <span class="label">ARMOR</span>
          <br>
          <h1 class="display-1 font-weight-light">{{stats.armor}}</h1>
        </v-flex>        
        <v-flex>
          <span class="label">ELECTRONIC DEFENSE</span>
          <br>
          <h1 class="display-1 font-weight-light">{{stats.edef}}</h1>
        </v-flex>
        <v-flex>
          <span class="label">EVASION</span>
          <br>
          <h1 class="display-1 font-weight-light">{{stats.evasion}}</h1>
        </v-flex>
        <v-flex>
          <span class="label">SPEED</span>
          <br>
          <h1 class="display-1 font-weight-light">{{stats.speed}}</h1>
        </v-flex>
      </v-layout>

      <v-divider class="mt-2 mb-2"/>

      <!-- invocation/skill block -->
      <v-layout align-space-around justify-space-between fill-height >
      <!-- invocations -->
      <v-flex>
        <v-layout><span class="label">INVOCATIONS</span></v-layout>
        <div v-for="i in pilot.invocations" :key="i.trigger" class="ml-2">
          <v-layout class="mb-3">
            <span class="title">{{i.trigger}}</span>
            <span v-if="i.accuracy" class="label ml-3 black--text">+1 Accuracy</span>
            <span v-else class="label ml-3 red--text">+1 Difficulty</span>
          </v-layout>
        </div>
      </v-flex>

      <!-- skills -->
      <v-flex>
        <span class="label">TRIGGERS</span><br>
        <div v-for="i in pilot.skills" :key="i.id" class="ml-2">
          <v-layout>
            <v-chip small outline color="indigo" class="title">+{{i.bonus}}</v-chip>
            <span class="title ml-1" style="padding-top:5px">{{item('Skills', i.id).trigger}}</span>
          </v-layout>
          <!-- <v-layout>
            <span class="label condense ml-3 mb-2">{{item('Skills', i.id).description}}</span>
          </v-layout> -->
        </div>
      </v-flex>      
      </v-layout>

      <v-divider class="mt-2 mb-2"/>

      <!-- talents -->
      <v-layout align-space-around justify-space-between fill-height >
        <v-flex>
          <v-layout><span class="label">TALENTS</span></v-layout>
          <div v-for="t in pilot.talents" :key="t.id" class="ml-2 mb-1">
            <v-layout>
              <v-icon v-for="n in t.rank" :key="`talstar_${n}`">star</v-icon>
              <v-icon v-for="n in (3) - t.rank" :key="`talnot_${n}`" color="grey lighten-1">star_outline</v-icon>
              <span class="title ml-2">{{item('Talents', t.id).name}}</span>
            </v-layout>
            <div class="ml-4">
            <v-layout><span v-html="item('Talents', t.id).r1_desc" /></v-layout>
            <v-layout v-if="t.rank > 1"><span v-html="item('Talents', t.id).r2_desc" /></v-layout>
            <v-layout v-if="t.rank > 2"><span v-html="item('Talents', t.id).r3_desc" /></v-layout>
            </div>
          </div>
        </v-flex>
      </v-layout>

      <v-divider class="mt-2 mb-2"/>

      <!-- license/mechskills/corebonus block -->
      <!-- licenses -->
      <v-layout align-space-around justify-space-between fill-height >
      <v-flex>
        <span class="label">LICENSES</span><br>
        <div v-for="l in pilot.licenses" :key="l.id">
          <v-layout>
            <v-icon v-for="n in l.level" :key="`licstar_${n}`">star</v-icon>
            <v-icon v-for="n in (3) - l.level" :key="`licnot_${n}`" color="grey lighten-1">star_outline</v-icon>
            <span class="title ml-2">{{l.source}} {{l.name}}</span>
          </v-layout>
        </div>

        <v-divider class="mr-4 mt-1 mb-1"/>

      <!-- mechskills -->
        <span class="label">MECH SKILLS</span>
        <v-layout>
          <span class="subheading">HULL: <span class="font-weight-black">{{stats.mech.hull}}</span></span>
          <span class="label ml-3 mr-2">//</span><span class="subheading">AGI: <span class="font-weight-black">{{stats.mech.agi}}</span></span>
          <span class="label ml-3 mr-2">//</span><span class="subheading">SYS: <span class="font-weight-black">{{stats.mech.sys}}</span></span>
          <span class="label ml-3 mr-2">//</span><span class="subheading">ENG: <span class="font-weight-black">{{stats.mech.eng}}</span></span>
        </v-layout>

      </v-flex>

      <v-divider vertical class="ma-2"/>


      <!-- core bonuses -->
      <v-flex>
        <span class="label">CORE BONUSES</span><br>
        <div v-for="b in pilot.core_bonuses" :key="b">
          <v-layout>
            <span class="title">{{item('CoreBonuses', b).name}}</span>
          </v-layout>
          <v-layout>
            <span class="ml-2">{{item('CoreBonuses', b).effect}}</span>
          </v-layout>
        </div>      
      </v-flex>
      
      </v-layout>

      <v-divider class="mt-2 mb-2"/>

      <!-- loadout -->
      <div v-if="loadout && loadout.items">
        <span class="label">GEAR: {{loadout.name}}</span><br>
        <v-layout>
          <v-flex xs12>
          <div v-if="loadout.items.armor" class="ma-1 ml-2">
            <span class="label">ARMOR</span><br>
            <div v-for="(i, idx) in loadout.items.armor" :key="idx + i.id" >
              <v-layout class="mr-2"><span class="title">{{gear(i.id).name}}</span></v-layout>
              <v-layout class="ml-2">
              <v-flex shrink class="label condense pt-1" v-html="`+ ${gear(i.id).armor || 0} Armor // E-Defense: ${gear(i.id).edef || 'N/A'} // Evasion: ${gear(i.id).evasion || 'N/A'}`" />
              <v-flex shrink class="subheading ml-4" v-if="gear(i.id).hp_bonus" v-html="`HP Bonus: +${gear(i.id).hp_bonus}`" />
              <v-flex shrink class="subheading ml-4" v-if="gear(i.id).speed" v-html="`Speed: ${gear(i.id).speed}`" />
              <v-flex shrink class="subheading ml-4" v-if="gear(i.id).speed_bonus" v-html="`Speed Bonus: +${gear(i.id).speed_bonus}`" />
              <v-flex shrink class="subheading ml-4" v-if="gear(i.id).evasion_bonus" v-html="`Evasion Bonus: +${gear(i.id).evasion_bonus}`" />
              <v-flex shrink class="subheading ml-4" v-if="gear(i.id).hp" v-html="`HP: ${gear(i.id).hp}`" />
              </v-layout>
            </div>
          </div>
          <v-divider class="ma-2" />

          <div v-if="loadout.items.weapon" class="ma-1 ml-2">
            <span class="label">WEAPONRY</span><br>
            <div v-for="(i, idx) in loadout.items.weapon" :key="idx + i">
              <v-layout shrink class="mr-2"><span class="title">{{gear(i.id).name}}</span></v-layout>
              <v-layout class="mt-1 mb-1 ml-2">
                <v-flex shrink class="mr-3"><range-element :range="gear(i.id).range" /></v-flex>
                <v-flex shrink><damage-element size="16" :dmg="gear(i.id).damage" /></v-flex>
              </v-layout>
            </div>
          </div>
          </v-flex>

          <v-divider vertical class="ma-2"/>

          <v-flex>
          <div v-if="loadout.items.gear" class="ma-1 ml-2">
            <span class="label">GEAR</span><br>
            <v-layout v-for="(i, idx) in loadout.items.gear" :key="idx + i">
              <v-flex shrink class="mr-2"><span class="title">{{gear(i.id).name}}</span>
              <br>
              <p class="ml-2 mb-0 pb-0">{{gear(i.id).description}}</p></v-flex>
            </v-layout>
          </div>
          </v-flex>
        </v-layout>
      </div>

      <v-layout class="pt-2">
        <v-flex class="pt-2"><v-divider/></v-flex>
        <v-flex shrink><span class="pilot-header">&emsp;PILOT&emsp;</span></v-flex>
        <v-flex xs1 class="pt-2"><v-divider/></v-flex>
      </v-layout>

    </v-container>
  </div>
</template>

<script>
  import Stats from '@/logic/stats'
  import { RangeElement, DamageElement } from '@/components/Roster/UI'

  export default {
    name: 'pilot-print-view',
    components: { RangeElement, DamageElement },
    data: () => ({
      pilot: {},
      loadout: {},
      stats: {},
      printOptions: {}
    }),
    methods: {
      item: function (type, id) {
        return this.$store.getters.getItemById(type, id)
      },
      gear: function (id) {
        return this.$store.getters.getItemById('PilotGear', id)
      }
    },
    created: function () {
      this.pilot = this.$store.getters.getPilot
      this.printOptions = this.$store.getters.getPrintOptions
      this.loadout = this.pilot.loadouts[this.printOptions.loadout_index] || null
      this.stats = Stats.pilotStats(this.pilot, this.pilot.loadouts[this.printOptions.loadout_index])
    },
    mounted: function () {
      window.print()
      setTimeout(() => {
        this.$router.push('/roster')
      }, 100)
    }
  }
</script>

<style>
  .label {
    text-transform: uppercase;
    font-size: 12px;
    color: #757575;
    letter-spacing: 3px;
  }

  .condense {
    letter-spacing: 1px;
  }

  .pilot-header {
    font-weight: 900;
    color: #757575;
    letter-spacing: 10px
  }
</style>
