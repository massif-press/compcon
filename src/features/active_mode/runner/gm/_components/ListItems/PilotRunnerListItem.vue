<template>
  <runner-list-item-base
    :actor="activeActor"
    :portrait="activeActor.Portrait"
    :deployed="combatant.deployables"
    :collapsed="collapsed"
    :selected="selected"
    :side="combatant.side"
    @click="$emit('select', combatant)"
    @deployable-click="$emit('select', $event)">
    <div>
      <span class="heading h4">
        {{ combatant.actor.Callsign }}
      </span>
      <span class="text-caption text-disabled ml-2">
        <cc-slashes />
        {{ combatant.actor.Name }}
        <span v-if="combatant.actor.Player" v-text="`(${combatant.actor.Player})`"></span>
      </span>
    </div>
    <v-card
      v-if="!mounted && !mech.CombatController.Destroyed && aiSystems.length"
      flat
      tile
      class="mb-1">
      <div class="text-cc-overline text-center">
        <div class="text-disabled">Mech under AI Control</div>
        <v-divider />
        <div class="text-accent">{{ aiSystems.map((x) => x.Name).join(' // ') }}</div>
      </div>
    </v-card>
  </runner-list-item-base>
</template>

<script>
import RunnerListItemBase from './RunnerListItemBase.vue';

export default {
  name: 'PilotRunnerListItem',
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
    mech() {
      return this.combatant.actor.ActiveMech;
    },
    activeActor() {
      if (!this.mech) {
        return this.combatant.actor;
      } else if (this.mech.CombatController.Mounted) {
        return this.mech;
      }
      return this.combatant.actor;
    },
    aiSystems() {
      if (!this.mech) return [];
      return this.mech.MechLoadoutController.ActiveLoadout.AISystems;
    },
    mounted() {
      return this.mech && this.mech.CombatController.Mounted;
    },
  },
};
</script>
