<template>
  <runner-list-item-base
    :actor="layer"
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
      <cc-slashes class="ml-2" />
      <span class="heading h4 px-2 mx-2 bg-primary">
        {{ layer.Name }}
      </span>
    </div>
  </runner-list-item-base>
</template>

<script>
import RunnerListItemBase from './RunnerListItemBase.vue';

export default {
  name: 'EidolonRunnerListItem',
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
  computed: {
    layer() {
      return this.combatant.actor.ActiveLayer;
    },
  },
};
</script>
