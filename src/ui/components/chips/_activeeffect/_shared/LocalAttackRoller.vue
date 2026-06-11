<template>
  <v-col v-if="event.Attack"
    cols="auto">
    <div v-if="!mobile"
      class="text-cc-overline text-disabled">{{ $t('ui.combat.vsStat', { stat: event.AttackStat }) }}</div>
    <v-row v-for="(s, idx) in event.Targets"
      :key="`target-${idx}`"
      dense
      align="center">

      <v-col cols="auto"
        class="mt-1">

        <v-row v-if="!s"
          no-gutters
          align="center"
          justify="center">
          <v-col cols="auto"
            class="mt-1">
            <i class="text-caption text-disabled">{{ $t('ui.combat.noTarget') }}</i>
          </v-col>
        </v-row>
        <v-row v-else
          no-gutters>
          <v-col>
            <v-text-field :model-value="s.AttackRolledValue"
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
              @update:model-value="handleAttackRoll(s, $event)">
              <template #prepend>
                <check-roll-interface :roll-data="s"
                  @rolled="onAttackRolled($event)" />
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <div v-if="s && s.HitResult === 'miss' && reliableDamageEvents.length"
          class="text-center">
          <v-chip v-for="de in reliableDamageEvents"
            :key="de.DamageType"
            size="x-small"
            color="core"
            class="mr-1">
            {{ $t('ui.combat.reliableOnMiss', { n: de.Reliable, type: de.DamageType }) }}
          </v-chip>
        </div>
      </v-col>

      <v-col cols="auto">
        <v-menu open-on-hover>
          <template #activator="{ props }">
            <v-btn stacked
              :color="!s.HitResult
                ? ''
                : s.HitResult === 'crit'
                  ? 'exotic'
                  : s.HitResult === 'hit'
                    ? 'success'
                    : 'error'
                "
              flat
              :disabled="!s.HitResult"
              tile
              height="45"
              v-bind="s.HitResult === 'crit' ? {} : props">
              <v-icon size="25"
                :icon="!s.HitResult
                  ? 'mdi-circle-outline'
                  : s.HitResult === 'crit'
                    ? 'mdi-check-decagram'
                    : s.HitResult === 'hit'
                      ? 'mdi-check-circle'
                      : 'mdi-cancel'
                  " />
              <template v-if="s.HitResult">{{
                s.HitResult === 'crit'
                  ? $t('ui.combat.crit')
                  : s.HitResult === 'hit'
                    ? $t('ui.combat.hit')
                    : $t('ui.combat.miss') }}</template>
            </v-btn>
          </template>
          <v-card class="pa-2">

            <v-list-item class="text-center"
              :title="s.HitResult !== 'crit'
                ? 'No Attack Rolled'
                : s.HitResult === 'crit'
                  ? 'Critical Hit'
                  : s.HitResult === 'hit'
                    ? 'Successful Attack'
                    : 'Miss'
                "
              subtitle="Select result" />
            <v-divider class="my-2" />
            <v-list-item title="Successful Hit"
              prepend-icon="mdi-check-circle"
              class="bg-success"
              @click="setHitResult(s, 'hit')" />
            <v-list-item title="Miss"
              prepend-icon="mdi-cancel"
              class="bg-error"
              @click="setHitResult(s, 'miss')" />
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
  </v-col>

</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
import CheckRollInterface from './CheckRollInterface.vue';

const { mdAndDown: mobile } = useDisplay()

const props = withDefaults(defineProps<{
  event: object
  crits?: boolean
}>(), {
  crits: false,
})

const reliableDamageEvents = computed(() =>
  (props.event.DamageEvents || []).filter((de: any) => de.Reliable > 0)
)

function setHitResult(s, val: string) {
  s.HitResult = val;
  if (val === 'crit' && props.event.Effect?.CanCrit) props.event.SetCrit();
  else props.event.UnsetCrit();
}

function handleAttackRoll(s, val) {
  s.AttackRolledValue = Number(val);
  if (Number(val) >= 20 && props.event.Effect?.CanCrit) props.event.SetCrit();
  else props.event.UnsetCrit();
}

function onAttackRolled(val) {
  if (Number(val) >= 20 && props.event.Effect?.CanCrit) props.event.SetCrit();
  else props.event.UnsetCrit();
}
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
