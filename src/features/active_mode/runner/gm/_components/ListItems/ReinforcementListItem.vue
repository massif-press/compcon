<template>
  <runner-list-item-base
    :actor="combatant.actor"
    :collapsed="collapsed"
    :selected="selected"
    :side="combatant.side"
    :icon="combatant.actor.Icon"
    :reinforcementTurn="combatant.reinforcementTurn"
    :round="round"
    @activate="$emit('activate', combatant)"
    @click="$emit('select', combatant)">
    <div>
      <span class="heading h4">
        {{ combatant.actor.Name }}
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
    round: {
      type: Number,
      default: 1,
    },
  },
  emits: ['select'],
};
</script>
