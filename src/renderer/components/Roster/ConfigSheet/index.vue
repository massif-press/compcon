<template>
  <div id="config-sheet" class="roster-content">
   <div v-if="config.name">
    <v-container fluid>
      <v-layout align-end>
        <v-flex shrink>
          <editable-label dark :attr="`${configPath}.name`" description="Configuration Name" :placeholder="config.name">
            <span slot="label" class="display-2 white--text">{{config.name}}</span>
          </editable-label>
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
        <v-flex xs6>
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
              <editable-textfield :description="'Configuration Notes'" :attr="`${configPath}.notes`" :initial="config.notes" dark />
          <v-layout class="mt-0"><span class="config-header mt-0">Licenses Required</span></v-layout>
          <v-layout>
            <v-flex>TODO</v-flex>
          </v-layout>
        </v-flex>
        
        <v-flex xs6>
            <v-img :src="require(`@/assets/img/frames/${config.frame_id}.png`)" class="ma-2" />
          </v-flex>
      </v-layout>

        <v-layout><span class="config-header">Mech Attributes</span></v-layout>
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
              <statblock-item :attr="'Attack Bonus'" :val="'+' + stats.attack_bonus" />
              <statblock-item :attr="'Tech Attack'" :val="'+' + stats.tech_attack" />
              <statblock-item :attr="'Limited System Bonus'" :val="'+' + stats.limited_bonus" />
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
            <mech-loadout :config_id="config.id" :frame_id="config.frame_id" :max_sp="stats.sp" />
          </v-flex>
        </v-layout>        

        <!-- <v-layout><span class="config-header">Combat Data</span></v-layout>
        <v-layout>
          <v-flex>vue-chartjs</v-flex>
        </v-layout> -->

      </v-container>

      <v-divider dark />
        <v-layout justify-space-around fill-height class="ml-5 pl-5 mt-4 mb-4">

          <v-flex xs3><v-btn large flat dark disabled>print</v-btn></v-flex>   

          <v-flex xs3><v-btn large flat dark>export</v-btn></v-flex>

          <v-flex xs3><v-btn large flat dark>clone</v-btn></v-flex>

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
                    <v-btn color="error" @click="''" > Delete Configuration </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
          </v-flex>

        </v-layout>
   </div>
   <div v-else style="height: 100%">
      <v-container style="height: 100%">
        <v-layout align-center justify-center row fill-height>
          <v-flex height="100%">
            <p class="grey--text text-xs-center display-2">NO CONFIGURATION LOADED</p>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script>
  import Stats from '@/logic/stats'
  import {EditableLabel, EditableTextfield, Tag} from '../UI'
  import StatblockItem from './StatblockItem'
  import TraitItem from './TraitItem'
  import MechLoadout from './LoadoutEditor/MechLoadout'

  export default {
    name: 'config-sheet',
    components: { EditableLabel, EditableTextfield, Tag, Stats, StatblockItem, TraitItem, MechLoadout },
    data: () => ({
      activeLoadoutIdx: 0,
      frameInfoModal: false,
      manufacturerModal: false,
      deleteDialog: false
    }),
    methods: {
      item: function (itemType, id) {
        return this.$store.getters.getItemById(itemType, id)
      },
      selectMechImg: function () {
        this.$refs.mechImg.showModal()
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
