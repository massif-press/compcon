<template>
  <div class="roster-content">
    <empty-view v-if="config.Frame.err">
      <div slot="contents">
        <p class="grey--text text-xs-center display-2">// MISSING FRAME DATA //</p>
        <br />
        <span v-if="config.brew" class="caption grey--text">({{ config.brew }})</span>
      </div>
    </empty-view>

    <div v-else-if="config">
      <v-container fluid class="pt-0">
        <!-- ID Block -->
        <v-layout align-end>
          <v-flex shrink>
            <editable-label
              attr="Name"
              description="Configuration Name"
              :placeholder="config.Name"
              :mech="config"
            >
              <span slot="label" class="display-2">{{ config.Name }}</span>
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
                class="ml-0 pl-1 pr-1 pt-4 pb-0"
              >{{ config.Frame.Source }} {{ config.Frame.Name }}</v-btn>
              <v-card-text slot="modal-content" v-html="config.Frame.description" />
            </lazy-dialog>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs7>
            <v-layout>
              <v-flex>
                <span class="white--text fluff-text ml-2">
                  {{ getManufacturer(config.Frame.Source).Name }}
                  <v-chip small outline pill color="white">{{ config.Frame.MechTypeString }} Mech</v-chip>
                </span>
              </v-flex>
            </v-layout>
            <v-textarea v-model="config.Notes" auto-grow rows="1" label="Configuration Notes" />
            <!-- Req. Licenses -->
            <v-layout class="mt-0">
              <span class="header mt-0">Licenses Required</span>
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
                      l.missing ? 'deep-orange darken-4' : 'grey lighten-1'
                    "
                    :class="l.missing ? 'white--text' : ''"
                  >
                    <v-avatar
                      v-if="l.rank"
                      :class="
                        `${
                          l.missing ? 'amber darken-3' : 'blue-grey lighten-1'
                        } font-weight-black title`
                      "
                    >
                      <span v-for="n in l.rank" :key="'ri_rnk_' + l.name + n">I</span>
                    </v-avatar>
                    {{ l.source }} {{ l.name }}
                  </v-chip>
                  <span>
                    <span v-if="l.missing" class="font-weight-bold yellow--text">
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
                >
                  <b>WARNING: UNLICENSED COMPONENTS</b>
                  <br />Pilot is missing one or more licenses required for this
                  configuration
                </v-alert>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex class="mr-3 ml-3 mt-0">
                <v-alert type="warning" :value="config.CurrentSP > config.MaxSP">
                  <b>WARNING: SYSTEM CAPACITY EXCEEDED</b>
                  <br />Configuration loadout exceeds available SP points (
                  <b>{{ config.CurrentSP }} SP used</b>
                  , {{ config.MaxSP }} SP available)
                </v-alert>
              </v-flex>
            </v-layout>
          </v-flex>
          <!-- Appearance -->
          <v-flex class="ma-2">
            <div style="border: solid 1px #757575; border-radius: 3px">
              <v-img :src="config.Portrait" class="ml-2" max-height="55vh" contain />
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
            >Set Custom Image</v-btn>
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
          <span class="header">
            Mech Attributes
            <span style="float: right">
              <contributor
                label="SIZE"
                :value="config.Size"
                :contributors="config.SizeContributors"
                reverse
              />
              {{ config.Size }} &emsp;
            </span>
          </span>
        </v-layout>
        <v-layout>
          <v-flex xs1 class="mr-3">
            <v-layout column justify-center fill-height class="text-xs-center">
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
              <v-divider class="pt-0 mt-0" />
              <v-flex class="subheader">
                <span class="caption">
                  <contributor
                    label="SYSTEM POINTS"
                    :value="config.MaxSP"
                    :contributors="config.SPContributors"
                  />
                </span>
              </v-flex>
              <v-flex class="hase">
                <span>{{ config.MaxSP }}</span>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex>
            <v-layout justify-space-between>
              <statblock-item
                attr="Structure"
                :val="config.MaxStructure"
                :contributors="config.StructureContributors"
              />
              <statblock-item attr="HP" :val="config.MaxHP" :contributors="config.HPContributors" />
              <statblock-item
                attr="Armor"
                :val="config.Armor"
                :contributors="config.ArmorContributors"
              />
            </v-layout>

            <v-layout justify-space-between>
              <statblock-item
                attr="Stress"
                :val="config.MaxStress"
                :contributors="config.StressContributors"
              />
              <statblock-item
                attr="Heat Capacity"
                :val="config.HeatCapacity"
                :contributors="config.HeatCapContributors"
              />
              <statblock-item
                attr="Repair Capacity"
                :val="config.RepairCapacity"
                :contributors="config.RepCapContributors"
              />
            </v-layout>

            <v-layout justify-space-between>
              <statblock-item
                attr="Attack Bonus"
                signed
                :val="config.AttackBonus"
                :contributors="config.AttackBonusContributors"
              />
              <statblock-item
                attr="Tech Attack"
                signed
                :val="config.TechAttack"
                :contributors="config.TechAttackContributors"
              />
              <statblock-item
                attr="Limited System Bonus"
                signed
                :val="config.LimitedBonus"
                :contributors="config.LimitedContributors"
              />
            </v-layout>
            <v-layout justify-space-between>
              <statblock-item
                attr="Speed"
                :val="config.Speed"
                :contributors="config.SpeedContributors"
              />
              <statblock-item
                attr="Evasion"
                :val="config.Evasion"
                :contributors="config.EvasionContributors"
              />
              <statblock-item
                attr="E-Defense"
                :val="config.EDefense"
                :contributors="config.EDefenseContributors"
              />
              <statblock-item
                attr="Sensor Range"
                :val="config.SensorRange"
                :contributors="config.SensorRangeContributors"
              />
              <statblock-item
                attr="Save Target"
                :val="config.SaveTarget"
                :contributors="config.SaveTargetContributors"
              />
            </v-layout>
          </v-flex>
        </v-layout>

        <v-layout>
          <span class="header">Frame Traits</span>
        </v-layout>
        <trait-item v-for="trait in config.Frame.Traits" :key="trait.name" :trait="trait" />

        <v-layout>
          <span class="header">CORE System</span>
        </v-layout>
        <v-layout>
          <v-flex class="ma-2">
            <v-toolbar color="grey lighten-2">
              <v-toolbar-title>{{ config.Frame.CoreSystem.Name }}</v-toolbar-title>
            </v-toolbar>
            <v-card>
              <v-card-text
                v-if="config.Frame.CoreSystem.Description"
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
                <span
                  class="pt-2 ml-2 caption grey--text"
                >(ACTIVE)</span>
              </v-card-title>
              <v-card-text class="mt-0 pt-0 mb-0 pb-1">
                <p class="mb-1" v-html="config.Frame.CoreSystem.Effect" />
                <item-tag v-for="t in config.Frame.CoreSystem.Tags" :key="t.id" :tag-obj="t" />
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>

        <v-layout>
          <span class="header">Mech Equipment</span>
        </v-layout>
        <v-layout>
          <v-flex>
            <mech-loadout :config="config" :pilot="pilot" />
          </v-flex>
        </v-layout>
      </v-container>

      <v-divider />
      <v-layout justify-space-around fill-height class="ma-5">
        <v-flex xs>
          <v-btn large color="primary" outline block @click="openPrintOptions(false)">
            <v-icon>print</v-icon>&nbsp; PRINT
          </v-btn>
          <v-btn color="primary" small flat block @click="copyConfigStatblock()">
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
                  <br />Pilot is missing one or more licenses required for this
                  configuration.
                </v-alert>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex class="mr-3 ml-3 mt-0">
                <v-alert type="error" :value="config.CurrentSP > config.MaxSP">
                  <b>CRITICAL: SYSTEM CAPACITY EXCEEDED</b>
                  <br />Configuration loadout exceeds available SP points (
                  <b>{{ config.CurrentSP }} SP used</b>
                  , {{ config.MaxSP }} SP available)
                </v-alert>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex class="mr-3 ml-3 mt-0">
                <v-alert type="warning" :value="config.MaxSP - config.CurrentSP > 0">
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
                  <br />Configuration has mounts that do not contain an equipped
                  weapon. Combat efficacy limited.
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
  Contributor,
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
    Contributor,
  },
  data: () => ({
    frameInfoModal: false,
    appearanceModal: false,
    printWarningDialog: false,
    snackbar: false,
    notification: '',
    loadoutForceReloadTrigger: 0,
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

<style>
.subheader {
  font-weight: bold;
  letter-spacing: 2px;
  text-align: center;
  vertical-align: middle;
  padding-top: 2px;
  margin-bottom: 0px;
}

.hase {
  font-size: 2em;
  line-height: 1em;
  font-weight: 300;
  margin-top: 0;
  padding-top: 0;
}
</style>
