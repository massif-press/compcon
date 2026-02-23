<template>
  <div class="heading"> {{ combatant.actor.CombatController.CombatName }}{{ possessive }}
    Deployed Equipment: </div>
  <v-card class="pb-2 px-2">
    <v-row dense
      v-if="combatant.deployables.length">
      <v-col v-for="d in combatant.deployables"
        :key="d.id"
        cols="12"
        md="6"
        lg="4"
        xl="2">
        <deployable-list-item :key="d.id"
          :selected="selected && selected.ID === d.ID"
          :parent="combatant"
          :deployable="d"
          :encounter="encounter"
          @click="select(d)"
          @activate="$emit('activate', $event)" />
      </v-col>
    </v-row>
    <div v-else
      class="text-disabled pa-4 text-center">
      <i>No active equipment.</i>
    </div>
  </v-card>
  <v-scroll-x-reverse-transition>
    <v-card v-if="selected"
      class="mt-4 pa-2"
      flat
      tile>
      <div class="heading h2">{{ selected.Name }}</div>
      <v-divider class="mt-2 mb-4" />
      <deployable-panel :combatant="selected"
        :encounter="encounter"
        :encounter-instance="sheet"
        :parent="combatant" />
    </v-card>
    <v-card v-else
      class="mt-4"
      flat
      tile>
      <v-card-text class="text-disabled text-center">
        <i>No equipment selected.</i>
      </v-card-text>
    </v-card>
  </v-scroll-x-reverse-transition>

</template>

<script>
import DeployableListItem from '../../gm/_components/ListItems/DeployableListItem.vue';
import DeployablePanel from '../../gm/EncounterPanels/DeployablePanel.vue';



export default {
  name: 'PcDeployablesPanel',
  components: {
    DeployableListItem,
    DeployablePanel,
  },
  props: {
    combatant: {
      type: Object,
      required: true,
    },
    encounter: {
      type: Object,
      required: true,
    },
    sheet: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    selected: null,
  }),
  computed: {
    possessive() {
      return this.combatant.actor.Name.endsWith('s') ? `'` : `'s`;
    },
  },
  methods: {
    select(deployable) {
      this.selected = deployable;
    },
  },

};
</script>
