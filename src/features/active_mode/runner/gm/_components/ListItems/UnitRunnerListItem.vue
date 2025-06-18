<template>
  <runner-list-item-base
    :activations="combatant.actor.StatController.CurrentStats['activations']"
    :actor="combatant.actor"
    :portrait="combatant.actor.Portrait"
    :collapsed="collapsed"
    :selected="selected"
    :side="combatant.side"
    @click="$emit('select')"
  >
    <div>
      <span class="heading h4">
        {{ combatant.actor.Name }}
      </span>
      <span v-if="combatant.number" class="text-accent ml-2"
        >#{{ combatant.number }}</span
      >
    </div>
    <div class="text-cc-overline">
      T{{ combatant.actor.NpcClassController.Tier }}
      {{ combatant.actor.NpcClassController.Class.Name }}
      <span v-if="combatant.actor.NpcTemplateController.Templates.length">
        {{
          combatant.actor.NpcTemplateController.Templates.map(
            (x) => x.Name
          ).join(' / ')
        }}
      </span>
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
