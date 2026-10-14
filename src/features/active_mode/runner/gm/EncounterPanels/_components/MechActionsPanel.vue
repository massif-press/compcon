<template>
  <action-palette
    :controller="controller"
    :actor="activeMech"
    :ids="ids"
    @deploy="$emit('deploy', $event)"
  >
    <template #button="{ action, section }">
      <mech-skirmish-button
        v-if="action.ID === 'act_skirmish'"
        :action="action"
        @activate="activate($event)"
      />
      <mech-barrage-button
        v-else-if="action.ID === 'act_barrage'"
        :action="action"
        @activate="activate($event)"
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
      <stabilize-button
        v-else-if="action.ID === 'act_stabilize'"
        :action="action"
      />
      <skill-check-button
        v-else-if="action.ID === 'act_skill_check'"
        :action="action"
        @activate="activate($event)"
      />
      <overcharge-button
        v-else-if="action.ID === 'act_overcharge'"
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
  import BasicActionButton from './loadouts/action_buttons/basicActionButton.vue'
  import ActionPalette from './ActionPalette.vue'
  import TargetedActionButton from './loadouts/action_buttons/targetedActionButton.vue'
  import InvadeButton from './loadouts/action_buttons/invadeButton.vue'
  import StabilizeButton from './loadouts/action_buttons/stabilizeButton.vue'
  import SkillCheckButton from './loadouts/action_buttons/skillCheckButton.vue'
  import OverchargeButton from './loadouts/action_buttons/overchargeButton.vue'
  import MechSkirmishButton from './loadouts/action_buttons/mechSkirmishButton.vue'
  import MechBarrageButton from './loadouts/action_buttons/mechBarrageButton.vue'

  const { owner } = useEncounterContext()

  defineEmits<{ deploy: [event: any] }>()

  const quickMechActions = [
    'act_boost',
    'act_grapple',
    'act_ram',
    'act_invade',
    'act_bolster',
    'act_lockon',
    'act_hide',
    'act_search',
    'act_scan',
    'act_prepare',
    'act_eject',
    'act_shut_down',
  ]
  const fullMechActions = [
    'act_disengage',
    'act_stabilize',
    'act_improvised_attack',
    'act_skill_check',
    'act_dismount',
    'act_boot_up',
    'act_full_tech',
  ]

  const ids = {
    quickAttack: ['act_skirmish'],
    fullAttack: ['act_barrage'],
    quick: quickMechActions,
    full: fullMechActions,
    reactions: ['act_overcharge', 'act_brace', 'act_overwatch'],
    lastReactions: ['act_self_destruct'],
  }

  const activeMech = computed(() => owner.value.actor.ActiveMech!)
  const controller = computed(() => activeMech.value.CombatController)

  const NOTICES: Record<string, { ok: [string, string]; fail?: [string, string] }> = {
    act_prepare: { ok: ['active.mechActions.preparedTitle', 'active.common.preparedText'] },
    act_eject: {
      ok: ['active.mechActions.pilotEjectedTitle', 'active.mechActions.pilotEjectedText'],
      fail: ['active.mechActions.ejectFailedTitle', 'active.mechActions.ejectFailedText'],
    },
    act_dismount: {
      ok: ['active.mechActions.pilotDismountedTitle', 'active.mechActions.pilotDismountedText'],
      fail: ['active.mechActions.dismountFailedTitle', 'active.mechActions.ejectFailedText'],
    },
    act_hide: { ok: ['active.mechActions.mechHiddenTitle', 'active.common.hiddenText'] },
    act_disengage: {
      ok: ['active.mechActions.mechDisengagedTitle', 'active.common.disengagedText'],
      fail: ['active.common.disengageFailed', 'active.common.disengageFailedText'],
    },
    act_boot_up: {
      ok: ['active.mechActions.mechBootedUpTitle', 'active.mechActions.mechBootedUpText'],
      fail: ['active.mechActions.bootUpFailedTitle', 'active.mechActions.bootUpFailedText'],
    },
    act_self_destruct: {
      ok: [
        'active.mechActions.selfDestructInitiatedTitle',
        'active.mechActions.selfDestructInitiatedText',
      ],
      fail: [
        'active.mechActions.selfDestructFailedTitle',
        'active.mechActions.selfDestructFailedText',
      ],
    },
    act_shut_down: { ok: ['active.mechActions.shutDownTitle', 'active.mechActions.shutDownText'] },
    act_brace: { ok: ['active.mechActions.mechBracedTitle', 'active.mechActions.mechBracedText'] },
    act_overwatch: {
      ok: ['active.mechActions.overwatchTitle', 'active.mechActions.overwatchText'],
    },
  }

  function announce(event: string, ok: boolean) {
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

  function activate(event: string) {
    announce(event, controller.value.RunAction(event))
  }
</script>
