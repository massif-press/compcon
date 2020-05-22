<template>
  <v-window-item>
    <div v-if="mech.Destroyed || mech.ReactorDestroyed">
      <destroyed-alert :mech="mech" />
    </div>
    <div v-else class="text-center">
      <span class="overline" v-html="'//COMBAT ENGAGED//'" />
      <div class="heading h1 mt-n4">
        <span>TURN</span>
        <span class="overcharge--text">{{ mech.State.turn }}</span>
      </div>
      <div
        v-if="mech.Ejected"
        class="heading h3 reaction-bg white--text pb-1"
        v-html="'PILOT EJECTED'"
      />
      <div v-else class="heading h3">
        <div
          v-if="mech.State.braced"
          class="heading h3 action--reaction white--text pb-1"
          v-html="'BRACED'"
        />
        <div
          v-if="mech.State.bracedCooldown"
          class="red--text destroyed-bg"
          v-html="'// BRACE RECOVERY //'"
        />
        <div v-if="mech.IsShutDown" class=" red--text destroyed-bg" v-html="'// SHUT DOWN //'" />
        <div
          v-if="mech.State.overwatch"
          class="heading h3 action--reaction white--text pb-1"
          v-html="'OVERWATCH'"
        />
        <div
          v-if="mech.State.prepare"
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
              :key="mech.State.move"
              size="4.5em"
              :color="
                mech.State.move === mech.State.maxMove ||
                mech.State.bracedCooldown ||
                mech.IsShutDown
                  ? 'grey'
                  : 'action--move'
              "
            >
              <v-icon size="3.25em" dark>$vuetify.icons.move</v-icon>
            </v-avatar>
          </cc-tooltip>
          <cc-tooltip simple inline content="1 Full Action / 2 Quick Actions">
            <v-avatar size="4.5em" :color="actionColor()">
              <v-icon v-if="mech.State.actions > 2 && !mech.IsShutDown" size="3.25em" dark>
                $vuetify.icons.overcharge
              </v-icon>
              <v-icon v-else-if="mech.State.actions === 2 && !mech.IsShutDown" size="3.25em" dark>
                $vuetify.icons.full
              </v-icon>
              <v-icon v-else-if="mech.State.actions === 1 && !mech.IsShutDown" size="3.25em" dark>
                $vuetify.icons.quick
              </v-icon>
              <v-icon v-else size="3.25em" dark>mdi-hexagon-outline</v-icon>
            </v-avatar>
          </cc-tooltip>
          <cc-tooltip simple inline content="Overcharge">
            <v-avatar
              size="4.5em"
              :color="
                mech.State.bracedCooldown || mech.State.overcharged || mech.IsShutDown
                  ? 'grey'
                  : 'action--overcharge'
              "
            >
              <v-icon size="3.25em" dark>$vuetify.icons.overcharge</v-icon>
            </v-avatar>
          </cc-tooltip>
          <cc-tooltip simple inline content="Reactions">
            <v-avatar
              size="4.5em"
              :color="
                mech.State.bracedCooldown ||
                mech.State.overwatch ||
                mech.State.braced ||
                mech.IsShutDown
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
              :color="mech.State.bracedCooldown || mech.IsShutDown ? 'grey' : 'action--free'"
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
            :key="mech.State.move"
            :current="mech.State.move"
            :max="mech.State.maxMove"
            large
            flip-input
            full-icon="$vuetify.icons.move"
            color="action--move"
            justify="center"
            :readonly="mech.IsShutDown"
            @update="mech.State.move = $event"
          >
            <span class="flavor-text pt-1">
              SPACES MOVED:&nbsp;
            </span>
          </cc-tick-bar>
        </v-col>
      </v-row>
      <div>
        <cc-tooltip simple content="Undo last action">
          <v-btn
            text
            icon
            absolute
            right
            small
            :disabled="!mech.State.history.length"
            @click="mech.State.undo()"
          >
            <v-icon small>undo</v-icon>
          </v-btn>
        </cc-tooltip>
      </div>
      <div class="overline text-center mt-2 mb-1">&mdash; ACTIONS &mdash;</div>
      <div v-if="mech.IsShutDown" key="a-boot">
        <action-button
          v-if="mech.State.actions >= 2"
          action-id="boot_up"
          class="mb-1"
          @click="mech.State.boot()"
        />
      </div>
      <div v-show="mech.Ejected && !mech.IsShutDown && !mech.Destroyed && !mech.ReactorDestroyed">
        <v-scale-transition group>
          <v-row v-if="mech.State.actions" key="a-r1" justify="center" dense>
            <action-button cols="4" action-id="activate_quick" @click="mech.State.quickAction()" />
            <action-button cols="4" action-id="boost" @click="mech.State.boost()" />
            <action-button cols="4" action-id="hide" @click="mech.State.hide()" />
            <action-button cols="6" action-id="search" @click="mech.State.quickAction()" />
            <action-button cols="6" action-id="prepare" @click="mech.State.setPrepare()" />
          </v-row>
          <v-row v-if="mech.State.actions >= 2" key="a-r2" justify="center" dense>
            <action-button
              action-id="mount_dismount"
              name-override="Remount Mech"
              @click="mech.State.remount()"
            />
            <action-button
              v-if="pilot.has('reserve', 'bombardment')"
              action-id="bombardment"
              @click="mech.State.bombard()"
            />
            <action-button cols="6" action-id="fight" @click="mech.State.fullAction()" />
            <action-button cols="6" action-id="jockey" @click="mech.State.fullAction()" />
            <action-button cols="6" action-id="activate_full" @click="mech.State.fullAction()" />
            <action-button cols="6" action-id="disengage" @click="mech.State.fullAction()" />
          </v-row>
          <v-row
            v-if="!mech.State.braced && !mech.State.overwatch && !mech.State.bracedCooldown"
            key="a-r3"
            justify="center"
            dense
          >
            <action-button cols="6" action-id="overwatch" @click="mech.State.setOverwatch()" />
            <action-button cols="6" action-id="brace" @click="mech.State.setBrace()" />
          </v-row>
          <v-row v-if="!mech.State.bracedCooldown && !mech.State.overcharged" key="a-r4">
            <action-button action-id="overcharge" @click="$refs.overcharge.show()" />
          </v-row>
          <v-row v-if="pilot.has('reserve', 'redundant_repair')" key="a-r5">
            <action-button action-id="redundant_repair" @click="redundantRepair()" />
          </v-row>
          <v-row v-if="pilot.has('reserve', 'deployable_shield')" key="a-r6">
            <action-button action-id="deployable_shield" @click="mech.State.deployableShield()" />
          </v-row>
          <v-row v-if="pilot.has('reserve', 'core_battery')" key="a-r7">
            <action-button
              action-id="core_battery"
              :disabled="mech.CurrentCoreEnergy > 0"
              @click="mech.State.coreBattery()"
            />
          </v-row>
        </v-scale-transition>
      </div>
    </div>
    <div v-if="!mech.IsShutDown && !mech.Ejected && !mech.Destroyed && !mech.ReactorDestroyed">
      <div v-if="mech.MeltdownImminent" class="px-4">
        <v-btn block dark x-large tile color="dangerzone" @click="mech.State.meltdown()">
          <v-icon left large>cci-reactor</v-icon>
          REACTOR MELTDOWN
          <v-icon right large>cci-reactor</v-icon>
        </v-btn>
        <v-btn
          block
          small
          outlined
          class="my-2"
          color="success"
          @click="mech.State.avoidMeltdown()"
        >
          VENT REACTOR
        </v-btn>
      </div>
      <v-scale-transition group>
        <v-row v-if="mech.State.actions" key="a-r8" justify="center" dense>
          <action-button cols="4" action-id="skirmish" @click="mech.State.quickAction()" />
          <action-button cols="4" action-id="activate_quick" @click="mech.State.quickAction()" />
          <action-button cols="4" action-id="quick_tech" @click="mech.State.quickAction()" />
          <action-button cols="4" action-id="boost" @click="mech.State.boost()" />
          <action-button cols="4" action-id="ram" @click="mech.State.quickAction()" />
          <action-button cols="4" action-id="grapple" @click="mech.State.quickAction()" />
          <action-button cols="6" action-id="hide" @click="mech.State.hide()" />
          <action-button cols="6" action-id="search" @click="mech.State.quickAction()" />
        </v-row>
        <v-row v-if="mech.State.actions >= 2" key="a-r9" justify="center" dense>
          <action-button
            v-if="pilot.has('reserve', 'bombardment')"
            action-id="bombardment"
            @click="mech.State.bombard()"
          />
          <action-button cols="4" action-id="barrage" @click="mech.State.fullAction()" />
          <action-button cols="4" action-id="activate_full" @click="mech.State.fullAction()" />
          <action-button cols="4" action-id="full_tech" @click="mech.State.fullAction()" />
          <action-button cols="6" action-id="stabilize" @click="$refs.stabilize.show()" />
          <action-button cols="6" action-id="disengage" @click="mech.State.fullAction()" />
        </v-row>
        <v-row
          v-if="!mech.State.braced && !mech.State.overwatch && !mech.State.bracedCooldown"
          key="a-r10"
          justify="center"
          dense
        >
          <action-button cols="6" action-id="overwatch" @click="mech.State.setOverwatch()" />
          <action-button cols="6" action-id="brace" @click="mech.State.setBrace()" />
        </v-row>
        <v-row
          v-if="!mech.State.bracedCooldown && !mech.State.overcharged"
          key="a-r11"
          justify="center"
          dense
        >
          <action-button action-id="overcharge" @click="$refs.overcharge.show()" />
        </v-row>
        <v-row v-if="pilot.has('reserve', 'redundant_repair')" key="a-r12" justify="center" dense>
          <action-button action-id="redundant_repair" @click="mech.State.redundantRepair()" />
        </v-row>
        <v-row v-if="pilot.has('reserve', 'deployable_shield')" key="a-r13" justify="center" dense>
          <action-button action-id="deployable_shield" @click="mech.State.deployableShield()" />
        </v-row>
        <v-row v-if="pilot.has('reserve', 'core_battery')" key="a-r14" justify="center" dense>
          <action-button
            action-id="core_battery"
            :disabled="mech.CurrentCoreEnergy > 0"
            @click="mech.State.coreBattery()"
          />
        </v-row>
        <v-expansion-panels
          v-if="mech.State.actions"
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
                <action-button
                  v-if="mech.State.actions >= 1"
                  action-id="shut_down"
                  @click="mech.State.shutDown()"
                />
                <action-button
                  v-if="mech.State.actions >= 1"
                  action-id="eject"
                  @click="mech.State.eject()"
                />
                <action-button
                  v-if="mech.State.actions >= 1"
                  action-id="self_destruct"
                  @click="mech.State.quickAction()"
                />
                <action-button
                  v-if="mech.State.actions >= 1"
                  action-id="prepare"
                  @click="mech.State.setPrepare()"
                />
                <action-button
                  v-if="mech.State.actions >= 2"
                  action-id="mount_dismount"
                  name-override="Dismount"
                  @click="mech.State.dismount()"
                />
                <action-button
                  v-if="mech.State.actions >= 2"
                  action-id="skill_check"
                  @click="mech.State.fullAction()"
                />
                <action-button
                  v-if="mech.State.actions >= 2"
                  action-id="improvised_attack"
                  @click="mech.State.fullAction()"
                />
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-scale-transition>
    </div>
    <v-row dense justify="center">
      <v-col cols="8">
        <v-btn block color="primary" dark large @click="endTurn()">END TURN</v-btn>
      </v-col>
      <v-col cols="9" class="mt-1">
        <v-btn small block color="amber darken-4" @click="endCombat()">End Combat</v-btn>
      </v-col>
    </v-row>
    <overcharge-dialog
      ref="overcharge"
      :mech="mech"
      @overcharge="mech.State.commitOvercharge($event)"
    />
    <stabilize-dialog
      ref="stabilize"
      :mech="mech"
      @stabilize="mech.State.commitStabilize($event)"
    />
    <burn-dialog ref="burn" :mech="mech" @complete="mech.State.newTurn()" />
  </v-window-item>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionButton from './components/ActionButton.vue'
import DestroyedAlert from './components/DestroyedAlert.vue'
import StabilizeDialog from './components/StabilizeDialog.vue'
import OverchargeDialog from './components/OverchargeDialog.vue'
import BurnDialog from './components/BurnDialog.vue'

export default Vue.extend({
  name: 'turn-manager',
  components: { ActionButton, DestroyedAlert, StabilizeDialog, OverchargeDialog, BurnDialog },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  computed: {
    mech() {
      return this.pilot.ActiveMech
    },
    loadout() {
      return this.mech.ActiveLoadout
    },
    turn() {
      return 1
      return this.state.turn
    },
  },
  methods: {
    actionColor() {
      if (this.mech.IsShutDown) return 'grey'
      if (this.mech.State.actions > 2) return 'action--overcharge'
      if (this.mech.State.actions == 2) return 'action--full'
      if (this.mech.State.actions == 1) return 'action--quick'
      return 'grey'
    },
    redundantRepair() {
      this.mech.State.redundantRepair()
      this.$refs.stabilize.show(true)
    },
    endTurn() {
      if (this.mech.Burn) {
        this.$refs.burn.show()
      } else this.mech.State.newTurn()
    },
    endCombat() {
      this.mech.State.restart()
      this.$emit('end')
    },
  },
})
</script>
