<template>
  <runner-list-item-base
    :activations="combatant.actor.StatController.CurrentStats['activations']"
    :portrait="combatant.actor.Portrait"
    :collapsed="collapsed"
    :selected="selected"
    :side="combatant.side"
    @click="$emit('select')">
    <div>
      <span class="heading h4">
        {{ combatant.actor.Name }}
      </span>
      <span v-if="combatant.number" class="text-accent ml-2">#{{ combatant.number }}</span>
    </div>

    <div style="font-size: 16px">
      <v-row dense justify="space-between" align="center" class="pl-2 pr-6">
        <v-col
          cols="auto"
          v-for="stat in combatant.actor.StatController.GetStatCollection([
            'hp',
            'stress',
            'heat',
            'structure',
            'repairCapacity',
          ])">
          <v-tooltip :text="stat.title" location="top" open-delay="400">
            <template #activator="{ props }">
              <v-icon v-bind="props" size="18" class="mx-1 mt-n1" :icon="stat.icon" />
              <b class="text-accent">{{ combatant.actor.StatController.CurrentStats[stat.key] }}</b>
              <span class="text-disabled text-caption">
                /{{ combatant.actor.StatController.MaxStats[stat.key] }}
              </span>
            </template>
          </v-tooltip>
        </v-col>
      </v-row>
      <v-divider class="my-1" />
      <v-row dense justify="space-between" align="center" class="pl-2 pr-6">
        <v-col
          cols="auto"
          v-for="stat in combatant.actor.StatController.GetStatCollection([
            'armor',
            'evasion',
            'edef',
            'saveTarget',
          ])">
          <v-tooltip :text="stat.title" location="top" open-delay="400">
            <template #activator="{ props }">
              <v-icon v-bind="props" size="18" class="mx-1 mt-n1" :icon="stat.icon" />
              <b class="text-secondary">
                {{ combatant.actor.StatController.CurrentStats[stat.key] }}
              </b>
            </template>
          </v-tooltip>
        </v-col>
      </v-row>
    </div>
  </runner-list-item-base>
</template>

<script>
import RunnerListItemBase from './RunnerListItemBase.vue';

export default {
  name: 'UnitRunnerListItem',
  components: {
    RunnerListItemBase,
  },
  props: {
    combatant: {
      type: Object,
      required: true,
    },
    collapsed: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Boolean,
    },
  },
  emits: ['select'],
};
</script>
