<template>
  <div id="config-sheet" class="roster-content">
    <empty-view v-if="config.Frame.err">
      <div slot="contents">
        <p class="grey--text text-xs-center display-2">
          // MISSING FRAME DATA //
        </p>
        <br />
        <span v-if="config.brew" class="caption grey--text">
          ({{ config.brew }})
        </span>
      </div>
    </empty-view>

    <div v-else-if="config">
      <v-tooltip bottom>
        <v-toolbar
          slot="activator"
          dense
          :color="config.IsActive ? 'warning' : 'grey darken-2'"
          class="ml-1"
        >
          <v-divider />
          <v-toolbar-title class="text-uppercase font-weight-light">
            <span style="letter-spacing: 15px; font-size: 1.75em">
              Mech {{ config.IsActive ? 'Active' : 'Inactive' }}
            </span>
          </v-toolbar-title>
          <v-divider />
          <v-toolbar-items class="hidden-sm-and-down">
            <v-btn large icon class="ma-0 ml-2" @click="activateConfig">
              <v-icon
                large
                :color="config.IsActive ? 'yellow accent-2' : 'grey darken-3'"
              >
                mdi-power
              </v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div class="text-xs-center">
          <span v-if="config.IsActive">
            <b>Active Mech</b>
            <br />
            Active Mechs can track Structure, HP, Reactor Stress, Heat,
            <br />
            Overcharge, and Repair Capacity.
            <br />
            A pilot may have only one mech activated at a time.
            <br />
            <br />
            You can click the toggle to deactivate {{ config.Name }}
          </span>
          <span v-else>
            <b>Inactive Mech</b>
            <br />
            Inactive Mechs are unable to track any stats, but Pilots may
            <br />
            have only one active Mech at any time. Making this Mech active
            <br />
            will deactivate any currently active Mechs
            <br />
            <br />
            You can click the toggle to activate {{ config.Name }}
          </span>
        </div>
      </v-tooltip>

      <v-container fluid class="pt-0">
        <!-- ID Block -->
        <v-layout align-end>
          <v-flex shrink>
            <editable-label
              dark
              attr="Name"
              description="Configuration Name"
              :placeholder="config.Name"
              :mech="config"
            >
              <span slot="label" class="display-2 white--text">
                {{ config.Name }}
              </span>
            </editable-label>
          </v-flex>
          <v-flex>
            <lazy-dialog
              :model="frameInfoModal"
              :title="`${config.Frame.Source} ${config.Frame.Name}`"
              hide-confirm
              @cancel="frameInfoModal = false"
            >
              <v-btn
                slot="activator"
                @click="frameInfoModal = true"
                large
                flat
                dark
                class="ml-0 pl-1 pr-1 pt-4 pb-0"
              >
                {{ config.Frame.Source }} {{ config.Frame.Name }}
              </v-btn>
              <v-card-text
                slot="modal-content"
                v-html="config.Frame.description"
              />
            </lazy-dialog>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs7>
            <v-layout>
              <v-flex>
                <span class="white--text fluff-text ml-2">
                  {{ getManufacturer(config.Frame.Source).Name }}
                  {{ config.Frame.MechTypeString }} Mech
                </span>
              </v-flex>
            </v-layout>
            <v-textarea
              dark
              color="orange"
              v-model="config.Notes"
              auto-grow
              rows="1"
              label="Configuration Notes"
              clearable
            />
            <!-- Req. Licenses -->
            <v-layout class="mt-0">
              <span class="config-header mt-0">Licenses Required</span>
            </v-layout>
            <v-layout>
              <v-flex>
                <v-tooltip
                  top
                  v-for="(l, index) in config.RequiredLicenses"
                  :key="'req_' + index + activeLoadoutID"
                >
                  <v-chip
                    slot="activator"
                    :color="
                      l.missing ? 'deep-orange darken-4' : 'grey darken-1'
                    "
                    class="white--text"
                  >
                    <v-avatar
                      v-if="l.rank"
                      :class="
                        `${
                          l.missing ? 'amber darken-3' : 'blue-grey darken-2'
                        } font-weight-black title`
                      "
                    >
                      <span v-for="n in l.rank" :key="'ri_rnk_' + l.name + n">
                        I
                      </span>
                    </v-avatar>
                    {{ l.source }} {{ l.name }}
                  </v-chip>
                  <span>
                    <span
                      v-if="l.missing"
                      class="font-weight-bold yellow--text"
                    >
                      WARNING: MISSING LICENSE
                      <br />
                    </span>
                    <b>{{ l.name }} RANK {{ l.rank }}</b>
                    <br />
                    <i>Required for:&nbsp;</i>
                    {{ l.items.join(', ') }}
                  </span>
                </v-tooltip>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex class="mr-3 ml-3 mt-1 mb-0">
                <v-alert
                  type="warning"
                  :value="config.RequiredLicenses.filter(x => x.missing).length"
                  outline
                >
                  <b>WARNING: UNLICENSED COMPONENTS</b>
                  <br />
                  Pilot is missing one or more licenses required for this
                  configuration
                </v-alert>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex class="mr-3 ml-3 mt-0">
                <v-alert
                  type="warning"
                  :value="config.CurrentSP > config.MaxSP"
                  outline
                >
                  <b>WARNING: SYSTEM CAPACITY EXCEEDED</b>
                  <br />
                  Configuration loadout exceeds available SP points (
                  <b>{{ config.CurrentSP }} SP used</b>
                  , {{ config.MaxSP }} SP available)
                </v-alert>
              </v-flex>
            </v-layout>
          </v-flex>
          <!-- Appearance -->
          <v-flex class="ma-2">
            <div style="border: solid 1px #757575; border-radius: 3px">
              <v-img
                :src="config.Portrait"
                class="ml-2"
                max-height="55vh"
                contain
              />
            </div>
            <v-btn
              block
              outline
              small
              color="grey"
              @click="
                appearanceLoader = true
                appearanceModal = true
              "
            >
              Set Custom Image
            </v-btn>
          </v-flex>
          <image-selector
            :model="appearanceModal"
            :config="config"
            @close="appearanceModal = false"
            @notify="notify($event)"
          />
        </v-layout>
        <!-- Attribute Block -->
        <v-layout>
          <span class="config-header">
            Mech Attributes
            <span style="float: right">SIZE {{ config.Size }} &emsp;</span>
          </span>
        </v-layout>
        <v-layout>
          <v-flex xs1 class="mr-3">
            <v-layout column justify-center class="text-xs-center">
              <v-flex class="subheader">
                <span class="caption">HULL</span>
              </v-flex>
              <v-flex class="hase">
                <span>{{ pilot.MechSkills.Hull }}</span>
              </v-flex>
              <v-flex class="subheader">
                <span class="caption">AGILITY</span>
              </v-flex>
              <v-flex class="hase">
                <span>{{ pilot.MechSkills.Agi }}</span>
              </v-flex>
              <v-flex class="subheader">
                <span class="caption">SYSTEMS</span>
              </v-flex>
              <v-flex class="hase">
                <span>{{ pilot.MechSkills.Sys }}</span>
              </v-flex>
              <v-flex class="subheader">
                <span class="caption">ENGINEERING</span>
              </v-flex>
              <v-flex class="hase">
                <span>{{ pilot.MechSkills.Eng }}</span>
              </v-flex>
              <v-divider dark class="pt-0 mt-0" />
              <v-flex class="subheader">
                <span class="caption">SYSTEM POINTS</span>
              </v-flex>
              <v-flex class="hase">
                <span>{{ config.SP }}</span>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex>
            <v-layout>
              <v-flex>
                <v-layout>
                  <v-flex shrink>
                    <span class="grey--text">
                      STRUCTURE
                      <b :style="`color: ${color.structure.dark}`">
                        {{ config.CurrentStructure || 0 }}
                        <span v-if="config.IsActive">
                          /{{ config.MaxStructure }}
                        </span>
                      </b>
                    </span>
                    <tick-bar
                      :current="config.CurrentStructure || config.MaxStructure"
                      :max="config.MaxStructure"
                      large
                      :color="color.structure.dark"
                      bg-color="pink darken-4"
                      empty-icon="mdi-hexagon-outline"
                      full-icon="cc-structure"
                      config
                      :readonly="!config.IsActive"
                      @update="config.CurrentStructure = $event"
                    />
                  </v-flex>
                  <v-flex>
                    <span class="grey--text">
                      &nbsp;HP
                      <b :style="`color: ${color.hp.dark}`">
                        {{ config.CurrentHP || 0 }}
                        <span v-if="config.IsActive">/{{ config.MaxHP }}</span>
                      </b>
                      &emsp; ARMOR
                      <b :style="`color: ${color.armor.dark}`">
                        {{ config.Armor }}
                      </b>
                    </span>
                    <v-layout>
                      <tick-bar
                        :current="config.CurrentHP || config.MaxHP"
                        :max="config.MaxHP"
                        large
                        :color="color.hp.dark"
                        bg-color="grey darken-1"
                        empty-icon="mdi-hexagon-outline"
                        full-icon="mdi-hexagon"
                        :readonly="!config.IsActive"
                        @update="config.CurrentHP = $event"
                      />
                      <v-flex shrink>
                        <v-rating
                          class="d-inline-flex"
                          v-model="config.Armor"
                          :length="config.Armor"
                          readonly
                          large
                          dense
                          full-icon="mdi-shield"
                          :color="color.armor.dark"
                        />
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
                    <span class="grey--text">
                      REACTOR STRESS
                      <b :style="`color: ${color.stress.dark}`">
                        {{ config.CurrentStress || 0 }}
                        <span v-if="config.IsActive">
                          /{{ config.MaxStress }}
                        </span>
                      </b>
                    </span>
                    <tick-bar
                      :current="config.CurrentStress || config.MaxStress"
                      :max="config.MaxStress"
                      large
                      :color="color.stress.dark"
                      bg-color="deep-orange darken-4"
                      empty-icon="mdi-circle-outline"
                      full-icon="cc-reactor-stress"
                      :readonly="!config.IsActive"
                      @update="config.CurrentStress = $event"
                    />
                  </v-flex>
                  <v-flex>
                    <span class="grey--text">
                      <span v-if="config.IsActive">
                        &nbsp;HEAT:
                        <b :style="`color: ${color.heatcap.dark}`">
                          {{ config.CurrentHeat || 0 }}
                        </b>
                        &emsp; &nbsp;
                      </span>
                      HEAT CAPACITY
                      <b :style="`color: ${color.heatcap.dark}`">
                        {{ config.HeatCapacity }}
                      </b>
                    </span>
                    <tick-bar
                      :current="config.CurrentHeat || 0"
                      :max="config.HeatCapacity"
                      large
                      :color="color.heatcap.dark"
                      bg-color="red darken-4"
                      empty-icon="mdi-circle-outline"
                      full-icon="mdi-circle"
                      :readonly="!config.IsActive"
                      @update="config.CurrentHeat = $event"
                    />
                  </v-flex>
                  <v-spacer />
                  <v-flex>
                    <span class="grey--text">
                      &nbsp;REPAIR CAPACITY
                      <b :style="`color: ${color.repcap.dark}`">
                        {{ config.CurrentRepairs }}
                        <span v-if="config.IsActive">
                          /{{ config.RepairCapacity }}
                        </span>
                      </b>
                    </span>
                    <tick-bar
                      :current="config.CurrentRepairs || config.RepairCapacity"
                      :max="config.RepairCapacity"
                      large
                      :color="color.repcap.dark"
                      bg-color="grey darken-2"
                      empty-icon="mdi-circle-outline"
                      full-icon="control_point"
                      :readonly="!config.IsActive"
                      @update="config.CurrentRepairs = $event"
                    />
                  </v-flex>
                  <v-spacer />
                  <v-flex v-if="config.IsActive">
                    <span class="grey--text">
                      &nbsp;CORE POWER
                      <b :style="`color: ${color.corepower.dark}`">
                        {{ config.CurrentCoreEnergy || 1 }}
                      </b>
                    </span>
                    <tick-bar
                      :config_id="config.id"
                      :current="config.CurrentCoreEnergy || 1"
                      :max="1"
                      large
                      :color="color.corepower.dark"
                      bg-color="grey darken-2"
                      empty-icon="mdi-battery-10"
                      full-icon="mdi-battery"
                      @update="config.CurrentCoreEnergy = $event"
                    />
                  </v-flex>
                  <v-spacer />
                  <v-flex v-if="config.IsActive">
                    <span class="grey--text">
                      &nbsp;OVERCHARGE
                      <b :style="`color: ${color.overcharge.dark}`">
                        {{ overcharge[config.CurrentOvercharge || 0] }}
                      </b>
                    </span>
                    <tick-bar
                      :config_id="config.id"
                      :current="config.CurrentOvercharge"
                      :max="3"
                      large
                      :color="color.overcharge.dark"
                      bg-color="grey darken-2"
                      empty-icon="mdi-circle-outline"
                      full-icon="mdi-alert-decagram"
                      @update="config.CurrentOvercharge = $event"
                    />
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
            <v-layout justify-space-between>
              <statblock-item
                :attr="'Attack Bonus'"
                signed
                :val="config.AttackBonus"
              />
              <statblock-item
                :attr="'Tech Attack'"
                signed
                :val="config.TechAttack"
              />
              <statblock-item
                :attr="'Limited System Bonus'"
                signed
                :val="config.LimitedBonus"
              />
            </v-layout>
            <v-layout justify-space-between>
              <statblock-item :attr="'Speed'" :val="config.Speed" />
              <statblock-item :attr="'Evasion'" :val="config.Evasion" />
              <statblock-item :attr="'E-Defense'" :val="config.EDefense" />
              <statblock-item
                :attr="'Sensor Range'"
                :val="config.SensorRange"
              />
              <statblock-item :attr="'Save Target'" :val="config.SaveTarget" />
            </v-layout>
          </v-flex>
        </v-layout>

        <v-layout><span class="config-header">Pilot Traits</span></v-layout>

        <v-layout class="ml-3 mr-3">
          <v-flex>
            <pilot-traits
              :talents="config.pilot.Talents"
              :core-bonuses="config.pilot.CoreBonuses"
            />
          </v-flex>
        </v-layout>

        <v-layout><span class="config-header">Frame Traits</span></v-layout>
        <trait-item
          v-for="trait in config.Frame.Traits"
          :key="trait.name"
          :trait="trait"
        />

        <v-layout><span class="config-header">CORE System</span></v-layout>
        <v-layout>
          <v-flex class="m-2">
            <v-toolbar color="grey darken-2">
              <v-toolbar-title class="white--text">
                {{ config.Frame.CoreSystem.Name }}
              </v-toolbar-title>
            </v-toolbar>
            <v-card dark>
              <v-card-text
                v-if="config.Frame.CoreSystem.Ddescription"
                v-html="config.Frame.CoreSystem.Description"
              />
              <div v-if="config.Frame.CoreSystem.Passive">
                <v-card-title class="subheading">Passive</v-card-title>
                <v-card-text class="mt-0 pt-0 mb-0 pb-1">
                  <p class="mb-1" v-html="config.Frame.CoreSystem.Passive" />
                </v-card-text>
              </div>
              <v-card-title class="title">
                {{ config.Frame.CoreSystem.Active }}
                <span class="pt-2 ml-2 caption grey--text">(ACTIVE)</span>
              </v-card-title>
              <v-card-text class="mt-0 pt-0 mb-0 pb-1">
                <p class="mb-1" v-html="config.Frame.CoreSystem.Effect" />
                <item-tag
                  v-for="t in config.Frame.CoreSystem.Tags"
                  :key="t.id"
                  :tag-obj="t"
                />
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>

        <v-layout><span class="config-header">Mech Equipment</span></v-layout>
        <v-layout>
          <v-flex>
            <mech-loadout :config="config" :pilot="pilot" />
          </v-flex>
        </v-layout>
      </v-container>

      <v-divider dark />
      <v-layout justify-space-around fill-height class="ma-5">
        <v-flex xs>
          <v-btn
            large
            color="warning"
            outline
            block
            dark
            @click="openPrintOptions(false)"
          >
            <v-icon>print</v-icon>
            &nbsp; PRINT
          </v-btn>
          <v-btn
            color="warning"
            small
            flat
            block
            @click="copyConfigStatblock()"
          >
            copy config statblock &nbsp;
            <v-tooltip top>
              <v-icon slot="activator" small color="grey">help</v-icon>
              <span>
                This produces a small raw text overview of the current
                Configuration and copies it to the clipboard.
              </span>
            </v-tooltip>
          </v-btn>
        </v-flex>
        <lazy-dialog
          :model="printWarningDialog"
          title="// PRINT WARNING //"
          acceptString="Continue Anyway"
          acceptColor="warning"
          @accept="openPrintOptions(true)"
          @cancel="printWarningDialog = false"
        >
          <v-card-text slot="modal-content">
            <v-layout>
              <v-flex class="mr-3 ml-3 mt-0 mb-0">
                <v-alert
                  type="error"
                  :value="config.RequiredLicenses.filter(x => x.missing).length"
                >
                  <b>CRITICAL: UNLICENSED COMPONENTS</b>
                  <br />
                  Pilot is missing one or more licenses required for this
                  configuration.
                </v-alert>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex class="mr-3 ml-3 mt-0">
                <v-alert type="error" :value="config.CurrentSP > config.MaxSP">
                  <b>CRITICAL: SYSTEM CAPACITY EXCEEDED</b>
                  <br />
                  Configuration loadout exceeds available SP points (
                  <b>{{ config.CurrentSP }} SP used</b>
                  , {{ config.MaxSP }} SP available)
                </v-alert>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex class="mr-3 ml-3 mt-0">
                <v-alert
                  type="warning"
                  :value="config.MaxSP - config.CurrentSP > 0"
                >
                  <b>WARNING: FREE SYSTEM CAPACITY REMAINING</b>
                  <br />
                  Configuration retains
                  {{ config.MaxSP - config.CurrentSP }} unused System Points.
                  Combat efficacy limited.
                </v-alert>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex class="mr-3 ml-3 mt-0">
                <v-alert type="warning" :value="hasEmptyMounts()">
                  <b>WARNING: EMPTY MOUNTS DETECTED</b>
                  <br />
                  Configuration has mounts that do not contain an equipped
                  weapon. Combat efficacy limited.
                </v-alert>
              </v-flex>
            </v-layout>
          </v-card-text>
        </lazy-dialog>
      </v-layout>
    </div>

    <empty-view v-else>
      <p slot="contents" class="grey--text text-xs-center display-2">
        NO CONFIGURATION LOADED
      </p>
    </empty-view>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { getStatic } from '@/mixins/static'
import {
  EditableLabel,
  EditableTextfield,
  ItemTag,
  EmptyView,
  LazyDialog,
  PipBar,
  TickBar,
} from '../components/UI'
import {
  StatblockItem,
  TraitItem,
  ImageSelector,
  PilotTraits,
} from './SheetComponents'
import MechLoadout from './LoadoutEditor/MechLoadout.vue'
import { clipboard } from 'electron'
import ccc from '@/features/_shared/UI/CCColors'
import { Mech, Frame, Pilot, Statblock } from '@/class'

export default Vue.extend({
  name: 'config-sheet',
  components: {
    EditableLabel,
    EditableTextfield,
    ItemTag,
    StatblockItem,
    TraitItem,
    MechLoadout,
    ImageSelector,
    EmptyView,
    LazyDialog,
    PipBar,
    TickBar,
    PilotTraits,
  },
  data: () => ({
    frameInfoModal: false,
    appearanceModal: false,
    printWarningDialog: false,
    snackbar: false,
    notification: '',
    loadoutForceReloadTrigger: 0,
    overcharge: ['+1', '+1d3', '+1d6', '+1d6+4'],
  }),
  methods: {
    notify: function(contents: string) {
      this.notification = contents
      this.snackbar = true
    },
    hasEmptyMounts(): boolean {
      if (!this.config) return false
      if (!this.config.ActiveLoadout) return false
      return this.config.ActiveLoadout.HasEmptyMounts
    },
    selectMechImg() {
      var vm = this as any
      vm.$refs.mechImg.showModal()
    },
    getStaticPath(path: string) {
      return getStatic(path)
    },
    openPrintOptions(override: boolean) {
      if (!this.config) return
      var vm = this as any
      if (
        !override &&
        (this.hasEmptyMounts() ||
          this.config.MaxSP - this.config.CurrentSP > 0 ||
          this.config.CurrentSP > this.config.MaxSP ||
          this.config.RequiredLicenses.filter(x => x.missing).length)
      ) {
        this.printWarningDialog = true
      } else {
        this.$router.push('/print-config')
      }
    },
    copyConfigStatblock() {
      var vm = this as any
      clipboard.writeText(Statblock.Generate(null, this.config))
      this.notify('Mech Statblock Copied to Clipboard')
    },
    activateConfig() {
      if (this.config && this.config.IsActive) this.pilot.ActiveMech = null
      else this.pilot.ActiveMech = this.config
    },
  },
  computed: {
    pilot(): Pilot {
      return this.$store.getters.getPilot as Pilot
    },
    config(): Mech | null {
      return this.pilot.LoadedMech
    },
    color(): any {
      return ccc
    },
    activeLoadoutID(): string {
      return this.config.ActiveLoadout ? this.config.ActiveLoadout.ID : 'none'
    },
  },
})
</script>

<style scoped>
#config-sheet {
  background-color: #424242;
}

.config-header {
  background-color: #757575;
  color: #eeeeee;
  font-weight: bold;
  letter-spacing: 3px;
  width: 100%;
  padding-left: 10px;
  margin-top: 10px;
  margin-bottom: 3px;
  height: 40px;
  padding-top: 8px;
}

.subheader {
  background-color: #757575;
  color: #eeeeee;
  font-weight: bold;
  letter-spacing: 2px;
}

.hase {
  color: #ffffff;
  font-size: 3em;
  font-weight: 300;
}
</style>
