<template>
  <div id="config-sheet" :class="{expanded: open, collapsed : !open}">
   <span class="float-right"><b-btn size="sm" variant="link" @click="close()"><v-icon name='window-close'  scale="1.5"/></b-btn></span>
   <div v-if="config.name">
    <b-container fluid>
      <b-row>
        <b-col><editable-label :description="'Configuration Name'" :attr="`${configPath}.name`" :val="config.name" :id="config.pilot_id"/></b-col>
        <b-col>{{ frame.name }}</b-col>
        <b-btn v-b-modal.frameInfoModal>frame info</b-btn>
          <b-modal id="frameInfoModal" size="lg" :title="frame.name">
            <p v-html="frame.description" />
          </b-modal>
      </b-row>
      <b-row>
        <b-col cols=6>
          <b-row>
            <b-btn v-b-modal.manuInfoModal>{{ item('Manufacturers', frame.source).name }}</b-btn>
              <b-modal id="manuInfoModal" size="xl" :title="item('Manufacturers', frame.source).name">
              <p v-html="item('Manufacturers', frame.source).description" />
              </b-modal>
            <b-col>{{ frame.mechtype }} Mech</b-col>
          </b-row>
          <b-row><span class="header">Licenses Required</span></b-row>
          <b-row>
            <b-col>licenses required</b-col>
          </b-row>
          <b-row><span class="header">Configuration Notes</span></b-row>
            <b-row>
            <b-col><editable-textfield :description="'Configuration Notes'" :attr="`${configPath}.notes`" :val="config.notes" :id="config.pilot_id"/></b-col>
          </b-row>
        </b-col>
        
        <b-col cols=6>
          <image-selector-modal :title="'Select Mech Image'" ref="mechImg">
            <div class="hovereffect" @click="selectMechImg()">
              <b-img src="https://via.placeholder.com/800x500" fluid-grow />
              <div class="overlay">
                <p style="height:100%;"><a style="position: abosulte; right:25px; bottom: 20px">SELECT MECH IMAGE</a></p>
              </div>
            </div>
          </image-selector-modal>
        </b-col>
      </b-row>

        <b-row><span class="header">Mech Attributes</span></b-row>
        <b-row>
          <b-col cols=1>
            <statblock-item :attr="'HULL'" :val="stats.hull" />
            <statblock-item :attr="'AGI'" :val="stats.agi" />
            <statblock-item :attr="'SYS'" :val="stats.sys" />
            <statblock-item :attr="'ENG'" :val="stats.eng" />
            <br>
            <statblock-item :attr="'SP'" :val="stats.sp" />
          </b-col>
          <b-col>
            <b-row>
              <b-col>
                <pip-bar :pip_width="15" :pip_height="35" :pips="[stats.structure, stats.hp, stats.armor]" :fills="['darkblue', 'cyan', 'white']" :borders="['cyan', 'blue', 'gray']" :label="`structure: ${stats.structure} // hp: ${stats.hp} // armor: ${stats.armor}`" :hover="'todo: list of item contributions'"/>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <pip-bar :pip_width="15" :pip_height="35" :pips="[stats.heatstress, stats.heatcap]" :fills="['red', 'orange']" :borders="['pink', 'yellow']" :label="`heat stress: ${stats.heatstress} // heat capacity: ${stats.heatcap}`" :hover="'todo: list of item contributions'"/>
              </b-col>
              <b-col>
                <pip-bar :pip_width="15" :pip_height="35" :pips="[stats.repcap]" :fills="['darkred']" :borders="['red']" :label="`Repair Capacity: ${stats.repcap}`" :hover="'todo: list of item contributions'"/>
              </b-col>
            </b-row>
            <hr>
            <b-row>
              <statblock-item :attr="'Speed'" :val="stats.speed" />
              <statblock-item :attr="'Attack Bonus'" :val="'+' + stats.attack_bonus" />
              <statblock-item :attr="'Tech Attack'" :val="'+' + stats.tech_attack" />
            </b-row>
            <b-row>
              <statblock-item :attr="'Evasion'" :val="stats.evasion" />
              <statblock-item :attr="'E-Defense'" :val="stats.edef" />
              <statblock-item :attr="'Sensor Range'" :val="stats.sensor_range" />
            </b-row>
          </b-col>
        </b-row>

        <b-row><span class="header">Frame Traits</span></b-row>
          <trait-item v-for="trait in frame.traits" :key="trait.name" :trait="trait" />

        <b-row><span class="header">CORE System</span></b-row>
        <b-row>
          <b-col>
            <b-card :title="frame.core_system.name">
              <p class="card-text" v-html="frame.core_system.description" />
              <h5>ACTIVE: {{frame.core_system.active_name}} </h5>
              <p class="card-text" v-html="frame.core_system.effect" />
              <p>todo: tags</p>
            </b-card>
          </b-col>
        </b-row>

        <b-row><span class="header">Loadouts</span></b-row>
        <b-row>
          <b-col>
            <mech-loadout :config_id="config.id" />
          </b-col>
        </b-row>        

        <b-row><span class="header">Combat Data</span></b-row>
        <b-row>
          <b-col>vue-chartjs</b-col>
        </b-row>

        <div class="spacer" />
      </b-container>

      <div class="spacer" />
      <b-container>
        <b-row>
          <b-col><b-button block>print</b-button></b-col>
          <b-col><b-button block>export</b-button></b-col>
          <b-col><b-button block>clone</b-button></b-col>
          <b-col><b-button block>delete</b-button></b-col>
        </b-row>
      <div class="spacer" />
      </b-container>
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
  import ImageSelector from '../UI/ImageSelector'
  import PipBar from '../UI/PipBar'
  import StatblockItem from './StatblockItem'
  import TraitItem from './TraitItem'
  import MechLoadout from './MechLoadout'

  export default {
    name: 'config-sheet',
    components: { EditableLabel, EditableTextfield, 'image-selector-modal': ImageSelector, PipBar, Stats, StatblockItem, TraitItem, MechLoadout },
    data: () => ({
      activeLoadoutIdx: 0
    }),
    methods: {
      close: function () {
        this.$parent.toggleConfigSheet(false)
      },
      item: function (itemType, id) {
        return this.$store.getters.getItemById(itemType, id)
      },
      selectMechImg: function () {
        this.$refs.mechImg.showModal()
      }
    },
    computed: {
      open: function () {
        return this.$parent.configOpen
      },
      config: function () {
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
        console.log(this.item('Frames', this.config.frame_id))
        return this.item('Frames', this.config.frame_id)
      }
    }
  }
</script>

<style scoped>
#config-sheet {
  height: 93vh;
  width: 94vw;
  background-color: lightgray;
  position: absolute;
  top:7.25vh;
  z-index: 2;
  transition: all .6s cubic-bezier(.13,.31,0,1.02);
  overflow-y: scroll;
}

#config-sheet.expanded {
  right: 0;
}

#config-sheet.collapsed {
  right: -95vw;
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
