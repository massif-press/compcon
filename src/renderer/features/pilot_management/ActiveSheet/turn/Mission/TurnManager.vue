<template>
  <v-window-item>
    <div v-if="mech.IsDestroyed">
      <destroyed-alert :mech="mech" />
      <cc-tooltip top simple inline content="Undo last action">
        <v-btn slot="activator" icon absolute right small :disabled="!history.length" @click="undo">
          <v-icon small>undo</v-icon>
        </v-btn>
      </cc-tooltip>
      <v-btn block color="amber darken-4" dark @click="endCombat()">End Combat</v-btn>
    </div>
    <div v-else class="text-center">
      <div class="heading h2 destroyed-bg" v-html="'COMBAT ENGAGED'" />
      <div class="heading h2" style="line-height: 60px;">
        <span>TURN</span>
        <span class="overcharge--text">{{ turn }}</span>
      </div>
      <div v-if="mech.IsEjected" class="heading h3 reaction-bg" v-html="'PILOT EJECTED'" />
      <div v-else class="heading h3">
        <div v-if="braced" class=" reaction-bg" v-html="'BRACED'" />
        <div v-if="bracedCooldown" class="red--text destroyed-bg" v-html="'// BRACE RECOVERY //'" />
        <div v-if="mech.IsShutDown" class=" red--text destroyed-bg" v-html="'// SHUT DOWN //'" />
        <div v-if="overwatch" class=" reaction-bg" v-html="'OVERWATCH'" />
        <div v-if="prepare" class=" prepare-bg" v-html="'PREPARED ACTION'" />
      </div>
      <v-divider class="ma-2" />
      <v-col cols="12" class="caption mb-2">&mdash; ACTIONS REMAINING &mdash;</v-col>
      <v-col cols="12" class="caption">
        <cc-tooltip simple inline content="Move">
          <v-avatar
            :key="move"
            slot="activator"
            size="4.5em"
            class="ml-1 mr-1"
            :color="move === maxMove || bracedCooldown || mech.IsShutDown ? 'grey' : 'red darken-3'"
          >
            <v-icon size="3.25em" dark>$vuetify.icons.move</v-icon>
          </v-avatar>
        </cc-tooltip>
        <cc-tooltip simple inline content="1 Full Action / 2 Quick Actions">
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
        </cc-tooltip>
        <cc-tooltip simple inline content="Overcharge">
          <v-avatar
            size="4.5em"
            class="ml-1 mr-1"
            :color="bracedCooldown || overcharged || mech.IsShutDown ? 'grey' : 'pink accent-3'"
          >
            <v-icon size="3.25em" dark>$vuetify.icons.overcharge</v-icon>
          </v-avatar>
        </cc-tooltip>
        <cc-tooltip simple inline content="Reactions">
          <v-avatar
            size="4.5em"
            class="ml-1 mr-1"
            :color="
              bracedCooldown || overwatch || braced || mech.IsShutDown ? 'grey' : 'purple darken-3'
            "
          >
            <v-icon size="3.25em" dark>$vuetify.icons.reaction</v-icon>
          </v-avatar>
        </cc-tooltip>
        <cc-tooltip simple inline content="Free Actions">
          <v-avatar
            slot="activator"
            size="4.5em"
            class="ml-1 mr-1"
            :color="bracedCooldown || mech.IsShutDown ? 'grey' : 'green darken-3'"
          >
            <v-icon size="3.25em" dark>$vuetify.icons.free</v-icon>
          </v-avatar>
        </cc-tooltip>
      </v-col>
      <div class="overline text-center mt-3">&mdash; MOVEMENT &mdash;</div>
      <div>
        <div style="display: table; margin: 0 auto;">
          <cc-tick-bar
            :key="move"
            label="SPACES MOVED"
            :current="move"
            :max="maxMove"
            large
            full-icon="$vuetify.icons.move"
            color="red accent-4"
            :readonly="mech.IsShutDown"
            @update="move = $event"
          />
        </div>
      </div>
      <div>
        <v-tooltip top>
          <v-btn
            slot="activator"
            flat
            icon
            absolute
            right
            small
            :disabled="!history.length"
            @click="undo"
          >
            <v-icon small>undo</v-icon>
          </v-btn>
          <span>Undo last action</span>
        </v-tooltip>
      </div>
      <div class="overline text-center mt-2 mb-1">&mdash; ACTIONS &mdash;</div>
      <v-expand-transition group>
        <div v-show="mech.IsShutDown" key="a-boot">
          <action-button v-if="actions >= 2" action-id="bootup" class="mb-1" @click="boot()" />
        </div>
        <div v-show="mech.IsEjected && !mech.IsShutDown && actions >= 2" key="a-remount">
          <action-button action-id="mount" name-override="Remount Mech" @click="remount()" />
        </div>

        <v-row v-show="actions" key="a-r1" justify="center">
          <action-button cols="4" action-id="quickactivate" @click="quickAction()" />
          <action-button cols="4" action-id="boost" @click="boost()" />
          <action-button cols="4" action-id="hide" @click="hide()" />
          <action-button cols="6" action-id="search" @click="quickAction()" />
          <action-button cols="6" action-id="prepare" @click="setPrepare()" />
        </v-row>

        <v-row v-show="actions >= 2" key="a-r2" justify="center">
          <action-button
            v-if="pilot.has('reserve', 'bombardment')"
            action-id="bombardment"
            @click="bombard()"
          />
          <action-button cols="6" action-id="fight" @click="fullAction()" />
          <action-button cols="6" action-id="jockey" @click="fullAction()" />
          <action-button cols="6" action-id="fullactivate" @click="fullAction()" />
          <action-button cols="6" action-id="disengage" @click="fullAction()" />
        </v-row>

        <v-row v-show="!braced && !overwatch && !bracedCooldown" key="a-r3" justify="center">
          <action-button cols="6" action-id="overwatch" @click="setOverwatch()" />
          <action-button cols="6" action-id="brace" @click="setBrace()" />
        </v-row>

        <v-row v-show="!bracedCooldown && !overcharged" key="a-r4">
          <action-button action-id="overcharge" @click="$refs.overcharge.show()" />
        </v-row>

        <v-row v-show="pilot.has('reserve', 'redundantrepair')" key="a-r5">
          <action-button action-id="redundantrepair" @click="redundantRepair()" />
        </v-row>

        <v-row v-show="pilot.has('reserve', 'deployableshield')" key="a-r6">
          <action-button action-id="deployableshield" @click="deployableShield()" />
        </v-row>

        <v-row v-show="pilot.has('reserve', 'corebattery')" key="a-r7">
          <action-button
            action-id="corebattery"
            :disabled="mech.CurrentCoreEnergy > 0"
            @click="coreBattery()"
          />
        </v-row>
      </v-expand-transition>
    </div>

    <div v-if="!mech.IsShutDown && !mech.IsEjected">
      <v-col v-if="mech.MeltdownImminent" cols="12" class="mb-3">
        <v-btn block x-large class="ma-0" color="red accent-4" @click="meltdown()">
          REACTOR MELTDOWN
        </v-btn>
        <v-btn
          block
          small
          outlined
          class="ma-0 mt-1"
          color="light-green accent-3"
          @click="avoidMeltdown()"
        >
          STABILIZE REACTOR
        </v-btn>
      </v-col>
      <v-expand-transition group>
        <v-row v-show="actions" key="a-r8" justify="center">
          <action-button cols="4" action-id="skirmish" @click="quickAction()" />
          <action-button cols="4" action-id="quickactivate" @click="quickAction()" />
          <action-button cols="4" action-id="quicktech" @click="quickAction()" />
          <action-button cols="4" action-id="boost" @click="boost()" />
          <action-button cols="4" action-id="ram" @click="quickAction()" />
          <action-button cols="4" action-id="grapple" @click="quickAction()" />
          <action-button cols="6" action-id="hide" @click="hide()" />
          <action-button cols="6" action-id="search" @click="quickAction()" />
        </v-row>
        <v-row v-show="actions >= 2" key="a-r9" justify="center">
          <action-button
            v-if="pilot.has('reserve', 'bombardment')"
            action-id="bombardment"
            @click="bombard()"
          />
          <action-button cols="4" action-id="barrage" @click="fullAction()" />
          <action-button cols="4" action-id="fullactivate" @click="fullAction()" />
          <action-button cols="4" action-id="fulltech" @click="fullAction()" />
          <action-button cols="6" action-id="stabilize" @click="$refs.stabilize.show()" />
          <action-button cols="6" action-id="disengage" @click="fullAction()" />
        </v-row>
        <v-row v-show="!braced && !overwatch && !bracedCooldown" key="a-r10" justify="center">
          <action-button cols="6" action-id="overwatch" @click="setOverwatch()" />
          <action-button cols="6" action-id="brace" @click="setBrace()" />
        </v-row>

        <v-row v-show="!bracedCooldown && !overcharged" key="a-r11" justify="center">
          <action-button action-id="overcharge" @click="$refs.overcharge.show()" />
        </v-row>
        <v-row v-show="pilot.has('reserve', 'redundantrepair')" key="a-r12" justify="center">
          <action-button action-id="redundantrepair" @click="redundantRepair()" />
        </v-row>
        <v-row v-show="pilot.has('reserve', 'deployableshield')" key="a-r13" justify="center">
          <action-button action-id="deployableshield" @click="deployableShield()" />
        </v-row>
        <v-row v-show="pilot.has('reserve', 'corebattery')" key="a-r14" justify="center">
          <action-button
            action-id="corebattery"
            :disabled="mech.CurrentCoreEnergy"
            @click="coreBattery()"
          />
        </v-row>

        <v-expansion-panel v-show="actions" key="a-r15" class="mt-2">
          <v-expansion-panel-content
            style="background-color: var(--v-panel-base)"
            class="pa-2 pr-3"
          >
            <span slot="header" class="heading h3">Other Actions</span>
            <action-button v-if="actions >= 1" action-id="shutdown" @click="shutDown()" />
            <action-button v-if="actions >= 1" action-id="eject" @click="eject()" />
            <action-button v-if="actions >= 1" action-id="selfdestruct" @click="quickAction()" />
            <action-button v-if="actions >= 1" action-id="prepare" @click="setPrepare()" />
            <action-button
              v-if="actions >= 2"
              action-id="mount"
              name-override="Dismount"
              @click="dismount()"
            />
            <action-button v-if="actions >= 2" action-id="skillcheck" @click="fullAction()" />
            <action-button v-if="actions >= 2" action-id="improvattack" @click="fullAction()" />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expand-transition>
    </div>
    <v-btn block color="warning" outlined dark large @click="newTurn()">END TURN</v-btn>
    <v-divider class="ma-2" />
    <v-btn block color="amber darken-4" dark @click="endCombat">End Combat</v-btn>
    <overcharge-dialog ref="overcharge" :mech="mech" @overcharge="commitOvercharge($event)" />
    <stabilize-dialog ref="stabilize" :mech="mech" />
    <condition-dialog ref="condition" :mech="mech" />
  </v-window-item>
</template>

<script lang="ts">
import Vue from 'vue'
import { Undo } from './logic/TurnUndoManager'
import ActionButton from './components/ActionButton.vue'
import DestroyedAlert from './components/DestroyedAlert.vue'
import StabilizeDialog from './components/StabilizeDialog.vue'
import ConditionDialog from './components/ConditionDialog.vue'
import OverchargeDialog from './components/OverchargeDialog.vue'

export default Vue.extend({
  name: 'turn-manager',
  components: { ActionButton, DestroyedAlert, StabilizeDialog, ConditionDialog, OverchargeDialog },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
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
    stabilizeMajor: null,
    stabilizeMinor: null,
    redundant: false,
    history: [],
    overcharge: ['+1', '+1d3', '+1d6', '+1d6+4'],
  }),
  computed: {
    mech() {
      return this.pilot.ActiveMech
    },
    loadout() {
      return this.mech.ActiveLoadout
    },
  },
  created() {
    this.maxMove = this.mech.IsEjected ? this.pilot.Speed : this.mech.Speed
  },
  methods: {
    undo() {
      this.actions += Undo(this.history.pop(), this.mech)
      //   default:
      //     Vue.set(this, action.field, action.val)
      //     break
    },
    newTurn() {
      this.turn += 1
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
      this.$refs.stabilize.show(true)
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
    commitOvercharge(heat: number) {
      this.history.push({ field: 'overcharge', val: heat })
      this.overcharged = true
      this.mech.CurrentOvercharge += 1
      this.actions += 1
      this.mech.AddHeat(heat)
    },
    commitStabilize() {
      // this.$refs.stabilize.show()false
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
          this.$refs.condition.show()
        case 'end_ally_condition':
          break
      }
      if (!this.redundant) this.actions -= 2
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
