<template>
  <combat-action-button
    :action="action"
    :owner="owner"
    :encounter="encounter">
    <template #default="{ close }">
      <v-row>
        <v-col cols="12"
          md="4">
          <v-tabs v-model="tab"
            direction="vertical"
            density="compact">
            <v-tab height="30"
              value="invade">Invade</v-tab>
            <v-divider v-if="!mobile" />
            <div class="pa-2 text-cc-overline text-disabled">Available Invade Actions</div>
            <v-tab v-for="item in invadeActions"
              :key="item.ID"
              height="30"
              class="bg-action--invade"
              :border="mobile"
              :value="item.ID">
              <v-icon :icon="item.Icon"
                class="mr-2" />
              {{ item.Name }}
            </v-tab>
          </v-tabs>
        </v-col>
        <v-col cols="12"
          md="8">
          <v-divider :vertical="!mobile"
            :class="mobile ? 'my-4' : 'mr-1'" />
          <v-tabs-window v-model="tab"
            class="px-2">
            <div v-if="tab === 'invade'">
              <div class="heading h4">{{ action.Name }}</div>
              <p v-html-safe="action.Detail"
                class="text-text pl-2" />
              <v-row dense
                align="center"
                class="my-2">
                <v-col><v-divider /></v-col>
                <v-col class="heading text-disabled"
                  cols="auto">Select an Invade Action</v-col>
                <v-col><v-divider /></v-col>
              </v-row>
            </div>
            <div v-else>
              <cc-synergy-display location="tech_attack"
                :mech="controller.Parent"
                alert />

              <menu-input :key="controller.ID"
                :active-effect="getSelectedAction(tab)"
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

<script lang="ts">
import { CompendiumStore } from '@/stores';
import CombatActionButton from './CombatActionButton.vue';
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';

export default {
  name: 'InvadeButton',
  components: { CombatActionButton, MenuInput },
  props: {
    action: { type: Object, required: true },
    owner: { type: Object, required: true },
    encounter: { type: Object, required: true },
  },
  emits: ['activate'],
  data: () => ({
    tab: 'invade',
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
    controller() {
      return this.owner.actor.CombatController.ActiveActor.CombatController;
    },
    invadeActions() {
      return [...CompendiumStore().Actions.filter((a) => a.Activation === 'Invade'),
        ...this.controller.AllActions('Invade')]
        .sort((a, b) => a.Name.localeCompare(b.Name));
    },
  },
  methods: {
    getSelectedAction(id) {
      return this.invadeActions.find((a) => a.ID === id);
    },
    apply() {
      this.$emit('activate', this.tab);
    },
    reset() {
      this.controller.ResetActivation(this.action.Activation);
    },
  },
};
</script>
