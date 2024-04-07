<template>
  <div class="text-overline">COMBATANTS</div>

  <v-card variant="outlined" style="border-color: rgb(var(--v-theme-panel))">
    <v-card-text>
      <v-row>
        NPC image - Npc name - tier/class/templates | side | PC Count<br />
        features
      </v-row>
      <v-row justify="end">
        <v-col cols="auto">
          <v-btn color="accent" variant="tonal" prepend-icon="mdi-plus" @click="addDialog = true">
            Add Unit</v-btn
          >
        </v-col>
      </v-row>
    </v-card-text>
    <v-toolbar density="compact" color="panel">
      Enemy forces: 0 - Allied forces: 0 - Other: 0 Combat rating: 3PCs: hard 4pcs: easy
    </v-toolbar>
  </v-card>

  <v-dialog v-model="addDialog" fullscreen>
    <v-card>
      <v-toolbar density="compact">
        <v-toolbar-title class="heading h3">
          <span>SELECT NPC</span>
          <v-btn-toggle
            v-model="selectorView"
            class="py-2 ml-6"
            variant="tonal"
            color="accent"
            mandatory>
            <v-btn value="list" icon><v-icon icon="mdi-view-list" /> </v-btn>
            <v-btn value="table" icon><v-icon icon="mdi-table" /></v-btn>
          </v-btn-toggle>
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="addDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <combatant-selector :encounter="encounter" :mode="selectorView" @select="addUnit" />
    </v-card>
  </v-dialog>

  <!-- <cc-dialog ref="editDialog" title="Edit Unit" fullscreen> -->
  <!-- </cc-dialog> -->
</template>

<script lang="ts">
import { Npc } from '@/classes/npc/Npc';
import CombatantSelector from './CombatantSelector.vue';
import { UserStore } from '@/stores';

export default {
  name: 'combatant-editor',
  components: { CombatantSelector },
  props: {
    encounter: { type: Object, required: true },
  },
  data: () => ({
    selected: null,
    addDialog: false,
    selectorView: 'list',
  }),
  watch: {
    selectorView(val) {
      if (!val) return;
      UserStore().User.SetView('combatantSelectorView', val);
    },
  },
  mounted() {
    const user = UserStore().User;
    if (!user || !user.View) return;
    this.selectorView = user.View('combatantSelectorView', 'list');
  },
  methods: {
    addUnit(item: Npc) {
      this.$notify({
        title: `${item.Name} Added`,
        text: `An instance of ${item.Name} was added to ${this.encounter.Name}.`,
        data: { icon: 'cc:encounter' },
      });
    },
    editUnit(item: any) {
      this.selected = item;
    },
  },
};
</script>
