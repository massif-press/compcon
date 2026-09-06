<template>
  <v-row no-gutters>
    <v-col class="heading h2 mb-2">
      <icon-select-menu :icon="combatant.actor.Icon"
        @select="combatant.actor.Icon = $event" />

      <cc-short-string-editor large
        @set="combatant.actor.Name = $event">
        <span class="text-accent">
          {{ combatant.actor.Name }}
        </span>
      </cc-short-string-editor>
    </v-col>

    <v-col v-if="combatant.actor.PlayerName"
      cols="auto">
      <span class="text-cc-overline pr-1">{{ $t('active.roster.playedBy') }}</span>
      <b class="text-accent">{{ combatant.actor.PlayerName }}</b>
    </v-col>
  </v-row>

  <cc-rich-text-area v-model="combatant.actor.Notes" />
  <br />

  <panel-base :item="combatant.actor"
    no-stats>
    <template #action-palette>
      <turn-state-toggles :states="turnStates" />
    </template>
  </panel-base>
</template>

<script setup lang="ts">
import type { CombatantData } from '@/classes/encounter/Encounter'
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { computed, provide } from 'vue'
import { EncounterContextKey } from './encounterContext'
import IconSelectMenu from './_components/IconSelectMenu.vue'
import PanelBase from './_PanelBase.vue'
import TurnStateToggles from './_components/TurnStateToggles.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  combatant: CombatantData
  encounterInstance: EncounterInstance
}>()

provide(EncounterContextKey, {
  owner: computed(() => props.combatant),
  encounterInstance: computed(() => props.encounterInstance),
})

defineEmits<{
  deselect: []
}>()

const turnStates = computed(() => {
  const cc = props.combatant.actor.CombatController
  return [
    {
      key: 'mounted',
      label: t('active.actions.mounted'),
      active: cc.Mounted,
      show: props.combatant.actor.PlaceholderType?.toLowerCase() === 'pilot',
      toggle: () => (cc.Mounted = !cc.Mounted),
    },
    {
      key: 'braced',
      label: t('active.actions.braced'),
      active: cc.Braced,
      reason: cc.BlockedReasonFor('brace'),
      toggle: () => cc.SetBraced(!cc.Braced),
      forceToggle: () => cc.SetBraced(!cc.Braced, true),
    },
    {
      key: 'overwatch',
      label: t('active.actions.overwatch'),
      active: cc.Overwatch,
      reason: cc.BlockedReasonFor('overwatch'),
      toggle: () => cc.SetOverwatch(!cc.Overwatch),
      forceToggle: () => cc.SetOverwatch(!cc.Overwatch, true),
    },
    {
      key: 'prepared',
      label: t('active.common.prepared'),
      active: cc.Prepared,
      toggle: () => (cc.Prepared = !cc.Prepared),
    },
  ]
})
</script>
