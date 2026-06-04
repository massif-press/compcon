<template>
  <cc-alert v-if="pilot.CombatController.IsDead"
    title="Pilot KIA"
    icon="mdi-skull"
    color="error"
    variant="outlined"
    prominent
    class="my-8">
    <p class="text-text mb-3">

      This pilot has been killed in action.
    </p>
    <div class="text-right">
      <v-btn size="x-small"
        variant="text"
        class="fade-select"
        @click="pilot.CombatController.IsDead = false">
        override
      </v-btn>
    </div>
  </cc-alert>

  <panel-base v-else
    :item="pilot">
    <template #name-block>
      <div class="heading h2">{{ pilot.Callsign }}</div>
      <div class="heading h4">{{ pilot.Name }}</div>

      <cc-alert v-if="pilot.CombatController.HasStatus('downandout')"
        title="Down and Out"
        icon="mdi-medical-bag"
        color="primary"
        class="mr-6">
        Pilot is unconscious, and any additional damage will kill them.
      </cc-alert>
    </template>

    <template #action-palette>
      <v-row no-gutters>
        <v-col>
          <v-btn flat
            tile
            size="small"
            block
            :color="pilot.ActiveMech.CombatController.Mounted ? 'primary' : 'panel'"
            text="Mounted"
            @click="setMounted" />
        </v-col>
        <v-divider vertical />
        <v-col>
          <v-btn flat
            tile
            size="small"
            block
            :color="pilot.CombatController.Overwatch ? 'primary' : 'panel'"
            text="Overwatch"
            @click="pilot.CombatController.Overwatch = !pilot.CombatController.Overwatch" />
        </v-col>
        <v-divider vertical />
        <v-col>
          <v-btn flat
            tile
            size="small"
            block
            :color="pilot.CombatController.Prepared ? 'primary' : 'panel'"
            text="Prepared"
            @click="pilot.CombatController.Prepared = !pilot.CombatController.Prepared" />
        </v-col>
      </v-row>
    </template>

    <template #actions>
      <pilot-actions-panel
        @deploy="deploy($event)" />
    </template>

    <v-expansion-panels class="mt-2"
      multiple
      flat
      tile
      bg-color="background"
      variant="accordion">
      <v-expansion-panel>
        <v-expansion-panel-title class="text-cc-overline">
          <div class="text-cc-overline">
            <v-icon icon="cc:talent"
              class="mt-n1"
              start />
            Pilot Talents ({{ pilot.TalentsController.Talents.length }})
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <cc-masonry-grid :items="pilot.TalentsController.Talents"
            :xl-columns="xlColumns">
            <template #default="{ item }">
              <cc-talent :key="item.Talent.ID"
                rank-view
                :talent="item.Talent"
                :rank="item.Rank"
                hide-locked
                hide-change>
                <template #combat>
                  <div v-if="item.Talent.AllActions?.length"
                    class="mb-2 mt-1">
                    <cc-combat-action-chip :owner="combatant" :encounter-instance="encounterInstance" v-for="a in item.Talent.AllActions"
                      :key="a.ID"
                      :action="a" />
                  </div>
                  <div v-if="item.Talent.AllDeployables?.length"
                    class="mb-2">
                    <deploy-button v-for="d in item.Talent.AllDeployables"
                      :key="d.ID"
                      :deployable="d"
                      :actor="pilot"
                      @deploy="deploy($event)" />
                  </div>
                </template>
              </cc-talent>
            </template>
          </cc-masonry-grid>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <div class="text-cc-overline mt-4 text-disabled">Loadout</div>
    <pilot-combat-loadout
      @deploy="deploy($event)" />
  </panel-base>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { useDisplay } from 'vuetify'
import { EncounterContextKey } from './encounterContext';
import type { CombatantData } from '@/classes/encounter/Encounter';
import PanelBase from './_PanelBase.vue';
import PilotActionsPanel from './_components/PilotActionsPanel.vue';
import PilotCombatLoadout from './_components/loadouts/PilotCombatLoadout.vue';
import DeployButton from './_components/loadouts/_deployButton.vue';
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance';

const props = defineProps<{
  combatant: CombatantData
  encounterInstance: EncounterInstance
}>()

provide(EncounterContextKey, {
  owner: computed(() => props.combatant),
  encounterInstance: computed(() => props.encounterInstance),
})

const emit = defineEmits(['deselect'])

const { smAndDown: mobile, xs: portrait } = useDisplay()

const xlColumns = computed(() => {
  if (mobile.value) return 1
  else return (props.encounterInstance as any).MaxMasonryColumns
})
const pilot = computed(() => (props.combatant as any).actor)

function deploy(deployable) { (props.encounterInstance as any).Deploy(deployable, props.combatant) }
function setMounted() { pilot.value?.ActiveMech?.CombatController?.ToggleMounted() }
</script>
