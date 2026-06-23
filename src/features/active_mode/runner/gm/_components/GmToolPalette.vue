<template>
  <v-list>
    <div v-if="pc">
      <v-tooltip :text="$t('common.pilotSheet')">
        <template #activator="{ props: activatorProps }">
          <v-list-item v-bind="!expanded && activatorProps"
            :class="getBgClass('pc')"
            @click="selectPanel('pc')">
            <template #prepend>
              <v-icon icon="cc:pilot" />
            </template>
            {{ $t('common.pilotSheet') }}
          </v-list-item>
        </template>
      </v-tooltip>
      <v-tooltip v-if="pc && combatant"
        :text="$t('active.tooltips.deployables')">
        <template #activator="{ props: activatorProps }">
          <v-list-item v-bind="!expanded && activatorProps"
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
    <v-tooltip :text="$t('active.tooltips.diceRoller')">
      <template #activator="{ props: activatorProps }">
        <v-list-item v-bind="!expanded && activatorProps"
          @click="$emit('open-dice-roller')">
          <template #prepend>
            <v-icon icon="mdi-dice-d20-outline" />
          </template>
          {{ $t('active.toolPalette.diceRoller') }}
        </v-list-item>
      </template>
    </v-tooltip>
    <v-tooltip :text="$t('active.tooltips.rollableTables')">
      <template #activator="{ props: activatorProps }">
        <v-list-item v-bind="!expanded && activatorProps"
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
      :text="$t('active.tooltips.encounterInfo')">
      <template #activator="{ props: activatorProps }">
        <v-list-item v-bind="!expanded && activatorProps"
          :class="getBgClass('encounter-info')"
          @click="selectPanel('encounter-info')">
          <template #prepend>
            <v-icon icon="cc:encounter" />
          </template>
          {{ $t('active.toolPalette.encounterInfo') }}
        </v-list-item>
      </template>
    </v-tooltip>
    <v-tooltip :text="$t('common.notes')">
      <template #activator="{ props: activatorProps }">
        <v-list-item v-bind="!expanded && activatorProps"
          :class="getBgClass('notes')"
          @click="selectPanel('notes')">
          <template #prepend>
            <v-icon icon="mdi-card-text-outline" />
          </template>
          {{ $t('common.notes') }}
        </v-list-item>
      </template>
    </v-tooltip>
    <v-divider class="my-2" />
    <v-tooltip max-width="300"
      :text="$t('active.tooltips.listTagsPresentOnCharactersOrEquipmentInThisEncounter')">
      <template #activator="{ props: activatorProps }">
        <v-list-item v-bind="!expanded && activatorProps"
          :class="getBgClass('reference-tag')"
          @click="selectPanel('reference-tag')">
          <template #prepend>
            <v-icon icon="mdi-tag" />
          </template>
          {{ $t('active.toolPalette.tagReference') }}
        </v-list-item>
      </template>
    </v-tooltip>
    <v-tooltip :text="$t('active.tooltips.combatQuickReference')">
      <template #activator="{ props: activatorProps }">
        <v-list-item v-bind="!expanded && activatorProps"
          :class="getBgClass('quick-reference')"
          @click="selectPanel('quick-reference')">
          <template #prepend>
            <v-icon icon="mdi-format-list-group" />
          </template>
          {{ $t('active.toolPalette.combatQuickRef') }}
        </v-list-item>
      </template>
    </v-tooltip>
    <v-tooltip :text="$t('active.toolPalette.npcRef')">
      <template #activator="{ props: activatorProps }">
        <v-list-item v-bind="!expanded && activatorProps"
          :class="getBgClass('npc-reference')"
          @click="selectPanel('npc-reference')">
          <template #prepend>
            <v-icon icon="cc:frame" />
          </template>
          {{ $t('active.toolPalette.npcRef') }}
        </v-list-item>
      </template>
    </v-tooltip>
    <v-divider class="my-2" />
    <v-tooltip :text="$t('common.settings')">
      <template #activator="{ props: activatorProps }">
        <v-list-item v-bind="!expanded && activatorProps"
          :class="getBgClass('options')"
          @click="selectPanel('options')">
          <template #prepend>
            <v-icon icon="mdi-cog" />
          </template>
          {{ $t('common.settings') }}
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
