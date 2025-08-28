<template>
  <scan-menu :item="actor" />

  <panel-base :encounter-instance="encounterInstance" :item="actor">
    <template #name-block>
      <div class="heading h2">
        {{ actor.Name }}
        <span class="text-accent" v-text="`#${combatant.number}`" />
      </div>
      <div class="heading h4">
        T{{ actor.NpcClassController.Tier }}
        {{ actor.NpcClassController.Class.Name }}
        <span v-if="actor.NpcTemplateController.Templates.length">
          {{ actor.NpcTemplateController.Templates.map((x) => x.Name).join(' / ') }}
        </span>
      </div>
    </template>

    <template #action-palette>
      <v-row dense>
        <v-col>
          <v-btn
            flat
            tile
            size="small"
            block
            :color="actor.CombatController.Overwatch ? 'primary' : 'panel'"
            text="Overwatch"
            @click="actor.CombatController.Overwatch = !actor.CombatController.Overwatch" />
          <v-divider />
          <v-btn
            flat
            tile
            size="small"
            block
            :color="actor.CombatController.Prepared ? 'primary' : 'panel'"
            text="Prepared"
            @click="actor.CombatController.Prepared = !actor.CombatController.Prepared" />
        </v-col>
      </v-row>
    </template>
    <template #pre>
      <unit-combat-loadout :encounter-instance="encounterInstance" :unit="actor" />

      <div class="text-cc-overline text-disabled mt-4">// OTHER ACTIONS</div>
      <v-row dense>
        <v-col>
          <v-btn
            block
            flat
            tile
            size="small"
            text="Grapple"
            prepend-icon="mdi-hexagon-slice-3"
            color="action--quick" />
        </v-col>
        <v-col>
          <v-btn
            block
            flat
            tile
            size="small"
            text="Ram"
            prepend-icon="mdi-hexagon-slice-3"
            color="action--quick" />
        </v-col>
        <v-col>
          <v-btn
            block
            flat
            tile
            size="small"
            text="Invade"
            prepend-icon="mdi-hexagon-slice-3"
            color="action--quick" />
        </v-col>
        <v-col>
          <v-btn
            block
            flat
            tile
            size="small"
            text="Lock On"
            prepend-icon="mdi-hexagon-slice-3"
            color="action--quick" />
        </v-col>
        <v-col>
          <v-btn
            block
            flat
            tile
            size="small"
            text="Search"
            prepend-icon="mdi-hexagon-slice-3"
            color="action--quick" />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <v-btn
            block
            flat
            tile
            size="small"
            text="Improvised Attack"
            color="action--full"
            prepend-icon="mdi-hexagon-slice-6" />
        </v-col>
        <v-col>
          <v-btn
            block
            flat
            tile
            size="small"
            text="Stabilize"
            color="action--full"
            prepend-icon="mdi-hexagon-slice-6" />
        </v-col>
      </v-row>
    </template>
  </panel-base>
</template>

<script>
import UnitCombatLoadout from './_components/loadouts/UnitCombatLoadout.vue';
import ScanMenu from './_components/ScanMenu.vue';
import PanelBase from './_PanelBase.vue';

export default {
  name: 'NpcPanel',
  components: {
    PanelBase,
    ScanMenu,
    UnitCombatLoadout,
  },
  props: {
    combatant: {
      type: Object,
      required: true,
    },
    encounterInstance: {
      type: Object,
      required: true,
    },
  },

  computed: {
    actor() {
      return this.combatant.actor;
    },
  },
};
</script>
