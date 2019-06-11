<template>
  <div class="roster-content">
    <div v-if="pilot.Name">
      <v-tooltip bottom>
        <v-toolbar
          slot="activator"
          dense
          :color="pilot.IsActive ? 'info' : 'grey lighten-3'"
          :dark="pilot.IsActive"
          class="ml-1"
        >
          <v-divider />
          <v-toolbar-title class="text-uppercase font-weight-light">
            <span style="letter-spacing: 15px; font-size: 1.75em">
              Pilot {{ pilot.IsActive ? 'Active' : 'Inactive' }}
            </span>
          </v-toolbar-title>
          <v-divider />
          <v-toolbar-items class="hidden-sm-and-down">
            <v-btn large icon class="ma-0 ml-2" @click="activatePilot">
              <v-icon
                large
                :color="pilot.IsActive ? 'teal accent-2' : 'grey darken-1'"
              >
                mdi-power
              </v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div class="text-xs-center">
          <span v-if="pilot.IsActive">
            <b>Active Pilot</b>
            <br />
            Active Pilots cannot edit or reallocate attributes or bonuses
            <br />
            (except when leveling up) and are able to record current HP.
            <br />
            <br />
            You can click the toggle to deactivate {{ pilot.Callsign }}.
          </span>
          <span v-else>
            <b>Inactive Pilot</b>
            <br />
            Inactive Pilots are able to edit and reallocate attributes and
            bonuses
            <br />
            but are unable to record current HP or select active Mechs.
            <br />
            <br />
            You can click the toggle to activate {{ pilot.Callsign }}
          </span>
        </div>
      </v-tooltip>
      <v-container fluid :class="pilot.IsActive ? 'mt-2' : ''">
        <!-- Pilot Info Block -->
        <v-layout>
          <v-flex xs10>
            <v-layout align-end>
              <!-- Callsign -->
              <v-flex shrink>
                <editable-label
                  attr="callsign"
                  description="Callsign"
                  :pilot="pilot"
                  :placeholder="pilot.Callsign"
                >
                  <span slot="label" class="callsign-text">
                    {{ pilot.Callsign }}
                  </span>
                </editable-label>
              </v-flex>
              <!-- Name -->
              <v-flex>
                <editable-label
                  attr="name"
                  description="Name"
                  :placeholder="pilot.Name"
                  :pilot="pilot"
                >
                  <span slot="label" class="blockquote ml-1 pl-0">
                    {{ pilot.Name }}&nbsp;
                  </span>
                </editable-label>
              </v-flex>
              <v-spacer />
              <v-flex class="text-xs-right mr-2" v-if="pilot.IsActive"></v-flex>
            </v-layout>
            <v-divider class="ma-2" />
            <!-- Pilot Statblock -->
            <v-layout>
              <v-flex>
                <span
                  class="caption"
                  v-html="
                    `HP ${pilot.CurrentHP}${
                      pilot.IsActive ? '/' + pilot.MaxHP : ''
                    }`
                  "
                />
                <tick-bar
                  :current="pilot.current_hp || pilot.MaxHP"
                  :max="pilot.MaxHP"
                  :attr="`current_hp`"
                  small
                  color="primary"
                  bg-color="blue lighten-3"
                  empty-icon="radio_button_unchecked"
                  full-icon="brightness_1"
                  pilot
                  :readonly="!pilot.IsActive"
                />
              </v-flex>
              <pip-bar
                small
                :model="pilot.Armor"
                :items="[pilot.Armor]"
                :caption="`ARMOR ${pilot.Armor}`"
              />
              <pip-bar
                small
                :model="pilot.EDefense"
                :items="[pilot.EDefense]"
                :caption="`E-DEFENSE ${pilot.EDefense}`"
              />
              <pip-bar
                small
                :model="pilot.Evasion"
                :items="[pilot.Evasion]"
                :caption="`EVASION ${pilot.Evasion}`"
              />
              <pip-bar
                small
                :model="pilot.Speed"
                :items="[pilot.Speed]"
                :caption="`SPEED ${pilot.Speed}`"
              />
            </v-layout>
          </v-flex>
          <!-- License Level -->
          <v-flex shrink>
            <span class="caption float-right">LICENSE LEVEL</span>
            <br />
          </v-flex>
          <span class="xl-text">{{ pilot.Level }}</span>
          <v-flex shrink>
            <!-- Level Up Button -->
            <v-tooltip bottom nudge-right="15px">
              <v-btn
                :to="'/level'"
                slot="activator"
                bottom
                right
                fab
                small
                :disabled="pilot.Level === maxLevel"
                color="primary"
                style="float:right; margin-left:30px"
              >
                <v-icon large>arrow_upward</v-icon>
              </v-btn>
              <span>Level Up</span>
            </v-tooltip>
            <!-- Level Selector -->
            <lazy-dialog
              :model="levelEditor"
              title="Set Pilot Level"
              acceptString="Set Pilot Level"
              hide-confirm
              @activate="levelEditor = true"
              @cancel="levelEditor = false"
            >
              <v-tooltip slot="activator" bottom nudge-right="15px">
                <v-btn
                  slot="activator"
                  @click="levelEditor = true"
                  outline
                  relative
                  icon
                  small
                  color="grey"
                  style="left: 10px; bottom: 20px"
                >
                  <v-icon small>build</v-icon>
                </v-btn>
                <span>Set Pilot Level</span>
              </v-tooltip>
              <template v-slot:modal-content>
                <level-selector
                  :pilot="pilot"
                  @changed="
                    levelEditor = false
                    notify(`Pilot Level set to ${$event}`)
                  "
                />
              </template>
            </lazy-dialog>
          </v-flex>
        </v-layout>
        <!-- End Pilot Info Block -->

        <!-- Pilot Alerts -->
        <v-layout>
          <v-flex>
            <v-alert
              :value="!pilot.Mechs.length"
              color="info"
              icon="info"
              outline
              class="ma-2 ml-5 mr-5"
            >
              <b>No Associated Mech</b>
              <br />
              This pilot does not have any mech Configurations associated with
              their profile. A new Configuration can be added by navigating to
              the
              <b>MECH HANGAR</b>
              from the menu bar
            </v-alert>
          </v-flex>
        </v-layout>

        <!-- Bio/Apparance Block -->
        <v-layout>
          <v-flex xs8>
            <v-layout>
              <v-flex>
                <!-- Biograpgy -->
                <v-layout>
                  <span class="header no-icon">Biography</span>
                </v-layout>
                <v-layout>
                  <v-flex xs12 class="text-xs-center">
                    <b v-if="pilot.custom_background" class="minor-title">
                      {{ pilot.custom_background }}
                    </b>
                    <div v-else style="display: inline">
                      <span v-if="pilot.Background.err" class="grey--text">
                        // MISSING BACKGROUND DATA //
                      </span>
                      <b v-else class="minor-title">
                        {{ pilot.Background.Name }}
                      </b>
                    </div>
                    <pilot-edit-modal
                      v-if="!pilot.IsActive"
                      title="Select Pilot Background"
                      :modelRef="backgroundModal"
                      ref="backgroundSelector"
                    >
                      <background-selector
                        slot="modal-content"
                        @close="setBackground()"
                        :pilot="pilot"
                      />
                    </pilot-edit-modal>
                  </v-flex>
                </v-layout>
                <!-- Clone Quirk -->
                <v-layout v-if="pilot.quirk">
                  <v-flex class="text-xs-center">
                    <v-alert :value="true" color="amber darken-4" class="ma-2">
                      <b class="minor-title">Clone Quirk</b>
                      <editable-label
                        :description="'Clone Quirk'"
                        :attr="'quirk'"
                        :placeholder="pilot.quirk"
                        :pilot="pilot"
                      >
                        <span slot="label" class="p fluff-text">
                          {{ pilot.quirk }}&emsp;
                        </span>
                      </editable-label>
                      <v-tooltip top>
                        <v-btn
                          absolute
                          top
                          right
                          slot="activator"
                          icon
                          class="mt-4"
                          @click="pilot.quirk = ''"
                        >
                          <v-icon color="white">close</v-icon>
                        </v-btn>
                        <span>Remove Quirk</span>
                      </v-tooltip>
                    </v-alert>
                  </v-flex>
                </v-layout>
                <!-- Pilot History -->
                <v-textarea
                  color="primary"
                  v-model="pilot.History"
                  auto-grow
                  rows="1"
                  label="History"
                  clearable
                />
              </v-flex>
            </v-layout>
            <v-layout>
              <!-- Contacts -->
              <!-- <v-flex>
                <v-layout><span class="header no-icon">Contacts</span></v-layout>
                <contacts-list :contacts="pilot.contacts" @add-contact="refresh" :key="pilot.contacts.length" />
              </v-flex> -->
            </v-layout>
          </v-flex>
          <v-flex xs4>
            <!-- Appearance -->
            <v-layout>
              <span class="header">
                Appearance
                <pilot-edit-modal
                  title="Set Pilot Portrait"
                  :modelRef="appearanceModal"
                  ref="appearanceSelector"
                >
                  <image-selector
                    slot="modal-content"
                    :pilot="pilot"
                    @notify="notify"
                    @close="closePortrait"
                  />
                </pilot-edit-modal>
              </span>
            </v-layout>
            <v-layout>
              <v-flex class="pl-2" @click="appearanceModal = true">
                <div v-if="pilot.Portrait">
                  <v-img
                    :src="pilot.Portrait"
                    max-height="55vh"
                    max-width="45.1vw"
                    contain
                  />
                </div>
                <div v-else>
                  <v-btn block small flat color="primary lighten-1">
                    <v-icon small>add</v-icon>
                    &nbsp;Add Pilot Image
                  </v-btn>
                </div>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex class="pl-2">
                <v-textarea
                  color="primary"
                  v-model="pilot.TextAppearance"
                  auto-grow
                  rows="1"
                  label="Description"
                  clearable
                />
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
        <!-- End Bio/Apparance Block -->

        <!-- Skills Block -->
        <v-layout>
          <v-flex xs1>
            <!-- Grit -->
            <v-layout><span class="header no-icon">Grit</span></v-layout>
            <v-layout align-center justify-center column fill-height>
              <v-flex>
                <span class="display-3 font-weight-black text-xs-center">
                  +{{ pilot.Grit }}
                </span>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs11>
            <!-- Triggers -->
            <v-layout>
              <span :class="`header ${pilot.IsActive ? 'no-icon' : ''}`">
                Skill Triggers
                <pilot-edit-modal
                  v-if="!pilot.IsActive"
                  title="Edit Pilot Skill Triggers"
                  :modelRef="skillModal"
                >
                  <skill-selector
                    slot="modal-content"
                    :pilot="pilot"
                    @close="skillModal = false"
                  />
                </pilot-edit-modal>
              </span>
            </v-layout>
            <v-layout>
              <v-flex class="mr-3">
                <skill-item
                  v-for="pilotskill in pilot.Skills"
                  :key="pilotskill.Skill.ID"
                  :pilotSkill="pilotskill"
                  :skill="pilotskill.Skill"
                />
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
        <!-- License Block -->
        <v-layout>
          <span :class="`header ${pilot.IsActive ? 'no-icon' : ''}`">
            Licenses
            <pilot-edit-modal
              v-if="!pilot.IsActive"
              title="Edit Pilot Licenses"
              :modelRef="licenseModal"
              ref="licenseSelector"
            >
              <license-selector slot="modal-content" :pilot="pilot" />
            </pilot-edit-modal>
          </span>
        </v-layout>
        <v-layout class="ml-3 mr-3">
          <v-flex>
            <v-expansion-panel focusable>
              <license-item
                v-for="pLicense in pilot.Licenses"
                :key="pLicense.License.Name"
                :pilotRank="pLicense.Rank"
                :licenseData="pLicense.License"
              />
            </v-expansion-panel>
          </v-flex>
        </v-layout>

        <!-- Talent Block -->
        <v-layout>
          <span :class="`header ${pilot.IsActive ? 'no-icon' : ''}`">
            Talents
            <pilot-edit-modal
              v-if="!pilot.IsActive"
              title="Edit Pilot Talents"
              :modelRef="talentModal"
              ref="talentSelector"
            >
              <talent-selector
                slot="modal-content"
                :pilot="pilot"
                @close="setPilotTalents"
              />
            </pilot-edit-modal>
          </span>
        </v-layout>
        <v-layout class="ml-3 mr-3">
          <v-flex>
            <v-expansion-panel focusable>
              <talent-item
                v-for="pilotTalent in pilot.Talents"
                :key="pilotTalent.Talent.id"
                :pilotTalent="pilotTalent"
                :talent="pilotTalent.Talent"
              />
            </v-expansion-panel>
          </v-flex>
        </v-layout>

        <!-- Mech Skills Block -->
        <v-layout>
          <span :class="`header ${pilot.IsActive ? 'no-icon' : ''}`">
            Mech Skills
            <pilot-edit-modal
              v-if="!pilot.IsActive"
              title="Edit Mech Skills"
              :modelRef="mechSkillModal"
              ref="mechSkillSelector"
            >
              <mech-skills-selector
                slot="modal-content"
                :pilot="pilot"
                @close="setMechSkills"
              />
            </pilot-edit-modal>
          </span>
        </v-layout>
        <v-layout center justify-space-around class="pl-5">
          <hase-pips title="hull" attribute="hull" />
          <hase-pips title="agility" attribute="agi" />
          <hase-pips title="systems" attribute="sys" />
          <hase-pips title="engineering" attribute="eng" />
        </v-layout>

        <!-- CORE Bonuses -->
        <v-layout>
          <span :class="`header ${pilot.IsActive ? 'no-icon' : ''}`">
            CORE Bonuses
            <pilot-edit-modal
              v-if="!pilot.IsActive"
              title="Edit CORE Bonuses"
              :modelRef="bonusModal"
              ref="bonusSelector"
            >
              <core-bonus-selector slot="modal-content" :pilot="pilot" />
            </pilot-edit-modal>
          </span>
        </v-layout>
        <v-layout
          row
          v-for="cb in pilot.CoreBonuses"
          :key="cb.ID"
          class="ml-5 mr-5"
        >
          <core-bonus-item :cb="cb" />
        </v-layout>

        <!-- Pilot Loadout -->
        <v-layout><span class="header no-icon">Pilot Gear</span></v-layout>
        <v-layout>
          <v-flex xs12><pilot-loadout :pilot="pilot" /></v-flex>
        </v-layout>

        <!-- Pilot Notes -->
        <v-layout><span class="header no-icon">Notes</span></v-layout>
        <v-layout>
          <v-flex>
            <div class="pt-1 pb-1 pl-3 pr-3">
              <v-textarea
                color="primary"
                v-model="pilot.Notes"
                auto-grow
                rows="1"
                label="Pilot Notes"
                clearable
              />
            </div>
          </v-flex>
        </v-layout>
      </v-container>

      <v-divider />

      <!-- Print Block -->
      <v-layout class="ma-5">
        <v-flex>
          <v-btn
            color="primary"
            large
            outline
            block
            @click="openPrintOptions()"
          >
            <v-icon>print</v-icon>
            &emsp; PRINT PILOT SHEET
          </v-btn>
          <v-btn color="primary" small flat block @click="copyPilotStatblock()">
            copy pilot statblock &nbsp;
            <v-tooltip top>
              <v-icon slot="activator" small color="grey">help</v-icon>
              <span>
                This produces a small raw text overview of the current Pilot and
                copies it to the clipboard.
              </span>
            </v-tooltip>
          </v-btn>
        </v-flex>
      </v-layout>

      <v-snackbar v-model="snackbar" :timeout="5000">
        <span v-html="notification" />
        <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
      </v-snackbar>

      <v-dialog v-model="printDialog" persistent width="50vw">
        <v-card>
          <v-card-title class="title">Active Mech Detected</v-card-title>
          <v-card-text>
            Include {{ pilot.Callsign }}'s currently active mech?
          </v-card-text>
          <slot name="modal-content"></slot>
          <v-divider />
          <v-card-actions>
            <v-btn color="primary" @click="print(false)">No</v-btn>
            <v-spacer />
            <v-btn color="primary" @click="print(true)">Yes</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <!-- Missing/No Pilot Display -->
    <empty-view v-else>
      <p slot="contents" class="grey--text text-xs-center display-2">
        NO PILOT LOADED
      </p>
    </empty-view>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { clipboard } from 'electron'
import {
  LazyDialog,
  EditableLabel,
  EditableTextfield,
  PipBar,
  EmptyView,
  TickBar,
} from '../components/UI'
import {
  ImageSelector,
  BackgroundSelector,
  SkillSelector,
  TalentSelector,
  LicenseSelector,
  MechSkillsSelector,
  CoreBonusSelector,
  LevelSelector,
} from './Selectors'
import {
  ContactsList,
  LicenseItem,
  SkillItem,
  TalentItem,
  CoreBonusItem,
  PilotEditModal,
  HasePips,
} from './SheetComponents'
import PilotLoadout from './LoadoutEditor/PilotLoadout.vue'
import NewConfig from '../HangarView/AddConfigMenu.vue'
import { Pilot, PilotSkill, Background, Statblock } from '@/class'
import { rules } from 'lancer-data'

export default Vue.extend({
  name: 'pilot-sheet',
  components: {
    EditableLabel,
    EditableTextfield,
    LicenseItem,
    SkillItem,
    TalentItem,
    PilotLoadout,
    CoreBonusItem,
    ImageSelector,
    ContactsList,
    BackgroundSelector,
    SkillSelector,
    TalentSelector,
    LicenseSelector,
    MechSkillsSelector,
    CoreBonusSelector,
    NewConfig,
    LazyDialog,
    PilotEditModal,
    LevelSelector,
    PipBar,
    HasePips,
    EmptyView,
    TickBar,
  },
  data: () => ({
    CallsignDialog: false,
    newCallsign: '',
    renameDialog: false,
    newName: '',
    newConfigModal: false,
    backgroundModal: false,
    appearanceModal: false,
    skillModal: false,
    licenseModal: false,
    talentModal: false,
    mechSkillModal: false,
    bonusModal: false,
    pilotGearModal: false,
    printDialog: false,
    levelEditor: false,
    snackbar: false,
    notification: '',
    activeLoadoutIdx: 0,
    loadoutForceReloadTrigger: 0,
  }),
  computed: {
    pilot(): Pilot {
      return this.$store.getters['getPilot']
    },
    maxLevel(): number {
      return rules.max_pilot_level
    },
  },
  methods: {
    refresh: function() {
      this.$forceUpdate()
    },
    notify: function(contents: string) {
      this.notification = contents
      this.snackbar = true
    },
    close(ref: string) {
      (this.$refs[ref] as any).cancel()
    },
    setBackground() {
      (this.$refs['backgroundSelector'] as any).cancel()
      this.backgroundModal = false
    },
    setPilotTalents() {
      this.talentModal = false
    },
    setMechSkills(){
      (this.$refs['mechSkillSelector'] as any).cancel()
    },
    closePortrait(){
      (this.$refs['appearanceSelector'] as any).cancel()
      this.appearanceModal = false
    },
    openPrintOptions() {
      if (this.pilot.ActiveConfig) {
        this.printDialog = true
      } else {
        this.$store.dispatch('setPrintOptions', {
          loadout_index: this.activeLoadoutIdx,
        })
        this.$router.push('/print-pilot')
      }
    },
    print: function(includeMech: boolean) {
      this.printDialog = false
      this.$store.dispatch('setPrintOptions', {
        combo: includeMech,
      })
      if (includeMech) {
        this.$router.push('/print-all')
      } else {
        this.$router.push('/print-pilot')
      }
    },
    copyPilotStatblock() {
      clipboard.writeText(Statblock.Generate(this.pilot, this.pilot.ActiveMech))
      this.notify('Pilot Statblock Copied to Clipboard')
    },
    activatePilot() {
      this.pilot.Active = !this.pilot.IsActive
      this.notify(
        `${this.pilot.Callsign} ${
          this.pilot.IsActive ? 'Activated' : 'Deactivated'
        }`
      )
    },
  },
})
</script>

<style scoped>
.header {
  background-color: lightgray;
  color: black;
  font-weight: bold;
  letter-spacing: 3px;
  width: 100%;
  padding-left: 10px;
  margin-top: 10px;
  margin-bottom: 3px;
}

.float-right {
  float: right;
  text-align: right;
}

.no-icon {
  height: 40px;
  padding-top: 8px;
}
</style>
