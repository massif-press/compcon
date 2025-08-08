<template>
  <runner-list-item-base
    :actor="activeActor"
    :portrait="activeActor.Portrait"
    :deployed="combatant.deployables"
    :collapsed="collapsed"
    :selected="selected"
    :side="combatant.side"
    @click="$emit('select')"
  >
    <div>
      <span class="heading h4">
        {{ combatant.actor.Callsign }}
      </span>
      <span class="text-caption text-disabled ml-2">
        <cc-slashes />
        {{ combatant.actor.Name }}
        <span
          v-if="combatant.actor.Player"
          v-text="`(${combatant.actor.Player})`"
        ></span>
      </span>
    </div>
  </runner-list-item-base>
</template>

<script>
import RunnerListItemBase from './RunnerListItemBase.vue';

export default {
  name: 'PilotRunnerListItem',
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
  computed: {
    activeActor() {
      // mech if available, pilot if mech is missing or unmounted
      return this.combatant.actor.ActiveMech || this.combatant.actor;
    },
  },
};
</script>
