<template>
  <action-palette
    :controller="controller"
    :actor="owner.actor"
    :ids="ids"
    :weapon-actions="wizard && !simple"
    @deploy="$emit('deploy', $event)"
  >
    <template #button="{ action, section, weapon }">
      <npc-skirmish-button
        v-if="weapon && action.ID === 'act_skirmish'"
        :action="action"
        :preset-weapon="weapon"
        :label="weaponLabel(action, weapon)"
      />
      <npc-barrage-button
        v-else-if="weapon"
        :action="action"
        :preset-weapon="weapon"
        :label="weaponLabel(action, weapon)"
      />
      <invade-button
        v-else-if="action.ID === 'act_invade'"
        :action="action"
        @activate="activate($event)"
      />
      <targeted-action-button
        v-else-if="section === 'quick' && controller.NeedsTarget(action.ID)"
        :action="action"
      />
      <basic-action-button
        v-else
        :action="action"
        @activate="activate($event)"
      />
    </template>
  </action-palette>
</template>

<script setup lang="ts">
  import { useEncounterContext } from '../encounterContext'
  import { computed } from 'vue'
  import { notify } from '@/util/notify'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()
  import ActionPalette from './ActionPalette.vue'
  import BasicActionButton from './loadouts/action_buttons/basicActionButton.vue'
  import InvadeButton from './loadouts/action_buttons/invadeButton.vue'
  import TargetedActionButton from './loadouts/action_buttons/targetedActionButton.vue'
  import NpcSkirmishButton from './loadouts/action_buttons/npcSkirmishButton.vue'
  import NpcBarrageButton from './loadouts/action_buttons/npcBarrageButton.vue'

  const { owner, simple, wizard } = useEncounterContext()

  defineEmits<{ deploy: [event: any] }>()

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

  const ids = computed(() => ({
    quickAttack: simple.value ? ['act_skirmish'] : [],
    fullAttack: simple.value ? ['act_barrage'] : [],
    quick: quickNpcActions,
    full: fullNpcActions,
    reactions: ['act_overwatch'],
  }))

  const controller = computed(() => owner.value.actor.CombatController)

  function weaponLabel(action: { Name: string }, weapon: { Name: string }) {
    return t('active.turnWizard.weaponAction', { action: action.Name, weapon: weapon.Name })
  }

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
