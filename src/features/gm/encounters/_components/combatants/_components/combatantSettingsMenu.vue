<template>
  <v-menu :close-on-content-click="false">
    <template #activator="{ props }">
      <v-chip size="small"
        style="margin-top: 3px"
        class="mr-2"
        label
        variant="elevated"
        flat
        tile
        :color="sideColor"
        v-bind="props">
        <v-tooltip location="top">
          <template #activator="{ props }">
            <div v-bind="props">
              <span class="text-capitalize">
                {{ item.side }} {{ item.actor.Tag }}&nbsp;&mdash;&nbsp;
              </span>
              <span v-if="item.reinforcement">{{ $t('gm.combatant.reinforcement') }}</span>
              <span v-else>{{ $t('gm.combatant.mainForce') }}</span>
              <span v-if="item.playerCount > 1">&nbsp;{{ $t('gm.combatant.pcsCount', { n: item.playerCount }) }}</span>
            </div>
          </template>
          {{ $t('gm.combatant.clickToEdit') }}
        </v-tooltip>
      </v-chip>
    </template>
    <v-card>
      <v-card-text>
        <div class="text-caption">{{ $t('gm.combatant.side') }}</div>
        <v-select v-model="item.side"
          density="compact"
          hide-details
          :items="[
            { title: 'Enemy', value: 'enemy' },
            { title: 'Ally', value: 'ally' },
            { title: 'Neutral', value: 'neutral' },
          ]"
          dense />

        <v-divider class="my-2" />
        <div class="text-caption">
          {{ $t('gm.combatant.atPcCount') }}
          <v-tooltip max-width="300px">
            <template #activator="{ props }">
              <v-icon v-bind="props"
                size="small"
                icon="mdi-information-outline" />
            </template>
            <span>{{ $t('gm.combatant.atPcCountHelp') }}</span>
          </v-tooltip>
        </div>
        <v-text-field v-model="item.playerCount"
          type="number"
          clearable
          persistent-hint
          density="compact"
          hint="Optional" />

        <v-divider class="my-2" />

        <v-checkbox v-model="item.reinforcement"
          label="Reinforcement"
          density="compact"
          hide-details />

        <div v-if="item.reinforcement">
          <div class="text-caption">
            {{ $t('gm.combatant.onTurn') }}
            <v-tooltip max-width="300px">
              <template #activator="{ props }">
                <v-icon v-bind="props"
                  size="small"
                  icon="mdi-information-outline" />
              </template>
              <span>{{ $t('gm.combatant.onTurnHelp') }}</span>
            </v-tooltip>
          </div>
          <v-text-field v-model.number="item.reinforcementTurn"
            type="number"
            clearable
            persistent-hint
            density="compact"
            hint="Optional" />
        </div>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  item: Record<string, any>
  readonly?: boolean
}>(), { readonly: false })

const sideColor = computed(() =>
  props.item.side === 'enemy' ? 'error' : props.item.side === 'ally' ? 'success' : ''
)
</script>
