<template>
  <runner-list-item-base
    :actor="combatant.actor"
    :portrait="combatant.actor.Portrait"
    :deployed="combatant.deployables"
    :collapsed="collapsed"
    :selected="selected"
    :side="combatant.side"
    @click="$emit('select', combatant)"
    @deployable-click="$emit('select', $event)">
    <div>
      <span class="heading h4">
        {{ combatant.actor.Name }}
      </span>
      <span v-if="combatant.number" class="text-accent ml-2">#{{ combatant.number }}</span>
    </div>
  </runner-list-item-base>
</template>

<script>
import RunnerListItemBase from './RunnerListItemBase.vue';

export default {
  name: 'DoodadRunnerListItem',
  components: {
    RunnerListItemBase,
  },
  emits: ['select'],
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
