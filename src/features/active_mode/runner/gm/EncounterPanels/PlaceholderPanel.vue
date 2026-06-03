<template>
  <v-row no-gutters>
    <v-col class="heading h2 mb-2">
      <icon-select-menu :icon="combatant.actor.Icon" @select="combatant.actor.Icon = $event" />

      <cc-short-string-editor large @set="combatant.actor.Name = $event">
        <span class="text-accent">
          {{ combatant.actor.Name }}
        </span>
      </cc-short-string-editor>
    </v-col>

    <v-col v-if="combatant.actor.Player" cols="auto">
      <span class="text-cc-overline pr-1">Played by</span>
      <b class="text-accent">{{ combatant.actor.Player }}</b>
    </v-col>
  </v-row>

  <cc-rich-text-area v-model="combatant.actor.Notes" />
  <br />

  <panel-base :item="combatant.actor" no-stats>
    <template #action-palette>
      <v-row dense>
        <v-col>
          <v-btn
            v-if="combatant.actor.PlaceholderType.toLowerCase() === 'pilot'"
            flat
            tile
            size="small"
            block
            :color="combatant.actor.CombatController.Mounted ? 'primary' : 'panel'"
            text="Mounted"
            @click="
              combatant.actor.CombatController.Mounted = !combatant.actor.CombatController.Mounted
            " />
          <v-divider />
          <v-btn
            flat
            tile
            size="small"
            block
            :color="combatant.actor.CombatController.Braced ? 'primary' : 'panel'"
            text="Braced"
            @click="
              combatant.actor.CombatController.Braced = !combatant.actor.CombatController.Braced
            " />
        </v-col>
        <v-col>
          <v-btn
            flat
            tile
            size="small"
            block
            :color="combatant.actor.CombatController.Overwatch ? 'primary' : 'panel'"
            text="Overwatch"
            @click="
              combatant.actor.CombatController.Overwatch =
                !combatant.actor.CombatController.Overwatch
            " />
          <v-divider />
          <v-btn
            flat
            tile
            size="small"
            block
            :color="combatant.actor.CombatController.Prepared ? 'primary' : 'panel'"
            text="Prepared"
            @click="
              combatant.actor.CombatController.Prepared = !combatant.actor.CombatController.Prepared
            " />
        </v-col>
      </v-row>
    </template>
  </panel-base>
</template>

<script setup lang="ts">
import type { CombatantData } from '@/classes/encounter/Encounter'
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { computed, provide } from 'vue'
import { EncounterContextKey } from './encounterContext';
import IconSelectMenu from './_components/IconSelectMenu.vue';
import PanelBase from './_PanelBase.vue';

const props = defineProps<{
  combatant: CombatantData
  encounterInstance: EncounterInstance
}>()

provide(EncounterContextKey, {
  owner: computed(() => props.combatant),
  encounterInstance: computed(() => props.encounterInstance),
})

const emit = defineEmits<{
  'deselect': []
}>()
</script>
