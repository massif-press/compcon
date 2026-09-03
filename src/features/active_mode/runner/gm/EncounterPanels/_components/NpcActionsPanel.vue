<template>
  <base-actions-panel
    :quick-actions="quickNpcActions"
    :full-actions="fullNpcActions"
    @deploy="$emit('deploy', $event)"
    @activate="activate($event)"
  >
    <template #quick-action-btn="{ action }">
      <invade-button
        v-if="action?.ID === 'act_invade'"
        :action="action"
        @activate="activate($event)"
      />
      <basic-action-button
        v-else
        :action="action"
        @activate="activate($event)"
      />
    </template>
  </base-actions-panel>
</template>

<script setup lang="ts">
  import type { CombatantData } from '@/classes/encounter/Encounter'
  import { useEncounterContext } from '../encounterContext'
  import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
  import { computed } from 'vue'
  import { CompendiumStore } from '@/stores'
  import { notify } from '@/util/notify'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()
  import BaseActionsPanel from './BaseActionsPanel.vue'
  import BasicActionButton from './loadouts/action_buttons/basicActionButton.vue'
  import InvadeButton from './loadouts/action_buttons/invadeButton.vue'

  const { owner, encounterInstance } = useEncounterContext()

  const emit = defineEmits<{ deploy: [event: any] }>()

  const quickNpcActions = [
    'act_boost',
    'act_grapple_npc',
    'act_hide',
    'act_prepare',
    'act_ram_npc',
    'act_invade',
    'act_lockon',
    'act_search',
  ]
  const fullNpcActions = ['act_disengage', 'act_improvised_attack_npc', 'act_stabilize_npc']

  const controller = computed(() => owner.value.actor.CombatController)

    const NOTICES: Record<string, { ok: [string, string]; fail?: [string, string] }> = {
    act_prepare: { ok: ['active.npcActions.npcPreparedTitle', 'active.common.preparedText'] },
    act_stabilize_npc: {
      ok: ['active.npcActions.npcStabilizedTitle', 'active.npcActions.npcStabilizedText'],
    },
    act_hide: { ok: ['active.npcActions.npcHiddenTitle', 'active.common.hiddenText'] },
    act_disengage: {
      ok: ['active.npcActions.npcDisengagedTitle', 'active.common.disengagedText'],
      fail: ['active.common.disengageFailed', 'active.common.disengageFailedText'],
    },
  }

  function activate(event: string) {
    const ok = controller.value.PerformAction(event)
    const notice = NOTICES[event]
    if (!notice) return
    if (!ok && !notice.fail) return
    const [title, text] = ok ? notice.ok : notice.fail!
    notify({
      type: ok ? 'success' : 'warning',
      title: t(title),
      text: t(text, { name: controller.value.CombatName }),
    })
  }
</script>
