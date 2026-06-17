<template>

  <template v-if="activeEffect">
  <cc-button v-if="activeEffect.IsPassive && !embedded"
    block
    size="x-small"
    color="panel"
    prepend-icon="mdi-close"
    @click="close()">
    {{ $t('common.dismiss') }}
  </cc-button>

  <div v-else-if="!embedded"
    class="d-flex justify-end mt-2 mr-4">
    <cc-button size="small"
      stacked
      @click="close">{{ $t('common.cancel') }}</cc-button>
    <v-spacer />
    <div>
      <cc-button v-if="!ready"
        size="small"
        stacked
        :color="color"
        :disabled="!isFree && (isApplied || mandatoryRemaining)"
        @click="stage(false)">
        <div class="px-4">
          <v-icon v-if="icon"
            :icon="icon"
            class="mt-n1"
            start />
          <span v-if="activation">{{ $t('ui.combat.activate') }}</span>
          <span v-else>{{ canOverride ? $t('ui.combat.applyAll') : $t('common.confirm') }}</span>
          <div class="text-disabled">
            <span v-if="activation && (activeEffect as any).Activation !== 'None'"
              style="letter-spacing: 1px">
              {{ isFree ? $t('ui.combat.free') : (activeEffect as any).Activation }}

            </span>
            <span v-if="
              (activeEffect as any).Activation &&
              activeEffect.Frequency &&
              (activeEffect.Frequency as any).Duration !== 'Unlimited'
            ">
              •
            </span>
            <span v-if="activeEffect.Frequency"
              style="letter-spacing: 1px">
              {{ frequencyText }}
            </span>
          </div>
        </div>
        <template #options>
          <v-list density="compact"
            class="pa-0"
            bg-color=panel
            border
            tile>

            <v-list-item class="bg-action--free"
              :disabled="mandatoryRemaining"
              :title="$t('ui.titles.activateFreeAction')"
              @click="stage(true)">
              <template v-if="mandatoryRemaining"
                #subtitle>
                <v-list-item-subtitle>{{ $t('ui.combat.mandatoryFields') }}</v-list-item-subtitle>
              </template>
              <template #prepend>
                <v-icon icon="cc:free"
                  class="mr-n5" />
              </template>
            </v-list-item>
            <v-divider class="my-2" />
            <v-list-item :title="$t('ui.titles.resetAllInputs')"
              @click="$emit('reset', false)">
              <template #prepend>
                <v-icon icon="mdi-reload"
                  class="mr-n5" />
              </template>
            </v-list-item>
          </v-list>
        </template>
      </cc-button>

      <cc-button v-else
        size="small"
        stacked
        :color="color"
        :disabled="!isFree && isApplied"
        @click="apply(close)">
        <div class="px-4">
          <v-icon v-if="icon"
            :icon="icon"
            class="mt-n1"
            start />
          {{ $t('common.confirm') }}
          <div class="text-disabled">
            <span v-if="activation"
              style="letter-spacing: 1px">
              {{ isFree ? $t('ui.combat.free') : (activeEffect as any).Activation }}
            </span>
            <span v-if="
              (activeEffect as any).Activation &&
              activeEffect.Frequency &&
              (activeEffect.Frequency as any).Duration !== 'Unlimited'
            ">
              •
            </span>
            <span v-if="activeEffect.Frequency"
              style="letter-spacing: 1px">
              {{ frequencyText }}
            </span>
          </div>
        </div>
        <template #options>
          <v-list density="compact"
            bg-color=panel
            border
            tile>

            <v-list-item :title="$t('ui.titles.resetAllInputs')"
              @click="$emit('reset', false)">
              <template #prepend>
                <v-icon icon="mdi-reload"
                  class="mr-n5" />
              </template>
            </v-list-item>
          </v-list>
        </template>
      </cc-button>
      <div class="text-center text-cc-overline text-disabled">
        <div v-if="isApplied">{{ $t('ui.combat.alreadyActivated') }}</div>
        <div v-if="noAction">{{ $t('ui.combat.insufficientActionsShort') }}</div>
      </div>
    </div>
  </div>

  </template>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ActiveEffectEvent } from '@/classes/components/feature/active_effects/ActiveEffectEvent';
import { WeaponAttackEvent } from '@/classes/components/feature/active_effects/WeaponAttackEvent';
import { Action } from '@/classes/Action';
import { EncounterInstance } from '@/classes/encounter/EncounterInstance';
import { CombatantData } from '@/classes/encounter/Encounter';

const props = withDefaults(defineProps<{
  event: ActiveEffectEvent | ActiveEffectEvent[]
  weaponEvent?: WeaponAttackEvent | WeaponAttackEvent[]
  action?: Action
  actionId?: string | string[]
  activationOverride?: string
  encounterInstance: EncounterInstance
  owner: CombatantData
  close: () => void
  embedded?: boolean
}>(), {
  weaponEvent: undefined,
  action: undefined,
  actionId: undefined,
  activationOverride: undefined,
  embedded: false,
})

const emit = defineEmits<{
  stage: []
  apply: []
  reset: [...args: any[]]
}>()

const ready = ref(false)
const isFree = ref(false)

const events = computed((): ActiveEffectEvent[] =>
  Array.isArray(props.event) ? props.event as ActiveEffectEvent[] : [props.event]
)

const weaponAttackEvents = computed((): WeaponAttackEvent[] =>
  props.weaponEvent
    ? Array.isArray(props.weaponEvent)
      ? props.weaponEvent as WeaponAttackEvent[]
      : [props.weaponEvent]
    : []
)

const actionIds = computed((): string[] =>
  props.actionId
    ? Array.isArray(props.actionId)
      ? props.actionId as string[]
      : [props.actionId]
    : []
)

const activeEffect = computed(() => events.value[0]?.Effect)

const icon = computed(() =>
  props.action?.Icon || (activeEffect.value as any).Icon || activeEffect.value.Origin.Icon || ''
)

const color = computed(() => {
  if (isFree.value) return 'action--free';
  return props.action?.Color || (activeEffect.value as any).Color || activeEffect.value.Origin.Color || 'primary';
})

const isApplied = computed((): boolean => {
  if (actionIds.value.length) {
    return actionIds.value.every(id =>
      props.owner.actor.CombatController.ActiveActor.CombatController.IsActionUsed(id));
  }
  return props.owner.actor.CombatController.ActiveActor.CombatController.IsActionUsed(activeEffect.value.ID);
})

const noAction = computed((): boolean =>
  !props.owner.actor.CombatController.ActiveActor.CombatController.CanActivate(props.activationOverride || props.action?.Activation || (activeEffect.value as any).Activation || 'free')
)

const canOverride = computed(() =>
  activeEffect.value.AddOther?.length ||
  activeEffect.value.AddResist?.length ||
  activeEffect.value.AddStatus?.length ||
  activeEffect.value.AddSpecial?.length ||
  activeEffect.value.Damage.length > 0
)

const hasAction = computed(() =>
  activeEffect.value.AddOther ||
  activeEffect.value.AddResist ||
  activeEffect.value.AddStatus ||
  activeEffect.value.AddSpecial ||
  activeEffect.value.Damage.length ||
  activeEffect.value.Save
)

const activation = computed((): boolean => (activeEffect.value as any).Activation != null)

const frequencyText = computed((): string => {
  if (activeEffect.value.Frequency) {
    if (
      typeof activeEffect.value.Frequency === 'object' &&
      (activeEffect.value.Frequency as any).FreqText
    ) {
      return (activeEffect.value.Frequency as any).FreqText;
    } else if (typeof activeEffect.value.Frequency === 'string') {
      return activeEffect.value.Frequency;
    }
  }
  return '';
})

const mandatoryRemaining = computed((): boolean => !events.value.every(x => x.Ready))

function stage(asFree) {
  events.value.forEach(e => e.Staged = true)
  isFree.value = asFree || false;
  if (!isFree.value && isApplied.value) return;
  ready.value = true;
  emit('stage');
}

function apply(close: () => void) {
  if (!isFree.value && (isApplied.value || !ready.value)) return;
  if (!isFree.value) {
    props.owner.actor.CombatController.MarkActionUsed(activeEffect.value.ID);
    const action = props.activationOverride || props.action?.Activation || (activeEffect.value as any).Activation || 'free';
    if (action !== 'Reaction') props.owner.actor.CombatController.SetCombatAction(action, false);
  }
  if (weaponAttackEvents.value.length)
    weaponAttackEvents.value.forEach(we => we.ApplyAll());
  else
    events.value.forEach(e => e.ApplyAll());
  isFree.value = false;
  emit('apply');
  close();
}
</script>
