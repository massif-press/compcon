<template>
  <cc-dialog :color="available ? action.Color : 'panel'"
    :icon="action.Icon"
    :title="action.Name"
    :close-on-click="false"
    min-width="70vw"
    max-width="80vw">
    <template #activator="{ open }">
      <v-btn block
        flat
        tile
        size="small"
        :color="available ? action.Color : 'panel'"
        @click="open">
        <span class="ml-1">
          <v-icon v-bind="props"
            :icon="action.Icon"
            :color="available ? '' : 'error'"
            start />
          <v-tooltip v-if="!available"
            location="top">
            <template #activator="{ props }">
              <v-icon v-bind="props"
                icon="mdi-exclamation-thick"
                color="error"
                class="ml-n2" />
            </template>
            <div class="text-center text-cc-overline">Cannot activate</div>
            <v-divider class="my-1" />
            <div v-if="!canActivate">
              Insufficient
              <v-chip :color="action.Color"
                size="small"
                variant="elevated"
                :prepend-icon="action.Icon || ''">
                {{ action.Activation }}
              </v-chip>
              actions remaining this turn.
            </div>
            <div v-else-if="!canUse">This action has already been used this turn.</div>
          </v-tooltip>
        </span>
        <v-tooltip location="top"
          width="300">
          <template #activator="{ props }">
            <span v-bind="props">
              {{ action.Name }}
            </span>
          </template>
          <div class="d-flex">
            <div class="heading h4 d-flex">{{ action.Name }}</div>
            <v-spacer />
            <v-chip size="x-small"
              :color="action.Color"
              :prepend-icon="action.Icon"
              variant="elevated"
              elevation="0">
              {{ action.Activation }} Action
            </v-chip>
          </div>
          <v-divider class="my-1" />
          {{ action.Terse }}
        </v-tooltip>
      </v-btn>
    </template>
    <template #default="{ close }">
      <v-sheet class="d-flex ml-n2">
        <v-tabs v-model="tab"
          direction="vertical"
          density="compact">
          <v-tab height="30"
            value="invade">Invade</v-tab>
          <v-divider />
          <div class="pa-2 text-cc-overline text-disabled">Available Invade Actions</div>
          <v-tab height="30"
            v-for="item in invadeActions"
            :key="item.ID"
            :value="item.ID">
            <v-icon :icon="item.Icon"
              class="mr-2" />
            {{ item.Name }}
          </v-tab>
        </v-tabs>
        <v-divider vertical
          class="mr-1" />
        <v-tabs-window v-model="tab"
          class="px-2">
          <div v-if="tab === 'invade'">
            <div class="heading h4">{{ action.Name }}</div>
            <p class="text-text pl-2"
              v-html="action.Detail" />
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
      </v-sheet>
    </template>
  </cc-dialog>
</template>

<script>
import { CompendiumStore } from '@/stores';
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';

export default {
  name: 'InvadeButton',
  props: {
    action: {
      type: Object,
      required: true,
    },
    owner: {
      type: Object,
      required: true,
    },
    encounter: {
      type: Object,
      required: true,
    },
  },
  components: {
    MenuInput,
  },
  data: () => ({
    tab: 'invade',
  }),
  computed: {
    controller() {
      return this.owner.actor.CombatController;
    },
    canActivate() {
      return this.controller.CanActivate(this.action.Activation);
    },
    canUse() {
      return !this.controller.IsActionUsed(this.actionId);
    },
    available() {
      return this.canActivate && this.canUse;
    },
    invadeActions() {
      return CompendiumStore()
        .Actions.filter((a) => a.Activation === 'Invade')
        .sort((a, b) => a.Name.localeCompare(b.Name));
    },
  },
  emits: ['activate'],
  methods: {
    getSelectedAction(id) {
      return CompendiumStore().Actions.find((a) => a.ID === id);
    },
    apply(close) {
      this.controller.toggleCombatAction(this.action.Activation);
      this.$emit('activate', this.actionId);
      // close();
    },
    reset() {
      this.controller.ResetActivation(this.action.Activation);
    },
  },
};
</script>
