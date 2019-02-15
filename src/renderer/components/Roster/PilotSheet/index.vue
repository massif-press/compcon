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
                  <span class="caption">HP {{stats.hp}} // ARMOR {{stats.armor}}</span>
                  <v-rating v-model="stats.hp" hover x-large :length="stats.hp + stats.armor" readonly small dense empty-icon="brightness_7" full-icon="brightness_1"/>
              </v-flex>
                <v-flex>
                  <span class="caption">E-DEFENSE {{stats.edef}}</span>
                  <v-rating v-model="stats.edef" hover x-large :length="stats.edef" readonly small dense empty-icon="brightness_7" full-icon="brightness_1"/>
                </v-flex>
                <v-flex>
                  <span class="caption">EVASION {{stats.evasion}}</span>
                  <v-rating v-model="stats.evasion" hover x-large :length="stats.evasion" readonly small dense empty-icon="brightness_7" full-icon="brightness_1"/>
                </v-flex>
                <v-flex>
                  <span class="caption">SPEED {{stats.speed}}</span>
                  <v-rating v-model="stats.speed" hover x-large :length="stats.speed" readonly small dense empty-icon="brightness_7" full-icon="brightness_1"/>
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
                    <v-dialog lazy v-model="backgroundModal" fullscreen hide-overlay transition="dialog-bottom-transition">
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
          <v-layout align-center justify-center column fill-height>
            <v-flex><span class="display-3 font-weight-black text-xs-center">+{{stats.grit}}</span></v-flex>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-layout>
            <span class="header">
              Skill Triggers
              <v-dialog lazy v-model="skillModal" fullscreen hide-overlay transition="dialog-bottom-transition">
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
          <v-dialog lazy v-model="talentModal" fullscreen hide-overlay transition="dialog-bottom-transition">
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
              <talent-selector :pilotTalents="pilot.talents" :pilotLevel="pilot.level" @set-talents="setPilotTalents"/>
            </v-card>
          </v-dialog>
        </span>
      </v-layout>
      <v-expansion-panel focusable>
        <talent-item v-for="talent in pilot.talents" :key="talent.id" :talent="talent" :talentData="item('Talents', talent.id)"/>
      </v-expansion-panel>
      <v-layout>
        <span class="header">Mech Skills
          <v-dialog lazy v-model="mechSkillModal" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-btn slot="activator" class="edit-btn" small flat icon color="blue darken-2">
              <v-icon small>edit</v-icon>
            </v-btn>
            <v-card>
              <v-toolbar fixed dense>
                <v-toolbar-title>Edit Mech Skills</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn icon large @click="mechSkillModal = false"> <v-icon large>close</v-icon> </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-spacer></v-spacer>
              <mech-skills-selector :mechSkills="pilot.mechSkills" :pilotLevel="pilot.level" :isActivePilot="true" />
              <v-layout justify-space-between>
                <v-flex xs1> &emsp; </v-flex>
                <v-flex xs1><v-btn color="primary" flat @click="mechSkillModal = false">Confirm</v-btn></v-flex>
              </v-layout>
            </v-card>
          </v-dialog>
        </span>
      </v-layout>
      <v-layout center justify-space-around class="pl-5">
        <v-flex>
          HULL <span class="grey--text">({{pilot.mechSkills.hull}})</span>
          <v-rating v-model="pilot.mechSkills.hull" hover x-large length=6 readonly dense empty-icon="radio_button_unchecked" full-icon="brightness_1"/>
        </v-flex>
        <v-flex xs3>
          AGILITY <span class="grey--text">({{pilot.mechSkills.agi}})</span>
          <v-rating v-model="pilot.mechSkills.agi" hover x-large length=6 readonly dense empty-icon="radio_button_unchecked" full-icon="brightness_1"/>
        </v-flex>
        <v-flex xs3>
          SYSTEMS <span class="grey--text">({{pilot.mechSkills.sys}})</span>
          <v-rating v-model="pilot.mechSkills.sys" hover x-large length=6 readonly dense empty-icon="radio_button_unchecked" full-icon="brightness_1"/>
        </v-flex>
        <v-flex xs3>
          ENGINEERING <span class="grey--text">({{pilot.mechSkills.eng}})</span>
          <v-rating v-model="pilot.mechSkills.eng" hover x-large length=6 readonly dense empty-icon="radio_button_unchecked" full-icon="brightness_1"/>
        </v-flex>
      </v-layout>
      <v-layout>
        <span class="header">CORE Bonuses
          <v-dialog lazy v-model="bonusModal" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-btn slot="activator" class="edit-btn" small flat icon color="blue darken-2">
              <v-icon small>edit</v-icon>
            </v-btn>
            <v-card>
              <v-toolbar fixed dense>
                <v-toolbar-title>Edit CORE Bonuses</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn icon large @click="bonusModal = false"> <v-icon large>close</v-icon> </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-spacer></v-spacer>
              <core-bonus-selector :pilotBonuses="pilot.core_bonuses" :pilotLevel="pilot.level" :pilotLicenses="pilot.licenses" @set-bonuses="setPilotBonuses"/>
            </v-card>
          </v-dialog>
        </span>
      </v-layout>      
      <div v-for="cb in pilot.core_bonuses" :key="cb">
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
  import MechSkillsSelector from './Selectors/MechSkillsSelector'
  import CoreBonusSelector from './Selectors/CoreBonusSelector'

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
      TalentSelector,
      MechSkillsSelector,
      CoreBonusSelector
    },
    data: () => ({
      backgroundModal: false,
      appearanceModal: false,
      skillModal: false,
      licenseModal: false,
      talentModal: false,
      mechSkillModal: false,
      bonusModal: false,
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
      },
      setPilotTalents: function (talentArray) {
        this.talentModal = false
        this.$store.dispatch('editPilot', {
          attr: `talents`,
          val: talentArray
        })
        this.$forceUpdate()
      },
      setPilotBonuses: function (bonusArray) {
        this.bonusModal = false
        this.$store.dispatch('editPilot', {
          attr: `core_bonuses`,
          val: bonusArray
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
