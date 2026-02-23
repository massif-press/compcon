<template>
  <v-col cols="auto"
    class="mt-1"
    v-if="event.Attack">
    <div v-if="!mobile"
      class="text-cc-overline text-disabled">vs {{ event.AttackStat }}</div>
    <div v-for="(s, idx) in event.Targets">
      <v-row v-if="!s"
        no-gutters
        align="center"
        justify="center">
        <v-col cols="auto"
          class="mt-1">
          <i class="text-caption text-disabled">No Target Selected</i>
        </v-col>
      </v-row>
      <v-row v-else
        no-gutters>
        <v-col>
          <v-text-field v-model="s.AttackRolledValue"
            density="compact"
            variant="outlined"
            :class="mobile ? 'short' : 'mb-1'"
            type="number"
            :width="mobile ? 60 : 85"
            hide-spin-buttons
            flat
            :error="!s.AttackRolledValue"
            hide-details
            tile
            @update:model-value="s.AttackRolledValue = Number($event)">
            <template #prepend>
              <check-roll-interface :roll-data="s" />
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="auto"
          align-self="center">
          <div class="text-center text-cc-overline px-2">VS</div>
        </v-col>
        <v-col align-self="center">
          <v-text-field v-model="s.TargetDefenseValue"
            :key="s.Combatant?.ID || `defense_${idx}`"
            density="compact"
            :class="mobile ? 'short' : 'mb-1'"
            variant="outlined"
            type="number"
            width="100"
            hide-spin-buttons
            :error="!s.TargetDefenseValue"
            flat
            tile
            hide-details
            @update:model-value="s.TargetDefenseValue = Number($event)">
            <template #append>
              <v-tooltip location="top">
                <template #activator="{ props }">
                  <v-btn icon
                    size="x-small"
                    flat
                    tile
                    class="ml-n1"
                    color="transparent"
                    v-bind="props"
                    @click="overrideSave(s)">
                    <v-icon size="25"
                      :color="!s.HitResult
                        ? ''
                        : s.HitResult === 'crit'
                          ? 'exotic'
                          : s.HitResult === 'hit'
                            ? 'success'
                            : 'error'
                        "
                      :icon="!s.HitResult
                        ? 'mdi-circle-outline'
                        : s.HitResult === 'crit'
                          ? 'mdi-check-decagram'
                          : s.HitResult === 'hit'
                            ? 'mdi-check-circle'
                            : 'mdi-cancel'
                        " />
                  </v-btn>
                </template>

                <div class="text-center">
                  {{
                    s.HitResult !== 'crit'
                      ? 'No Attack Rolled'
                      : s.HitResult === 'crit'
                        ? 'Critical Hit'
                        : s.HitResult === 'hit'
                          ? 'Successful Attack'
                          : 'Failed Attack'
                  }}

                  <div>
                    <i class="text-caption text-disabled">Click to override</i>
                  </div>
                </div>
              </v-tooltip>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
    </div>
  </v-col>
</template>

<script>
import CheckRollInterface from './CheckRollInterface.vue';

export default {
  name: 'BaseAttackRoller',
  components: {
    CheckRollInterface
  },
  props: {
    event: { type: Object, required: true },
    crits: { type: Boolean, default: false },
  },
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    }
  },
  methods: {
    getTargetCoverDifficulty(idx) {
      const target = this.selectedTargets[idx];
      if (!target) return 0;

      return target.actor.CombatController.Cover === 'none'
        ? 0
        : target.actor.CombatController.Cover === 'soft'
          ? 1
          : 2;
    },
    overrideSave(s) {
      if (!s.HitResult) return;
      if (s.HitResult === 'crit') {
        s.AttackRolledValue = 0;
      } else if (s.HitResult === 'miss') {
        s.AttackRolledValue = s.TargetDefenseValue
      } else {
        s.AttackRolledValue = 20;
      }
    },
  },
};
</script>

<style scoped>
::v-deep(.short .v-field__input) {
  min-height: 28px !important;
  padding: 4px !important;
  padding-left: 8px !important;
}

::v-deep(.short .v-field) {
  height: 28px !important;
}
</style>
