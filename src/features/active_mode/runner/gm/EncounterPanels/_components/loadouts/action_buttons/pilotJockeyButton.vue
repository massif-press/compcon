<template>
  <combat-action-button
    :action="action"
    :owner="owner"
    :encounter="encounter">
    <template #default="{ close }">
      <v-row>
        <v-col cols="auto">
          <v-tabs v-model="tab"
            direction="vertical"
            density="compact">
            <v-tab value="jockey">Jockey</v-tab>
            <v-divider />
            <div class="pa-2 text-cc-overline text-disabled">Available Jockey Actions</div>
            <v-tab v-for="item in jockeyActions"
              :key="item.ID"
              :value="item.ID">
              {{ item.Name }}
            </v-tab>
          </v-tabs>
        </v-col>
        <v-divider vertical
          class="mr-1" />
        <v-col>
          <v-tabs-window v-model="tab"
            class="px-2">
            <div v-if="tab === 'jockey'">
              <div class="heading h4">{{ action.Name }}</div>
              <p v-html-safe="action.Detail"
                class="text-text pl-2" />
              <v-row dense
                align="center"
                class="my-2">
                <v-col><v-divider /></v-col>
                <v-col class="heading text-disabled"
                  cols="auto">Select a Jockey Action</v-col>
                <v-col><v-divider /></v-col>
              </v-row>
            </div>

            <div v-else>
              <menu-input :key="controller.ID"
                :active-effect="selectedAction(tab)"
                :encounter="encounter"
                :owner="owner"
                :close="close"
                @apply="apply"
                @reset="reset" />
            </div>
          </v-tabs-window>
        </v-col>
      </v-row>
    </template>
  </combat-action-button>
</template>

<script>
import { CompendiumStore } from '@/stores';
import CombatActionButton from './CombatActionButton.vue';
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';

export default {
  name: 'PilotJockeyButton',
  components: { CombatActionButton, MenuInput },
  props: {
    action: { type: Object, required: true },
    owner: { type: Object, required: true },
    encounter: { type: Object, required: true },
  },
  emits: ['activate'],
  data: () => ({
    tab: 'jockey',
  }),
  computed: {
    controller() {
      return this.owner.actor.CombatController;
    },
    jockeyActions() {
      return CompendiumStore()
        .Actions.filter((a) => a.Activation === 'Jockey')
        .sort((a, b) => a.Name.localeCompare(b.Name));
    },
  },
  methods: {
    selectedAction(id) {
      return CompendiumStore().Actions.find((a) => a.ID === id);
    },
    apply(close) {
      this.$emit('activate', this.action.ID);
    },
    reset() {
      this.controller.ResetActivation(this.action.Activation);
    },
  },
};
</script>
