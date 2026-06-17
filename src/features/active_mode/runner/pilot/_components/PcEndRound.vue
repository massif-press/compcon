<template>
  <end-round-dialog>
    <template #default="{ isActive }">
      <v-card-text>
          <cc-alert v-if="hasRemainingActions"
            color="error"
            icon="mdi-alert"
            variant="outlined"
            :title="$t('active.titles.youHaveRemainingActions')">
            <v-row class="my-1 mx-4 px-2 text-text bg-panel"
              justify="space-around">
              <end-round-action-chips :controller="controller"
                large />
            </v-row>
            <div class="heading text-center">
              {{ $t('active.pcEndRound.forfeitActions') }}
            </div>
          </cc-alert>

          <div v-if="nextRoundAlerts">
            <v-divider class="my-4" />

            <div class="text-cc-overline mt-2">{{ $t('active.pcEndRound.nextRound') }}</div>
            <div class="my-1">
              <div class="mx-4 px-2 text-text bg-panel">
                <b class="text-secondary">{{ controller.CombatName }}</b>
                {{ $t('active.pcEndRound.willLoseStatuses') }}
                <div v-for="(s, index) in getTimeoutStatuses()"
                  :key="`timeout-${index}`"
                  class="px-2 text-text bg-panel">
                  <b class="text-accent text-uppercase">
                    <v-icon :icon="s.status.Icon"
                      size="small"
                      class="mt-n1" />
                    {{ s.status.Name }}
                  </b>
                  {{ $t('active.pcEndRound.atThe') }}
                  <b class="text-accent">
                    {{ $t('active.pcEndRound.endsOnTurn', { when: s.expires.EndsOn }) }}
                  </b>
                </div>
              </div>
              <div v-for="(s, index) in getTimeoutStatuses(true)"
                :key="`timeout-custom-${index}`"
                class="my-1 mx-4 px-2 text-text bg-panel">
                <b class="text-secondary">{{ controller.CombatName }}</b>
                {{ $t('active.pcEndRound.willLoseStatuses') }}
                <div v-for="(s, sIdx) in getTimeoutStatuses()"
                  :key="`timeout-custom-inner-${sIdx}`"
                  class="my-1 mx-4 px-2 text-text bg-panel">
                  <b class="text-accent text-uppercase">
                    {{ s.status.Name }}
                  </b>
                  {{ $t('active.pcEndRound.atThe') }}
                  <b class="text-accent">
                    {{ $t('active.pcEndRound.endsOnTurn', { when: s.expires.EndsOn }) }}
                  </b>
                </div>
              </div>
            </div>

            <div v-for="(b, index) in braced"
              :key="`braced-${index}`"
              class="my-1 mx-4 px-2 text-text bg-panel">
              <i18n-t keypath="active.pcEndRound.braceExit" tag="span" scope="global">
                <template #braced><b class="text-accent">{{ $t('active.pcEndRound.braced') }}</b></template>
                <template #cooldown><b class="text-warning">{{ $t('active.pcEndRound.braceCooldown') }}</b></template>
              </i18n-t>
            </div>
          </div>

          <v-divider class="my-4" />
          <cc-button color="primary"
            block
            prepend-icon="mdi-check-all"
            @click="endRound(isActive)">
            {{ $t('active.endRound.endRound') }}
          </cc-button>
        </v-card-text>
    </template>
  </end-round-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import * as _ from 'lodash-es';
import PilotSheet from '@/features/pilot_management/store/PilotSheet';
import EndRoundDialog from '../../_shared/_EndRoundDialog.vue';
import EndRoundActionChips from '../../_components/EndRoundActionChips.vue';

defineOptions({ name: 'PcEndRoundPanel' })

const props = defineProps<{
  sheet: PilotSheet
}>()

const nextRoundAlerts = computed(() => {
      return braced.value || getTimeoutStatuses().length || getTimeoutStatuses(true).length;
    })
const controller = computed(() => {
      return props.sheet.Pilot.CombatController;
    })
const hasRemainingActions = computed(() => {
      return controller.value.HasRemainingActions;
    })
const hasTimedEffects = computed(() => {
      return controller.value.TimedEffects.length > 0;
    })
const braced = computed(() => {
      return controller.value.Braced;
    })

function getTimeoutStatuses(custom = false) {
      return controller.value[custom ? 'CustomStatuses' : 'Statuses'].filter(
        (s) =>
          s.expires &&
          (s.expires.Period === 'turn' ||
          (s.expires.Period === 'round' &&
            s.expires.RoundEndNumber &&
            s.expires.RoundEndNumber === props.sheet.Round + 1))
      );
    }
async function endRound(isActive) {
      isActive.value = false;
      await props.sheet.EndRound();
    }
</script>
