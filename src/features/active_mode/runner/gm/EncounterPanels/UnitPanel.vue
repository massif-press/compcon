<template>
  <scan-menu :item="actor" />

  <panel-base :encounter-instance="encounterInstance"
    :item="actor">
    <template #name-block>
      <div class="heading h2">
        <cc-short-string-editor :placeholder="actor.Name"
          @set="actor.Name = $event">
          {{ actor.Name }}
          <span class="text-accent"
            v-text="`#${combatant.number}`" />
        </cc-short-string-editor>
      </div>
      <div class="heading h4">
        T{{ actor.NpcClassController.Tier }}
        {{ actor.NpcClassController.Class.Name }}
        <span v-if="actor.NpcTemplateController.Templates.length">
          {{actor.NpcTemplateController.Templates.map((x) => x.Name).join(' / ')}}
        </span>
      </div>
    </template>

    <template #action-palette>
      <v-row dense>
        <v-col>
          <v-btn flat
            tile
            size="small"
            block
            :color="actor.CombatController.Overwatch ? 'primary' : 'panel'"
            text="Overwatch"
            @click="actor.CombatController.Overwatch = !actor.CombatController.Overwatch" />
          <v-divider />
          <v-btn flat
            tile
            size="small"
            block
            :color="actor.CombatController.Prepared ? 'primary' : 'panel'"
            text="Prepared"
            @click="actor.CombatController.Prepared = !actor.CombatController.Prepared" />
        </v-col>
      </v-row>
    </template>

    <unit-combat-loadout :encounter-instance="encounterInstance"
      :unit="actor"
      :owner="combatant"
      @deploy="deploy($event)" />

    <template #actions>
      <npc-actions-panel :owner="combatant"
        :encounter-instance="encounterInstance"
        @deploy="deploy($event)" />
    </template>
  </panel-base>
</template>

<script setup lang="ts">
import type { CombatantData } from '@/classes/encounter/Encounter'
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { computed } from 'vue'
import UnitCombatLoadout from './_components/loadouts/UnitCombatLoadout.vue';
import NpcActionsPanel from './_components/NpcActionsPanel.vue';
import ScanMenu from './_components/ScanMenu.vue';
import PanelBase from './_PanelBase.vue';

const props = defineProps<{
  combatant: CombatantData
  encounterInstance: EncounterInstance
}>()

const emit = defineEmits<{
  'deselect': []
}>()

const actor = computed(() => {
      return props.combatant.actor;
    })

function deploy(deployable) {
      props.encounterInstance.Deploy(deployable, props.combatant);
    }
</script>
