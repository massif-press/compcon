<template>
  <div id="config-sheet" class="roster-content">
    
    <div v-if="frame.err" style="height: 95vh">
      <v-container style="height: 100%">
        <v-layout align-center justify-center row fill-height>
          <v-flex>
            <p class="grey--text text-xs-center display-2">// MISSING FRAME DATA //</p>
            <br>
            <span v-if="config.brew" class="caption grey--text">({{config.brew}})</span>
          </v-flex>
        </v-layout>
      </v-container>
    </div>

   <div v-else-if="config.name">
    <v-container fluid>
      <v-layout align-end>
        <v-flex shrink>
          <editable-label dark :attr="`${configPath}.name`" description="Configuration Name" :placeholder="config.name">
            <span slot="label" class="display-2 white--text">{{config.name}}</span>
          </editable-label>
          <v-btn absolute top right style="margin-top: 90px" outline color="grey lighten-1" to="/pilot"><v-icon>mdi-arrow-left</v-icon>&emsp;Return to Pilot Sheet</v-btn>
        </v-flex>
        <v-flex>
            <v-dialog lazy v-model="frameInfoModal" width="900">
              <v-btn slot="activator" large flat dark class="ml-0 pl-0 pb-0 mb-0">{{ frame.source }} {{ frame.name }}</v-btn>
              <v-card>
                <v-card-title primary-title class="title">{{frame.source}} {{frame.name}}</v-card-title>
                <v-card-text v-html="frame.description" />
                <v-divider />
                <v-card-actions>
                  <v-btn color="primary" flat @click="frameInfoModal = false" > Close </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex >
          <v-layout>
            <v-flex>
              <v-dialog lazy v-model="manufacturerModal">
                <v-btn slot="activator" flat dark>{{ item('Manufacturers', frame.source).name }} {{ frame.mechtype }} Mech</v-btn>
                <v-card>
                  <v-card-title primary-title class="title">{{ item('Manufacturers', frame.source).name }}</v-card-title>
                  <v-card-text v-html="item('Manufacturers', frame.source).description" />
                  <v-divider />
                  <v-card-actions>
                    <v-btn color="primary" flat @click="manufacturerModal = false" > Close </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-flex>
          </v-layout>
              <editable-textfield :description="'Configuration Notes'" :attr="`${configPath}.notes`" :initial="config.notes" dark :key="config.id"/>
          <v-layout class="mt-0"><span class="config-header mt-0">Licenses Required</span></v-layout>
          <v-layout>
            <v-flex>
              <v-tooltip top v-for="(l, index) in stats.required_licenses" :key="'req_' + index">
                <v-chip slot="activator" :color="l.missing ? 'deep-orange darken-4' : 'grey darken-1'" class="white--text" >
                  <v-avatar v-if="l.rank" :class="`${l.missing ? 'amber darken-3' : 'blue-grey darken-2'} font-weight-black title`"><span v-for="n in l.rank" :key="'ri_rnk_' + l.name + n">I</span></v-avatar >
                  {{l.name}}</v-chip>
                <span><span v-if="l.missing" class="font-weight-bold yellow--text">WARNING: MISSING LICENSE<br></span><b>{{l.name}} RANK {{l.rank}}</b><br><i>Required for:&nbsp;</i> {{l.items.join(', ')}}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex class="mr-3 ml-3 mt-1 mb-0">
          <v-alert type="warning" :value="stats.required_licenses.filter(x => x.missing).length" outline><b>WARNING: UNLICENSED COMPONENTS</b><br>Pilot is missing one or more licenses required for this configuration</v-alert>
            </v-flex>
          </v-layout><v-layout>
            <v-flex class="mr-3 ml-3 mt-0">
          <v-alert type="warning" :value="stats.used_sp > stats.sp" outline><b>WARNING: SYSTEM CAPACITY EXCEEDED</b><br>Configuration loadout exceeds available SP points (<b>{{stats.used_sp}} SP used</b>, {{stats.sp}} SP available)</v-alert>
            </v-flex>
          </v-layout>

        </v-flex>
        
        <v-flex class="ma-2">
          <div style="background-color: #757575">
            <v-img v-if="config.custom_img" :src="`file://${userDataPath}/img/frame/${config.custom_img}`" class="ml-2" max-height="55vh" contain/>
            <v-img v-else :src="getStaticPath(`img/frames/${config.frame_id}.png`)" class="ml-2" max-height="55vh" contain/>
            </div>
            <v-btn block outline small color="grey" @click="appearanceLoader = true; appearanceModal = true">Set Custom Image</v-btn>
          </v-flex>
          <v-dialog lazy v-model="appearanceModal" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>
              <v-toolbar fixed dense flat>
                <v-toolbar-title>Set Custom Image</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn icon large @click="appearanceModal = false; appearanceLoader = false"> <v-icon large>close</v-icon> </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-spacer class="mt-5" />
              <div v-if="appearanceLoader">
                <image-selector :preselect="config.custom_img" :default_img="getStaticPath(`img/frames/${config.frame_id}.png`)" @assign-img="setCustomImg" />
              </div>
              <v-layout justify-space-between>
                <v-flex xs1> &emsp; </v-flex>
                <v-flex xs1><v-btn color="primary" flat @click="appearanceModal = false; appearanceLoader = false">Confirm</v-btn></v-flex>
              </v-layout>
            </v-card>
          </v-dialog>
      </v-layout>

        <v-layout><span class="config-header">Mech Attributes<span style="float: right">SIZE {{frame.stats.size}} &emsp;</span></span></v-layout>
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
                    <span class="grey--text">STRUCTURE <b style="color: #F50057">{{stats.structure}}</b></span>
                    <v-rating v-model="stats.structure" :length="stats.structure" readonly large dense full-icon="blur_circular" color="pink accent-3"/>
                  </v-flex>
                  <v-flex>
                    <span class="grey--text"> &nbsp;HP <b class="white--text">{{stats.hp}}</b> &emsp; ARMOR <b style="color: #82B1FF">{{stats.armor}}</b></span>
                    <v-rating v-model="stats.hp" :length="stats.hp + stats.armor" readonly large dense empty-icon="brightness_7" full-icon="brightness_1" color="white"/>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
            <v-divider dark />
            <v-layout class="mb-4">
              <v-flex>
                <v-layout>
                  <v-flex shrink>
                    <span class="grey--text">REACTOR STRESS <b style="color: #FF3D00">{{stats.heatstress}}</b></span>
                    <v-rating v-model="stats.heatstress" :length="stats.heatstress" readonly large dense full-icon="blur_circular" color="deep-orange accent-3"/>
                  </v-flex>
                  <v-flex>
                    <span class="grey--text"> &nbsp;HEAT CAPACITY <b style="color: #FFCC80">{{stats.heatcap}}</b></span>
                    <v-rating v-model="stats.heatcap" :length="stats.heatcap" readonly large dense full-icon="brightness_1" color="orange lighten-3"/>
                  </v-flex>
                  <v-spacer />
                    <v-flex>
                    <span class="grey--text"> &nbsp;REPAIR CAPACITY <b style="color: #E0E0E0">{{stats.repcap}}</b></span>
                    <v-rating v-model="stats.repcap" :length="stats.repcap" readonly large dense full-icon="control_point" color="grey lighten-2"/>
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
              <v-card-text class="mt-0 pt-0 mb-0 pb-1"><p class="mb-1" v-html="frame.core_system.effect" /><tag v-for="t in frame.core_system.tags" :key="t" :id="t" :val="0" /></v-card-text>
            </v-card>
          </v-flex>
        </v-layout>

        <v-layout><span class="config-header">Mech Equipment</span></v-layout>
        <v-layout>
          <v-flex>
            <mech-loadout :config_id="config.id" :frame_id="config.frame_id" :stats="stats" @set-index="setActiveIndex" @deleted="fullReload"/>
          </v-flex>
        </v-layout>        

        <!-- <v-layout><span class="config-header">Combat Data</span></v-layout>
        <v-layout>
          <v-flex>vue-chartjs</v-flex>
        </v-layout> -->

      </v-container>

      <v-divider dark />
        <v-layout justify-space-around fill-height class="ml-5 pl-5 mt-4 mb-4">

          <v-flex xs3>
            <v-btn large color="cyan accent-3" flat dark @click="openPrintOptions(false)"><v-icon>print</v-icon> &nbsp; PRINT</v-btn>
          </v-flex>
          <v-dialog v-model="printWarningDialog" width="800">
            <v-card>
              <v-card-title class="title">// PRINT WARNING //</v-card-title>
              <v-card-text>
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
              <v-divider />
              <v-card-actions>
                <v-btn color="primary" flat @click="printWarningDialog = false" > Cancel </v-btn>
                <v-spacer />
                <v-btn color="warning" flat @click="openPrintOptions(true)" > Continue Anyway </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-flex xs3>
            <v-dialog v-model="exportDialog" width="500" >
                <v-btn slot="activator" color="cyan accent-3" large flat><v-icon>call_made</v-icon> &nbsp; EXPORT</v-btn>
                <v-card>
                  <v-card-title class="title">Export Configuration &mdash; {{config.name}}</v-card-title>
                  <v-card-text>
                    <v-btn large block flat color="primary" @click="exportConfig">Save to File</v-btn>
                    <br>
                    <v-btn large block flat color="primary" @click="copyConfig">Copy Configuration Data to Clipboard</v-btn>
                  </v-card-text>
                  <v-divider />
                  <v-card-actions>
                    <v-btn color="primary" flat @click="exportDialog = false" > Cancel </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <!-- Copy Success notification -->
              <v-snackbar v-model="snackbar" :timeout="5000" >
                <span v-html="notification" />
                <v-btn color="pink" flat @click="snackbar = false" > Close </v-btn>
              </v-snackbar>
          </v-flex>    
                
          <v-flex xs3>
            <v-btn slot="activator" color="cyan accent-3" large flat @click="cloneConfig"><v-icon>file_copy</v-icon> &nbsp; CLONE</v-btn>
          </v-flex>

          <v-flex xs3>
            <v-dialog v-model="deleteDialog" width="500" >
                <v-btn slot="activator" color="error" large flat><v-icon>delete</v-icon> &nbsp; DELETE</v-btn>
                <v-card>
                  <v-card-text>
                    Are you sure you want to delete the <b>{{config.name}}</b> configuration? This action cannot be undone
                  </v-card-text>
                  <v-divider />
                  <v-card-actions>
                    <v-btn color="primary"  flat @click="deleteDialog = false" > Cancel </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="deleteConfig" > Delete Configuration </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
          </v-flex>

        </v-layout>
   </div>

    <div v-else style="height: 95vh">
      <v-container style="height: 100%">
        <v-layout align-center justify-center row fill-height>
          <v-flex>
            <p class="grey--text text-xs-center display-2">NO CONFIGURATION LOADED</p>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script>
  import Stats from '@/logic/stats'
  import io from '@/store/data_io'

  import {EditableLabel, EditableTextfield, Tag} from '../UI'
  import StatblockItem from './StatblockItem'
  import TraitItem from './TraitItem'
  import MechLoadout from './LoadoutEditor/MechLoadout'
  import ImageSelector from './ImageSelector'

  export default {
    name: 'config-sheet',
    components: { EditableLabel, EditableTextfield, Tag, Stats, StatblockItem, TraitItem, MechLoadout, ImageSelector },
    data: () => ({
      activeLoadoutIdx: 0,
      frameInfoModal: false,
      manufacturerModal: false,
      appearanceModal: false,
      appearanceLoader: false,
      printWarningDialog: false,
      deleteDialog: false,
      exportDialog: false,
      snackbar: false,
      notification: '',
      loadoutForceReloadTrigger: 0
    }),
    methods: {
      item: function (itemType, id) {
        return this.$store.getters.getItemById(itemType, id)
      },
      setActiveIndex (idx) {
        this.activeLoadoutIdx = idx
      },
      fullReload () {
        this.$router.push('/config')
      },
      hasEmptyMounts: function () {
        var empty = false
        if (!this.config.loadouts.length) return true
        if (!this.config.loadouts[this.activeLoadoutIdx]) return true
        if (!this.config.loadouts[this.activeLoadoutIdx].mounts) return true
        if (!this.config.loadouts[this.activeLoadoutIdx].mounts.length) return true
        for (let i = 0; i < this.config.loadouts[this.activeLoadoutIdx].mounts.length; i++) {
          const m = this.config.loadouts[this.activeLoadoutIdx].mounts[i]
          if (m.mount_type.includes('/')) empty = m.weapons.length < 2
          else empty = !m.weapons.length
        }
        return empty
      },
      selectMechImg: function () {
        this.$refs.mechImg.showModal()
      },
      deleteConfig: function () {
        this.deleteDialog = false
        this.$store.dispatch('deleteConfig', this.config.id)
      },
      cloneConfig: function () {
        this.$store.dispatch('cloneConfig', JSON.parse(JSON.stringify(this.config)))
        this.notification = 'Configuration Duplicated'
        this.snackbar = true
      },
      exportConfig: function () {
        const { dialog } = require('electron').remote
        var path = dialog.showSaveDialog({
          defaultPath: this.config.name.toLowerCase().replace(/\W/g, ''),
          buttonLabel: 'Export Configuration'
        })
        io.saveFile(path + '.json', JSON.stringify(this.config), function (err) {
          if (err) {
            alert(`Error: COMP/CON could not save a file to ${path}`)
          }
        })
        this.exportDialog = false
        this.notification = 'Configuration Exported Successfully'
        this.snackbar = true
      },
      copyConfig: function () {
        const {clipboard} = require('electron')
        clipboard.writeText(JSON.stringify(this.config))
        this.exportDialog = false
        this.notification = 'Configuration Copied to Clipboard'
        this.snackbar = true
      },
      getStaticPath: function (path) {
        return `static/${path}`
      },
      setCustomImg: function (path) {
        this.appearanceModal = false
        this.appearanceLoader = false
        this.$store.dispatch('editConfig', {
          id: this.config.id,
          attr: `custom_img`,
          val: path
        })
      },
      openPrintOptions: function (override) {
        this.$store.dispatch('setPrintOptions', {
          config_id: this.config.id,
          loadout_index: this.activeLoadoutIdx
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
      }
    },
    computed: {
      config: function () {
        return this.$store.getters.getConfig
      },
      pilot: function () {
        return this.$store.getters.getPilot
      },
      configPath: function () {
        var idx = this.$store.getters.getConfigIndex(this.config.id)
        return `configs[${idx}]`
      },
      stats: function () {
        if (this.loadoutForceReloadTrigger) console.info('Equipment changed: recalculating config stats...')
        else console.info('Loadout changed: recalculating config stats...')
        return this.$store.getters.getMechStats(this.config.id, this.config.loadouts[this.activeLoadoutIdx])
      },
      frame: function () {
        return this.item('Frames', this.config.frame_id)
      }
    }
  }
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
