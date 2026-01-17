<template>
  <div>
    <cc-alert v-if="combatant.CombatController.IsDestroyed"
      class="ma-2"
      color="error"
      prominent
      outlined>
      <v-icon icon="cc:destroyed"
        size="large"
        start />
      <span class="text-cc-overline">{{ combatant.ItemType }} DESTROYED</span>
    </cc-alert>
    <cc-alert v-else-if="!combatant.IsDeployed"
      class="ma-2"
      prominent
      icon="cc:drone"
      title="Recalled to Mech"
      outlined>
      <span>{{ combatant.ItemType }} has been recalled, awaiting
        <b>redeployment</b></span>
      <cc-button size="small"
        block
        class="mt-2"
        options-icon="mdi-chevron-down"
        :color="`action--${recall.toLowerCase()}` || 'primary'"
        :disabled="!canRedeploy"
        @click="handleRedeploy(false)">
        <div class="px-4">
          <v-icon :icon="getActionIcon(redeploy)"
            class="mt-n1"
            start />
          Redeploy
          <span class="text-disabled">
            ({{ redeploy }})
          </span>
        </div>
        <template #options>
          <v-list density="compact"
            class="pa-0"
            bg-color=panel
            border
            tile>
            <v-list-item @click="handleRedeploy(true)"
              class="bg-action--free"
              title="Activate (Free Action)">
              <template #prepend>
                <v-icon icon="cc:free"
                  class="mr-n5" />
              </template>
            </v-list-item>
          </v-list>
        </template>
      </cc-button>
      <v-divider class="my-2" />
      <cc-button block
        size="x-small"
        color="primary"
        @click="hide = !hide">{{ hide ? 'Show' : 'Hide' }}
        Details</cc-button>
    </cc-alert>

    <v-scroll-y-reverse-transition>
      <div v-if="!hide">
        <cc-panel class="mb-4"
          :title="combatant.Base.Name"
          :icon="combatant.Base.Icon"
          outlined>
          <div v-html="combatant.Base.Detail" />
          <div v-html="combatant.Base.Description" />
        </cc-panel>

        <panel-base :encounter-instance="encounterInstance"
          :item="combatant"
          no-stats
          no-actions
          no-conditions
          hide-palette>
          <template #name-block>
            <v-card flat
              tile
              class="pa-2">
              <v-row class="pr-4">
                <v-col>
                  <v-row no-gutters
                    align="center">
                    <v-col cols="auto"
                      align-self="center"
                      class="mr-2">
                      <v-icon :icon="combatant.Base.Icon"
                        size="60" />
                    </v-col>
                    <v-col cols="auto">
                      <div class="heading h2">{{ combatant.Name }}</div>
                      <div class="text-cc-overline">
                        {{ combatant.Base.Type }}
                        <cc-slashes class="ml-1 mr-2" />
                        <span class="text-disabled">Owned by</span>
                        <b>&nbsp;{{ owner.Callsign || owner.Name || 'Unknown' }}</b>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </template>
        </panel-base>

        <cc-button size="small"
          block
          class="mt-4"
          options-icon="mdi-chevron-down"
          :color="`action--${recall.toLowerCase()}` || 'primary'"
          :disabled="!canRecall"
          @click="handleRecall(false)">
          <v-icon :icon="getActionIcon(recall)"
            class="mt-n1"
            start />
          Recall
          <span class="text-disabled">
            ({{ recall }})
          </span>
          <template #options>
            <v-list density="compact"
              class="pa-0"
              bg-color=panel
              border
              tile>
              <v-list-item @click="handleRecall(true)"
                class="bg-action--free"
                title="Activate (Free Action)">
                <template #prepend>
                  <v-icon icon="cc:free"
                    class="mr-n5" />
                </template>
              </v-list-item>
            </v-list>
          </template>
        </cc-button>
      </div>
    </v-scroll-y-reverse-transition>

    <v-row class="mt-2">
      <v-col>
        <cc-button block
          color="error"
          size="small"
          @click="remove">
          Remove {{ combatant.Base.Type }}
        </cc-button>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { remove } from 'lodash';
import StatMiniPanel from './_components/StatMiniPanel.vue';
import PanelBase from './_PanelBase.vue';
import { Action } from '@/classes/Action';

export default {
  name: 'DeployablePanel',
  components: {
    PanelBase,
    StatMiniPanel,
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
  data() {
    return {
      hide: false,
    };
  },
  emits: ['deselect'],
  computed: {
    isDeployable() {
      return this.combatant.Base.Type === 'Deployable';
    },
    owner() {
      return this.combatant.Owner.actor;
    },
    recall() {
      return this.combatant.Base.Recall || null;
    },
    canRecall() {
      return this.owner.CombatController.CanActivate(this.recall);
    },
    redeploy() {
      return this.combatant.Base.Redeploy || null;
    },
    canRedeploy() {
      return this.owner.CombatController.CanActivate(this.redeploy);
    },
    deactivate() {
      return this.combatant.Base.Deactivate || null;
    }
  },
  methods: {
    remove() {
      const combatant = this.encounterInstance.Combatants.find(
        (c) => c.id === this.combatant.Owner.id
      );
      const idx = combatant.deployables.findIndex((d) => d.id === this.combatant.id);
      if (idx === -1) return;
      combatant.deployables.splice(idx, 1);
      this.$emit('deselect', combatant);
    },
    getActionIcon(action) {
      return Action.getIcon(action);
    },
    handleRecall(isFree = false) {
      if (!isFree && this.recall) {
        this.owner.CombatController.ActiveActor.CombatController.toggleCombatAction(this.recall);
      }
      this.combatant.IsDeployed = false;
      this.hide = true;
    },
    handleRedeploy(isFree = false) {
      if (!isFree && this.redeploy) {
        this.owner.CombatController.ActiveActor.CombatController.toggleCombatAction(this.redeploy);
      }
      this.combatant.IsDeployed = true;
      this.hide = false;
    },
  },
};
</script>
