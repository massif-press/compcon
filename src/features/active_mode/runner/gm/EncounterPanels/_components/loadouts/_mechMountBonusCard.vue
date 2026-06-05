<template>
  <div style="position: relative">
    <cc-alert variant="outlined"
      border-color="primary"
      color="text"
      :icon="expanded && 'cc:weapon_profile'"
      :title="expanded && bonus.Name"
      class="mb-2">
      <v-card-text class="pa-0">
        <v-row dense>
          <v-col v-if="!expanded"
            cols="auto">
            <v-tooltip location="top"
              :text="bonus.Name">
              <template #activator="{ props }">
                <v-icon v-bind="props"
                  size="25"
                  color="primary"
                  class="mt-n1"
                  icon="cc:weapon_profile" />
              </template>
            </v-tooltip>
          </v-col>
          <v-col>
            <span v-html-safe="bonus.MountedEffect"
              class=text-text />
          </v-col>
        </v-row>

        <template v-if="!expanded">
          <cc-combat-action-chip :owner="owner" :encounter-instance="encounterInstance" v-for="a in bonus.Actions"
            :key="a.ID"
            :action="a"
            class="mt-1">
            <template #icon>
              <v-tooltip location="top"
                text="Equipment Action">
                <template #activator="{ props }">
                  <v-icon v-bind="props"
                    icon="cc:system" />
                </template>
              </v-tooltip>
            </template>
          </cc-combat-action-chip>

          <deploy-button v-for="(d, i) in bonus.Deployables"
            :key="d.Name + i"
            :deployable="d"
            :actor="mech"
            @deploy="$emit('deploy', d)" />
        </template>
      </v-card-text>


    </cc-alert>
    <div style="position: absolute; right: -5px; bottom: -4px"
      class="fade-select">
      <v-tooltip max-width="300"
        location="top">
        <template #activator="{ props }">
          <v-icon v-bind="props"
            icon="mdi-alert-outline"
            size="16"
            color="warning" />
        </template>
        Mount bonus effects on weapon attacks are
        <strong class="text-accent"><u>NOT</u></strong>
        automatically enforced by COMP/CON. Please ensure you manually apply any relevant
        effects during gameplay.
      </v-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import DeployButton from './_deployButton.vue';
import { useEncounterContext } from '../../encounterContext'
import { Mech } from '@/classes/mech/Mech';
import { EncounterInstance } from '@/classes/encounter/EncounterInstance';
import { CoreBonus } from '@/classes/pilot/components/index';

const { owner, encounterInstance } = useEncounterContext()

defineProps({
  bonus: {
    type: CoreBonus,
    required: true,
  },
  mech: {
    type: Mech,
    required: true,
  },
  expanded: {
    type: Boolean,
  },
})

defineEmits(['deploy'])
</script>
