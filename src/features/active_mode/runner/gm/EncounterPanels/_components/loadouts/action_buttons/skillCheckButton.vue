<template>
  <cc-dialog :color="available ? action.Color : 'panel'"
    :icon="action.Icon"
    :title="action.Name"
    :close-on-click="false"
    min-width="70vw"
    max-width="80vw">
    <template #activator="{ open }">
      <v-btn block
        flat
        tile
        size="small"
        :color="available ? action.Color : 'panel'"
        @click="open">
        <span class="ml-1">
          <v-icon v-bind="props"
            :icon="action.Icon"
            :color="available ? '' : 'error'"
            start />
          <v-tooltip v-if="!available"
            location="top">
            <template #activator="{ props }">
              <v-icon v-bind="props"
                icon="mdi-exclamation-thick"
                color="error"
                class="ml-n2" />
            </template>
            <div class="text-center text-cc-overline">Cannot activate</div>
            <v-divider class="my-1" />
            <div v-if="!canActivate">
              Insufficient
              <v-chip :color="action.Color"
                size="small"
                variant="elevated"
                :prepend-icon="action.Icon || ''">
                {{ action.Activation }}
              </v-chip>
              actions remaining this turn.
            </div>
            <div v-else-if="!canUse">This action has already been used this turn.</div>
          </v-tooltip>
        </span>
        <v-tooltip location="top"
          width="300">
          <template #activator="{ props }">
            <span v-bind="props">
              {{ action.Name }}
            </span>
          </template>
          <div class="d-flex">
            <div class="heading h4 d-flex">{{ action.Name }}</div>
            <v-spacer />
            <v-chip size="x-small"
              :color="action.Color"
              :prepend-icon="action.Icon"
              variant="elevated"
              elevation="0">
              {{ action.Activation }} Action
            </v-chip>
          </div>
          <v-divider class="my-1" />
          {{ action.Terse }}
        </v-tooltip>
      </v-btn>
    </template>
    <template #default="{ close }">
      <p v-html="action.Detail"
        class="text-text mb-4" />
      <v-card color="panel"
        flat
        tile
        class="px-12 py-3">
        <v-row class="mb-3"
          align="center">
          <v-col>
            <div class="text-cc-overline text-disabled">Check Stat</div>
            <v-select v-model="selectedHase"
              :items="hase"
              density="compact"
              variant="outlined"
              flat
              hide-details
              tile />
          </v-col>
          <v-col cols="auto">
            <div class="text-cc-overline text-disabled">Check Type</div>
            <v-btn-toggle v-model="checkType"
              density="compact"
              flat
              tile
              color="primary">
              <v-btn value="standard"
                size="small">Standard</v-btn>
              <v-btn value="contested"
                size="small">Contested</v-btn>
            </v-btn-toggle>
          </v-col>

          <v-col v-if="checkType === 'standard'">
            <div class="text-cc-overline text-disabled">Modifiers</div>
            <div class="d-flex">
              <v-btn-toggle v-model="modifier"
                density="compact"
                flat
                tile
                color="primary">
                <v-btn value=""
                  size="small">None</v-btn>
                <v-btn value="risky"
                  size="small">Risky</v-btn>
                <v-btn value="heroic"
                  size="small">Heroic</v-btn>
              </v-btn-toggle>
              <cc-checkbox v-model="difficult"
                bg-color="background"
                flat
                tile
                class="ml-6" />
              <div class="d-inline ml-2 mt-2 text-cc-overline">Difficult</div>
            </div>
          </v-col>
          <v-col v-else>
            <div class="text-cc-overline text-disabled">Select Target</div>

            <v-select v-model="selectedTarget"
              :items="targets"
              density="compact"
              variant="outlined"
              item-title="CombatController.RootActor.CombatController.CombatName"
              return-object
              flat
              hide-details
              tile />
          </v-col>
        </v-row>

        <v-row dense>
          <v-col>
            <div v-if="checkType === 'contested'"
              class="text-center heading">
              {{ controller.CombatName }}
              <v-divider class="mb-2" />
            </div>

            <skill-check-base ref="check"
              :controller="controller"
              :selected-hase="selectedHase"
              :difficult="difficult">
              <v-col v-if="checkType === 'standard'"
                cols="auto"
                align-self="center">
                <div class="text-center text-cc-overline px-2 mt-n3"><b>VS</b></div>
              </v-col>
              <v-col v-if="checkType === 'standard'">
                <div class="text-cc-overline text-disabled">Target Value</div>
                <v-text-field v-model="targetVal"
                  density="compact"
                  variant="outlined"
                  type="number"
                  hide-spin-buttons
                  flat
                  tile
                  hide-details>
                  <template #append>
                    <v-tooltip v-if="$refs.check"
                      location="top">
                      <template #activator="{ props }">
                        <v-btn icon
                          size="x-small"
                          variant="text"
                          flat
                          tile
                          :color="!$refs.check.roll
                              ? ''
                              : $refs.check.roll >= targetVal
                                ? 'success'
                                : 'error'
                            "
                          class="ml-n2"
                          v-bind="props"
                          @click="overrideSave()">
                          <v-icon size="25"
                            :icon="!$refs.check.roll
                                ? 'mdi-circle-outline'
                                : $refs.check.roll >= targetVal
                                  ? 'mdi-check-circle'
                                  : 'mdi-cancel'
                              " />
                        </v-btn>
                      </template>

                      <div class="text-center">
                        {{
                          !$refs.check.roll
                            ? 'No Check Rolled'
                            : $refs.check.roll >= targetVal
                              ? 'Check Successful'
                              : 'Check Failed'
                        }}

                        <div>
                          <i class="text-caption text-disabled">Click to override</i>
                        </div>
                      </div>
                    </v-tooltip>
                  </template>
                </v-text-field>
              </v-col>
            </skill-check-base>
          </v-col>
          <v-col v-if="checkType === 'contested'"
            align-self="center"
            cols="auto"
            class="mx-1">
            <v-chip size="large"
              class="heading">VS</v-chip>
          </v-col>
          <v-col v-if="checkType === 'contested' && selectedTarget">
            <div class="text-center heading">
              {{ selectedTarget.Name }}
              <v-divider class="mb-2" />
              <skill-check-base ref="contest"
                :controller="selectedTarget.CombatController"
                :selected-hase="selectedHase" />
            </div>
          </v-col>
          <v-col v-else-if="checkType === 'contested' && !selectedTarget"
            class="text-center text-disabled text-caption"
            align-self="center">
            <i>No Target Selected</i>
          </v-col>
        </v-row>
      </v-card>
      <cc-alert v-if="
        this.checkType === 'contested' &&
        this.selectedTarget &&
        $refs.check.roll &&
        $refs.contest.roll
      "
        class="mt-4"
        :color="$refs.check.roll >= $refs.contest.roll ? 'success' : 'error'"
        outlined>
        <div class="text-center heading">
          Result:
          <span>
            {{ controller.CombatName }}
            {{ $refs.check.roll >= $refs.contest.roll ? 'Wins' : 'Loses' }}
          </span>
        </div>
      </cc-alert>
      <menu-input hide-input
        :key="controller.ID"
        :active-effect="action"
        :encounter="encounter"
        :owner="controller.Parent"
        :close="close"
        @apply="apply"
        @reset="reset" />
    </template>
  </cc-dialog>
</template>

<script>
import { CompendiumStore } from '@/stores';
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';
import SkillCheckBase from './_skillCheckBase.vue';

export default {
  name: 'InvadeButton',
  props: {
    action: {
      type: Object,
      required: true,
    },
    owner: {
      type: Object,
      required: true,
    },
    encounter: {
      type: Object,
      required: true,
    },
  },
  components: {
    MenuInput,
    SkillCheckBase,
  },
  data: () => ({
    roll: null,
    bonus: 0,
    accDiff: 0,
    targetVal: 10,
    rollResults: [],
    selectedHase: 'hull',
    checkType: 'standard',
    difficult: false,
    modifier: '',
    selectedTarget: null,
    hase: [
      { title: 'Hull', value: 'hull' },
      { title: 'Agility', value: 'agility' },
      { title: 'Systems', value: 'systems' },
      { title: 'Engineering', value: 'engineering' },
      { title: 'None', value: '' },
    ],
  }),
  watch: {
    difficult(newVal) {
      if (newVal) {
        this.accDiff -= 1;
      } else {
        this.accDiff += 1;
      }
    },
    modifier(newVal) {
      if (newVal === 'heroic') {
        this.targetVal = 20;
      } else {
        this.targetVal = 10;
      }
    },
    applicableBonuses: {
      immediate: true,
      handler(newVal) {
        this.bonus = newVal.bonuses.reduce((acc, curr) => acc + curr.Value, 0);
        this.accDiff = newVal.accDiff.reduce((acc, curr) => acc + curr.Accuracy, 0);
      },
    },
  },
  computed: {
    controller() {
      return this.owner.actor.CombatController;
    },
    canActivate() {
      return this.controller.CanActivate(this.action.Activation);
    },
    canUse() {
      return !this.controller.IsActionUsed(this.actionId);
    },
    available() {
      return this.canActivate && this.canUse;
    },
    targets() {
      const thisCombatant = this.encounter.Combatants.find(
        (c) => c.actor.ID === this.controller.RootActor.ID
      );
      if (!thisCombatant) return [];
      return this.encounter.Combatants.filter(
        (c) =>
          c.actor.ID !== this.controller.ActiveActor.ID &&
          c.actor.ID !== this.controller.RootActor.ID
      ).map((x) => x.actor.CombatController.ActiveActor);
    },
    applicableBonuses() {
      let bonuses = [];
      bonuses = this.controller.ActiveActor.FeatureController?.Bonuses?.filter(
        (b) => b.ID === this.selectedHase || b.ID === 'check'
      );
      const result = {
        bonuses: bonuses.filter((b) => !!b.Value) || [],
        accDiff: bonuses.filter((b) => !!b.Accuracy) || [],
      };
      if (this.selectedHase) {
        const statBonus = this.controller.ActiveActor.CombatController.StatController.getStat(
          this.selectedHase
        );
        if (statBonus) {
          result.bonuses.push({
            Source: `${this.selectedHase.charAt(0).toUpperCase() + this.selectedHase.slice(1)} Stat`,
            Value: statBonus,
          });
        }
      }

      return result;
    },
  },
  emits: ['activate'],
  methods: {
    clearableConditions(target) {
      if (!target) return [];
      return target.CombatController.Statuses.filter(
        (s) => s.status.StatusType.toLowerCase() === 'condition'
      );
    },

    apply(close) {
      this.controller.toggleCombatAction(this.action.Activation);

      this.$emit('activate', this.actionId);
      // close();
    },
    reset() {
      this.controller.ResetActivation(this.action.Activation);
    },
    rollCheck(idx) {
      this.rollResults = [];
      const results = [];
      const count = 1 + Math.abs(this.accDiff);

      for (let i = 1; i <= count; i++) {
        const roll = Math.floor(Math.random() * 20) + 1;
        const val = roll + this.bonus;
        results.push({
          val,
          text: `${roll} + ${this.bonus} (${val})`,
        });
      }

      if (this.accDiff < 0) {
        results.sort((a, b) => a.val - b.val);
      } else {
        results.sort((a, b) => b.val - a.val);
      }

      this.rollResults = results;

      this.roll = results[0].val;
    },
    overrideCheck(idx) {
      if (this.roll < this.targetVal) {
        this.roll = 20;
      } else {
        this.roll = 1;
      }
    },
  },
};
</script>
