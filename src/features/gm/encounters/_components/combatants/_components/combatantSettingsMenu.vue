<template>
  <v-tooltip location="top">
    <template #activator="{ props }">
      <v-chip variant="outlined" size="small" v-bind="props">
        <v-icon size="large" :icon="item.npc.TagIcon" :color="sideColor" style="margin-top: -2px" />
      </v-chip>
    </template>
    <span class="text-capitalize">{{ item.side }} {{ item.npc.Tag }}</span>
  </v-tooltip>
  <span v-if="item.playerCount">
    <cc-slashes class="mx-2" />
    <v-tooltip location="top">
      <template #activator="{ props }">
        <v-chip variant="outlined" size="small" v-bind="props">
          <v-icon icon="cc:pilot" class="mx-n1" style="margin-top: -2px" />
          <v-icon size="x-small" icon="mdi-close" />
          {{ item.playerCount }}
        </v-chip>
      </template>
      <span>Added to encounter if there are {{ item.playerCount }} or more PCs</span>
    </v-tooltip>
  </span>
  <span v-if="item.reinforcement">
    <cc-slashes class="mx-2" />
    <v-tooltip location="top">
      <template #activator="{ props }">
        <v-chip variant="outlined" size="small" v-bind="props">
          <v-icon icon="mdi-expand-all-outline" />
          <span v-if="item.reinforcementTurn">
            <v-icon size="small" icon="mdi-at" />
            {{ item.reinforcementTurn }}
          </span>
        </v-chip>
      </template>
      <div>
        This NPC will join the encounter as a reinforcement
        <span v-if="item.reinforcementTurn">
          &mdash; Reinforces on turn {{ item.reinforcementTurn }}
        </span>
      </div>
    </v-tooltip>
  </span>
  <v-menu :close-on-content-click="false">
    <template #activator="{ props }">
      <v-btn
        v-if="!readonly"
        icon
        size="x-small"
        variant="text"
        color="accent"
        class="ml-1"
        v-bind.stop="props">
        <v-tooltip max-width="300px" open-delay="900">
          <template #activator="{ props }">
            <v-icon v-bind="props" size="large" icon="mdi-pencil" />
          </template>
          <span>Edit this NPC's side, reinforcement, and player count status</span>
        </v-tooltip>
      </v-btn>
    </template>
    <v-card>
      <v-card-text>
        <div class="text-caption">Side</div>
        <v-select
          v-model="item.side"
          density="compact"
          hide-details
          :items="[
            { title: 'Enemy', value: 'enemy' },
            { title: 'Ally', value: 'ally' },
            { title: 'Other', value: 'other' },
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
