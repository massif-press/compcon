<template>
  <div class="roster-content">
    <div v-if="pilot.name">
      <v-container fluid>
        <v-layout>
          <v-flex xs10>
            <v-layout>
              <v-flex>
                <editable-label :description="'Callsign'" :attr="'callsign'" :val="pilot.callsign" :id="pilot.id"/>
              </v-flex>
              <v-flex>
                <editable-label :description="'Name'" :attr="'name'" :val="pilot.name" :id="pilot.id"/>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex>
                <pip-bar :pip_width="12" :pip_height="20" :pips="[stats.hp, stats.armor]" :fills="['darkblue', 'gray']" :borders="['black', 'black']" :label="`hp: ${stats.hp} // armor: ${stats.armor}`" :hover="'todo: list of item contributions'" />
              </v-flex>
                <v-flex>
                <pip-bar :pip_width="12" :pip_height="20" :pips="[stats.edef]" :fills="['darkblue']" :borders="['black']" :label="`e-defense: ${stats.edef}`" :hover="'todo: list of item contributions'"/>
                </v-flex>
                <v-flex>
                <pip-bar :pip_width="12" :pip_height="20" :pips="[stats.evasion]" :fills="['darkblue']" :borders="['black']" :label="`evasion: ${stats.evasion}`" :hover="'todo: list of item contributions'"/>
                </v-flex>
                <v-flex>
                <pip-bar :pip_width="12" :pip_height="20" :pips="[stats.speed]" :fills="['darkblue']" :borders="['black']" :label="`speed: ${stats.speed}`" :hover="'todo: list of item contributions'"/>
                </v-flex>
            </v-layout>
          </v-flex>
          <v-flex>
            <span>License Level {{pilot.level}}</span>
            <v-btn block :disabled="pilot.level > 11" variant="success">Level Up</v-btn>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs8>
            <v-layout>
              <v-flex>
                <v-layout><span class="header no-icon">Biography</span></v-layout>
                <v-layout>
                  <v-flex xs12 style="text-align:center">
                    <b> {{ item('Backgrounds', pilot.background).name }} </b>
                    <v-dialog v-model="backgroundModal" fullscreen hide-overlay transition="dialog-bottom-transition">
                      <v-btn slot="activator" class="edit-btn" small flat icon color="blue">
                        <v-icon small>edit</v-icon>
                      </v-btn>
                      <v-card>
                        <v-toolbar fixed dense>
                          <v-toolbar-title>Select Pilot Background</v-toolbar-title>
                          <v-spacer></v-spacer>
                          <v-toolbar-items>
                            <v-btn icon large @click="backgroundModal = false"> <v-icon large>close</v-icon> </v-btn>
                          </v-toolbar-items>
                        </v-toolbar>
                        <v-spacer></v-spacer>
                        <background-selector @selected="backgroundSelect" :preSelected="pilot.background"/>
                      </v-card>
                    </v-dialog>
                  </v-flex>
                </v-layout>
                <editable-textfield :description="'History'" :attr="'history'" :val="pilot.history" :id="pilot.id"/>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex>
                <v-layout><span class="header no-icon">Contacts</span></v-layout>
                <contacts-list :contacts="pilot.contacts" @add-contact="refresh" :key="pilot.contacts.length" />
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs4>
            <v-layout><span class="header no-icon">Appearance</span></v-layout>
            <v-layout>
              <v-flex class="pl-2">
                <image-selector-modal :title="'Select Pilot Image'" ref="appearanceImg">
                  <div class="hovereffect" @click="selectAppearanceImg()">
                    <b-img src="https://via.placeholder.com/400x500" fluid-grow />
                    <div class="overlay">
                      <p style="height:100%;"><a style="position: abosulte; right:25px; bottom: 20px">SELECT PILOT IMAGE</a></p>
                    </div>
                  </div>
                </image-selector-modal>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex class="pl-2"><editable-textfield :description="'Appearance Notes'" :attr="'text_appearance'" :val="pilot.text_appearance" :id="pilot.id"/></v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      <v-layout>
        <v-flex xs1>
          <v-layout><span class="header no-icon">Grit</span></v-layout>
          <v-layout align-h="center">
            <v-flex align-self="center"><h1>+{{stats.grit}}</h1></v-flex>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-layout>
            <span class="header">
              Skill Triggers
              <v-dialog v-model="skillModal" fullscreen hide-overlay transition="dialog-bottom-transition">
                <v-btn slot="activator" class="edit-btn" small flat icon color="blue darken-2">
                  <v-icon small>edit</v-icon>
                </v-btn>
                <v-card>
                  <v-toolbar fixed dense>
                    <v-toolbar-title>Edit Pilot Skills</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                      <v-btn icon large @click="skillModal = false"> <v-icon large>close</v-icon> </v-btn>
                    </v-toolbar-items>
                  </v-toolbar>
                  <v-spacer></v-spacer>
                  <skill-selector :pilotSkills="pilot.skills" :pilotLevel="pilot.level" @set-skills="setPilotSkills"/>
                </v-card>
              </v-dialog>
            </span>
          </v-layout>
          <div v-for="skill in pilot.skills" :key="skill.id">
            <skill-item :skillData="item('Skills', skill.id)" :skill="skill" />
          </div>
        </v-flex>
      </v-layout>
      <v-layout>
        <span class="header">Licenses
          <v-btn class="edit-btn" small flat icon color="blue darken-2">
            <v-icon small>edit</v-icon>
          </v-btn>
        </span>
      </v-layout>
      <div v-for="(license, index) in pilot.licenses" :key="index">
        <license-item :license="license" :licenseData="getLicense(license.name)" />
      </div>
      <v-layout>
        <span class="header">Talents
          <v-dialog v-model="talentModal" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-btn slot="activator" class="edit-btn" small flat icon color="blue darken-2">
              <v-icon small>edit</v-icon>
            </v-btn>
            <v-card>
              <v-toolbar fixed dense>
                <v-toolbar-title>Edit Pilot Talents</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn icon large @click="talentModal = false"> <v-icon large>close</v-icon> </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-spacer></v-spacer>
              <talent-selector :pilotTalents="pilot.talents" :pilotLevel="pilot.level" />
            </v-card>
          </v-dialog>
        </span>
      </v-layout>
      <v-expansion-panel>
        <talent-item v-for="talent in pilot.talents" :key="talent.id" :talent="talent" :talentData="item('Talents', talent.id)"/>
      </v-expansion-panel>
      <v-layout>
        <span class="header">Mech Skills
          <v-btn class="edit-btn" small flat icon color="blue darken-2">
            <v-icon small>edit</v-icon>
          </v-btn>
        </span>
      </v-layout>
      <v-layout>
        <v-flex xs3>
          <pip-bar :pip_width="16" :pip_height="35" :pips="[stats.mech.hull, (12 - stats.mech.hull)]" :fills="['darkblue', 'lightgray']" :borders="['black', 'gray']" :label="`HULL: ${stats.mech.hull}`" />
        </v-flex>
        <v-flex xs3>
          <pip-bar :pip_width="16" :pip_height="35" :pips="[stats.mech.agi, (12 - stats.mech.agi)]" :fills="['darkblue', 'lightgray']" :borders="['black', 'gray']" :label="`AGILITY: ${stats.mech.agi}`" />
        </v-flex>
        <v-flex xs3>
          <pip-bar :pip_width="16" :pip_height="35" :pips="[stats.mech.sys, (12 - stats.mech.sys)]" :fills="['darkblue', 'lightgray']" :borders="['black', 'gray']" :label="`SYSTEMS: ${stats.mech.sys}`" />
        </v-flex>
        <v-flex xs3>
          <pip-bar :pip_width="16" :pip_height="35" :pips="[stats.mech.eng, (12 - stats.mech.eng)]" :fills="['darkblue', 'lightgray']" :borders="['black', 'gray']" :label="`ENGINEERING: ${stats.mech.eng}`" />
        </v-flex>
      </v-layout>
      <v-layout>
        <span class="header">CORE Bonuses
          <v-btn class="edit-btn" small flat icon color="blue darken-2">
            <v-icon small>edit</v-icon>
          </v-btn>
        </span>
      </v-layout>      <div v-for="cb in pilot.core_bonuses" :key="cb">
        <cb-item :cb="item('CoreBonuses', cb)" />
      </div>
      <v-layout><span class="header no-icon">Pilot Gear</span></v-layout>
      <v-layout>
        <v-flex>
          <pilot-loadout />
        </v-flex>
      </v-layout>
      <v-layout><span class="header no-icon">Notes</span></v-layout>
      <v-layout>
        <v-flex><editable-textfield :description="'Pilot Notes'" :attr="'notes'" :val="pilot.notes" :id="pilot.id"/></v-flex>
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
  import ContactsList from './ContactsList'
  import LicenseItem from './LicenseItem'
  import SkillItem from './SkillItem'
  import TalentItem from './TalentItem'
  import CoreBonusItem from './CoreBonusItem'
  import PilotLoadout from './LoadoutEditor/PilotLoadout'
  import BackgroundSelector from './Selectors/BackgroundSelector'
  import SkillSelector from './Selectors/SkillSelector'
  import TalentSelector from './Selectors/TalentSelector'

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
      ContactsList,
      BackgroundSelector,
      SkillSelector,
      TalentSelector
    },
    data: () => ({
      backgroundModal: false,
      appearanceModal: false,
      skillModal: false,
      licenseModal: false,
      talentModal: false,
      mechSkillModal: false,
      pilotGearModal: false,
      contactKey: 0,
      activeLoadoutIdx: 0,
      loadoutForceReloadTrigger: 0
    }),
    methods: {
      refresh: function () {
        console.log('refreshing')
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
        this.backgroundModal = false
        this.$store.dispatch('editPilot', {
          attr: `background`,
          val: bgReturn.value
        })
      },
      setPilotSkills: function (skillArray) {
        this.skillModal = false
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
.spacer {
  padding-bottom: 5vh;
}

.header {
  background-color: lightgray;
  font-weight: bold;
  letter-spacing: 3px;
  width: 100%;
  padding-left: 10px;
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

.no-icon {
  height:40px;
  padding-top:8px
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
