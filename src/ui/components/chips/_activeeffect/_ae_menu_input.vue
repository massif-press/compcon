<template>
  <div v-if="!embedded"
    class="text-right text-caption text-disabled mb-1">
    <i v-if="activeEffect.Origin.Name">
      From {{ activeEffect.Origin.Name }}
      <span v-if="activeEffect.Origin.Source">
        ({{ activeEffect.Origin.Type }}, {{ activeEffect.Origin.Source }})
      </span>
      <span v-else-if="activeEffect.Origin.Origin">
        ({{ activeEffect.Origin.Origin.Name }},
        {{ activeEffect.Origin.Origin.ItemType.replace(/([a-z])([A-Z])/g, '$1 $2') }})
      </span>
      <cc-lcp-info :item="activeEffect.Origin" />
    </i>
  </div>

  <v-row v-if="event.AttackBonus || event.Accuracy"
    dense
    align="center"
    justify="end"
    class="bg-panel heading h3 pb-1 mb-1 px-3">
    <v-col v-if="event.AttackBonus"
      cols="auto">
      <cc-npc-attack-bonus :attack-bonus="event.AttackBonus" />
    </v-col>
    <v-col v-if="event.Accuracy"
      cols="auto">
      <cc-npc-accuracy-element :accuracy="event.Accuracy" />
    </v-col>
  </v-row>

  <div v-if="!hideInput">
    <cc-alert v-if="activeEffect.Condition"
      color="primary">
      <b class="text-accent">IF:&nbsp;</b>
      <b v-html-safe="activeEffect.getCondition(owner.actor.CombatController.Tier)" />
    </cc-alert>
    <cc-alert v-if="(activeEffect as any).Trigger"
      color="primary">
      <b class="text-accent">Trigger:&nbsp;</b>
      <b v-html-safe="activeEffect.getTrigger(owner.actor.CombatController.Tier)" />
    </cc-alert>

    <div v-html-safe="activeEffect.getDetail(owner.actor.CombatController.Tier)"
      class="text-text pa-1 mb-3" />

    <v-card flat
      tile
      :color="color"
      class="mb-1 px-1">

      <effect-applicator v-if="!event.IsPassive"
        :pc="isPilotSheet"
        :event="event" />

    </v-card>

  </div>


  <v-slide-y-transition>
    <div v-if="event && event.Staged"
      class="pa-4">
      <div class="text-cc-overline text-disabled">Staged:</div>
      <v-row dense>
        <v-col>
          <code style="white-space: pre-wrap; font-size: 12px;">
          {{ event.Summary }}
        </code>
        </v-col>
        <v-col cols="auto"
          align-self="end">
          <v-btn size=small
            icon
            flat
            tile
            variant="text"
            class="fade-select"
            @click="copyText(event.Summary)">
            <v-icon icon="mdi-content-copy" />
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-slide-y-transition>

  <apply-button :event="<ActiveEffectEvent>event"
    :encounter-instance="encounterInstance"
    :owner="owner"
    :close="close"
    @reset="reset($event)"
    @apply="$emit('apply')" />

</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { CombatantData } from '@/classes/encounter/Encounter';

import { ActiveEffectEvent } from '@/classes/components/feature/active_effects/ActiveEffectEvent';
import EffectApplicator from './EffectApplicator.vue';
import ApplyButton from './ApplyButton.vue'
import { ActiveEffect } from '@/classes/components/feature/active_effects/ActiveEffect';
import { EncounterInstance } from '@/classes/encounter/EncounterInstance';
import { Action } from '@/classes/Action';

const props = withDefaults(defineProps<{
  activeEffect: any
  encounterInstance: EncounterInstance
  owner: CombatantData
  close: Function
  hideInput?: boolean
  embedded?: boolean
  color?: string
  overrideMissingInputs?: boolean
  initialTargets?: any[]
  action?: Action
}>(), {
  hideInput: false,
  embedded: false,
  color: 'panel',
  overrideMissingInputs: null,
  initialTargets: () => [],
})

const emit = defineEmits<{
  apply: []
  reset: [...args: any[]]
}>()

const event = ref({} as ActiveEffectEvent)
const ready = ref(false)
const isFree = ref(false)

const isPilotSheet = computed(() => props.encounterInstance.ItemType === 'PilotSheet')

const isApplied = computed((): boolean =>
  props.owner.actor.CombatController.IsActionUsed(props.activeEffect.ID)
)

const isRam = computed((): boolean => props.activeEffect.ID === 'act_ram')

const canOverride = computed(() =>
  props.activeEffect.AddOther?.length ||
  props.activeEffect.AddResist?.length ||
  props.activeEffect.AddStatus?.length ||
  props.activeEffect.AddSpecial?.length ||
  props.activeEffect.Damage.length > 0
)

const hasAction = computed(() =>
  props.activeEffect.AddOther ||
  props.activeEffect.AddResist ||
  props.activeEffect.AddStatus ||
  props.activeEffect.AddSpecial ||
  props.activeEffect.Damage.length ||
  props.activeEffect.Save
)

const activation = computed((): boolean => (props.activeEffect as any).Activation != null)

const frequencyText = computed((): string => {
  if (props.activeEffect.Frequency) {
    if (
      typeof props.activeEffect.Frequency === 'object' &&
      (props.activeEffect.Frequency as any).FreqText
    ) {
      return (props.activeEffect.Frequency as any).FreqText;
    } else if (typeof props.activeEffect.Frequency === 'string') {
      return props.activeEffect.Frequency;
    }
  }
  return '';
})

function reset(clearAction = false) {
  if (clearAction) props.owner.actor.CombatController.ClearActionUsed(props.activeEffect.ID);
  const self = props.encounterInstance.Combatants.find(
    (c: CombatantData) => c.actor.CombatController.RootActor.ID === props.owner.actor.CombatController.RootActor.ID
  );
  if (!self) {
    throw new Error('Owner combatant not found in encounterInstance');
  }
  event.value = new ActiveEffectEvent(self, props.activeEffect, props.encounterInstance);
}

function copyText(text: string) {
  navigator.clipboard.writeText(text);
}

onMounted(() => {
  reset();
})
</script>
