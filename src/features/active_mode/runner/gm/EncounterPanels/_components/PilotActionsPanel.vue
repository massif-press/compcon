<template>
  <base-actions-panel
    :quick-actions="quickPilotActions"
    :full-actions="fullPilotActions"
    @deploy="$emit('deploy', $event)"
    @activate="activate($event)"
  >
    <template #before-quick>
      <v-row dense>
        <v-col>
          <pilot-fight-button
            :action="getBaseAction('act_fight')"
            @activate="activate($event)"
          />
        </v-col>
      </v-row>
      <v-divider class="my-2" />
    </template>
    <template #quick-action-btn="{ action }">
      <invade-button
        v-if="action?.ID === 'act_invade'"
        :action="action"
        @activate="activate($event)"
      />
      <pilot-reload-button
        v-else-if="action?.ID === 'act_reload'"
        :action="action"
      />
      <targeted-action-button
        v-else-if="action && controller.NeedsTarget(action.ID)"
        :action="action"
      />
      <basic-action-button
        v-else
        :action="action"
        @activate="activate($event)"
      />
    </template>
    <template #full-action-btn="{ action }">
      <skill-check-button
        v-if="action?.ID === 'act_skill_check'"
        :action="action"
        @activate="activate($event)"
      />
      <pilot-jockey-button
        v-else-if="action?.ID === 'act_jockey'"
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
  import SkillCheckButton from './loadouts/action_buttons/skillCheckButton.vue'
  import PilotReloadButton from './loadouts/action_buttons/pilotReloadButton.vue'
  import PilotJockeyButton from './loadouts/action_buttons/pilotJockeyButton.vue'
  import PilotFightButton from './loadouts/action_buttons/pilotFightButton.vue'
  import InvadeButton from './loadouts/action_buttons/invadeButton.vue'
  import TargetedActionButton from './loadouts/action_buttons/targetedActionButton.vue'

  const { owner, encounterInstance } = useEncounterContext()

  defineEmits<{ deploy: [event: any] }>()

  const quickPilotActions = [
    'act_boost',
    'act_hide',
    'act_search',
    'act_lockon',
    'act_prepare',
    'act_reload',
    'act_invade',
  ]
  const fullPilotActions = ['act_skill_check', 'act_mount', 'act_disengage', 'act_jockey']

  const controller = computed(() => owner.value.actor.CombatController)

  function getBaseAction(actionId: string) {
    return CompendiumStore().Actions.find((a: any) => a.ID === actionId)!
  }

  const NOTICES: Record<string, { ok: [string, string]; fail?: [string, string] }> = {
    act_prepare: { ok: ['active.pilotActions.preparedTitle', 'active.common.preparedText'] },
    act_mount: {
      ok: ['active.pcPanel.pilotMounted', 'active.pilotActions.mountedText'],
      fail: ['active.pilotActions.mountFailedTitle', 'active.pilotActions.mountFailedText'],
    },
    act_hide: { ok: ['active.pilotActions.hiddenTitle', 'active.common.hiddenText'] },
    act_disengage: {
      ok: ['active.pilotActions.disengagedTitle', 'active.common.disengagedText'],
      fail: ['active.common.disengageFailed', 'active.common.disengageFailedText'],
    },
  }

  function activate(event: string) {
    const ok = controller.value.RunAction(event)
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
