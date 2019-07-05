<template>
  <div>
    <v-layout column fill-height>
      <v-flex xs12 class="major-title text-xs-center destroyed-bg">
        <span>COMBAT ENGAGED</span>
      </v-flex>
      <v-flex xs12 class="callsign-text text-xs-center" style="line-height: 60px;">
        <span>TURN</span>
        <span class="pink--text">{{turn}}</span>
      </v-flex>
      <v-flex v-if="braced" xs12 class="minor-title text-xs-center reaction-bg">
        <span v-html="'BRACED'" />
      </v-flex>
      <v-flex v-if="bracedCooldown" xs12 class="minor-title red--text text-xs-center destroyed-bg">
        <span v-html="'// BRACE RECOVERY //'" />
      </v-flex>
      <v-flex v-if="mech.IsShutDown" xs12 class="minor-title red--text text-xs-center destroyed-bg">
        <span v-html="'// SHUT DOWN //'" />
      </v-flex>
      <v-flex v-if="overwatch" xs12 class="minor-title text-xs-center reaction-bg">
        <span v-html="'OVERWATCH'" />
      </v-flex>
      <v-flex v-if="prepare" xs12 class="minor-title text-xs-center prepare-bg">
        <span v-html="'PREPARED ACTION'" />
      </v-flex>
      <v-divider dark class="ma-2" />
      <v-flex xs12 class="caption text-xs-center mb-2">&mdash; ACTIONS REMAINING &mdash;</v-flex>
      <v-flex xs12 class="caption text-xs-center">
        <v-tooltip bottom>
          <v-avatar
            slot="activator"
            size="4.5em"
            class="ml-1 mr-1"
            :key="move"
            :color=" move === maxMove || bracedCooldown || mech.IsShutDown ? 'grey' : 'red darken-3'"
          >
            <v-icon size="3.25em" dark>$vuetify.icons.move</v-icon>
          </v-avatar>
          <span>Move</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-avatar slot="activator" size="4.5em" :color="actionColor()" class="ml-1 mr-1">
            <v-icon
              v-if="actions > 2 && !mech.IsShutDown"
              size="3.25em"
              dark
            >$vuetify.icons.overcharge</v-icon>
            <v-icon
              v-else-if="actions === 2 && !mech.IsShutDown"
              size="3.25em"
              dark
            >$vuetify.icons.full</v-icon>
            <v-icon
              v-else-if="actions === 1 && !mech.IsShutDown"
              size="3.25em"
              dark
            >$vuetify.icons.quick</v-icon>
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
            :color=" bracedCooldown || overwatch || braced || mech.IsShutDown ? 'grey' : 'purple darken-3'"
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
            :color=" bracedCooldown || mech.IsShutDown  ? 'grey' : 'green darken-3'"
          >
            <v-icon size="3.25em" dark>$vuetify.icons.free</v-icon>
          </v-avatar>
          <span>Free Actions</span>
        </v-tooltip>
      </v-flex>
      <v-flex xs12 class="caption text-xs-center mt-3">&mdash; MOVEMENT &mdash;</v-flex>
      <v-flex xs12>
        <div style="display: table; margin: 0 auto;">
          <tick-bar
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
      </v-flex>
      <v-flex xs12>
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
      </v-flex>
      <v-flex xs12 class="caption text-xs-center mt-2 mb-1">&mdash; ACTIONS &mdash;</v-flex>

      <v-flex xs12 v-if="mech.IsShutDown">
        <action-button v-if="actions >= 2" action-id="action_bootup" class="mb-1" @click="boot()" />
      </v-flex>

      <v-flex v-else xs12>
        <v-expand-transition>
          <v-layout row wrap justify-center v-show="actions">
            <v-flex xs4>
              <div class="mr-1 mb-1">
                <action-button action-id="action_skirmish" @click="quickAction()" />
              </div>
            </v-flex>
            <v-flex xs4>
              <div class="mr-1 mb-1">
                <action-button action-id="action_quickactivate" @click="quickAction()" />
              </div>
            </v-flex>
            <v-flex xs4>
              <div class="mr-1 mb-1">
                <action-button action-id="action_quicktech" @click="quickAction()" />
              </div>
            </v-flex>
            <v-flex xs4>
              <div class="mr-1 mb-1">
                <action-button action-id="action_boost" @click="boost()" />
              </div>
            </v-flex>
            <v-flex xs4>
              <div class="mr-1 mb-1">
                <action-button action-id="action_ram" @click="quickAction()" />
              </div>
            </v-flex>
            <v-flex xs4>
              <div class="mr-1 mb-1">
                <action-button action-id="action_grapple" @click="quickAction()" />
              </div>
            </v-flex>
            <v-flex xs6>
              <div class="mr-1 mb-1">
                <action-button action-id="action_hide" @click="hide()" />
              </div>
            </v-flex>
            <v-flex xs6>
              <div class="mr-1 mb-1">
                <action-button action-id="action_search" @click="quickAction()" />
              </div>
            </v-flex>
          </v-layout>
        </v-expand-transition>
        <v-expand-transition>
          <v-layout row wrap justify-center v-show="actions >= 2">
            <v-flex class="mr-1 mb-1">
              <action-button action-id="action_barrage" @click="fullAction()" />
            </v-flex>
            <v-flex class="mr-1 mb-1">
              <action-button action-id="action_fullactivate" @click="fullAction()" />
            </v-flex>
            <v-flex class="mr-1 mb-1">
              <action-button action-id="action_fulltech" @click="fullAction()" />
            </v-flex>
            <v-flex class="mr-1 mb-1">
              <action-button action-id="action_stabilize" @click="openStabilize()" />
            </v-flex>
            <v-flex class="mr-1 mb-1">
              <action-button action-id="action_disengage" @click="fullAction()" />
            </v-flex>
          </v-layout>
        </v-expand-transition>
        <v-expand-transition>
          <v-layout row wrap justify-center v-show="!braced && !overwatch && !bracedCooldown">
            <v-flex class="mr-1 mb-1">
              <action-button action-id="action_overwatch" @click="setOverwatch()" />
            </v-flex>
            <v-flex class="mr-1 mb-1">
              <action-button action-id="action_brace" @click="setBrace()" />
            </v-flex>
          </v-layout>
        </v-expand-transition>
        <v-expand-transition>
          <v-layout row wrap justify-center v-show="!bracedCooldown && !overcharged">
            <v-flex class="mr-1 mb-1">
              <action-button action-id="action_overcharge" @click="openOvercharge" />
            </v-flex>
          </v-layout>
        </v-expand-transition>

        <v-expansion-panel class="mt-2">
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
              @click="quickAction()"
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
              @click="fullAction()"
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
      </v-flex>
      <v-flex xs12 class="text-xs-center ma-2 mt-4">
        <v-btn block color="warning" outline dark small @click="newTurn()">END TURN</v-btn>
      </v-flex>
    </v-layout>
    <v-divider class="ma-2" />
    <v-layout row wrap>
      <v-flex xs12>
        <v-btn block color="amber darken-4" dark @click="endCombat">End Combat</v-btn>
      </v-flex>
    </v-layout>

    <v-dialog v-model="overchargeDialog" scrollable width="500px" transition="dialog-transition">
      <v-card>
        <v-toolbar flat dark color="pink accent-3" class="major-title">Overcharge</v-toolbar>
        <v-card-text class="effect-text pb-0">
          <p>Overcharging immediately allows you to make any quick action of your choice as a free action, even one you already made this turn.</p>
          <p class="text-xs-center minor-title pb-0">
            Overcharging will incur
            <span
              class="red--text text--darken-2"
            >{{overcharge[mech.CurrentOvercharge]}} Heat</span>
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
          >Overcharge</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="stabilizeDialog" scrollable max-width="825px" transition="dialog-transition">
      <v-card>
        <v-toolbar flat dark color="indigo darken-1" class="major-title">Stabilize</v-toolbar>
        <v-card-text class="effect-text pb-0">
          <p>Enact emergency protocols in order to purge your mech‘s systems of excess heat, repair your chassis where you can, and buy your system time to eliminate hostile code.</p>
          <p class="caption red--text text-xs-center pa-0">
            <b>// WARNING: THIS ACTION CANNOT BE UNDONE //</b>
          </p>
          <p class="text-xs-center minor-title pb-0">
            <span class="caption">Choose one of the following:</span>
            <v-radio-group v-model="stabilizeMajor">
              <v-radio
                label="Cool Mech, resetting the heat gauge and ending the exposed status"
                value="cool"
              />
              <v-radio
                :label="`Spend 1 Repair to refill HP to maximum. ${!mech.CurrentRepairs ? ' // REPAIR CAPACITY EXHAUSTED //': ''}`"
                value="repair"
                :disabled="!mech.CurrentRepairs"
              />
            </v-radio-group>
            <v-divider class="mt-2 mb-2 ml-5 mr-5" />
            <span class="caption">And one of the following:</span>
            <v-radio-group v-model="stabilizeMinor">
              <v-radio label="Reload all weapons with the Loading Tag" value="reload" />
              <v-radio
                :label="`End all Burn currently affecting your mech ${mech.Burn === 0 ? ' // BURN STATUS NOMINAL //': ''}`"
                value="end_burn"
                :disabled="mech.Burn === 0"
              />
              <v-radio
                :label="`End a condition affecting your mech ${!mech.Conditions.length ? ' // MECH STATUS NOMINAL //': ''}`"
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
          >Stabilize</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="conditionDialog" width="500px" persistent transition="dialog-transition">
      <v-card>
        <v-toolbar dark flat class="major-title">Select Condiditon to End</v-toolbar>
        <v-card-text>
          <v-btn v-for="c in mech.Conditions" :key="c" block large @click="endCondition(c)">{{c}}</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
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
    history: [],
    overcharge: ['+1', '+1d3', '+1d6', '+1d6+4'],
    overcharge_heat: '',
  }),
  methods: {
    undo() {
      let action = this.history.pop()
      switch (action.field) {
        case 'boost':
          this.maxMove -= this.mech.Speed
          if (this.move < this.maxMove) this.move === this.maxMove
          this.actions += 1
          break
        case 'hide':
          const hidx = this.mech.Statuses.findIndex(x => x === 'Hidden')
          if (hidx > -1) this.mech.Statuses.splice(hidx, 1)
          this.actions += 1
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
      this.maxMove = this.mech.Speed
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
      this.maxMove = this.mech.Speed
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
        this.maxMove += this.mech.Speed
        if (this.move < 0) this.move === 0
      }
    },
    hide() {
      this.history.push({ field: 'hide', val: false })
      if (!this.mech.Statuses.includes('Hidden'))
        this.mech.Statuses.push('Hidden')
      this.actions -= 1
    },
    fullAction() {
      if (this.actions >= 2) {
        this.history.push({ field: 'actions', val: 2 })
        this.actions -= 2
      }
    },
    setPrepare() {
      this.history.push({ field: 'prepare', val: false })
      this.prepare = true
      this.actions -= 1
    },
    setBrace() {
      this.history.push({ field: 'braced', val: false })
      if (!this.mech.Resistances.includes('Next Attack'))
        this.mech.Resistances.push('Next Attack')
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
    openStabilize() {
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
      this.actions -= 2
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
    endCombat() {
      this.$emit('end')
    },
  },
  created() {
    this.maxMove = this.mech.Speed
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

