<template>
  <v-col>
    <div class="text-cc-overline text-disabled">
      <span>{{ `Target${event.AoE ? 's' : ''}` }}</span>
    </div>
    <v-select v-for="(idx) in !event.AoE ? 1 : event.Targets.length"
      :key="event.Targets[idx - 1]?.Combatant.id || 'empty-selector-00'"
      :value="event.Targets[idx - 1]?.Combatant.actor.CombatController.CombatName || ''"
      density="compact"
      variant="outlined"
      return-object
      class="mb-1"
      :item-title="t => t.actor.CombatController.CombatName"
      :items="event.AvailableTargets"
      flat
      :error="!event.Targets[idx - 1]?.Combatant.id"
      hide-details
      tile
      @update:model-value="event.SetTarget($event, idx - 1)">
      <template #prepend>
        <div v-if="idx === 1">
          <v-tooltip location="top">
            <template #activator="{ props }">
              <v-btn icon
                size="x-small"
                variant="text"
                flat
                tile
                class="mr-n2"
                v-bind="props"
                @click="event.AoE = !event.AoE">
                <v-icon size="25"
                  :icon="event.AoeIcon"
                  class="mr-n2" />
              </v-btn>
            </template>

            <div v-if="event.AoE">
              Area of Effect
              <span v-if="typeof event.AoE === 'string'">
                <cc-slashes />
                {{ event.AoE }}
              </span>
              <div>
                <i class="text-caption text-disabled">Click to Override</i>
              </div>
            </div>

            <div v-else
              class="text-center">
              Single Target
              <div>
                <i class="text-caption text-disabled">Click to Override</i>
              </div>
            </div>
          </v-tooltip>
        </div>
        <div v-else
          style="width: 24px"></div>
      </template>
      <template #append>
        <v-btn icon
          size="x-small"
          variant="text"
          flat
          tile
          class="mx-n2">
          <v-icon size="20"
            icon="mdi-close"
            @click="event.RemoveTarget(idx - 1)" />
        </v-btn>
      </template>
    </v-select>
    <v-btn v-if="event.AoE"
      :key="`targetSel_${event.AvailableTargets.length}`"
      size="x-small"
      block
      flat
      tile
      :color="event.AvailableTargets.length ? 'primary' : ''"
      class="ma-1"
      :disabled="!event.AvailableTargets.length"
      @click="event.AddTarget()">
      Add Target
    </v-btn>
  </v-col>
</template>

<script>

export default {
  name: 'BaseTargetSelector',
  props: {
    event: { type: Object, required: true },
  },
};
</script>
