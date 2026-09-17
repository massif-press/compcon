<template>
  <v-expansion-panels
    focusable
    tile
    color="panel"
    flat
    class="mt-1"
  >
    <v-expansion-panel>
      <v-expansion-panel-title class="heading h4 py-0">
        {{ $t('active.actions.allActions') }}
      </v-expansion-panel-title>
      <v-expansion-panel-text style="border: 2px solid rgb(var(--v-theme-panel))">
        <v-row dense>
          <v-col
            v-for="pa in controller.AllActions('Protocol')"
            :key="pa.ID"
          >
            <deploy-button
              v-if="pa.Deployable"
              action-only
              :deployable="toDeployable(pa)"
              :actor="activeMech"
              @deploy="$emit('deploy', $event)"
            />
            <basic-action-button
              v-else
              :action="pa"
              @activate="activate($event)"
            />
          </v-col>
          <v-col
            v-for="fa in controller.AllActions('Free')"
            :key="fa.ID"
          >
            <deploy-button
              v-if="fa.Deployable"
              action-only
              :deployable="toDeployable(fa)"
              :actor="activeMech"
              @deploy="$emit('deploy', $event)"
            />
            <basic-action-button
              v-else
              :action="fa"
              @activate="activate($event)"
            />
          </v-col>
        </v-row>
        <v-divider class="my-2" />
        <v-row dense>
          <v-col>
            <mech-skirmish-button
              :action="getBaseAction('act_skirmish')"
              @activate="activate($event)"
            />
          </v-col>
          <v-col>
            <mech-barrage-button
              :action="getBaseAction('act_barrage')"
              @activate="activate($event)"
            />
          </v-col>
        </v-row>
        <v-divider class="my-2" />

        <v-row
          align="start"
          dense
        >
          <v-col>
            <v-row dense>
              <v-col
                v-for="(action, index) in quickMechActions"
                :key="`quick-${index}`"
              >
                <invade-button
                  v-if="action === 'act_invade'"
                  :action="getBaseAction(action)"
                  @activate="activate($event)"
                />

                <targeted-action-button
                  v-else-if="controller.NeedsTarget(action)"
                  :action="getBaseAction(action)"
                />

                <basic-action-button
                  v-else
                  :action="getBaseAction(action)"
                  @activate="activate($event)"
                />
              </v-col>
              <v-divider class="my-1" />
              <v-col
                v-for="qa in controller.AllActions('Quick')"
                :key="qa.ID"
              >
                <deploy-button
                  v-if="qa.Deployable"
                  action-only
                  :deployable="toDeployable(qa)"
                  :actor="activeMech"
                  @deploy="$emit('deploy', $event)"
                />
                <basic-action-button
                  v-else
                  :action="qa"
                  @activate="activate($event)"
                />
              </v-col>
              <v-col
                v-for="qta in controller.AllActions('Quick Tech')"
                :key="qta.ID"
              >
                <deploy-button
                  v-if="qta.Deployable"
                  action-only
                  :deployable="toDeployable(qta)"
                  :actor="activeMech"
                  @deploy="$emit('deploy', $event)"
                />
                <basic-action-button
                  v-else
                  :action="qta"
                  @activate="activate($event)"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-row dense>
              <v-col
                v-for="(action, index) in fullMechActions"
                :key="`full-${index}`"
              >
                <stabilize-button
                  v-if="action === 'act_stabilize'"
                  :action="getBaseAction(action)"
                />
                <skill-check-button
                  v-else-if="action === 'act_skill_check'"
                  :action="getBaseAction(action)"
                  @activate="activate($event)"
                />
                <basic-action-button
                  v-else
                  :action="getBaseAction(action)"
                  @activate="activate($event)"
                />
              </v-col>
              <v-divider class="my-1" />
              <v-col
                v-for="fa in controller.AllActions('Full')"
                :key="fa.ID"
              >
                <deploy-button
                  v-if="fa.Deployable"
                  action-only
                  :deployable="toDeployable(fa)"
                  :actor="activeMech"
                  @deploy="$emit('deploy', $event)"
                />
                <basic-action-button
                  v-else
                  :action="fa"
                  @activate="activate($event)"
                />
              </v-col>
              <v-col
                v-for="fta in controller.AllActions('Full Tech')"
                :key="fta.ID"
              >
                <deploy-button
                  v-if="fta.Deployable"
                  action-only
                  :deployable="toDeployable(fta)"
                  :actor="activeMech"
                  @deploy="$emit('deploy', $event)"
                />
                <basic-action-button
                  v-else
                  :action="fta"
                  @activate="activate($event)"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider class="my-2" />

        <v-row dense>
          <v-col>
            <overcharge-button :action="getBaseAction('act_overcharge')" />
          </v-col>
          <v-col>
            <basic-action-button
              :action="getBaseAction('act_brace')"
              @activate="activate($event)"
            />
          </v-col>
          <v-col>
            <basic-action-button
              :action="getBaseAction('act_overwatch')"
              @activate="activate($event)"
            />
          </v-col>
          <v-col
            v-for="ra in controller.AllActions('Reaction')"
            :key="ra.ID"
          >
            <deploy-button
              v-if="ra.Deployable"
              action-only
              :deployable="toDeployable(ra)"
              :actor="activeMech"
              @deploy="$emit('deploy', $event)"
            />
            <basic-action-button
              v-else
              :action="ra"
              @activate="activate($event)"
            />
          </v-col>
          <v-col>
            <basic-action-button
              :action="getBaseAction('act_self_destruct')"
              @activate="activate($event)"
            />
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
  import { useEncounterContext } from '../encounterContext'
  import { computed } from 'vue'
  import { CompendiumStore } from '@/stores'
  import { Deployable } from '@/classes/components/feature/deployable/Deployable'
  import { notify } from '@/util/notify'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()
  import BasicActionButton from './loadouts/action_buttons/basicActionButton.vue'
  import TargetedActionButton from './loadouts/action_buttons/targetedActionButton.vue'
  import DeployButton from './loadouts/_deployButton.vue'
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

  const activeMech = computed(() => owner.value.actor.ActiveMech!)
  const controller = computed(() => activeMech.value.CombatController)

  function getBaseAction(actionId: string) {
    return CompendiumStore().Actions.find((a: any) => a.ID === actionId)!
  }

  function toDeployable(action: any) {
    return new Deployable(action.Deployable)
  }

  const NOTICES: Record<string, { ok: [string, string]; fail?: [string, string] }> = {
    act_prepare: { ok: ['active.mechActions.preparedTitle', 'active.common.preparedText'] },
    act_eject: {
      ok: ['active.mechActions.pilotEjectedTitle', 'active.mechActions.pilotEjectedText'],
      fail: ['active.mechActions.ejectFailedTitle', 'active.mechActions.ejectFailedText'],
    },
    act_dismount: {
      ok: ['active.mechActions.pilotDismountedTitle', 'active.mechActions.pilotDismountedText'],
      fail: ['active.mechActions.dismountFailedTitle', 'active.mechActions.dismountFailedText'],
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
<style scoped>
  .v-expansion-panel-text >>> .v-expansion-panel-text__wrapper {
    padding: 8px;
  }
</style>
