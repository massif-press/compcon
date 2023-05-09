<template>
  <div>
    <cc-stress-table ref="stressTable" :mech="mech" />
    <cc-structure-table ref="structureTable" :mech="mech" />
    <div>
      <v-row density="compact">
        <v-col class="mt-n5">
          <div v-show="$vuetify.display.mdAndUp" class="text-overline text-subtle">MOUNTED::</div>
          <div :class="$vuetify.display.mdAndUp ? 'heading h2 mt-n4' : 'font-weight-bold'">
            <span class="text-accent">{{ mech.Frame.Source }} {{ mech.Frame.Name }}</span>
            <cc-slashes />
            <span class="text-stark">{{ mech.Name }}</span>
          </div>
        </v-col>
        <v-col v-show="$vuetify.display.mdAndUp" cols="auto" class="ml-auto mr-2 mt-n3">
          <div class="text-overline text-subtle mt-n2">PILOT::</div>
          <div class="heading h2 mt-n3 text-subtle">{{ pilot.Callsign }}</div>
        </v-col>
      </v-row>

      <v-divider v-if="$vuetify.display.smAndDown" class="my-2" />

      <v-row
        v-if="state.SelfDestructCounter > 0"
        density="compact"
        justify="center"
        class="text-center"
      >
        <v-col cols="auto">
          <v-alert density="compact" variant="outlined" color="error" prominent>
            <v-icon slot="prepend" color="error" size="90" class="mr-3">cc:reactor</v-icon>
            <span
              v-if="state.SelfDestructCounter > 1"
              :class="$vuetify.display.mdAndUp ? 'heading h1' : 'heading h3'"
            >
              SELF DESTRUCT IN {{ state.SelfDestructCounter }} ROUNDS
            </span>
            <span v-else class="heading h1">SELF DESTRUCT IMMINENT</span>
            <div class="heading mt-n4 text-subtle">
              FRAME.PRIORITY.ALERT::REACTOR CRITICALITY EVENT
            </div>
            <div class="px-5 my-1">
              <v-btn small block color="error" @click="state.SelfDestruct()">
                <v-icon start>mdi-skull</v-icon>
                DETONATE REACTOR
                <v-icon end>mdi-skull</v-icon>
              </v-btn>
            </div>
            <div class="text-right mt-1">
              <v-btn
                x-small
                color="primary"
                class="fade-select"
                @click="state.CancelSelfDestruct()"
              >
                <v-icon small left>mdi-reload</v-icon>
                UNDO
              </v-btn>
            </div>
          </v-alert>
        </v-col>
      </v-row>

      <v-alert
        v-if="mech.Pilot.Status === 'KIA' || mech.Pilot.IsDead"
        prominent
        density="compact"
        variant="outlined"
        color="error"
      >
        <v-icon slot="prepend" size="80" class="mr-2">mdi-skull</v-icon>
        <div :class="`heading ${$vuetify.display.mdAndUp ? 'h1' : 'h3'} pb-2 text-center`">
          KILLED IN ACTION
        </div>
        <div style="position: relative">
          <v-menu offset-y offset-x>
            <template #activator="{ props }">
              <v-btn
                color="secondary"
                absolute
                right
                small
                variant="outlined"
                class="fade-select"
                style="bottom: 0; right: 0"
                v-bind="props"
              >
                Revert
              </v-btn>
            </template>
            <cc-confirmation
              content="This will restore the selected pilot and clear the KIA and Down and Out statuses."
              @confirm="mech.Pilot.Restore()"
            />
          </v-menu>
        </div>
      </v-alert>

      <destroyed-alert v-if="mech.Destroyed" :mech="mech" @restore="mech.BasicRepair($event)" />

      <v-row v-else-if="mech.IsShutDown" density="compact" justify="center" class="text-center">
        <v-col cols="auto">
          <v-alert density="compact" variant="outlined" color="warning" prominent>
            <v-icon slot="prepend" color="warning" size="70" class="mr-3">
              cc:status_shut-down
            </v-icon>
            <span :class="$vuetify.display.mdAndUp ? 'heading h1' : 'heading h3'">
              MECH SHUT DOWN
            </span>
            <div class="heading mt-n4 text-subtle">FRAME.STATUS//ERR: NO RESPONSE</div>
          </v-alert>
        </v-col>
      </v-row>

      <div v-if="!mech.ReactorDestroyed">
        <v-row justify="space-between" align="center" density="compact" class="mt-n3">
          <v-col cols="6" md="3" :style="mech.Destroyed ? 'opacity: 0.5' : ''">
            <cc-status-select
              label="Statuses"
              :items="statuses"
              :model="mech.Statuses"
              dark
              color="deep-orange darken-1"
              @set="state.SetStatusCondition($event, true)"
            />
          </v-col>
          <v-col cols="6" md="3">
            <cc-status-select
              label="Conditions"
              :items="conditions"
              :model="mech.Conditions"
              dark
              color="red darken-2"
              @set="state.SetStatusCondition($event)"
            />
          </v-col>
          <v-col cols="6" md="3">
            <cc-status-select
              label="Resistances"
              :items="resistances"
              :model="mech.Resistances"
              dark
              color="blue darken-2"
              @set="state.SetResistance($event)"
            />
          </v-col>

          <v-col
            cols="6"
            md="auto"
            class="ml-auto mr-auto"
            :style="mech.Destroyed ? 'opacity: 0.5' : ''"
          >
            <v-text-field
              v-model="mech.Burn"
              type="number"
              append-icon="mdi-plus-circle-outline"
              prepend-icon="mdi-minus-circle-outline"
              :style="$vuetify.display.mdAndUp ? 'width: 115px' : ''"
              class="hide-input-spinners"
              hint="BURN"
              persistent-hint
              density="compact"
              @click:append="state.SetBurn(mech.Burn + 1)"
              @click:prepend="state.SetBurn(mech.Burn - 1)"
              @change="state.SetBurn(parseInt($event))"
            />
          </v-col>

          <v-col cols="auto" :class="`mx-3 ${$vuetify.display.lgAndDown ? 'ml-auto' : ''}`"></v-col>
        </v-row>

        <div :style="mech.Destroyed ? 'opacity: 0.5' : ''">
          <pip-layout
            :mech="mech"
            :struct-rollover="structRolledOver"
            :stress-rollover="stressRolledOver"
            :hp-resistance="hpResistance"
          >
            <cc-tooltip slot="repair" simple inline content="Full Repair">
              <v-menu v-model="repairMenu" offset-y offset-x bottom left>
                <template #activator="{ props }">
                  <v-btn v-if="!mech.Destroyed" icon class="fade-select" v-bind="props">
                    <v-icon x-large>cc:repair</v-icon>
                  </v-btn>
                  <v-btn v-else size="x-large" color="secondary" icon v-bind="props">
                    <v-icon size="50">cc:repair</v-icon>
                  </v-btn>
                </template>
                <cc-confirmation
                  content="Lancer, this will <span class='text-accent'>fully repair and recharge this mech.</span> Do you want to continue?"
                  @confirm="
                    repairMenu = false;
                    state.CommitFullRepair();
                  "
                />
              </v-menu>
            </cc-tooltip>
          </pip-layout>

          <v-row density="compact" align="center" class="mt-n3">
            <v-col
              cols="12"
              md="auto"
              :class="`ml-2 mt-n2 mr-2 ${$vuetify.display.smAndDown ? 'text-center' : ''}`"
            >
              <div :class="$vuetify.display.smAndDown ? 'd-inline ' : 'mb-n2'">
                <span class="heading h2 text-accent">
                  {{ pilot.MechSkillsController.MechSkills.Hull }}
                  <span v-if="$vuetify.display.smAndDown" class="heading h3 text-subtle"> H </span>
                  <span v-else class="flavor-text text-subtle">//HULL</span>
                  <cc-synergy-display location="hull" :mech="mech" class="d-inline" />
                </span>
              </div>
              <div :class="$vuetify.display.smAndDown ? 'd-inline' : 'mb-n2'">
                <span class="heading h2 text-accent">
                  {{ pilot.MechSkillsController.MechSkills.Agi }}
                  <span v-if="$vuetify.display.smAndDown" class="heading h3 text-subtle"> A </span>
                  <span v-else class="flavor-text text-subtle">//AGI</span>
                  <cc-synergy-display location="agility" :mech="mech" class="d-inline" />
                </span>
              </div>
              <div :class="$vuetify.display.smAndDown ? 'd-inline' : 'mb-n2'">
                <span class="heading h2 text-accent">
                  {{ pilot.MechSkillsController.MechSkills.Sys }}
                  <span v-if="$vuetify.display.smAndDown" class="heading h3 text-subtle"> S </span>
                  <span v-else class="flavor-text text-subtle">//SYS</span>
                  <cc-synergy-display location="systems" :mech="mech" class="d-inline" />
                </span>
              </div>
              <div :class="$vuetify.display.smAndDown ? 'd-inline' : 'mb-n2'">
                <span class="heading h2 text-accent">
                  {{ pilot.MechSkillsController.MechSkills.Eng }}
                  <span v-if="$vuetify.display.smAndDown" class="heading h3 text-subtle"> E </span>
                  <span v-else class="flavor-text text-subtle">//ENG</span>
                  <cc-synergy-display location="engineering" :mech="mech" class="d-inline" />
                </span>
              </div>
            </v-col>
            <v-col>
              <v-row>
                <cc-active-card
                  prominent
                  class="my-1"
                  color="frame"
                  header="SPEED"
                  :content="mech.Speed"
                />
                <cc-active-card
                  prominent
                  class="my-1"
                  color="frame"
                  :header="$vuetify.display.lgAndUp ? 'Attack Bonus' : 'ATK'"
                  :content="`${mech.AttackBonus > 0 ? '+' : ''}${mech.AttackBonus}`"
                />
                <cc-active-card
                  prominent
                  class="my-1"
                  color="frame"
                  :header="$vuetify.display.lgAndUp ? 'Tech Attack' : 'T.ATK'"
                  :content="`${mech.TechAttack > 0 ? '+' : ''}${mech.TechAttack}`"
                />
                <cc-active-card
                  v-if="$vuetify.display.smAndDown"
                  prominent
                  class="my-1"
                  color="frame"
                  header="SIZE"
                  :content="mech.Size"
                />
              </v-row>
              <v-row>
                <cc-active-card
                  prominent
                  class="my-1"
                  color="frame"
                  header="EVAS."
                  :content="mech.Evasion"
                />
                <cc-active-card
                  prominent
                  class="my-1"
                  color="frame"
                  :header="$vuetify.display.lgAndUp ? 'E-Defense' : 'E-DEF'"
                  :content="mech.EDefense"
                />
                <cc-active-card
                  prominent
                  class="my-1"
                  color="frame"
                  :header="$vuetify.display.lgAndUp ? 'Save Target' : 'SAVE'"
                  :content="mech.SaveTarget"
                />
                <cc-active-card
                  prominent
                  class="my-1"
                  color="frame"
                  :header="$vuetify.display.lgAndUp ? 'Sensor Range' : 'SENS.'"
                  :content="mech.SensorRange"
                />
              </v-row>
            </v-col>
            <v-col v-if="$vuetify.display.mdAndUp" cols="auto">
              <div style="position: relative">
                <v-icon size="120" color="frame" style="z-index: 2">{{ mech.SizeIcon }}</v-icon>
                <div
                  v-if="mech.Size > 0.5"
                  style="
                    background-color: white;
                    position: absolute;
                    bottom: 21px;
                    top: 21px;
                    left: 21px;
                    right: 21px;
                    border-radius: 50%;
                    z-index: 1;
                  "
                />
              </div>
            </v-col>
          </v-row>

          <v-row density="compact">
            <v-col cols="12" md="4">
              <cc-active-card
                v-for="(trait, i) in mech.Frame.Traits"
                color="frame"
                :header="trait.Name"
                subheader="FRAME TRAIT"
              >
                <div v-html-safe="trait.Description" />
                <v-row v-if="trait.Actions.length" density="compact">
                  <v-col v-for="(a, j) in trait.Actions" style="min-width: 40%" class="mb-n1">
                    <cc-action
                      :action="a"
                      active
                      :activations="pilot.State.Actions"
                      :disabled="mech.IsStunned"
                      :unusable="a.Activation === 'Protocol' && !pilot.State.IsProtocolAvailable"
                    />
                  </v-col>
                </v-row>
              </cc-active-card>
            </v-col>
            <v-col cols="12" md="8" align-self="center">
              <cc-active-card
                color="corepower"
                :header="mech.Frame.CoreSystem.Name"
                subheader="CORE SYSTEM"
                style="height: 100%"
              >
                <div v-if="mech.Frame.CoreSystem.PassiveName" class="mb-2">
                  <span class="heading h2">
                    {{ mech.Frame.CoreSystem.PassiveName }}
                    <span class="pt-2 ml-2 caption text-subtle">(PASSIVE)</span>
                  </span>
                  <p v-html-safe="mech.Frame.CoreSystem.PassiveEffect" class="mb-1" />
                  <cc-action
                    v-for="(a, i) in mech.Frame.CoreSystem.PassiveActions"
                    :action="a"
                    active
                    :activations="mech.Pilot.State.Actions"
                    :disabled="mech.Destroyed || mech.IsStunned"
                    :unusable="a.Activation === 'Protocol' && !mech.Pilot.State.IsProtocolAvailable"
                    class="mx-8"
                  />
                </div>
                <v-row density="compact" class="mb-1">
                  <v-col
                    v-for="(a, i) in mech.Frame.CoreSystem.DeployActions"
                    style="min-width: 40%"
                    class="mb-n1"
                  >
                    <cc-action
                      :action="a"
                      active
                      no-action
                      :activations="mech.Pilot.State.Actions"
                    />
                  </v-col>
                </v-row>
                <span class="heading h2">
                  {{ mech.Frame.CoreSystem.ActiveName }}
                  <span class="pt-2 ml-2 caption text-subtle">(ACTIVE)</span>
                </span>
                <p
                  v-html-safe="mech.Frame.CoreSystem.ActiveEffect"
                  class="mb-1 text-text body-text"
                />
                <div class="my-1 px-6">
                  <cc-action
                    v-if="mech.CurrentCoreEnergy > 0"
                    active
                    :action="coreActivator"
                    @use="mech.CurrentCoreEnergy--"
                  />
                  <div
                    v-else
                    class="heading h3 text-center"
                    style="letter-spacing: 5px; opacity: 0.4"
                  >
                    CORE ENERGY EXHAUSTED
                  </div>
                  <cc-action
                    v-for="(a, i) in mech.Frame.CoreSystem.ActiveActions"
                    :action="a"
                    active
                    :activations="mech.Pilot.State.Actions"
                    :disabled="mech.Destroyed || mech.IsStunned"
                    :unusable="a.Activation === 'Protocol' && !mech.Pilot.State.IsProtocolAvailable"
                    class="mx-8"
                  />
                </div>
                <cc-tags :tags="mech.Frame.CoreSystem.Tags" color="corepower" />
              </cc-active-card>
            </v-col>
          </v-row>
        </div>

        <v-row v-if="pilot.CoreBonusController.CoreBonuses" density="compact">
          <v-col cols="auto" class="mb-n2">
            <span class="overline">CORE BONUSES</span>
            <v-btn small right icon class="fade-select" @click="showCBs = !showCBs">
              <v-icon small v-html="showCBs ? 'mdi-eye-outline' : 'mdi-eye-off-outline'" />
            </v-btn>
          </v-col>
          <v-scroll-x-transition>
            <v-col v-if="showCBs" cols="auto" class="ml-auto">
              <v-btn
                x-small
                variant="outlined"
                class="fade-select"
                @click="expandAll(pilot.CoreBonusController.CoreBonuses.length, 'cb_', true)"
              >
                <v-icon small left>mdi-chevron-up</v-icon>
                All
              </v-btn>
              <v-btn
                x-small
                variant="outlined"
                class="fade-select"
                @click="expandAll(pilot.CoreBonusController.CoreBonuses.length, 'cb_', false)"
              >
                <v-icon small left>mdi-chevron-down</v-icon>
                All
              </v-btn>
            </v-col>
          </v-scroll-x-transition>
        </v-row>
        <v-scroll-y-reverse-transition mode="out-in" leave-absolute>
          <v-row v-if="pilot.CoreBonusController.CoreBonuses && showCBs">
            <cc-active-card
              v-for="(bonus, i) in pilot.CoreBonusController.CoreBonuses"
              :ref="`cb_${i}`"
              :cols="12 / pilot.CoreBonusController.CoreBonuses.length"
              color="corepower"
              collapsible
              :header="bonus.Name"
              :style="$vuetify.display.smAndDown ? '' : 'min-width: 400px'"
            >
              <p v-html-safe="bonus.Effect" class="pa-1 ma-0" />
            </cc-active-card>
          </v-row>
        </v-scroll-y-reverse-transition>

        <v-row density="compact">
          <v-col cols="auto" class="mb-n2">
            <span class="overline">PILOT TALENTS</span>
            <v-btn small right icon class="fade-select" @click="showTalents = !showTalents">
              <v-icon small v-html="showTalents ? 'mdi-eye-outline' : 'mdi-eye-off-outline'" />
            </v-btn>
          </v-col>
          <v-scroll-x-transition>
            <v-col v-if="showTalents" cols="auto" class="ml-auto">
              <v-btn
                x-small
                variant="outlined"
                class="fade-select"
                @click="expandAll(pilot.TalentsController.Talents.length, 'tal_', true)"
              >
                <v-icon small left>mdi-chevron-up</v-icon>
                All
              </v-btn>
              <v-btn
                x-small
                variant="outlined"
                class="fade-select"
                @click="expandAll(pilot.TalentsController.Talents.length, 'tal_', false)"
              >
                <v-icon small left>mdi-chevron-down</v-icon>
                All
              </v-btn>
            </v-col>
          </v-scroll-x-transition>
        </v-row>
        <v-scroll-y-reverse-transition mode="out-in" leave-absolute>
          <v-row v-if="showTalents" justify="center">
            <cc-active-card
              v-for="(t, i) in pilot.TalentsController.Talents"
              :ref="`tal_${i}`"
              collapsible
              start-closed
              color="primary"
              :cols="$vuetify.display.lgAndUp ? 4 : $vuetify.display.smAndDown ? 12 : 6"
              :header="`${t.Talent.Name} ${'I'.repeat(t.Rank)}`"
            >
              <ul v-for="n in 3">
                <li v-if="t.Rank >= n">
                  <span v-html-safe="t.Talent.Ranks[n - 1].Description" />
                  <div class="text-center">
                    <cc-action
                      v-for="a in t.Talent.Ranks[n - 1].Actions"
                      :action="a"
                      :active="a.Activation !== 'Invade'"
                      :activations="pilot.State.Actions"
                      :disabled="mech.IsStunned"
                      :unusable="a.Activation === 'Protocol' && !pilot.State.IsProtocolAvailable"
                    />
                  </div>
                </li>
              </ul>
            </cc-active-card>
          </v-row>
        </v-scroll-y-reverse-transition>

        <v-row density="compact">
          <v-col cols="12">
            <span class="overline">COUNTERS</span>
            <v-btn small right icon class="fade-select" @click="showCounters = !showCounters">
              <v-icon small v-html="showCounters ? 'mdi-eye-outline' : 'mdi-eye-off-outline'" />
            </v-btn>
          </v-col>
          <v-scroll-y-reverse-transition mode="out-in">
            <div v-if="showCounters">
              <cc-counter-set :actor="[pilot]" />
            </div>
            <div v-else style="min-height: 24px" />
          </v-scroll-y-reverse-transition>
        </v-row>

        <div :style="mech.Destroyed ? 'opacity: 0.5' : ''">
          <active-mode-loadout :mech="mech" :rest="mech.Destroyed" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import sleep from '@/util/sleep';
import { Mech, MechLoadout } from '@/class';
import MechSelectButton from '../components/MechSelectButton.vue';
import PipLayout from './PipLayout.vue';
import ActiveModeLoadout from './ActiveModeLoadout.vue';

import DestroyedAlert from '../components/DestroyedAlert.vue';

export default {
  name: 'mech-block',
  components: {
    MechSelectButton,
    PipLayout,
    ActiveModeLoadout,
    DestroyedAlert,
  },
  data: () => ({
    showTalents: true,
    showCBs: true,
    showCounters: true,
    tabs: 0,
    burn: 0,
    structRolledOver: false,
    stressRolledOver: false,
    repairMenu: false,
  }),
  computed: {
    mech(): Mech {
      return this.pilot.ActiveMech || null;
    },
    state() {
      return this.pilot.State;
    },
    resistances() {
      return [
        { name: 'Kinetic', color: 'kinetic' },
        { name: 'Energy', color: 'energy' },
        { name: 'Explosive', color: 'explosive' },
        { name: 'Heat', color: 'heat' },
        { name: 'Burn', color: 'burn' },
        { name: 'All', color: 'variable' },
        { name: 'Next Attack', color: 'overcharge' },
      ];
    },
    coreActivator() {
      return this.mech.FeatureController.Actions.find((x) => x.ID === 'core_active_activate');
    },
    loadout(): MechLoadout {
      return this.mech.MechLoadoutController.ActiveLoadout;
    },
    statuses(): string[] {
      return CompendiumStore()
        .getItemCollection('Statuses')
        .filter((x) => x.type === 'Status');
    },
    conditions(): string[] {
      return CompendiumStore()
        .getItemCollection('Statuses')
        .filter((x) => x.type === 'Condition');
    },
    hpResistance(): boolean {
      if (this.mech.Resistances.length === 1 && this.mech.Resistances[0] === 'Heat') return false;
      return !!this.mech.Resistances.length;
    },
    hpColor(): string {
      if (this.mech.Resistances.length) {
        if (this.mech.Resistances.length === 1) {
          const c = this.resistances
            .find((x) => x.name === this.mech.Resistances[0])
            .name.toLowerCase();
          if (c === 'heat') return 'heat';
          return 'overcharge';
        }
        return 'variable--damage';
      }
      return 'hp';
    },
  },
  watch: {
    'mech.CurrentStructure': {
      async handler(newVal: number, oldVal: number) {
        if (newVal === 0) return;
        if (newVal < oldVal) {
          this.structRolledOver = true;
          await sleep(500);
          this.structRolledOver = false;
          (this.$refs.structureTable as any).show();
        } else if (newVal > 0 && this.mech.Destroyed) {
          this.mech.Destroyed = false;
        }
      },
    },
    'mech.CurrentStress': {
      async handler(newVal: number, oldVal: number) {
        if (newVal === 0) return;
        if (newVal < oldVal) {
          this.stressRolledOver = true;
          await sleep(500);
          this.stressRolledOver = false;
          (this.$refs.stressTable as any).show();
        } else if (newVal > 0 && this.mech.ReactorDestroyed) {
          this.mech.ReactorDestroyed = false;
        }
      },
    },
    'mech.Destroyed': {
      async handler(newVal: boolean) {
        if (newVal) {
          this.showTalents = false;
          this.showCBs = false;
          this.showCounters = false;
        } else {
          this.showTalents = true;
          this.showCBs = true;
          this.showCounters = true;
        }
      },
    },
    'mech.ReactorDestroyed': {
      async handler(newVal: boolean) {
        if (newVal) {
          this.showTalents = false;
          this.showCBs = false;
          this.showCounters = false;
        } else {
          this.showTalents = true;
          this.showCBs = true;
          this.showCounters = true;
        }
      },
    },
  },
  methods: {
    expandAll(len: number, key: string, expand: boolean) {
      for (let i = 0; i < len; i++) {
        const k = key + i;
        if (this.$refs[k]) this.$refs[k][0].collapsed = expand;
      }
    },
  },
};
</script>

<style>
.rolledOver * {
  animation-name: rollover;
  animation-duration: 500ms;
  animation-timing-function: ease-out;
}

@keyframes rollover {
  0% {
    color: red;
  }
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
  100% {
    color: inherit;
  }
}
</style>
