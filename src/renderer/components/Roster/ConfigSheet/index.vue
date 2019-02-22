<template>
  <div id="config-sheet" class="roster-content">
   <span class="float-right"><v-btn size="sm" variant="link" to="/pilot"><b-icon name='window-close'  scale="1.5"/></v-btn></span>
   <div v-if="config.name">
    <v-container fluid>
      <v-layout>
        <v-flex><editable-label :description="'Configuration Name'" :attr="`${configPath}.name`" :val="config.name" /></v-flex>
        <v-flex>{{ frame.name }}</v-flex>
        <v-btn v-b-modal.frameInfoModal>frame info</v-btn>
          <b-modal id="frameInfoModal" size="lg" :title="frame.name">
            <p v-html="frame.description" />
          </b-modal>
      </v-layout>
      <v-layout>
        <v-flex xs6>
          <v-layout>
            <v-btn v-b-modal.manuInfoModal>{{ item('Manufacturers', frame.source).name }}</v-btn>
              <b-modal id="manuInfoModal" size="xl" :title="item('Manufacturers', frame.source).name">
              <p v-html="item('Manufacturers', frame.source).description" />
              </b-modal>
            <v-flex>{{ frame.mechtype }} Mech</v-flex>
          </v-layout>
          <v-layout><span class="header">Licenses Required</span></v-layout>
          <v-layout>
            <v-flex>licenses required</v-flex>
          </v-layout>
          <v-layout><span class="header">Configuration Notes</span></v-layout>
            <v-layout>
              <editable-textfield :description="'Configuration Notes'" :attr="`${configPath}.notes`" :initial="config.notes" />
          </v-layout>
        </v-flex>
        
        <v-flex xs6>
          <b-img src="https://via.placeholder.com/800x500" fluid-grow />
        </v-flex>
      </v-layout>

        <v-layout><span class="header">Mech Attributes</span></v-layout>
        <v-layout>
          <v-flex xs1>
            <statblock-item :attr="'HULL'" :val="stats.hull" />
            <statblock-item :attr="'AGI'" :val="stats.agi" />
            <statblock-item :attr="'SYS'" :val="stats.sys" />
            <statblock-item :attr="'ENG'" :val="stats.eng" />
            <br>
            <statblock-item :attr="'SP'" :val="stats.sp" />
          </v-flex>
          <v-flex>
            <v-layout>
              <v-flex>
                <pip-bar :pip_width="15" :pip_height="35" :pips="[stats.structure, stats.hp, stats.armor]" :fills="['darkblue', 'cyan', 'white']" :borders="['cyan', 'blue', 'gray']" :label="`structure: ${stats.structure} // hp: ${stats.hp} // armor: ${stats.armor}`" :hover="'todo: list of item contributions'"/>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex>
                <pip-bar :pip_width="15" :pip_height="35" :pips="[stats.heatstress, stats.heatcap]" :fills="['red', 'orange']" :borders="['pink', 'yellow']" :label="`heat stress: ${stats.heatstress} // heat capacity: ${stats.heatcap}`" :hover="'todo: list of item contributions'"/>
              </v-flex>
              <v-flex>
                <pip-bar :pip_width="15" :pip_height="35" :pips="[stats.repcap]" :fills="['darkred']" :borders="['red']" :label="`Repair Capacity: ${stats.repcap}`" :hover="'todo: list of item contributions'"/>
              </v-flex>
            </v-layout>
            <hr>
            <v-layout>
              <statblock-item :attr="'Speed'" :val="stats.speed" />
              <statblock-item :attr="'Attack Bonus'" :val="'+' + stats.attack_bonus" />
              <statblock-item :attr="'Tech Attack'" :val="'+' + stats.tech_attack" />
            </v-layout>
            <v-layout>
              <statblock-item :attr="'Evasion'" :val="stats.evasion" />
              <statblock-item :attr="'E-Defense'" :val="stats.edef" />
              <statblock-item :attr="'Sensor Range'" :val="stats.sensor_range" />
            </v-layout>
          </v-flex>
        </v-layout>

        <v-layout><span class="header">Frame Traits</span></v-layout>
          <trait-item v-for="trait in frame.traits" :key="trait.name" :trait="trait" />

        <v-layout><span class="header">CORE System</span></v-layout>
        <v-layout>
          <v-flex>
            <b-card :title="frame.core_system.name">
              <p class="card-text" v-html="frame.core_system.description" />
              <h5>ACTIVE: {{frame.core_system.active_name}} </h5>
              <p class="card-text" v-html="frame.core_system.effect" />
              <p>todo: tags</p>
            </b-card>
          </v-flex>
        </v-layout>

        <v-layout><span class="header">Loadouts</span></v-layout>
        <v-layout>
          <v-flex>
            <mech-loadout :config_id="config.id" :max_sp="stats.sp" />
          </v-flex>
        </v-layout>        

        <v-layout><span class="header">Combat Data</span></v-layout>
        <v-layout>
          <v-flex>vue-chartjs</v-flex>
        </v-layout>

        <div class="spacer" />
      </v-container>

      <div class="spacer" />
      <v-container>
        <v-layout>
          <v-flex><v-btn block>print</v-btn></v-flex>
          <v-flex><v-btn block>export</v-btn></v-flex>
          <v-flex><v-btn block>clone</v-btn></v-flex>
          <v-flex><v-btn block>delete</v-btn></v-flex>
        </v-layout>
      <div class="spacer" />
      </v-container>
   </div>
   <div v-else>
     No configuration loaded
   </div>
  </div>
</template>

<script>
  import Stats from '@/logic/stats'
  import EditableLabel from '../UI/EditableLabel'
  import EditableTextfield from '../UI/EditableTextfield'
  // import ImageSelector from '../UI/ImageSelector'
  import PipBar from '../UI/PipBar'
  import StatblockItem from './StatblockItem'
  import TraitItem from './TraitItem'
  import MechLoadout from './MechLoadout'

  export default {
    name: 'config-sheet',
    components: { EditableLabel, EditableTextfield, PipBar, Stats, StatblockItem, TraitItem, MechLoadout },
    data: () => ({
      activeLoadoutIdx: 0
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
        if (!this.$parent.activeConfigId) return {}
        return this.$store.getters.getConfigById(this.$parent.activeConfigId)
      },
      pilot: function () {
        return this.$store.getters.getPilot
      },
      configPath: function () {
        var idx = this.$store.getters.getConfigIndex(this.$parent.activeConfigId)
        return `configs[${idx}]`
      },
      stats: function () {
        return this.$store.getters.getMechStats(this.$parent.activeConfigId, this.config.loadouts[this.activeLoadoutIdx])
      },
      frame: function () {
        return this.item('Frames', this.config.frame_id)
      }
    }
  }
</script>

<style scoped>
#config-sheet {
  background-color: lightgray;
  z-index: 2;
  overflow-y: scroll;
}

.header {
  background-color: slategrey;
  font-weight: bold;
  letter-spacing: 3px;
  width: 100%;
  padding-left: 5px;
  margin-top:10px;
  margin-bottom: 3px;
}

.spacer {
  padding-bottom: 5vh;
}

</style>
