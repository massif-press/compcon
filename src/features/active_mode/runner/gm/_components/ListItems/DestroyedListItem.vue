<template>
  <runner-list-item-base
    :actor="combatant.actor"
    :collapsed="collapsed"
    :selected="selected"
    :side="combatant.side"
    icon="cc:destroyed_outline"
    @click="$emit('select', combatant)">
    <div>
      <span class="heading">
        {{ combatant.actor.Name }}
      </span>
    </div>
  </runner-list-item-base>
</template>

<script>
import RunnerListItemBase from './RunnerListItemBase.vue';

export default {
  name: 'DestroyedListItem',
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
