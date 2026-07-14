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

          <div class="text-cc-overline mt-2">{{ $t('active.pcEndRound.nextRound') }}:</div>
          <div class="my-1">
            <div class="mx-4 px-2 text-text bg-panel">
              <b class="text-secondary">{{ controller.CombatName }}</b>
              {{ $t('active.pcEndRound.willLoseStatuses') }}:
              <div v-for="(s, index) in getTimeoutStatuses()"
                :key="`timeout-${index}`"
                class="px-2 text-text bg-panel">
                <b class="text-accent text-uppercase">
                  <div v-if="s.status.Svg"
                    v-html-safe="cleanSvg(s.status.Svg)"
                    class="d-inline-block"
                    :style="{
                      width: s.status.IconSize(),
                      height: s.status.IconSize(),
                      filter: `invert(${$vuetify.theme.current.dark ? 1 : 0})`,
                    }" />
                  <v-icon v-else
                    :icon="s.status.Icon"
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
              {{ $t('active.pcEndRound.willLoseStatuses') }}:
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
            <i18n-t keypath="active.pcEndRound.braceExit"
              tag="span"
              scope="global">
              <template #braced><b class="text-accent">{{ $t('active.actions.braced')
                  }}</b></template>
              <template #cooldown><b class="text-warning">{{ $t('active.pcEndRound.braceCooldown')
                  }}</b></template>
            </i18n-t>
          </div>
        </div>

        <div v-if="hasBurn">
          <v-divider class="my-4" />
          <cc-alert color="burn"
            icon="cc:burn"
            variant="outlined"
            :title="$t('active.pcEndRound.burnTitle')">
            <div class="body-text"
              v-html-safe="$t('active.burnCheck.prompt', { n: currentBurn })" />
            <div v-if="!burnHandled"
              class="d-flex flex-wrap mt-2"
              style="gap: 8px">
              <cc-button color="primary"
                prepend-icon="mdi-dice-d20"
                @click="burnDialog = true">
                {{ $t('active.pcEndRound.resolveBurn') }}
              </cc-button>
              <cc-button variant="text"
                @click="markBurnHandled">
                {{ $t('active.burnCheck.ignore') }}
              </cc-button>
            </div>
            <div v-else
              class="text-cc-overline text-success mt-2">
              <v-icon icon="mdi-check"
                size="small"
                start />{{ $t('active.pcEndRound.burnResolved') }}
            </div>
          </cc-alert>
        </div>

        <v-divider class="my-4" />
        <cc-button color="primary"
          block
          prepend-icon="mdi-check-all"
          :disabled="hasBurn && !burnHandled"
          @click="endRound(isActive)">
          {{ $t('active.endRound.endRound') }}
        </cc-button>
        <div v-if="hasBurn && !burnHandled"
          class="text-cc-overline text-error text-center mt-1">
          {{ $t('active.pcEndRound.burnRequired') }}
        </div>

        <burn-check-modal v-if="mechController"
          v-model="burnDialog"
          :cc="mechController"
          @resolved="markBurnHandled" />
      </v-card-text>
    </template>
  </end-round-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import * as _ from 'lodash-es';
import PilotSheet from '@/features/pilot_management/store/PilotSheet';
import EndRoundDialog from '../../_shared/_EndRoundDialog.vue';
import EndRoundActionChips from '../../_components/EndRoundActionChips.vue';
import BurnCheckModal from '../../gm/EncounterPanels/_components/BurnCheckModal.vue';
import { StatKey } from '@/classes/components/combat/stats/Stats';
import DOMPurify from 'dompurify';

defineOptions({ name: 'PcEndRoundPanel' })

const props = defineProps<{
  sheet: PilotSheet
}>()

const burnDialog = ref(false)
const burnHandledRound = ref<number | null>(null)
const burnHandled = computed(() => burnHandledRound.value === props.sheet.Round)
const mechController = computed(() => props.sheet.Pilot.ActiveMech?.CombatController)
const currentBurn = computed(() =>
  mechController.value?.StatController.getCurrent(StatKey.BURN) ?? 0
)
const hasBurn = computed(() => currentBurn.value > 0)

function markBurnHandled() {
  burnHandledRound.value = props.sheet.Round
}
function cleanSvg(svg: string) {
  return DOMPurify.sanitize(svg, { USE_PROFILES: { svg: true, svgFilters: true } });
}
const nextRoundAlerts = computed(() => {
  return braced.value || getTimeoutStatuses().length || getTimeoutStatuses(true).length;
})
const controller = computed(() => {
  return props.sheet.Pilot.CombatController;
})
const hasRemainingActions = computed(() => {
  return controller.value.HasRemainingActions;
})

const braced = computed(() => {
  return controller.value.Braced;
})

function getTimeoutStatuses(custom = false): any[] {
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
