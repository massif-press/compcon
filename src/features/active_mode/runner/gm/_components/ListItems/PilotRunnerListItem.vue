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
    <v-card v-if="mech.CombatController.IsAIControlled" flat tile class="mb-1">
      <div class="text-cc-overline text-center">
        <div class="text-disabled">Mech under AI Control</div>
        <v-divider />
        <div class="text-accent">{{ aiSystems.map((x) => x.Name).join(' // ') }}</div>
      </div>
    </v-card>
    <div v-if="mech.CombatController.IsInSelfDestruct" class="sd-pulse">
      <div class="text-cc-overline text-center">
        <v-icon icon="mdi-alert-outline" size="15" />
        SELF DESTRUCT INITIATED
        <v-icon icon="mdi-alert-outline" size="15" />
      </div>
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

<style scoped>
.sd-pulse {
  animation: sd-pulse 3s infinite ease-in-out;
  padding: 2px;
  corner-shape: bevel;
  border-radius: 20px;
}

@keyframes sd-pulse {
  0% {
    background-color: rgb(145, 11, 50);
  }
  50% {
    background-color: rgb(230, 39, 39);
  }
  100% {
    background-color: rgb(145, 11, 50);
  }
}
</style>
