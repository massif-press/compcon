<template>
  <div>
    <div v-if="mech.IsDestroyed">
      <v-card>
        <v-card-text class="text-center destroyed-bg">
          <p class="major-title red--text pa-3 ma-5" style="background-color:black;">
            MECH DESTROYED
            <span
              v-if="mech.ReactorDestroyed"
              class="title red--text text--accent-3 pa-0 ma-0"
              style="background-color:black;"
            >
              <br />
              REACTOR DESTROYED
            </span>
          </p>
        </v-card-text>
      </v-card>
      <v-row>
        <v-col cols="12">
          <v-tooltip top>
            <v-btn
              slot="activator"
              flat
              icon
              absolute
              right
              small
              @click="undo"
              :disabled="!history.length"
            >
              <v-icon small>undo</v-icon>
            </v-btn>
            <span>Undo last action</span>
          </v-tooltip>
        </v-col>
      </v-row>
      <v-btn block color="amber darken-4" dark @click="endCombat">End Combat</v-btn>
    </div>
    <div v-else>
      <v-row column fill-height>
        <v-col cols="12" class="major-title text-center destroyed-bg">
          <span>COMBAT ENGAGED</span>
        </v-col>
        <v-col cols="12" class="callsign-text text-center" style="line-height: 60px;">
          <span>TURN</span>
          <span class="pink--text">{{ turn }}</span>
        </v-col>
        <v-col v-if="mech.IsEjected" cols="12" class="minor-title text-center reaction-bg">
          <span v-html="'PILOT EJECTED'" />
        </v-col>
        <div v-else>
          <v-col v-if="braced" cols="12" class="minor-title text-center reaction-bg">
            <span v-html="'BRACED'" />
          </v-col>
          <v-col v-if="bracedCooldown" cols="12" class="minor-title red--text text-center destroyed-bg">
            <span v-html="'// BRACE RECOVERY //'" />
          </v-col>
          <v-col
            v-if="mech.IsShutDown"
            cols="12"
            class="minor-title red--text text-center destroyed-bg"
          >
            <span v-html="'// SHUT DOWN //'" />
          </v-col>
          <v-col v-if="overwatch" cols="12" class="minor-title text-center reaction-bg">
            <span v-html="'OVERWATCH'" />
          </v-col>
          <v-col v-if="prepare" cols="12" class="minor-title text-center prepare-bg">
            <span v-html="'PREPARED ACTION'" />
          </v-col>
        </div>
        <v-divider dark class="ma-2" />
        <v-col cols="12" class="caption text-center mb-2">&mdash; ACTIONS REMAINING &mdash;</v-col>
        <v-col cols="12" class="caption text-center">
          <v-tooltip bottom>
            <v-avatar
              slot="activator"
              size="4.5em"
              class="ml-1 mr-1"
              :key="move"
              :color="
                move === maxMove || bracedCooldown || mech.IsShutDown ? 'grey' : 'red darken-3'
              "
            >
              <v-icon size="3.25em" dark>$vuetify.icons.move</v-icon>
            </v-avatar>
            <span>Move</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-avatar slot="activator" size="4.5em" :color="actionColor()" class="ml-1 mr-1">
              <v-icon v-if="actions > 2 && !mech.IsShutDown" size="3.25em" dark>
                $vuetify.icons.overcharge
              </v-icon>
              <v-icon v-else-if="actions === 2 && !mech.IsShutDown" size="3.25em" dark>
                $vuetify.icons.full
              </v-icon>
              <v-icon v-else-if="actions === 1 && !mech.IsShutDown" size="3.25em" dark>
                $vuetify.icons.quick
              </v-icon>
              <v-icon v-else size="3.25em" dark>mdi-hexagon-outline</v-icon>
            </v-avatar>
            <span>1 Full Action / 2 Quick Actions</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-avatar
              slot="activator"
              size="4.5em"
              class="ml-1 mr-1"
              :color="bracedCooldown || overcharged || mech.IsShutDown ? 'grey' : 'pink accent-3'"
            >
              <v-icon size="3.25em" dark>$vuetify.icons.overcharge</v-icon>
            </v-avatar>
            <span>Overcharge</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-avatar
              slot="activator"
              size="4.5em"
              class="ml-1 mr-1"
              :color="
                bracedCooldown || overwatch || braced || mech.IsShutDown
                  ? 'grey'
                  : 'purple darken-3'
              "
            >
              <v-icon size="3.25em" dark>$vuetify.icons.reaction</v-icon>
            </v-avatar>
            <span>Reactions</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-avatar
              slot="activator"
              size="4.5em"
              class="ml-1 mr-1"
              :color="bracedCooldown || mech.IsShutDown ? 'grey' : 'green darken-3'"
            >
              <v-icon size="3.25em" dark>$vuetify.icons.free</v-icon>
            </v-avatar>
            <span>Free Actions</span>
          </v-tooltip>
        </v-col>
        <v-col cols="12" class="caption text-center mt-3">&mdash; MOVEMENT &mdash;</v-col>
        <v-col cols="12">
          <div style="display: table; margin: 0 auto;">
            <tick-bar
              label="SPACES MOVED"
              :current="move"
              :key="move"
              :max="maxMove"
              large
              fullIcon="$vuetify.icons.move"
              color="red accent-4"
              @update="move = $event"
              :readonly="mech.IsShutDown"
            />
          </div>
        </v-col>
        <v-col cols="12">
          <v-tooltip top>
            <v-btn
              slot="activator"
              flat
              icon
              absolute
              right
              small
              @click="undo"
              :disabled="!history.length"
            >
              <v-icon small>undo</v-icon>
            </v-btn>
            <span>Undo last action</span>
          </v-tooltip>
        </v-col>
        <v-col cols="12" class="caption text-center mt-2 mb-1">&mdash; ACTIONS &mdash;</v-col>
        <!-- conditionally exclusive v-shows (instead of v-if/else-if/else) is necessary here because vue chokes on a critical mass nested conditionals with transitions -->
        <div v-show="mech.IsShutDown">
          <v-col cols="12">
            <action-button
              v-if="actions >= 2"
              action-id="action_bootup"
              class="mb-1"
              @click="boot()"
            />
          </v-col>
        </div>
        <div v-show="mech.IsEjected && !mech.IsShutDown">
          <v-col cols="12">
            <v-expand-transition>
              <v-row wrap justify="center" v-show="actions >= 2">
                <v-col cols="12">
                  <div class="mr-1 mb-1">
                    <action-button
                      action-id="action_mount"
                      @click="remount()"
                      name-override="Remount Mech"
                    />
                  </div>
                </v-col>
              </v-row>
            </v-expand-transition>
            <v-expand-transition>
              <v-row wrap justify="center" v-show="actions">
                <v-col cols="4">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_quickactivate" @click="quickAction()" />
                  </div>
                </v-col>
                <v-col cols="4">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_boost" @click="boost()" />
                  </div>
                </v-col>
                <v-col cols="4">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_hide" @click="hide()" />
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_search" @click="quickAction()" />
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_prepare" @click="setPrepare()" />
                  </div>
                </v-col>
              </v-row>
            </v-expand-transition>
            <v-expand-transition>
              <v-row wrap justify="center" v-show="actions >= 2">
                <v-col cols="12" v-if="pilot.has('reserve', 'bombardment')">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_bombardment" @click="bombard()" />
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_fight" @click="fullAction()" />
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_jockey" @click="fullAction()" />
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_fullactivate" @click="fullAction()" />
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_disengage" @click="fullAction()" />
                  </div>
                </v-col>
              </v-row>
            </v-expand-transition>
            <v-expand-transition>
              <v-row wrap justify="center" v-show="!braced && !overwatch && !bracedCooldown">
                <v-col cols="6">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_overwatch" @click="setOverwatch()" />
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_brace" @click="setBrace()" />
                  </div>
                </v-col>
              </v-row>
            </v-expand-transition>
            <v-expand-transition>
              <v-row wrap justify="center" v-show="!bracedCooldown && !overcharged">
                <v-col class="mr-1 mb-1">
                  <action-button action-id="action_overcharge" @click="openOvercharge" />
                </v-col>
              </v-row>
            </v-expand-transition>
            <v-expand-transition>
              <v-row wrap justify="center" v-show="pilot.has('reserve', 'redundantrepair')">
                <v-col cols="12">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_redundantrepair" @click="redundantRepair()" />
                  </div>
                </v-col>
              </v-row>
            </v-expand-transition>
            <v-expand-transition>
              <v-row wrap justify="center" v-show="pilot.has('reserve', 'deployableshield')">
                <v-col cols="12">
                  <div class="mr-1 mb-1">
                    <action-button
                      action-id="action_deployableshield"
                      @click="deployableShield()"
                    />
                  </div>
                </v-col>
              </v-row>
            </v-expand-transition>
            <v-expand-transition>
              <v-row wrap justify="center" v-show="pilot.has('reserve', 'corebattery')">
                <v-col cols="12">
                  <div class="mr-1 mb-1">
                    <action-button
                      action-id="action_corebattery"
                      @click="coreBattery()"
                      :disabled="mech.CurrentCoreEnergy > 0"
                    />
                  </div>
                </v-col>
              </v-row>
            </v-expand-transition>
          </v-col>
        </div>
        <div v-show="!mech.IsShutDown && !mech.IsEjected">
          <v-col cols="12">
            <v-col cols="12" v-if="mech.MeltdownImminent" class="mb-3">
              <v-btn block x-large class="ma-0" color="red accent-4" @click="meltdown()">
                REACTOR MELTDOWN
              </v-btn>
              <v-btn
                block
                small
                outline
                class="ma-0 mt-1"
                color="light-green accent-3"
                @click="avoidMeltdown()"
              >
                STABILIZE REACTOR
              </v-btn>
            </v-col>
            <v-expand-transition>
              <v-row wrap justify="center" v-show="actions">
                <v-col cols="4">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_skirmish" @click="quickAction()" />
                  </div>
                </v-col>
                <v-col cols="4">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_quickactivate" @click="quickAction()" />
                  </div>
                </v-col>
                <v-col cols="4">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_quicktech" @click="quickAction()" />
                  </div>
                </v-col>
                <v-col cols="4">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_boost" @click="boost()" />
                  </div>
                </v-col>
                <v-col cols="4">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_ram" @click="quickAction()" />
                  </div>
                </v-col>
                <v-col cols="4">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_grapple" @click="quickAction()" />
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_hide" @click="hide()" />
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_search" @click="quickAction()" />
                  </div>
                </v-col>
              </v-row>
            </v-expand-transition>
            <v-expand-transition>
              <v-row wrap justify="center" v-show="actions >= 2">
                <v-col cols="12" v-if="pilot.has('reserve', 'bombardment')">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_bombardment" @click="bombard()" />
                  </div>
                </v-col>
                <v-col cols="4">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_barrage" @click="fullAction()" />
                  </div>
                </v-col>
                <v-col cols="4">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_fullactivate" @click="fullAction()" />
                  </div>
                </v-col>
                <v-col cols="4">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_fulltech" @click="fullAction()" />
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_stabilize" @click="openStabilize()" />
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_disengage" @click="fullAction()" />
                  </div>
                </v-col>
              </v-row>
            </v-expand-transition>
            <v-expand-transition>
              <v-row wrap justify="center" v-show="!braced && !overwatch && !bracedCooldown">
                <v-col cols="6">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_overwatch" @click="setOverwatch()" />
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_brace" @click="setBrace()" />
                  </div>
                </v-col>
              </v-row>
            </v-expand-transition>
            <v-expand-transition>
              <v-row wrap justify="center" v-show="!bracedCooldown && !overcharged">
                <v-col class="mr-1 mb-1">
                  <action-button action-id="action_overcharge" @click="openOvercharge" />
                </v-col>
              </v-row>
            </v-expand-transition>
            <v-expand-transition>
              <v-row wrap justify="center" v-show="pilot.has('reserve', 'redundantrepair')">
                <v-col cols="12">
                  <div class="mr-1 mb-1">
                    <action-button action-id="action_redundantrepair" @click="redundantRepair()" />
                  </div>
                </v-col>
              </v-row>
            </v-expand-transition>
            <v-expand-transition>
              <v-row wrap justify="center" v-show="pilot.has('reserve', 'deployableshield')">
                <v-col cols="12">
                  <div class="mr-1 mb-1">
                    <action-button
                      action-id="action_deployableshield"
                      @click="deployableShield()"
                    />
                  </div>
                </v-col>
              </v-row>
            </v-expand-transition>
            <v-expand-transition>
              <v-row wrap justify="center" v-show="pilot.has('reserve', 'corebattery')">
                <v-col cols="12">
                  <div class="mr-1 mb-1">
                    <action-button
                      action-id="action_corebattery"
                      @click="coreBattery()"
                      :disabled="mech.CurrentCoreEnergy > 0"
                    />
                  </div>
                </v-col>
              </v-row>
            </v-expand-transition>
            <v-expand-transition>
              <v-expansion-panel v-show="actions" class="mt-2">
                <v-expansion-panel-content style="background-color: #616161" class="pa-2 pr-3">
                  <span slot="header" class="minor-title">Other Actions</span>
                  <action-button
                    v-if="actions >= 1"
                    action-id="action_shutdown"
                    class="mb-1"
                    @click="shutDown()"
                  />
                  <action-button
                    v-if="actions >= 1"
                    action-id="action_eject"
                    class="mb-1"
                    @click="eject()"
                  />
                  <action-button
                    v-if="actions >= 1"
                    action-id="action_selfdestruct"
                    class="mb-1"
                    @click="quickAction()"
                  />
                  <action-button
                    v-if="actions >= 1"
                    action-id="action_prepare"
                    class="mb-1"
                    @click="setPrepare()"
                  />
                  <action-button
                    v-if="actions >= 2"
                    action-id="action_mount"
                    class="mb-1"
                    nameOverride="Dismount"
                    @click="dismount()"
                  />
                  <action-button
                    v-if="actions >= 2"
                    action-id="action_skillcheck"
                    class="mb-1"
                    @click="fullAction()"
                  />
                  <action-button
                    v-if="actions >= 2"
                    action-id="action_improvattack"
                    class="mb-1"
                    @click="fullAction()"
                  />
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expand-transition>
          </v-col>
        </div>
        <v-col cols="12" class="text-center ma-2 mt-4">
          <v-btn block color="warning" outline dark large @click="newTurn()">END TURN</v-btn>
        </v-col>
      </v-row>
      <v-divider class="ma-2" />
      <v-row wrap>
        <v-col cols="12">
          <v-btn block color="amber darken-4" dark @click="endCombat">End Combat</v-btn>
        </v-col>
      </v-row>

      <v-dialog v-model="overchargeDialog" scrollable width="500px" transition="dialog-transition">
        <v-card>
          <v-toolbar flat dark color="pink accent-3" class="major-title">Overcharge</v-toolbar>
          <v-card-text class="effect-text pb-0">
            <p>
              Overcharging immediately allows you to make any quick action of your choice as a free
              action, even one you already made this turn.
            </p>
            <p class="text-center minor-title pb-0">
              Overcharging will incur
              <span class="red--text text--darken-2">
                {{ overcharge[mech.CurrentOvercharge] }} Heat
              </span>
              <br />
              <span class="caption">INPUT HEAT COST TO CONFIRM OVERCHARGE</span>
            </p>
            <div class="ml-5 mr-5">
              <v-text-field
                v-model="overcharge_heat"
                type="number"
                label="Heat Roll Result"
                outline
                append-outer-icon="add"
                @click:append-outer="overcharge_heat < 10 ? overcharge_heat++ : ''"
                prepend-icon="remove"
                @click:prepend="overcharge_heat > 0 ? overcharge_heat-- : ''"
              ></v-text-field>
            </div>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn flat color="primary" @click="overchargeDialog = false">Cancel</v-btn>
            <v-spacer />
            <v-btn
              large
              dark
              color="pink accent-3"
              :disabled="!overcharge_heat || overcharge_heat === '0'"
              @click="commitOvercharge"
            >
              Overcharge
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="stabilizeDialog"
        scrollable
        max-width="825px"
        transition="dialog-transition"
      >
        <v-card>
          <v-toolbar flat dark color="indigo darken-1" class="major-title">Stabilize</v-toolbar>
          <v-card-text class="effect-text pb-0">
            <p>
              Enact emergency protocols in order to purge your mech‘s systems of excess heat, repair
              your chassis where you can, and buy your system time to eliminate hostile code.
            </p>
            <p class="caption red--text text-center pa-0">
              <b>// WARNING: THIS ACTION CANNOT BE UNDONE //</b>
            </p>
            <p class="text-center minor-title pb-0">
              <span class="caption">Choose one of the following:</span>
              <v-radio-group v-model="stabilizeMajor">
                <v-radio
                  label="Cool Mech, resetting the heat gauge and ending the exposed status"
                  value="cool"
                />
                <v-radio
                  :label="
                    `Spend 1 Repair to refill HP to maximum. ${
                      !mech.CurrentRepairs ? ' // REPAIR CAPACITY EXHAUSTED //' : ''
                    }`
                  "
                  value="repair"
                  :disabled="!mech.CurrentRepairs"
                />
              </v-radio-group>
              <v-divider class="mt-2 mb-2 ml-5 mr-5" />
              <span class="caption">And one of the following:</span>
              <v-radio-group v-model="stabilizeMinor">
                <v-radio label="Reload all weapons with the Loading Tag" value="reload" />
                <v-radio
                  :label="
                    `End all Burn currently affecting your mech ${
                      mech.Burn === 0 ? ' // BURN STATUS NOMINAL //' : ''
                    }`
                  "
                  value="end_burn"
                  :disabled="mech.Burn === 0"
                />
                <v-radio
                  :label="
                    `End a condition affecting your mech ${
                      !mech.Conditions.length ? ' // MECH STATUS NOMINAL //' : ''
                    }`
                  "
                  value="end_self_condition"
                  :disabled="!mech.Conditions.length"
                />
                <v-radio
                  label="End a condition affecting an adjacent ally"
                  value="end_ally_condition"
                />
              </v-radio-group>
            </p>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn flat color="primary" @click="stabilizeDialog = false">Cancel</v-btn>
            <v-spacer />
            <v-btn
              large
              dark
              color="indigo darken-3"
              :disabled="!stabilizeMajor || !stabilizeMinor"
              @click="commitStabilize"
            >
              Stabilize
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="conditionDialog" width="500px" persistent transition="dialog-transition">
        <v-card>
          <v-toolbar dark flat class="major-title">Select Condiditon to End</v-toolbar>
          <v-card-text>
            <v-btn v-for="c in mech.Conditions" :key="c" block large @click="endCondition(c)">
              {{ c }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionButton from './ActionButton.vue'
import TickBar from '../../../components/UI/TickBar.vue'

export default Vue.extend({
  name: 'turn-manager',
  components: { ActionButton, TickBar },
  props: {
    pilot: Object,
    mech: Object,
    loadout: Object,
  },
  data: () => ({
    step: 2,
    turn: 1,
    move: 0,
    maxMove: 0,
    actions: 2,
    overwatch: false,
    braced: false,
    overcharged: false,
    prepare: false,
    bracedCooldown: false,
    overchargeDialog: false,
    stabilizeDialog: false,
    stabilizeMajor: null,
    stabilizeMinor: null,
    conditionDialog: false,
    redundant: false,
    history: [],
    overcharge: ['+1', '+1d3', '+1d6', '+1d6+4'],
    overcharge_heat: '',
  }),
  methods: {
    undo() {
      let action = this.history.pop()
      switch (action.field) {
        case 'avoid_meltdown':
          this.mech.MeltdownImminent = true
        case 'meltdown':
          this.mech.IsDestroyed = false
          this.mech.ReactorDestroyed = false
        case 'boost':
          this.maxMove -= this.mech.IsEjected ? this.pilot.Speed : this.mech.Speed
          if (this.move < this.maxMove) this.move === this.maxMove
          this.actions += 1
          break
        case 'hide':
          const hidx = this.mech.Statuses.findIndex(x => x === 'Hidden')
          if (hidx > -1) this.mech.Statuses.splice(hidx, 1)
          this.actions += 1
          break
        case 'dismount':
          this.actions += 1
        case 'eject':
          this.mech.IsEjected = false
          this.actions += 1
          break
        case 'remount':
          this.mech.IsEjected = true
          this.actions += 2
          break
        case 'bombard':
          this.actions += 2
          const abidx = this.pilot.Reserves.findIndex(x => x.ID === 'reserve_bombardment')
          if (abidx > -1) this.pilot.Reserves[abidx].Used = false
          break
        case 'depshield':
          const dsidx = this.pilot.Reserves.findIndex(x => x.ID === 'reserve_bombardment')
          if (dsidx > -1) this.pilot.Reserves[dsidx].Used = false
          break
        case 'corebattery':
          const cdidx = this.pilot.Reserves.findIndex(x => x.ID === 'reserve_bombardment')
          this.mech.CurrentCoreEnergy = 0
          if (cdidx > -1) this.pilot.Reserves[cdidx].Used = false
          break
        case 'overcharge':
          this.mech.ReduceHeat(parseInt(action.val), true)
          this.actions -= 1
          break
        case 'prepare':
          this.actions += 1
        case 'shutdown':
          this.actions += 1
          const sdidx = this.mech.Statuses.findIndex(x => x === 'Shut Down')
          if (sdidx > -1) this.mech.Statuses.splice(sdidx, 1)
        case 'braced':
          const bidx = this.mech.Resistances.findIndex(x => x === 'Next Attack')
          if (bidx > -1) this.mech.Resistances.splice(bidx, 1)
        default:
          Vue.set(this, action.field, action.val)
          break
      }
    },
    newTurn() {
      this.turn++
      this.history = []
      this.move = 0
      this.actions = 2
      this.maxMove = this.mech.IsEjected ? this.pilot.Speed : this.mech.Speed
      this.overcharged = false
      this.overwatch = false
      this.prepare = false
      if (this.braced) {
        this.bracedCooldown = true
        this.actions = 1
        this.move = this.maxMove
        this.braced = false
      } else if (this.bracedCooldown) {
        this.bracedCooldown = false
      }
      if (this.mech.Burn) {
        this.mech.AddDamage(this.mech.Burn, 'Burn')
      }
    },
    restart() {
      this.turn = 1
      this.history = []
      this.move = 0
      this.actions = 2
      this.maxMove = this.mech.IsEjected ? this.pilot.Speed : this.mech.Speed
      this.overcharged = false
      this.prepare = false
      this.braced = false
      this.bracedCooldown = false
    },
    actionColor() {
      if (this.mech.IsShutDown) return 'grey'
      if (this.actions > 2) return 'light-blue darken-1'
      if (this.actions == 2) return 'indigo darken-1'
      if (this.actions == 1) return 'info'
      return 'grey'
    },
    quickAction() {
      if (this.actions > 0) {
        this.history.push({ field: 'actions', val: this.actions })
        this.actions--
      }
    },
    boost() {
      if (this.actions > 0) {
        this.history.push({ field: 'boost' })
        this.actions--
        this.maxMove += this.mech.IsEjected ? this.pilot.Speed : this.mech.Speed
        if (this.move < 0) this.move === 0
      }
    },
    hide() {
      this.history.push({ field: 'hide', val: false })
      if (!this.mech.Statuses.includes('Hidden')) this.mech.Statuses.push('Hidden')
      this.actions -= 1
    },
    dismount() {
      this.history.push({ field: 'dismount', val: false })
      this.mech.IsEjected = true
      this.actions -= 2
    },
    eject() {
      this.history.push({ field: 'eject', val: false })
      this.mech.IsEjected = true
      this.actions -= 1
    },
    remount() {
      this.history.push({ field: 'remount', val: false })
      this.mech.IsEjected = false
      this.actions -= 2
    },
    fullAction() {
      if (this.actions >= 2) {
        this.history.push({ field: 'actions', val: 2 })
        this.actions -= 2
      }
    },
    bombard() {
      if (this.actions >= 2) {
        this.history.push({ field: 'bombard', val: false })
        this.actions -= 2
        const abidx = this.pilot.Reserves.findIndex(x => x.ID === 'reserve_bombardment')
        if (abidx > -1) this.pilot.Reserves[abidx].Used = true
      }
    },
    redundantRepair() {
      const rridx = this.pilot.Reserves.findIndex(x => x.ID === 'reserve_redundantrepair')
      if (rridx > -1) this.pilot.Reserves[rridx].Used = true
      this.openStabilize(true)
    },
    deployableShield() {
      this.history.push({ field: 'depshield', val: false })
      const dsidx = this.pilot.Reserves.findIndex(x => x.ID === 'reserve_deployableshield')
      if (dsidx > -1) this.pilot.Reserves[dsidx].Used = true
    },
    coreBattery() {
      this.history.push({ field: 'corebattery', val: false })
      const cbidx = this.pilot.Reserves.findIndex(x => x.ID === 'reserve_corebattery')
      if (cbidx > -1) this.pilot.Reserves[cbidx].Used = true
      this.mech.CurrentCoreEnergy = 1
    },
    setPrepare() {
      this.history.push({ field: 'prepare', val: false })
      this.prepare = true
      this.actions -= 1
    },
    setBrace() {
      this.history.push({ field: 'braced', val: false })
      if (!this.mech.Resistances.includes('Next Attack')) this.mech.Resistances.push('Next Attack')
      this.braced = true
    },
    setOverwatch() {
      this.history.push({ field: 'overwatch', val: false })
      this.overwatch = true
    },
    openOvercharge() {
      this.overchargeDialog = true
    },
    commitOvercharge() {
      this.overchargeDialog = false
      this.history.push({ field: 'overcharge', val: this.overcharge_heat })
      this.overcharged = true
      this.mech.CurrentOvercharge += 1
      this.actions++
      this.mech.AddHeat(parseInt(this.overcharge_heat))
      this.overcharge_heat = ''
    },
    openStabilize(redundant?: boolean) {
      this.redundant = redundant || false
      this.stabilizeDialog = true
    },
    commitStabilize() {
      this.stabilizeDialog = false
      switch (this.stabilizeMajor) {
        case 'cool':
          this.mech.CurrentHeat = 0
          this.endStatus('Exposed')
          break
        case 'repair':
          this.mech.CurrentRepairs -= 1
          this.mech.CurrentHP = this.mech.MaxHP
          break
      }
      switch (this.stabilizeMinor) {
        case 'reload':
          this.loadout.ReloadAll()
          break
        case 'end_burn':
          this.mech.Burn = 0
          break
        case 'end_self_condition':
          this.conditionDialog = true
        case 'end_ally_condition':
          break
      }
      if (!this.redundant) this.actions -= 2
    },
    endCondition(c: string) {
      const cidx = this.mech.Conditions.findIndex(x => x === c)
      if (cidx > -1) this.mech.Conditions.splice(cidx, 1)
      this.conditionDialog = false
    },
    endStatus(s: string) {
      const stidx = this.mech.Statuses.findIndex(x => x === s)
      if (stidx > -1) this.mech.Statuses.splice(stidx, 1)
    },
    shutDown() {
      this.mech.Statuses.push('Shut Down')
      this.mech.Conditions.push('Stunned')
      this.actions -= 1
      this.mech.CurrentHeat = 0
      this.endStatus('Exposed')
      this.history.push({ field: 'shutdown' })
    },
    boot() {
      this.move = 0
      this.endStatus('Shut Down')
      this.endCondition('Stunned')
      this.actions -= 2
    },
    meltdown() {
      this.history.push({ field: 'meltdown', val: true })
      this.mech.Destroy()
      this.mech.ReactorDestroyed = true
    },
    avoidMeltdown() {
      this.history.push({ field: 'avoid_meltdown', val: false })
      this.mech.MeltdownImminent = false
    },
    endCombat() {
      this.$emit('end')
    },
  },
  created() {
    this.maxMove = this.mech.IsEjected ? this.pilot.Speed : this.mech.Speed
  },
})
</script>

<style scoped>
.reaction-bg {
  background-color: #6a1b9a;
}

.prepare-bg {
  background-color: #01579b;
}
</style>
