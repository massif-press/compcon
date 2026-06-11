<template>
  <v-list>
    <div v-if="pc">
      <v-tooltip text="Pilot Sheet">
        <template #activator="{ props }">
          <v-list-item v-bind="!expanded && props"
            :class="getBgClass('pc')"
            @click="selectPanel('pc')">
            <template #prepend>
              <v-icon icon="cc:pilot" />
            </template>
            {{ $t('active.toolPalette.pilotSheet') }}
          </v-list-item>
        </template>
      </v-tooltip>
      <v-tooltip v-if="pc && combatant"
        text="Deployables">
        <template #activator="{ props }">
          <v-list-item v-bind="!expanded && props"
            :class="getBgClass('deployables')"
            @click="selectPanel('deployables')">
            <template #prepend>
              <v-badge v-if="combatant.deployables.length"
                color="info"
                offset-x="-5"
                :content="combatant.deployables.length">
                <v-icon icon="cc:drone" />
              </v-badge>
              <v-icon v-else
                icon="cc:drone" />
            </template>
            <span v-if="expanded">
              {{ $t('active.toolPalette.deployables') }}
            </span>
          </v-list-item>
        </template>
      </v-tooltip>
      <v-divider class="my-2" />
    </div>
    <v-tooltip text="Dice Roller">
      <template #activator="{ props }">
        <v-list-item v-bind="!expanded && props"
          @click="$emit('open-dice-roller')">
          <template #prepend>
            <v-icon icon="mdi-dice-d20-outline" />
          </template>
          {{ $t('active.toolPalette.diceRoller') }}
        </v-list-item>
      </template>
    </v-tooltip>
    <v-tooltip text="Rollable Tables">
      <template #activator="{ props }">
        <v-list-item v-bind="!expanded && props"
          @click="$emit('open-table-index')">
          <template #prepend>
            <v-icon icon="mdi-table-multiple" />
          </template>
          {{ $t('active.toolPalette.rollableTables') }}
        </v-list-item>
      </template>
    </v-tooltip>
    <v-divider class="my-2" />
    <v-tooltip v-if="!pc"
      text="Encounter Info">
      <template #activator="{ props }">
        <v-list-item v-bind="!expanded && props"
          :class="getBgClass('encounter-info')"
          @click="selectPanel('encounter-info')">
          <template #prepend>
            <v-icon icon="cc:encounter" />
          </template>
          {{ $t('active.toolPalette.encounterInfo') }}
        </v-list-item>
      </template>
    </v-tooltip>
    <v-tooltip text="Notes">
      <template #activator="{ props }">
        <v-list-item v-bind="!expanded && props"
          :class="getBgClass('notes')"
          @click="selectPanel('notes')">
          <template #prepend>
            <v-icon icon="mdi-card-text-outline" />
          </template>
          {{ $t('active.toolPalette.notes') }}
        </v-list-item>
      </template>
    </v-tooltip>
    <v-divider class="my-2" />
    <v-tooltip max-width="300"
      text="List tags present on characters or equipment in this encounter">
      <template #activator="{ props }">
        <v-list-item v-bind="!expanded && props"
          :class="getBgClass('reference-tag')"
          @click="selectPanel('reference-tag')">
          <template #prepend>
            <v-icon icon="mdi-tag" />
          </template>
          {{ $t('active.toolPalette.tagReference') }}
        </v-list-item>
      </template>
    </v-tooltip>
    <v-tooltip text="Combat Quick Reference">
      <template #activator="{ props }">
        <v-list-item v-bind="!expanded && props"
          :class="getBgClass('quick-reference')"
          @click="selectPanel('quick-reference')">
          <template #prepend>
            <v-icon icon="mdi-format-list-group" />
          </template>
          {{ $t('active.toolPalette.combatQuickRef') }}
        </v-list-item>
      </template>
    </v-tooltip>
    <v-divider class="my-2" />
    <v-tooltip text="Settings">
      <template #activator="{ props }">
        <v-list-item v-bind="!expanded && props"
          :class="getBgClass('options')"
          @click="selectPanel('options')">
          <template #prepend>
            <v-icon icon="mdi-cog" />
          </template>
          {{ $t('active.toolPalette.settings') }}
        </v-list-item>
      </template>
    </v-tooltip>
  </v-list>
  <div style="height: 50px" />
</template>

<script setup lang="ts">
import type { CombatantData } from '@/classes/encounter/Encounter'
defineOptions({ name: 'gm-tool-palette' })

const props = withDefaults(defineProps<{
  expanded?: boolean
  selected?: string
  pc?: boolean
  combatant?: CombatantData
}>(), {
  expanded: false,
  selected: '',
  combatant: null
})

const emit = defineEmits<{
  'select-panel': []
  'open-dice-roller': []
  'open-table-index': []
}>()

function selectPanel(panel) {
      emit('select-panel', panel);
    }
function getBgClass(panel) {
      return props.selected === panel ? 'bg-primary' : '';
    }
</script>
