<template>
  <cc-dialog :color="available ? action.Color : 'panel'"
    :icon="action.Icon"
    :title="action.Name"
    :close-on-click="false"
    min-width="1000">
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
          <div v-if="action.Origin">
            <i class="text-caption">
              <span class="text-disabled">From&nbsp;</span>
              <strong>{{ action.Origin }}</strong>
            </i>
          </div>
          <div v-else>
            {{ action.Terse }}
          </div>
        </v-tooltip>
      </v-btn>
    </template>
    <template #default="{ close }">
      <cc-synergy-display :location="action.ID.replace('act_', '')"
        :mech="controller.Parent"
        alert />

      <menu-input :active-effect="action"
        :encounter="encounter"
        :owner="owner"
        :close="close"
        @apply="apply"
        @reset="reset" />
    </template>
  </cc-dialog>
</template>

<script>
import { CompendiumStore } from '@/stores';
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';

export default {
  name: 'BasicActionButton',
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
  emits: ['activate'],
  computed: {
    controller() {
      return this.owner.actor.CombatController;
    },
    canActivate() {
      return this.controller.CanActivate(this.action.Activation);
    },
    canUse() {
      return !this.controller.IsActionUsed(this.action.ID);
    },
    available() {
      return this.canActivate && this.canUse;
    },
  },
  emits: ['activate'],
  methods: {
    apply(close) {
      this.$emit('activate', this.action.ID);
    },
    reset() {
      this.controller.ResetActivation(this.action.Activation);
    },
  },
};
</script>
