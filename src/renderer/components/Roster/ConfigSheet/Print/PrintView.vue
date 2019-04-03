<template>
  <div style="line-height: 1.2">
    <v-container fluid>
    <!-- config header -->
      <!-- <v-layout>
        <v-flex xs1 class="pt-0"><hr/></v-flex>
        <v-flex shrink class="pt-0 mt-0"><span class="pilot-header">&emsp;MECH&emsp;</span></v-flex>
        <v-flex class="pt-0"><hr/></v-flex>
      </v-layout> -->

    <!-- callsign/name/level block -->
      <v-layout fill-height justify-space-between >
        <v-flex xs3>
          <span class="p-reg">{{frame.source}} {{frame.name}} // {{pilot.callsign}}</span>
          <br>
          <h1 class="p-mechname font-weight-black" :style="`font-size: ${calcSize(config.name)}px`">{{config.name}}</h1>
        </v-flex>
        <v-flex class="ml-5">
          <v-layout justify-space-between class="text-xs-center">
            <v-flex class="p-reg">
              <b>HULL</b>
              <br><span class="p-title font-weight-regular">{{stats.hull}}</span>
            </v-flex>
            <v-flex class="p-reg">
              <b>AGI</b>
              <br><span class="p-title font-weight-regular">{{stats.agi}}</span>
            </v-flex>
            <v-flex class="p-reg">
              <b>SYS</b>
              <br><span class="p-title font-weight-regular">{{stats.sys}}</span>
            </v-flex>
            <v-flex class="p-reg">
              <b>ENG</b>
              <br><span class="p-title font-weight-regular">{{stats.eng}}</span>
            </v-flex>
            <hr vertical />
            <v-flex class="p-reg">
              <b>ATK</b> BONUS
              <br><span class="p-title font-weight-regular">{{signed(stats.attack_bonus)}}</span>
            </v-flex>
            <v-flex class="p-reg">
              <b>TECH</b> ATK
              <br><span class="p-title font-weight-regular">{{signed(stats.tech_attack)}}</span>
            </v-flex>
            <v-flex class="p-reg">
              <b>SAVE</b> TARGET
              <br><span class="p-title font-weight-regular">{{stats.save_target}}</span>
            </v-flex>            
          </v-layout>
          <v-layout justify-space-between class="text-xs-center mt-2">
            <v-flex class="p-reg">
              <b>SPEED</b>
              <br><span class="p-title font-weight-regular">{{stats.speed}}</span>
            </v-flex>
            <v-flex class="p-reg">
              <b>EVASION</b>
              <br><span class="p-title font-weight-regular">{{stats.evasion}}</span>
            </v-flex>
            <v-flex class="p-reg">
              <b>E-DEFENSE</b>
              <br><span class="p-title font-weight-regular">{{stats.edef}}</span>
            </v-flex>
            <v-flex class="p-reg">
              <b>SENSOR RANGE</b>
              <br><span class="p-title font-weight-regular">{{stats.sensor_range}}</span>
            </v-flex>
            <v-flex class="p-reg">
              <b>LTD SYS BONUS</b>
              <br><span class="p-title font-weight-regular">{{signed(stats.limited_bonus)}}</span>
            </v-flex>    
            <v-flex class="p-reg">
              <b>SIZE</b>
              <br><span class="p-title font-weight-regular">{{frame.stats.size}}</span>
            </v-flex>            
            </v-layout>
        </v-flex>
      </v-layout>

      <hr class="ma-2">
      <v-layout justify-space-around class="text-xs-center">
        <v-flex shrink>
          <span class="p-reg">STRUCTURE</span><br>
          <v-icon>crop_din</v-icon><v-icon>crop_din</v-icon><v-icon>crop_din</v-icon><v-icon>crop_din</v-icon>
        </v-flex>
        <v-flex shrink class="ml-2">
          <span class="p-reg">HP</span>
          <br>
          <h1 class="p-large font-weight-bold"><span style="text-decoration: underline; white-space: pre; font-size:16px">____</span> / {{stats.hp}}</h1>
          <span class="p-large">{{stats.armor}} ARMOR</span><br>
        </v-flex>
        <hr vertical />
        <v-flex shrink>
          <span class="p-reg">REACTOR STRESS</span><br>
          <v-icon>crop_din</v-icon><v-icon>crop_din</v-icon><v-icon>crop_din</v-icon><v-icon>crop_din</v-icon>
        </v-flex>
        <v-flex shrink class="ml-2">
          <span class="p-reg">HEAT</span>
          <br>
          <h1 class="p-large font-weight-bold"><span style="text-decoration: underline; white-space: pre; font-size:16px">____</span> / {{stats.heatcap}}</h1>
        </v-flex>
        <hr vertical />
        <v-flex shrink>
          <span class="p-reg">REPAIR CAPACITY</span><br>
          <h1 class="p-large font-weight-bold"><span style="text-decoration: underline; white-space: pre; font-size:16px">____</span> / {{stats.repcap}}</h1>
        </v-flex>
        <hr vertical />
        <v-flex shrink class="ml-2">
          <span class="p-reg">OVERCHARGE</span>
          <br>
          <v-icon>crop_din</v-icon><v-icon>crop_din</v-icon><v-icon>crop_din</v-icon><v-icon>crop_din</v-icon>
          <br>
          <span class="p-reg">1 / 1d3 / 1d6 / 1d6+4</span>
        </v-flex>
        <hr vertical />
        <v-flex shrink class="ml-2">
          <span class="p-reg">CORE POWER</span>
          <br>
          <v-icon>crop_din</v-icon>
        </v-flex>
      </v-layout>
      <v-layout>
      </v-layout>

      <hr class="ma-2">

      <v-layout row>
        <v-flex xs6>
          <span class="label">TRAITS</span><br>
          <v-flex v-for="trait in frame.traits" :key="trait.name">
            <span class="p-large">{{trait.name}}</span><br>
            <p class="p-reg ml-2 mt-0 mb-0">{{trait.description}}</p>
          </v-flex>
        </v-flex>

        <v-flex xs6>
          <span class="label">CORE System</span><br>
          <v-flex class="text-xs-center">
            <span class="p-large">{{frame.core_system.name}}</span><br>
          </v-flex>  
          <v-flex v-if="frame.core_system.passive">     
            <span class="p-reg font-weight-bold">Passive: </span>
            <p class="p-reg ml-2 mt-0 mb-0">{{frame.core_system.passive}}</p>
          </v-flex> 
          <v-flex>     
            <span class="p-reg font-weight-bold">{{frame.core_system.active_name}} (Requires 1 CORE Power): </span>
            <p class="p-reg ml-2 mt-0 mb-0">{{frame.core_system.effect}}</p>
          </v-flex>
          <v-flex>     
            <span v-for="t in frame.core_system.tags" :key="t" small class="print-tag">{{tag(t).name}}</span>
          </v-flex>
        </v-flex>
      </v-layout>

      <hr class="mt-2 ml-2 mr-2">
      <div v-if="loadout">
      <span class="label" style="page-break-inside: avoid">MOUNTS</span><br>
      <v-layout row>
        <v-flex>
        <v-layout v-if="1 === 1" row>
          <div style="width: 100%">
            <v-flex>
              <div class="bordered mt-1 mb-1 pa-0">
                <span class="mount-title" >CORE Integrated Weapon</span>
                <div class="mount-interior">
                  <v-layout>
                    <v-flex shrink class="ml-1"><span class="p-large">{{frame.core_system.integrated.name}}</span></v-flex>
                    <v-flex v-if="frame.core_system.integrated.range" shrink class="ml-2"><range-element size="9" :range="frame.core_system.integrated.range" /></v-flex>
                    <v-flex v-if="frame.core_system.integrated.damage" shrink class="ml-2"><span><damage-element size="9" :dmg="frame.core_system.integrated.damage" /></span></v-flex>
                  </v-layout>
                  <p class="p-reg ml-2 mt-0 mb-0">{{frame.core_system.integrated.effect}}</p>
                  <span v-for="t in frame.core_system.integrated.tags" :key="t.id + w.id" small class="print-tag ml-2">{{fullTag(tag(t.id).name, t.val)}}</span>
                </div>
              </div>
            </v-flex>
          </div>
        </v-layout>        
        <v-layout v-for="(mount, index) in stats.integrated_mounts" :key="'intmount_' + index" row>
          <div v-if="mount" style="width: 100%">
            <v-flex>
              <div class="bordered mt-1 mb-1 pa-0">
                <span class="mount-title" >Integrated Weapon</span>
                <div class="mount-interior">
                  <v-layout>
                    <v-flex shrink class="ml-1"><span class="p-large">{{weapon(mount).name}}</span></v-flex>
                    <v-flex v-if="weapon(mount).range" shrink class="ml-2"><range-element size="9" :range="weapon(mount).range" /></v-flex>
                    <v-flex v-if="weapon(mount).damage" shrink class="ml-2"><span><damage-element size="9" :dmg="weapon(mount).damage" /></span></v-flex>
                  </v-layout>
                  <p class="p-reg ml-2 mt-0 mb-0">{{mount.effect}}</p>
                  <span v-for="t in weapon(mount).tags" :key="t.id + mount" small class="print-tag ml-2">{{fullTag(tag(t.id).name, t.val)}}</span>
                </div>
              </div>
            </v-flex>
          </div>
        </v-layout>
        <v-layout v-for="(mount, index) in loadout.mounts" :key="'mount_' + index" row>
          <div v-if="!mount.imparm || (mount.imparm && hasImparm())" style="width: 100%">
            <v-flex>
              <div class="bordered mt-1 mb-1 pa-0">
                <span class="mount-title" >{{mount.mount_type}}</span>
                <div class="mount-interior">
                  <div v-if="mount.sh_lock" class="text-xs-center">
                    <i style="letter-spacing: 5px; color: grey;">MOUNT LOCKED &mdash; SUPERHEAVY WEAPON BRACING</i>
                  </div>
                  <div v-else-if="!mount.weapons.length">
                    <i style="letter-spacing: 5px; color: grey;">EMPTY</i>
                  </div>
                  <div v-else v-for="w in mount.weapons" :key="w.id">
                    <v-layout>
                      <v-flex shrink class="ml-1"><span class="p-large">{{weapon(w.id).name}}</span></v-flex>
                      <v-flex shrink class="ml-2"><range-element size="9" :range="weapon(w.id).range" /></v-flex>
                      <v-flex shrink class="ml-2"><span><damage-element size="9" :dmg="weapon(w.id).damage" /></span></v-flex>
                    </v-layout>
                    <p class="p-reg ml-2 mt-0 mb-0">{{weapon(w.id).effect}}</p>
                    <span v-for="t in weapon(w.id).tags" :key="t.id + w.id" small class="print-tag ml-2">{{fullTag(tag(t.id).name, t.val)}}</span>
                  </div>
                </div>
              </div>
            </v-flex>
          </div>
        </v-layout>
      </v-flex>
    </v-layout>

      <span class="label" style="page-break-inside: avoid">SYSTEMS</span><br>
      <v-layout row>
        <v-flex>
        <v-layout v-for="(sys, index) in stats.integrated_systems" :key="'system_' + index" row>
          <v-flex>
          <span class ="p-large">{{system(sys).name}}</span><br>
          <p class="p-reg ml-2 mt-0 mb-0" v-html="system(sys).effect" />
          <span v-for="t in system(sys).tags" :key="t.id + sys" small class="print-tag ml-2">{{fullTag(tag(t.id).name, t.val)}}</span>
          </v-flex>
        </v-layout>
        <v-layout v-for="(sys, index) in loadout.systems" :key="'system_' + index" row>
          <v-flex>
          <span class ="p-large">{{system(sys.id).name}}</span><br>
          <p class="p-reg ml-2 mt-0 mb-0" v-html="system(sys.id).effect" />
          <span v-for="t in system(sys.id).tags" :key="t.id + sys" small class="print-tag ml-2">{{fullTag(tag(t.id).name, t.val)}}</span>
          </v-flex>
        </v-layout>
        </v-flex>
      </v-layout>
      </div>

    </v-container>
  </div>
</template>

<script>
  import Stats from '@/logic/stats'
  import { RangeElement, DamageElement } from '@/components/Roster/UI'

  export default {
    name: 'mech-print-view',
    components: { RangeElement, DamageElement },
    data: () => ({
      pilot: {},
      config: {},
      frame: {},
      loadout: {},
      stats: {},
      printOptions: {}
    }),
    methods: {
      item: function (type, id) {
        return this.$store.getters.getItemById(type, id)
      },
      tag: function (id) {
        return this.$store.getters.getItemById('Tags', id)
      },
      system: function (id) {
        return this.$store.getters.getItemById('MechSystems', id)
      },
      weapon: function (id) {
        return this.$store.getters.getItemById('MechWeapons', id)
      },
      signed: function (val) {
        return val > -1 ? `+${val}` : `${val}`
      },
      calcSize: function (str) {
        if (str.length < 12) return 30
        else if (str.length < 30) return 25
        else return 20
      },
      fullTag: function (t, v) {
        if (typeof v === 'string' && this.stats.limited_bonus > 0) {
          return t.replace(/{VAL}/g, `${v}+${this.stats.limited_bonus}`)
        }
        return t.replace(/{VAL}/g, v + this.stats.limited_bonus)
      },
      hasImparm: function () {
        return this.pilot.core_bonuses.includes('imparm')
      }
    },
    created: function () {
      this.pilot = this.$store.getters.getPilot
      this.printOptions = this.$store.getters.getPrintOptions
      this.config = this.pilot.configs.find(x => x.id === this.printOptions.config_id)
      this.loadout = this.config.loadouts[this.printOptions.loadout_index] || null
      this.pilotStats = Stats.pilotStats(this.pilot, this.pilot.loadouts[this.printOptions.loadout_index])
      this.stats = this.$store.getters.getMechStats(this.config.id, this.config.loadouts[this.activeLoadoutIdx])
      this.frame = this.$store.getters.getItemById('Frames', this.config.frame_id)
    },
    mounted: function () {
      window.print()
      setTimeout(() => {
        this.$router.push('/config')
      }, 10)
    }
  }
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

  .mount-title {
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
  .bordered {
    border: solid 1px grey; 
    border-radius: 3px;
  }
  .mount-interior {
    position: relative;
    top: -6px;
  }

</style>
