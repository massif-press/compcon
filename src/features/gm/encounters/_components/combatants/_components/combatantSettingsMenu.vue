<template>
  <v-menu :close-on-content-click="false">
    <template #activator="{ props }">
      <v-chip
        size="small"
        style="margin-top: 3px"
        class="mr-2"
        label
        :color="sideColor"
        v-bind="props">
        <v-tooltip location="top">
          <template #activator="{ props }">
            <span class="text-capitalize">
              {{ item.side }} {{ item.npc.Tag }}&nbsp;&mdash;&nbsp;
            </span>
            <span v-if="item.reinforcement">Reinforcement</span>
            <span v-else>Main Force</span>
            <span v-if="item.playerCount > 1">({{ item.playerCount }}+ PCs)</span>
          </template>
          Click to Edit
        </v-tooltip>
      </v-chip>
    </template>
    <v-card>
      <v-card-text>
        <v-btn-toggle v-model="item.side" density="compact">
          <v-btn
            v-for="side in ['enemy', 'ally', 'neutral']"
            :value="side"
            size="small"
            @click="item.side = side">
            {{ side }}
          </v-btn>
        </v-btn-toggle>
        <div class="text-caption">Side</div>
        <v-select
          v-model="item.side"
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
          At PC Count
          <v-tooltip max-width="300px">
            <template #activator="{ props }">
              <v-icon v-bind="props" size="small" icon="mdi-information-outline" />
            </template>
            <span>
              This NPC will be marked as being part of the encounter only if there are at least as
              many Player Characters as indicated. Leaving this blank will indicate that is will be
              part of the encounter at all PC counts.
            </span>
          </v-tooltip>
        </div>
        <v-text-field
          v-model="item.playerCount"
          type="number"
          clearable
          persistent-hint
          density="compact"
          hint="Optional" />

        <v-divider class="my-2" />

        <v-checkbox
          v-model="item.reinforcement"
          label="Reinforcement"
          density="compact"
          hide-details />

        <div v-if="item.reinforcement">
          <div class="text-caption">
            On Turn
            <v-tooltip max-width="300px">
              <template #activator="{ props }">
                <v-icon v-bind="props" size="small" icon="mdi-information-outline" />
              </template>
              <span>
                This NPC will be marked as joining the encounter on the specified turn. Leaving this
                blank will indicate that this NPC can be used as a reinforcement at the GM's
                discretion.
              </span>
            </v-tooltip>
          </div>
          <v-text-field
            v-model="item.reinforcementTurn"
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

<script lang="ts">
export default {
  name: 'combatant-settings-menu',
  props: {
    item: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
  },
  computed: {
    sideColor() {
      return this.item.side === 'enemy' ? 'error' : this.item.side === 'ally' ? 'success' : '';
    },
  },
};
</script>
