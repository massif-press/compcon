<template>
  <v-row no-gutters>
    <v-col class="heading h2 text-accent">
      <cc-short-string-editor large @set="combatant.actor.Name = $event">
        {{ combatant.actor.Name }}
      </cc-short-string-editor>
    </v-col>
    <v-col v-if="combatant.actor.Player" cols="auto">
      <span class="text-cc-overline pr-1">Played by</span>
      <b class="text-accent">{{ combatant.actor.Player }}</b>
    </v-col>
  </v-row>

  <v-row dense class="mt-n1">
    <v-col :order="mounted ? 0 : 1" v-if="mech" :cols="view === 'mech' ? '' : 'auto'">
      <cc-button
        size="small"
        :color="view === 'mech' ? 'primary' : 'panel'"
        block
        @click="view = 'mech'">
        {{ mech.Name }}
        <template #subtitle>
          <span v-if="mounted" class="text-disabled">
            <cc-slashes />
            PILOT MOUNTED
          </span>
        </template>
      </cc-button>
    </v-col>
    <v-col :cols="view === 'pilot' ? '' : 'auto'">
      <cc-button
        size="small"
        :color="view === 'pilot' ? 'primary' : 'panel'"
        block
        @click="view = 'pilot'">
        {{ combatant.actor.Name }}
        <template #subtitle>
          <span v-if="!mounted" class="text-disabled">
            <cc-slashes />
            PILOT UNMOUNTED
          </span>
        </template>
      </cc-button>
    </v-col>
  </v-row>

  <v-window v-model="view">
    <v-window-item value="mech">
      <panel-base :encounter-instance="encounterInstance" v-if="mech" :item="mech">
        <template #name-block>
          <div class="heading h2">
            <cc-short-string-editor large @set="mech.Name = $event">
              {{ mech.Name }}
            </cc-short-string-editor>
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
                :color="mech.CombatController.Mounted ? 'primary' : 'panel'"
                text="Mounted"
                @click="mech.CombatController.Mounted = !mech.CombatController.Mounted" />
              <v-divider />
              <v-btn
                flat
                tile
                size="small"
                block
                :color="mech.CombatController.Braced ? 'primary' : 'panel'"
                text="Braced"
                @click="mech.CombatController.Braced = !mech.CombatController.Braced" />
            </v-col>
            <v-col>
              <v-btn
                flat
                tile
                size="small"
                block
                :color="mech.CombatController.Overwatch ? 'primary' : 'panel'"
                text="Overwatch"
                @click="mech.CombatController.Overwatch = !mech.CombatController.Overwatch" />
              <v-divider />
              <v-btn
                flat
                tile
                size="small"
                block
                :color="mech.CombatController.Prepared ? 'primary' : 'panel'"
                text="Prepared"
                @click="mech.CombatController.Prepared = !mech.CombatController.Prepared" />
            </v-col>
          </v-row>
        </template>
        <template #stat-block>
          <cc-button block size="small" color="exotic" prepend-icon="mdi-flask">
            Edit Stats
          </cc-button>
        </template>
      </panel-base>
    </v-window-item>
    <v-window-item value="pilot">
      <panel-base :encounter-instance="encounterInstance" :item="combatant.actor" />
    </v-window-item>
  </v-window>
</template>

<script>
import PanelBase from './_PanelBase.vue';

export default {
  name: 'PcPanel',
  components: {
    PanelBase,
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
  data: () => ({
    view: 'mech', // default view
  }),
  computed: {
    mech() {
      return this.combatant.actor.ActiveMech;
    },
    mounted() {
      if (!this.mech) return false;
      return this.mech.CombatController.Mounted;
    },
  },
};
</script>
