<template>
  <div id="config-sheet" class="roster-content">
    
    <empty-view v-if="frame.err">
      <div slot="contents">
        <p class="grey--text text-xs-center display-2">// MISSING FRAME DATA //</p><br>
        <span v-if="config.brew" class="caption grey--text">({{config.brew}})</span>
      </div>
    </empty-view>

    <div v-else-if="config.name">

      <v-tooltip bottom>
        <v-toolbar slot="activator" dense :color="config.active? 'warning' : 'grey darken-2'" class="ml-1">
            <v-divider/>
          <v-toolbar-title class="text-uppercase font-weight-light">
            <span style="letter-spacing: 15px; font-size: 1.75em"> Mech {{config.active? 'Active' : 'Inactive'}}</span>
          </v-toolbar-title>
            <v-divider/>
              <v-toolbar-items class="hidden-sm-and-down">
                <v-btn large icon class="ma-0 ml-2" @click="activateConfig">
                  <v-icon large :color="config.active ? 'yellow accent-2' : 'grey darken-3'">mdi-power</v-icon>
                </v-btn>
              </v-toolbar-items>
        </v-toolbar>
        <div class="text-xs-center">
          <span v-if="config.active"><b>Active Mech</b><br>
          Active Mechs can track Structure, HP, Reactor Stress, Heat, <br>
          Overcharge, and Repair Capacity.<br>
          A pilot may have only one mech activated at a time.<br><br>
          You can click the toggle to deactivate {{config.name}}</span>
          <span v-else><b>Inctive Mech</b><br>
          Inactive Mechs are unable to track any stats, but Pilots may<br>
          have only one active Mech at any time. Making this Mech active<br>
          will deactivate any currently active Mechs<br><br>
          You can click the toggle to activate {{config.name}}</span>
        </div>
      </v-tooltip> 

      <v-container fluid class="pt-0">
        <!-- ID Block -->
        <v-layout align-end>
          <v-flex shrink>
            <editable-label dark :attr="`${configPath}.name`" description="Configuration Name" :placeholder="config.name">
              <span slot="label" class="display-2 white--text">{{config.name}}</span>
            </editable-label>
          </v-flex>
          <v-flex>
            <lazy-dialog :model="frameInfoModal" :title="`${frame.source} ${frame.name}`" hide-confirm @cancel="frameInfoModal = false">
              <v-btn slot="activator" @click="frameInfoModal = true" large flat dark class="ml-0 pl-1 pr-1 pt-4 pb-0">
                {{ frame.source }} {{ frame.name }}
              </v-btn>
              <v-card-text slot="modal-content" v-html="frame.description" />
            </lazy-dialog>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs7>
            <v-layout>
              <v-flex>
                <span class="white--text fluff-text ml-2">{{ getManufacturer(frame.source).name }} {{ frame.mechtype }} Mech</span>
              </v-flex>
            </v-layout>
            <editable-textfield :description="'Configuration Notes'" :attr="`${configPath}.notes`" :initial="config.notes" dark :key="config.id"/>
            <!-- Req. Licenses -->
            <v-layout class="mt-0"><span class="config-header mt-0">Licenses Required</span></v-layout>
            <v-layout>
              <v-flex>
                <v-tooltip top v-for="(l, index) in stats.required_licenses" :key="'req_' + index">
                  <v-chip slot="activator" :color="l.missing ? 'deep-orange darken-4' : 'grey darken-1'" class="white--text" >
                    <v-avatar v-if="l.rank" :class="`${l.missing ? 'amber darken-3' : 'blue-grey darken-2'} font-weight-black title`">
                      <span v-for="n in l.rank" :key="'ri_rnk_' + l.name + n">I</span>
                    </v-avatar >
                    {{l.name}}
                  </v-chip>
                  <span>
                    <span v-if="l.missing" class="font-weight-bold yellow--text">WARNING: MISSING LICENSE
                    <br></span><b>{{l.name}} RANK {{l.rank}}</b><br>
                    <i>Required for:&nbsp;</i> {{l.items.join(', ')}}
                  </span>
                </v-tooltip>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex class="mr-3 ml-3 mt-1 mb-0">
                <v-alert type="warning" :value="stats.required_licenses.filter(x => x.missing).length" outline><b>WARNING: UNLICENSED COMPONENTS</b><br>
                  Pilot is missing one or more licenses required for this configuration
                </v-alert>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex class="mr-3 ml-3 mt-0">
                <v-alert type="warning" :value="stats.used_sp > stats.sp" outline><b>WARNING: SYSTEM CAPACITY EXCEEDED</b><br>
                  Configuration loadout exceeds available SP points (<b>{{stats.used_sp}} SP used</b>, {{stats.sp}} SP available)
                </v-alert>
              </v-flex>
            </v-layout>
          </v-flex>
          <!-- Appearance -->
          <v-flex class="ma-2">
            <div style="border: solid 1px #757575; border-radius: 3px">
              <v-img v-if="config.cloud_img" :src="`file://${userDataPath}/img/frame/${config.custom_img}`" class="ml-2" max-height="55vh" contain/>
              <v-img v-else-if="config.custom_img" :src="`file://${userDataPath}/img/frame/${config.custom_img}`" class="ml-2" max-height="55vh" contain/>
              <v-img v-else :src="`file://${userDataPath}/img/default_frames/${config.frame_id}.png`" class="ml-2" max-height="55vh" contain/>
            </div>
            <v-btn block outline small color="grey" @click="appearanceLoader = true; appearanceModal = true">Set Custom Image</v-btn>
          </v-flex>
           <image-selector :model="appearanceModal" :config="config" @close="appearanceModal = false" @notify="notify($event)" />
        </v-layout>
        <!-- Attribute Block -->
        <v-layout>
          <span class="config-header">Mech Attributes
            <span style="float: right">SIZE {{stats.size}} &emsp;</span>
          </span>
        </v-layout>
          <v-layout>
            <v-flex xs1 class="mr-3">
              <v-layout column justify-center class="text-xs-center">
                <v-flex class="subheader"><span class="caption">HULL</span></v-flex>
                <v-flex class="hase"><span>{{stats.hull}}</span></v-flex>
                <v-flex class="subheader"><span class="caption">AGILITY</span></v-flex>
                <v-flex class="hase"><span>{{stats.agi}}</span></v-flex>
                <v-flex class="subheader"><span class="caption">SYSTEMS</span></v-flex>
                <v-flex class="hase"><span>{{stats.sys}}</span></v-flex>
                <v-flex class="subheader"><span class="caption">ENGINEERING</span></v-flex>
                <v-flex class="hase"><span>{{stats.eng}}</span></v-flex>
                <v-divider dark class="pt-0 mt-0" />
                <v-flex class="subheader"><span class="caption">SYSTEM POINTS</span></v-flex>
                <v-flex class="hase"><span>{{stats.sp}}</span></v-flex>
              </v-layout>
            </v-flex>
            <v-flex>
              <v-layout>
                <v-flex>
                  <v-layout>
                    <v-flex shrink>
                      <span class="grey--text">STRUCTURE 
                        <b :style="`color: ${color.structure.dark}`">{{config.current_structure || 0}}
                          <span v-if="config.active">/{{stats.structure}}</span>
                        </b>
                      </span>
                      <tick-bar :config_id="config.id" :current="config.current_structure || stats.structure" :max="stats.structure" :attr="`current_structure`" large
                        :color="color.structure.dark" bg-color="pink darken-4" empty-icon="mdi-hexagon-outline" full-icon="cc-structure" config :readonly="!config.active" />
                    </v-flex>
                    <v-flex>
                      <span class="grey--text"> 
                        &nbsp;HP <b :style="`color: ${color.hp.dark}`">{{config.current_hp || 0}}
                          <span v-if="config.active">/{{stats.hp}}</span>
                        </b> 
                        &emsp; ARMOR <b :style="`color: ${color.armor.dark}`">{{stats.armor}}</b>
                      </span>
                      <v-layout>
                        <tick-bar :config_id="config.id" :current="config.current_hp || stats.hp" :max="stats.hp" :attr="`current_hp`" large
                          :color="color.hp.dark" bg-color="grey darken-1" empty-icon="mdi-hexagon-outline" full-icon="mdi-hexagon" config  :readonly="!config.active" />
                        <v-flex shrink>
                          <v-rating class="d-inline-flex" v-model="stats.armor" :length="stats.armor" readonly large dense full-icon="mdi-shield" :color="color.armor.dark"/>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
              <v-divider dark />
              <v-layout class="mb-4">
                <v-flex>
                  <v-layout>
                    <v-flex shrink>
                      <span class="grey--text">REACTOR STRESS 
                        <b :style="`color: ${color.stress.dark}`">{{config.current_stress || 0}}
                          <span v-if="config.active">/{{stats.heatstress}}</span>
                        </b></span>
                      <tick-bar :config_id="config.id" :current="config.current_stress || stats.heatstress" :max="stats.heatstress" :attr="`current_stress`" large
                        :color="color.stress.dark" bg-color="deep-orange darken-4" empty-icon="mdi-circle-outline" full-icon="cc-reactor-stress" config  :readonly="!config.active" />
                    </v-flex>
                    <v-flex>
                      <span class="grey--text">
                        <span v-if="config.active">&nbsp;HEAT: <b :style="`color: ${color.heatcap.dark}`">{{config.current_heat || 0}}</b> &emsp; &nbsp;</span>
                        HEAT CAPACITY <b :style="`color: ${color.heatcap.dark}`">{{stats.heatcap}}</b></span>
                      <tick-bar :config_id="config.id" :current="config.current_heat || 0" :max="stats.heatcap" :attr="`current_heat`" large
                        :color="color.heatcap.dark" bg-color="red darken-4" empty-icon="mdi-circle-outline" full-icon="mdi-circle" config  :readonly="!config.active" />
                    </v-flex>
                    <v-spacer />
                      <v-flex>
                      <span class="grey--text"> &nbsp;REPAIR CAPACITY <b :style="`color: ${color.repcap.dark}`">{{config.current_repairs}}
                        <span v-if="config.active">/{{stats.repcap}}</span>
                      </b></span>
                      <tick-bar :config_id="config.id" :current="config.current_repairs || stats.repcap" :max="stats.repcap" :attr="`current_repairs`" large
                        :color="color.repcap.dark" bg-color="grey darken-2" empty-icon="mdi-circle-outline" full-icon="control_point" config  :readonly="!config.active" />
                    </v-flex>
                    <v-spacer />
                    <v-flex v-if="config.active">
                      <span class="grey--text"> &nbsp;CORE POWER 
                        <b :style="`color: ${color.corepower.dark}`">
                          {{config.corepower || 1}}
                      </b></span>
                      <tick-bar :config_id="config.id" :current="config.corepower || 1" :max="1" attr="corepower" large
                        :color="color.corepower.dark" bg-color="grey darken-2" empty-icon="mdi-battery-10" full-icon="mdi-battery" config />
                    </v-flex>
                    <v-spacer />
                    <v-flex v-if="config.active">
                      <span class="grey--text"> &nbsp;OVERCHARGE 
                        <b :style="`color: ${color.overcharge.dark}`">
                          {{overcharge[config.overcharge || 0]}}
                      </b></span>
                      <tick-bar :config_id="config.id" :current="config.overcharge" :max="4" attr="overcharge" large
                        :color="color.overcharge.dark" bg-color="grey darken-2" empty-icon="mdi-circle-outline" full-icon="mdi-alert-decagram" config />
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
              <v-layout justify-space-between>
                <statblock-item :attr="'Attack Bonus'" signed :val="stats.attack_bonus" />
                <statblock-item :attr="'Tech Attack'" signed :val="stats.tech_attack" />
                <statblock-item :attr="'Limited System Bonus'" signed :val="stats.limited_bonus" />
              </v-layout>
              <v-layout justify-space-between>
                <statblock-item :attr="'Speed'" :val="stats.speed" />
                <statblock-item :attr="'Evasion'" :val="stats.evasion" />
                <statblock-item :attr="'E-Defense'" :val="stats.edef" />
                <statblock-item :attr="'Sensor Range'" :val="stats.sensor_range" />
                <statblock-item :attr="'Save Target'" :val="stats.save_target" />
              </v-layout>
            </v-flex>
          </v-layout>

          <v-layout><span class="config-header">Pilot Traits</span></v-layout>

          <v-layout class="ml-3 mr-3">
            <v-flex>
              <pilot-traits :pilot="pilot" />
            </v-flex>
          </v-layout>

          <v-layout><span class="config-header">Frame Traits</span></v-layout>
          <trait-item v-for="trait in frame.traits" :key="trait.name" :trait="trait" />

          <v-layout><span class="config-header">CORE System</span></v-layout>
          <v-layout>
            <v-flex class="m-2">
              <v-toolbar color="grey darken-2"><v-toolbar-title class="white--text">{{frame.core_system.name}}</v-toolbar-title></v-toolbar>
              <v-card dark>
                <v-card-text v-if="frame.core_system.description" v-html="frame.core_system.description" />
                <div v-if="frame.core_system.passive">
                  <v-card-title class="subheading">Passive</v-card-title>
                  <v-card-text class="mt-0 pt-0 mb-0 pb-1"><p class="mb-1" v-html="frame.core_system.passive" /></v-card-text>
                </div>
                <v-card-title class="title">{{frame.core_system.active_name}}<span class="pt-2 ml-2 caption grey--text">(ACTIVE)</span></v-card-title>
                <v-card-text class="mt-0 pt-0 mb-0 pb-1"><p class="mb-1" v-html="frame.core_system.effect" />
                <item-tag v-for="t in frame.core_system.tags" :key="t.id" :tag-obj="t" /></v-card-text>
              </v-card>
            </v-flex>
          </v-layout>

          <v-layout><span class="config-header">Mech Equipment</span></v-layout>
          <v-layout>
            <v-flex>
              <mech-loadout :config_id="config.id" :frame_id="config.frame_id" :stats="stats" @set-index="setActiveIndex" @deleted="fullReload"/>
            </v-flex>
          </v-layout>

        </v-container>

        <v-divider dark />
        <v-layout justify-space-around fill-height class="ma-5">
          <v-flex xs>
            <v-btn large color="warning" outline block dark @click="openPrintOptions(false)"><v-icon>print</v-icon> &nbsp; PRINT</v-btn>
            <v-btn color="warning" small flat block @click="copyConfigStatblock()">copy config statblock &nbsp;
              <v-tooltip top>
                <v-icon slot="activator" small color="grey">help</v-icon>
                <span>
                  This produces a small raw text overview of the current Configuration and copies it to the clipboard.
                </span>
              </v-tooltip>
            </v-btn>
          </v-flex>
          <lazy-dialog :model="printWarningDialog" title="// PRINT WARNING //" acceptString="Continue Anyway"
            acceptColor="warning" @accept="openPrintOptions(true)" @cancel="printWarningDialog = false">
            <v-card-text slot="modal-content">
              <v-layout>
                <v-flex class="mr-3 ml-3 mt-0 mb-0">
                  <v-alert type="error" :value="stats.required_licenses.filter(x => x.missing).length">
                    <b>CRITICAL: UNLICENSED COMPONENTS</b><br>
                    Pilot is missing one or more licenses required for this configuration.
                  </v-alert>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex class="mr-3 ml-3 mt-0">
                  <v-alert type="error" :value="stats.used_sp > stats.sp">
                    <b>CRITICAL: SYSTEM CAPACITY EXCEEDED</b><br>
                    Configuration loadout exceeds available SP points (<b>{{stats.used_sp}} SP used</b>, {{stats.sp}} SP available)
                  </v-alert>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex class="mr-3 ml-3 mt-0">
                  <v-alert type="warning" :value="(stats.sp - stats.used_sp) > 0">
                    <b>WARNING: FREE SYSTEM CAPACITY REMAINING</b><br>
                    Configuration retains {{stats.sp - stats.used_sp}} unused System Points. Combat efficacy limited.
                  </v-alert>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex class="mr-3 ml-3 mt-0">
                  <v-alert type="warning" :value="hasEmptyMounts()">
                    <b>WARNING: EMPTY MOUNTS DETECTED</b><br>
                    Configuration has mounts that do not contain an equipped weapon. Combat efficacy limited.
                  </v-alert>
                </v-flex>
              </v-layout>
            </v-card-text>
          </lazy-dialog>

      </v-layout>
    </div>

    <empty-view v-else>
      <p slot="contents" class="grey--text text-xs-center display-2">NO CONFIGURATION LOADED</p>
    </empty-view>

  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Stats from '../logic/stats'
  import {mapGetters} from 'vuex'
  import {getStatic} from '@/mixins/static'
  import {EditableLabel, EditableTextfield, ItemTag, EmptyView, LazyDialog, PipBar, TickBar} from '../components/UI'
  import {StatblockItem, TraitItem, ImageSelector, PilotTraits} from './SheetComponents'
  import MechLoadout from './LoadoutEditor/MechLoadout.vue'
  import { clipboard } from 'electron';
  import ccc from '@/features/_shared/UI/CCColors'


  export default Vue.extend({
    name: 'config-sheet',
    components: { EditableLabel, EditableTextfield, ItemTag, StatblockItem, TraitItem, MechLoadout, ImageSelector, EmptyView, LazyDialog, PipBar, TickBar, PilotTraits},
    data: () => ({
      activeLoadoutIdx: 0,
      frameInfoModal: false,
      appearanceModal: false,
      printWarningDialog: false,
      snackbar: false,
      notification: '',
      loadoutForceReloadTrigger: 0,
      overcharge: [ "+1", "+1d3", "+1d6", "+1d6+4", "MAX"]
    }),
    methods: {
      setActiveIndex (index: number) {
        this.activeLoadoutIdx = index
      },
      fullReload () {
        this.$router.push('/config')
      },
      notify: function (contents: string) {
        this.notification = contents
        this.snackbar = true
      },      
      hasEmptyMounts (): boolean {
        var empty = false
        var vm = this as any
        if (!vm.config.loadouts.length) return true
        if (!vm.config.loadouts[vm.activeLoadoutIdx]) return true
        if (!vm.config.loadouts[vm.activeLoadoutIdx].mounts) return true
        if (!vm.config.loadouts[vm.activeLoadoutIdx].mounts.length) return true
        for (let i = 0; i < vm.config.loadouts[vm.activeLoadoutIdx].mounts.length; i++) {
          const m = vm.config.loadouts[vm.activeLoadoutIdx].mounts[i]
          if (m.imparm || (m.imparm && vm.pilot.core_bonuses.includes('imparm'))) continue
          if (m.mount_type.includes('/')) empty = m.weapons.length < 2
          else empty = !m.weapons.length
        }
        return empty
      },
      selectMechImg () {
        var vm = this as any
        vm.$refs.mechImg.showModal()
      },
      getStaticPath (path: string) {
        return getStatic(path)
      },
      openPrintOptions (override: boolean) {
        var vm = this as any
        this.$store.dispatch('setPrintOptions', {
          config_id: vm.config.id,
          config_loadout_index: this.activeLoadoutIdx
        })
        if (!override && (
          this.hasEmptyMounts() ||
          (this.stats.sp - this.stats.used_sp) > 0 ||
          this.stats.used_sp > this.stats.sp ||
          this.stats.required_licenses.filter(x => x.missing).length
        )) {
          this.printWarningDialog = true
        } else {
          this.$router.push('/print-config')
        }
      },
      copyConfigStatblock () {
        var vm = this as any
        clipboard.writeText(Stats.mechStatblock(vm.pilot, vm.config, vm.config.loadouts[vm.activeLoadoutIdx], vm.$store.getters['getState']))
        this.notify('Pilot Statblock Copied to Clipboard')
      },
      activateConfig() {
        var vm = this as any
        if (!vm.config.active) {
          for (let i = 0; i < vm.pilot.configs.length; i++) {
            if (vm.pilot.configs[i].active) {
                vm.$store.dispatch('editConfig', {
                id: vm.pilot.configs[i].id,
                attr: `active`,
                val: false
              })
            }
          }
        }
        this.$store.dispatch('editConfig', {
          id: vm.config.id,
          attr: `active`,
          val: !vm.config.active
        })
        vm.$store.dispatch('editPilot', {
          attr: 'active_config',
          val: vm.config.id
        })
      }
    },
    computed: {
      ...mapGetters({
        config: 'getConfig',
        configIndex: 'getConfigIndex',
        pilot: 'getPilot'
      }),
      configPath (): string {
        var vm = this as any
        return `configs[${vm.configIndex(vm.config.id)}]`
      },
      stats (): MechStats {
        var vm = this as any
        if (this.loadoutForceReloadTrigger) console.info('Equipment changed: recalculating config stats...')
        else console.info('Loadout changed: recalculating config stats...')
        return this.$store.getters['getMechStats'](vm.config.id, vm.config.loadouts[vm.activeLoadoutIdx])
      },
      frame (): Frame {
        var vm = this as any
        return this.$store.getters['getItemById']('Frames', vm.config.frame_id)
      },
      color (): any {
        return ccc.colors
      }
    }
  })
</script>

<style scoped>
  #config-sheet {
    background-color: #424242;
  }

  .config-header {
    background-color: #757575;
    color: #EEEEEE;
    font-weight: bold;
    letter-spacing: 3px;
    width: 100%;
    padding-left: 10px;
    margin-top:10px;
    margin-bottom: 3px;
    height:40px;
    padding-top:8px
  }

  .subheader {
    background-color: #757575;
    color: #EEEEEE;
    font-weight: bold;
    letter-spacing: 2px;
  }

  .hase {
    color: #ffffff;
    font-size: 3em;
    font-weight: 300
  }
</style>
