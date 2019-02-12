<template>
  <div class="roster-content">
    <div v-if="pilot.name">
      <b-container fluid id="test">
        <b-row>
          <b-col cols=10>
            <b-row>
              <b-col cols="auto">
                <editable-label :description="'Callsign'" :attr="'callsign'" :val="pilot.callsign" :id="pilot.id"/>
              </b-col>
              <b-col cols="auto">
                <editable-label :description="'Name'" :attr="'name'" :val="pilot.name" :id="pilot.id"/>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols=auto>
                <pip-bar :pip_width="12" :pip_height="20" :pips="[stats.hp, stats.armor]" :fills="['cyan', 'white']" :borders="['blue', 'gray']" :label="`hp: ${stats.hp} // armor: ${stats.armor}`" :hover="'todo: list of item contributions'" />
              </b-col>
                <b-col cols=auto>
                <pip-bar :pip_width="12" :pip_height="20" :pips="[stats.edef]" :fills="['green']" :borders="['lime']" :label="`e-defense: ${stats.edef}`" :hover="'todo: list of item contributions'"/>
                </b-col>
                <b-col cols=auto>
                <pip-bar :pip_width="12" :pip_height="20" :pips="[stats.evasion]" :fills="['green']" :borders="['lime']" :label="`evasion: ${stats.evasion}`" :hover="'todo: list of item contributions'"/>
                </b-col>
                <b-col cols=auto>
                <pip-bar :pip_width="12" :pip_height="20" :pips="[stats.speed]" :fills="['orange']" :borders="['darkred']" :label="`speed: ${stats.speed}`" :hover="'todo: list of item contributions'"/>
                </b-col>
            </b-row>
          </b-col>
          <b-col>
            <span>License Level {{pilot.level}}</span>
            <b-btn block :disabled="pilot.level > 11" variant="success">Level Up</b-btn>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols=8>
            <b-row>
              <b-col>
                <b-row><span class="header">Biography</span></b-row>
                <b-row>
                  <b-col cols=12 style="text-align:center">
                    <b> {{ item('Backgrounds', pilot.background).name }} </b>
                    <b-btn size="sm" variant="link" class="edit-btn" v-b-modal.PSbackgroundModal><v-icon name="edit" /></b-btn>
                  </b-col>
                  <!-- Background Selector Modal -->
                  <b-modal ref="PSbackgroundModal" id="PSbackgroundModal" size="xl" centered hide-footer
                  title="Change Pilot Background" >
                  <h5 style="text-align: center">Current Background: {{item('Backgrounds', pilot.background).name }}</h5>
                  <hr>
                    <background-selector @selected="backgroundSelect" />
                  </b-modal>
                </b-row>
                <editable-textfield :description="'History'" :attr="'history'" :val="pilot.history" :id="pilot.id"/>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-row><span class="header">Contacts</span></b-row>
                <div v-for="(contact, index) in pilot.contacts" :key="index + pilot.contacts.length">
                  <contact-item :index="index" :contact="contact" class="border rounded" style="padding: 10px; margin:10px" />
                </div>
                <b-row>
                  <b-col>
                    <b-btn @click="addContact()" class="float-right" variant="success" size="sm" style="margin:0px 10px" v-b-tooltip.hover title="Add Contact">
                      <v-icon name="plus" />
                    </b-btn>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>            
          </b-col>
          <b-col cols=4>
            <b-row><span class="header">Appearance</span></b-row>
            <b-row>
              <b-col>
                <image-selector-modal :title="'Select Pilot Image'" ref="appearanceImg">
                  <div class="hovereffect" @click="selectAppearanceImg()">
                    <b-img src="https://via.placeholder.com/400x500" fluid-grow />
                    <div class="overlay">
                      <p style="height:100%;"><a style="position: abosulte; right:25px; bottom: 20px">SELECT PILOT IMAGE</a></p>
                    </div>
                  </div>
                </image-selector-modal>
              </b-col>
            </b-row>
            <b-row>
              <b-col><editable-textfield :description="'Appearance Notes'" :attr="'text_appearance'" :val="pilot.text_appearance" :id="pilot.id"/></b-col>
            </b-row>
          </b-col>      
        </b-row>
      <b-row>
        <b-col cols=1>
          <b-row><span class="header">Grit</span></b-row>
          <b-row align-h="center">
            <b-col align-self="center"><h1>+{{stats.grit}}</h1></b-col>
          </b-row>
        </b-col>
        <b-col>
          <b-row><span class="header">Skill Triggers<b-btn size="sm" variant="link" class="edit-btn" v-b-modal.PSskillsModal><v-icon name="edit" /></b-btn></span>
            <!-- Skill Selector Modal -->
            <b-modal ref="PSskillsModal" id="PSskillsModal" size="xl" centered hide-footer title="Pilot Skills" >
              <skill-selector :pilotSkills="pilot.skills" :pilotLevel="pilot.level" @set-skills="setPilotSkills"/>
            </b-modal>          
          
          </b-row>
          <div v-for="skill in pilot.skills" :key="skill.id">
            <skill-item :skillData="item('Skills', skill.id)" :skill="skill" />
          </div>
        </b-col>
      </b-row>
      <b-row><span class="header">Licenses<b-btn size="sm" variant="link" class="edit-btn"><v-icon name="edit" /></b-btn></span></b-row>
      <div v-for="(license, index) in pilot.licenses" :key="index">
        <license-item :license="license" :licenseData="getLicense(license.name)" />
      </div>
      <b-row><span class="header">Talents<b-btn size="sm" variant="link" class="edit-btn"><v-icon name="edit" /></b-btn></span></b-row>
        <div v-for="talent in pilot.talents" :key="talent.id">
          <talent-item :talent="talent" :talentData="item('Talents', talent.id)"/>
        </div>
      <b-row><span class="header">Mech Skills<b-btn size="sm" variant="link" class="edit-btn"><v-icon name="edit" /></b-btn></span></b-row>
      <b-row align-content="center">
        <b-col cols=3>
          <pip-bar :pip_width="16" :pip_height="35" :pips="[stats.mech.hull, (12 - stats.mech.hull)]" :fills="['blue', 'gray']" :borders="['cyan', 'black']" :label="`HULL: ${stats.mech.hull}`" />
        </b-col>
        <b-col cols=3>
          <pip-bar :pip_width="16" :pip_height="35" :pips="[stats.mech.agi, (12 - stats.mech.agi)]" :fills="['blue', 'gray']" :borders="['cyan', 'black']" :label="`AGILITY: ${stats.mech.agi}`" />
        </b-col>
        <b-col cols=3>
          <pip-bar :pip_width="16" :pip_height="35" :pips="[stats.mech.sys, (12 - stats.mech.sys)]" :fills="['blue', 'gray']" :borders="['cyan', 'black']" :label="`SYSTEMS: ${stats.mech.sys}`" />
        </b-col>
        <b-col cols=3>
          <pip-bar :pip_width="16" :pip_height="35" :pips="[stats.mech.eng, (12 - stats.mech.eng)]" :fills="['blue', 'gray']" :borders="['cyan', 'black']" :label="`ENGINEERING: ${stats.mech.eng}`" />
        </b-col>
      </b-row>
      <b-row><span class="header">CORE Bonuses<b-btn size="sm" variant="link" class="edit-btn"><v-icon name="edit" /></b-btn></span></b-row>
      <div v-for="cb in pilot.core_bonuses" :key="cb">
        <cb-item :cb="item('CoreBonuses', cb)" />
      </div>
      <b-row><span class="header">Pilot Gear Loadout</span></b-row>
      <b-row>
        <b-col>
          <pilot-loadout />
        </b-col>
      </b-row>
      <b-row><span class="header">Notes</span></b-row>      
      <b-row>
        <b-col><editable-textfield :description="'Pilot Notes'" :attr="'notes'" :val="pilot.notes" :id="pilot.id"/></b-col>
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
      no pilot loaded
    </div>
  </div>
</template>

<script>
  import Stats from '@/logic/stats'
  import EditableLabel from '../UI/EditableLabel'
  import EditableTextfield from '../UI/EditableTextfield'
  import PipBar from '../UI/PipBar'
  import ImageSelector from '../UI/ImageSelector'
  import Contact from './Contact'
  import LicenseItem from './LicenseItem'
  import SkillItem from './SkillItem'
  import TalentItem from './TalentItem'
  import CoreBonusItem from './CoreBonusItem'
  import PilotLoadout from './LoadoutEditor/PilotLoadout'
  import BackgroundSelector from './Selectors/BackgroundSelector'
  import SkillSelector from './Selectors/SkillSelector'

  export default {
    name: 'pilot-sheet',
    components: {
      EditableLabel,
      EditableTextfield,
      PipBar,
      LicenseItem,
      SkillItem,
      TalentItem,
      PilotLoadout,
      'cb-item': CoreBonusItem,
      'image-selector-modal': ImageSelector,
      'contact-item': Contact,
      BackgroundSelector,
      SkillSelector
    },
    data: () => ({
      contactKey: 0,
      activeLoadoutIdx: 0,
      loadoutForceReloadTrigger: 0
    }),
    methods: {
      addContact: function () {
        this.$store.dispatch('editPilot', {
          attr: `contacts[${this.pilot.contacts.length}]`,
          val: {name: 'New Contact (click to edit)', relationship: 'Edit Relationship', description: 'Edit Description'}
        })
        this.$forceUpdate()
      },
      selectAppearanceImg: function () {
        this.$refs.appearanceImg.showModal()
      },
      item: function (type, id) {
        return this.$store.getters.getItemById(type, id)
      },
      getLicense: function (name) {
        return this.$store.getters.getLicenseByName(name.toLowerCase())
      },
      backgroundSelect: function (bgReturn) {
        this.$refs.PSbackgroundModal.hide()
        this.$store.dispatch('editPilot', {
          attr: `background`,
          val: bgReturn.value
        })
      },
      setPilotSkills: function (skillArray) {
        this.$refs.PSskillsModal.hide()
        this.$store.dispatch('editPilot', {
          attr: `skills`,
          val: skillArray
        })
        this.$forceUpdate()
      }
    },
    computed: {
      pilot: function () {
        return this.$store.getters.getPilot
      },
      stats: function () {
        if (this.loadoutForceReloadTrigger) console.info('Equipment changed: recalculating pilot stats...')
        else console.info('Loadout changed: recalculating pilot stats...')
        return Stats.pilotStats(this.pilot, this.pilot.loadouts[this.activeLoadoutIdx])
      }
    }
  }
</script>

<style scoped>
#test {
  background-color:lightskyblue;
}

.spacer {
  padding-bottom: 5vh;
}

.header {
  background-color: cadetblue;
  font-weight: bold;
  letter-spacing: 3px;
  width: 100%;
  padding-left: 5px;
  margin-top:10px;
  margin-bottom: 3px;
}

.edit-btn {
  position: relative;
  margin-left: -10px;
  fill-opacity: 0.5;
  cursor: pointer;
  transition: 0.3s all;
}

.edit-btn:hover {
  fill-opacity: 1;
  transition: 0.3s all;
}
</style>

<style>


.notch20 {
  --notchSize: 20px;
  
  clip-path: 
    polygon(
      0% 0%, 
      0% 0%, 
      calc(100% - var(--notchSize)) 0%, 
      100% var(--notchSize), 
      100% 100%, 
      calc(100% - var(--notchSize)) 100%, 
      var(--notchSize) 100%, 
      0% calc(100% - var(--notchSize))
    );
}

.notch8 {
  --notchSize: 8px;
  
  clip-path: 
    polygon(
      0% 0%, 
      0% 0%, 
      calc(100% - var(--notchSize)) 0%, 
      100% var(--notchSize), 
      100% 100%, 
      calc(100% - var(--notchSize)) 100%, 
      var(--notchSize) 100%, 
      0% calc(100% - var(--notchSize))
    );
}

.hovereffect {
  width: 100%;
  height: 100%;
  float: left;
  overflow: hidden;
  position: relative;
  text-align: center;
  cursor: pointer;
  background: linear-gradient(45deg, #ff89e9 0%,#05abe0 100%);
}

.hovereffect .overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
  top: 0;
  left: 0;
  padding: 3em;
  text-align: left;
}

.hovereffect img {
  display: block;
  position: relative;
  max-width: none;
  width: calc(100% + 60px);
  transition: opacity 0.35s, transform 0.45s;
}

.hovereffect h2 {
  text-transform: uppercase;
  color: #fff;
  position: relative;
  font-size: 17px;
  background-color: transparent;
  padding: 15% 0 10px 0;
  text-align: left;
}

.hovereffect .overlay:before {
  position: absolute;
  top: 20px;
  right: 20px;
  bottom: 20px;
  left: 20px;
  border: 1px solid #fff;
  content: '';
  opacity: 0;
  filter: alpha(opacity=0);
  transition: opacity 0.35s, transform 0.45s;
}

.hovereffect a, .hovereffect p {
  color: #FFF;
  opacity: 0;
  filter: alpha(opacity=0);
  transition: opacity 0.35s, transform 0.45s;
}

.hovereffect:hover img {
  opacity: 0.6;
  filter: alpha(opacity=60);
}

.hovereffect:hover .overlay:before,
.hovereffect:hover a, .hovereffect:hover p {
  opacity: 1;
  filter: alpha(opacity=100);
}


</style>
