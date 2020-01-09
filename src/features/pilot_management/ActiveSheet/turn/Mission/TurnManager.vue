<template>
  <v-window-item>
    <div v-if="mech.Destroyed || mech.ReactorDestroyed">
      <destroyed-alert :mech="mech" />
    </div>
    <div v-else class="text-center">
      <span class="overline" v-html="'//COMBAT ENGAGED//'" />
      <div class="heading h1 mt-n4">
        <span>TURN</span>
        <span class="overcharge--text">{{ turn }}</span>
      </div>
      <div
        v-if="mech.Ejected"
        class="heading h3 reaction-bg white--text pb-1"
        v-html="'PILOT EJECTED'"
      />
      <div v-else class="heading h3">
        <div v-if="braced" class="heading h3 action--reaction white--text pb-1" v-html="'BRACED'" />
        <div v-if="bracedCooldown" class="red--text destroyed-bg" v-html="'// BRACE RECOVERY //'" />
        <div v-if="mech.IsShutDown" class=" red--text destroyed-bg" v-html="'// SHUT DOWN //'" />
        <div
          v-if="overwatch"
          class="heading h3 action--reaction white--text pb-1"
          v-html="'OVERWATCH'"
        />
        <div
          v-if="prepare"
          class="heading h3 action--reaction white--text pb-1"
          v-html="'PREPARED ACTION'"
        />
      </div>
      <v-divider class="mb-2" />
      <span class="caption mb-2">&mdash; ACTIONS REMAINING &mdash;</span>
      <v-row dense>
        <v-col cols="12" class="caption">
          <cc-tooltip simple inline content="Move">
            <v-avatar
              :key="move"
              size="4.5em"
              :color="
                move === maxMove || bracedCooldown || mech.IsShutDown ? 'grey' : 'action--move'
              "
            >
              <v-icon size="3.25em" dark>$vuetify.icons.move</v-icon>
            </v-avatar>
          </cc-tooltip>
          <cc-tooltip simple inline content="1 Full Action / 2 Quick Actions">
            <v-avatar size="4.5em" :color="actionColor()">
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
              :color="
                bracedCooldown || overcharged || mech.IsShutDown ? 'grey' : 'action--overcharge'
              "
            >
              <v-icon size="3.25em" dark>$vuetify.icons.overcharge</v-icon>
            </v-avatar>
          </cc-tooltip>
          <cc-tooltip simple inline content="Reactions">
            <v-avatar
              size="4.5em"
              :color="
                bracedCooldown || overwatch || braced || mech.IsShutDown
                  ? 'grey'
                  : 'action--reaction'
              "
            >
              <v-icon size="3.25em" dark>$vuetify.icons.reaction</v-icon>
            </v-avatar>
          </cc-tooltip>
          <cc-tooltip simple inline content="Free Actions">
            <v-avatar
              size="4.5em"
              :color="bracedCooldown || mech.IsShutDown ? 'grey' : 'action--free'"
            >
              <v-icon size="3.25em" dark>$vuetify.icons.free</v-icon>
            </v-avatar>
          </cc-tooltip>
        </v-col>
      </v-row>
      <div class="overline text-center mt-3">&mdash; MOVEMENT &mdash;</div>
      <v-row justify="center" dense no-gutters>
        <v-col cols="auto">
          <cc-tick-bar
            :key="move"
            :current="move"
            :max="maxMove"
            large
            flip-input
            full-icon="$vuetify.icons.move"
            color="action--move"
            justify="center"
            :readonly="mech.IsShutDown"
            @update="move = $event"
          >
            <span class="flavor-text">
              <span class="heading h3 primary--text">{{ move }}</span>
              /{{ maxMove }}
              SPACES MOVED
            </span>
          </cc-tick-bar>
        </v-col>
      </v-row>
      <div>
        <cc-tooltip simple content="Undo last action">
          <v-btn text icon absolute right small :disabled="!history.length" @click="undo">
            <v-icon small>undo</v-icon>
          </v-btn>
        </cc-tooltip>
      </div>
      <div class="overline text-center mt-2 mb-1">&mdash; ACTIONS &mdash;</div>
      <div v-if="mech.IsShutDown" key="a-boot">
        <action-button v-if="actions >= 2" action-id="bootup" class="mb-1" @click="boot()" />
      </div>
      <div
        v-show="mech.Ejected && !mech.IsShutDown && !mech.Destroyed && !mech.ReactorDestroyed"
      >
        <v-scale-transition group>
          <v-row v-if="actions" key="a-r1" justify="center" dense>
            <action-button cols="4" action-id="quickactivate" @click="quickAction()" />
            <action-button cols="4" action-id="boost" @click="boost()" />
            <action-button cols="4" action-id="hide" @click="hide()" />
            <action-button cols="6" action-id="search" @click="quickAction()" />
            <action-button cols="6" action-id="prepare" @click="setPrepare()" />
          </v-row>
          <v-row v-if="actions >= 2" key="a-r2" justify="center" dense>
            <action-button action-id="mount" name-override="Remount Mech" @click="remount()" />
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
          <v-row v-if="!braced && !overwatch && !bracedCooldown" key="a-r3" justify="center" dense>
            <action-button cols="6" action-id="overwatch" @click="setOverwatch()" />
            <action-button cols="6" action-id="brace" @click="setBrace()" />
          </v-row>
          <v-row v-if="!bracedCooldown && !overcharged" key="a-r4">
            <action-button action-id="overcharge" @click="$refs.overcharge.show()" />
          </v-row>
          <v-row v-if="pilot.has('reserve', 'redundantrepair')" key="a-r5">
            <action-button action-id="redundantrepair" @click="redundantRepair()" />
          </v-row>
          <v-row v-if="pilot.has('reserve', 'deployableshield')" key="a-r6">
            <action-button action-id="deployableshield" @click="deployableShield()" />
          </v-row>
          <v-row v-if="pilot.has('reserve', 'corebattery')" key="a-r7">
            <action-button
              action-id="corebattery"
              :disabled="mech.CurrentCoreEnergy > 0"
              @click="coreBattery()"
            />
          </v-row>
        </v-scale-transition>
      </div>
    </div>
    <div v-if="!mech.IsShutDown && !mech.Ejected && !mech.Destroyed && !mech.ReactorDestroyed">
      <div v-if="mech.MeltdownImminent" class="px-4">
        <v-btn block dark x-large tile color="dangerzone" @click="meltdown()">
          <v-icon left large>cci-reactor</v-icon>
          REACTOR MELTDOWN
          <v-icon right large>cci-reactor</v-icon>
        </v-btn>
        <v-btn block small outlined class="my-2" color="success" @click="avoidMeltdown()">
          VENT REACTOR
        </v-btn>
      </div>
      <v-scale-transition group>
        <v-row v-if="actions" key="a-r8" justify="center" dense>
          <action-button cols="4" action-id="skirmish" @click="quickAction()" />
          <action-button cols="4" action-id="quickactivate" @click="quickAction()" />
          <action-button cols="4" action-id="quicktech" @click="quickAction()" />
          <action-button cols="4" action-id="boost" @click="boost()" />
          <action-button cols="4" action-id="ram" @click="quickAction()" />
          <action-button cols="4" action-id="grapple" @click="quickAction()" />
          <action-button cols="6" action-id="hide" @click="hide()" />
          <action-button cols="6" action-id="search" @click="quickAction()" />
        </v-row>
        <v-row v-if="actions >= 2" key="a-r9" justify="center" dense>
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
        <v-row v-if="!braced && !overwatch && !bracedCooldown" key="a-r10" justify="center" dense>
          <action-button cols="6" action-id="overwatch" @click="setOverwatch()" />
          <action-button cols="6" action-id="brace" @click="setBrace()" />
        </v-row>
        <v-row v-if="!bracedCooldown && !overcharged" key="a-r11" justify="center" dense>
          <action-button action-id="overcharge" @click="$refs.overcharge.show()" />
        </v-row>
        <v-row v-if="pilot.has('reserve', 'redundantrepair')" key="a-r12" justify="center" dense>
          <action-button action-id="redundantrepair" @click="redundantRepair()" />
        </v-row>
        <v-row v-if="pilot.has('reserve', 'deployableshield')" key="a-r13" justify="center" dense>
          <action-button action-id="deployableshield" @click="deployableShield()" />
        </v-row>
        <v-row v-if="pilot.has('reserve', 'corebattery')" key="a-r14" justify="center" dense>
          <action-button
            action-id="corebattery"
            :disabled="mech.CurrentCoreEnergy"
            @click="coreBattery()"
          />
        </v-row>
        <v-expansion-panels
          v-if="actions"
          key="a-r15"
          style="background-color: var(--v-panel-base)"
          class="pa-2 pr-3"
        >
          <v-expansion-panel>
            <v-expansion-panel-header class="heading h3">
              Other Actions
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row dense>
                <action-button v-if="actions >= 1" action-id="shutdown" @click="shutDown()" />
                <action-button v-if="actions >= 1" action-id="eject" @click="eject()" />
                <action-button
                  v-if="actions >= 1"
                  action-id="selfdestruct"
                  @click="quickAction()"
                />
                <action-button v-if="actions >= 1" action-id="prepare" @click="setPrepare()" />
                <action-button
                  v-if="actions >= 2"
                  action-id="mount"
                  name-override="Dismount"
                  @click="dismount()"
                />
                <action-button v-if="actions >= 2" action-id="skillcheck" @click="fullAction()" />
                <action-button v-if="actions >= 2" action-id="improvattack" @click="fullAction()" />
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-scale-transition>
    </div>
    <v-row dense justify="center">
      <v-col cols="8">
        <v-btn block color="primary" dark large @click="newTurn()">END TURN</v-btn>
      </v-col>
      <v-col cols="9" class="mt-1">
        <v-btn small block color="amber darken-4" @click="endCombat()">End Combat</v-btn>
      </v-col>
    </v-row>
    <overcharge-dialog ref="overcharge" :mech="mech" @overcharge="commitOvercharge($event)" />
    <stabilize-dialog ref="stabilize" :mech="mech" @stabilize="commitStabilize($event)" />
  </v-window-item>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionButton from './components/ActionButton.vue'
import DestroyedAlert from './components/DestroyedAlert.vue'
import StabilizeDialog from './components/StabilizeDialog.vue'
import OverchargeDialog from './components/OverchargeDialog.vue'

export default Vue.extend({
  name: 'turn-manager',
  components: { ActionButton, DestroyedAlert, StabilizeDialog, OverchargeDialog },
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
    redundant: false,
    history: [],
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
    this.maxMove = this.mech.Ejected ? this.pilot.Speed : this.mech.Speed
  },
  methods: {
    undo() {
      let action = this.history.pop()
      switch (action.field) {
        case 'avoid_meltdown':
          this.mech.MeltdownImminent = true
        case 'meltdown':
          this.mech.Destroyed = false
          this.mech.ReactorDestroyed = false
        case 'boost':
          this.maxMove -= this.mech.Ejected ? this.pilot.Speed : this.mech.Speed
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
          this.mech.Ejected = false
          this.actions += 1
          break
        case 'remount':
          this.mech.Ejected = true
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
      this.turn += 1
      this.history = []
      this.move = 0
      this.actions = 2
      this.maxMove = this.mech.Ejected ? this.pilot.Speed : this.mech.Speed
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
      this.maxMove = this.mech.Ejected ? this.pilot.Speed : this.mech.Speed
      this.overcharged = false
      this.prepare = false
      this.braced = false
      this.bracedCooldown = false
    },
    actionColor() {
      if (this.mech.IsShutDown) return 'grey'
      if (this.actions > 2) return 'action--overcharge'
      if (this.actions == 2) return 'action--full'
      if (this.actions == 1) return 'action--quick'
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
        this.maxMove += this.mech.Ejected ? this.pilot.Speed : this.mech.Speed
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
      this.mech.Ejected = true
      this.actions -= 2
    },
    eject() {
      this.history.push({ field: 'eject', val: false })
      this.mech.Ejected = true
      this.actions -= 1
    },
    remount() {
      this.history.push({ field: 'remount', val: false })
      this.mech.Ejected = false
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
    commitStabilize(actionsUsed: number) {
      this.actions += actionsUsed
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
      this.endStatus('Shut Down')
      this.endCondition('Stunned')
      this.move = 0
      this.actions = 0
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
