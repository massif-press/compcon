<template>
  <runner-list-item-base
    :activations="npc.StatController.CurrentStats['activations']"
    :portrait="npc.Portrait"
    :collapsed="collapsed"
    :selected="selected"
    :side="combatant.side"
    @click="$emit('select')">
    <div>
      <span class="heading h4">
        {{ npc.Name }}
      </span>
      <span class="text-caption text-disabled ml-2">
        <cc-slashes />
        NPC #{{ combatant.index + 1 }}
      </span>
    </div>
    <div class="text-cc-overline">
      T{{ npc.NpcClassController.Tier }} {{ npc.NpcClassController.Class.Name }}
      <span v-if="npc.NpcTemplateController.Templates.length">
        {{ npc.NpcTemplateController.Templates.map((x) => x.Name).join(' / ') }}
      </span>
    </div>

    <div style="font-size: 16px">
      <v-row dense justify="space-between" align="center" class="pl-2 pr-6">
        <v-col
          cols="auto"
          v-for="stat in npc.StatController.GetStatCollection([
            'hp',
            'stress',
            'heat',
            'structure',
            'repairCapacity',
          ])">
          <v-tooltip :text="stat.title" location="top" open-delay="400">
            <template #activator="{ props }">
              <v-icon v-bind="props" size="18" class="mx-1 mt-n1" :icon="stat.icon" />
              <b class="text-accent">{{ npc.StatController.CurrentStats[stat.key] }}</b>
              <span class="text-disabled text-caption">
                /{{ npc.StatController.MaxStats[stat.key] }}
              </span>
            </template>
          </v-tooltip>
        </v-col>
      </v-row>
      <v-divider class="my-1" />
      <v-row dense justify="space-between" align="center" class="pl-2 pr-6">
        <v-col
          cols="auto"
          v-for="stat in npc.StatController.GetStatCollection([
            'armor',
            'evasion',
            'edef',
            'saveTarget',
          ])">
          <v-tooltip :text="stat.title" location="top" open-delay="400">
            <template #activator="{ props }">
              <v-icon v-bind="props" size="18" class="mx-1 mt-n1" :icon="stat.icon" />
              <b class="text-secondary">{{ npc.StatController.CurrentStats[stat.key] }}</b>
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
    npc: {
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
