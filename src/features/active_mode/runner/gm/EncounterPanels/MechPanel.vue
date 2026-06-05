<template>
  <cc-alert v-if="mech.CombatController.ReactorDestroyed"
    title="Mech Destroyed &mdash; Reactor Meltdown"
    icon="mdi-radioactive-circle"
    color="error"
    variant="outlined"
    prominent
    class="my-8">
    <p class="text-text mb-3">
      This mech has suffered a reactor meltdown. It is permanently destroyed and cannot be repaired.
    </p>
    <cc-combat-action-chip :owner="combatant" :encounter-instance="encounterInstance" :action="mech.CombatController.MeltdownAction" />

    <div class="text-right">
      <v-btn size="x-small"
        variant="text"
        class="fade-select"
        @click="mech.CombatController.ReactorDestroyed = false">
        override
      </v-btn>
    </div>
  </cc-alert>

  <panel-base v-else
    :item="mech">
    <template #name-block>
      <div class="heading h2">{{ mech.Name }}</div>
      <div class="heading h4">{{ mech.Frame.Source }} {{ mech.Frame.Name }}</div>

      <cc-alert v-if="mech.CombatController.AIControl"
        title="Under AI Control"
        icon="cc:nhp"
        color="primary"
        class="mr-6">
        <div class="text-center">
          <div class="heading">{{aiSystems.map((x) => x.Name).join(' // ')}}</div>
        </div>
      </cc-alert>

    </template>

    <template #action-palette>
      <v-row no-gutters>
        <v-col>
          <v-btn flat
            tile
            size="small"
            block
            :color="mech.CombatController.Mounted ? 'primary' : 'panel'"
            text="Mounted"
            @click="setMounted" />
        </v-col>
        <v-divider vertical />
        <v-col>
          <v-btn flat
            tile
            size="small"
            block
            :color="mech.CombatController.Braced ? 'primary' : 'panel'"
            text="Braced"
            @click="mech.CombatController.Braced = !mech.CombatController.Braced" />
        </v-col>
        <v-divider vertical />
        <v-col>
          <v-btn flat
            tile
            size="small"
            block
            :color="mech.CombatController.Overwatch ? 'primary' : 'panel'"
            text="Overwatch"
            @click="mech.CombatController.Overwatch = !mech.CombatController.Overwatch" />
        </v-col>
        <v-divider vertical />
        <v-col>
          <v-btn flat
            tile
            size="small"
            block
            :color="mech.CombatController.Prepared ? 'primary' : 'panel'"
            text="Prepared"
            @click="mech.CombatController.Prepared = !mech.CombatController.Prepared" />
        </v-col>
        <v-divider vertical />
        <v-col>
          <v-btn v-if="mech.MechLoadoutController.ActiveLoadout.AICount"
            flat
            tile
            size="small"
            block
            :color="mech.CombatController.AIControl ? 'primary' : 'panel'"
            text="AI Control"
            @click="mech.CombatController.AIControl = !mech.CombatController.AIControl" />
        </v-col>
      </v-row>
    </template>

    <template #actions>
      <mech-actions-panel
        :controller="mech.CombatController"
        @deploy="deploy($event)" />
    </template>

    <v-expansion-panels class="mt-2"
      multiple
      flat
      tile
      bg-color="background"
      variant="accordion">
      <v-expansion-panel class="py-0">
        <v-expansion-panel-title class="text-cc-overline py-0">
          <div class="text-cc-overline">
            <v-icon icon="cc:trait"
              class="mt-n1"
              start />
            Frame Traits ({{ mech.Frame.Traits.length }})
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <cc-masonry-grid :items="mech.Frame.Traits"
            :xl-columns="xlColumns">
            <template #default="{ item }">
              <cc-trait-item :trait="item"
                color="primary"
                style="height: 100%"
                combat>
                <template #combat>
                  <combat-actions-block :item="item"
                    :combatant="combatant"
                    :actor="mech"
                    @deploy="deploy($event)" />
                </template>
              </cc-trait-item>
            </template>
          </cc-masonry-grid>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel v-if="mech.Parent.CoreBonusController.CoreBonuses.length">
        <v-expansion-panel-title class="text-cc-overline">
          <div class="text-cc-overline">
            <v-icon icon="cc:corebonus"
              class="mt-n1"
              start />
            Core Bonuses ({{ mech.Parent.CoreBonusController.CoreBonuses.length }})
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <cc-masonry-grid :items="mech.Parent.CoreBonusController.CoreBonuses"
            :xl-columns="xlColumns">
            <template #default="{ item }">
              <cc-core-bonus-item :key="item.ID"
                terse
                :bonus="item"
                combat>
                <template #combat>
                  <combat-actions-block :item="item"
                    :combatant="combatant"
                    :actor="mech"
                    @deploy="deploy($event)" />
                </template>
              </cc-core-bonus-item>
            </template>
          </cc-masonry-grid>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-title class="text-cc-overline">
          <div class="text-cc-overline">
            <v-icon icon="cc:talent"
              class="mt-n1"
              start />
            Pilot Talents ({{ mech.Parent.TalentsController.Talents.length }})
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <cc-masonry-grid :items="mech.Parent.TalentsController.Talents"
            :xl-columns="xlColumns">
            <template #default="{ item, index }">
              <cc-talent :key="item.Talent.ID"
                rank-view
                :talent="item.Talent"
                :rank="item.Rank"
                hide-locked
                hide-change>
                <template #combat>
                  <div v-for="(rank, n) in item.Talent.Ranks"
                    :key="`rank-${index}-${n}`">
                    <div
                      v-if="item.Rank >= n + 1 && (rank.Actions?.length || rank.Deployables?.length)"
                      class="mb-2 mt-1">
                      <cc-combat-action-chip :owner="combatant" :encounter-instance="encounterInstance" v-for="a in rank.Actions"
                        :key="a.ID"
                        :action="a" />
                      <deploy-button v-for="d in rank.Deployables"
                        :key="d.ID"
                        :deployable="d"
                        :actor="mech"
                        @deploy="deploy($event)" />
                    </div>
                  </div>
                </template>
              </cc-talent>
            </template>
          </cc-masonry-grid>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <div class="text-cc-overline mt-4 text-disabled">Core</div>
    <mech-core-panel :mech="mech"
      @deploy="deploy($event)" />

    <div class="text-cc-overline mt-4 text-disabled">Loadout</div>
    <mech-combat-loadout
      :mech="mech"
      @deploy="deploy($event!)" />
  </panel-base>
</template>

<script setup lang="ts">
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import type { CombatantData } from '@/classes/encounter/Encounter'
import { computed, provide } from 'vue';
import { useDisplay } from 'vuetify';
import { EncounterContextKey } from './encounterContext';
import PanelBase from './_PanelBase.vue';
import MechCombatLoadout from './_components/loadouts/MechCombatLoadout.vue';
import MechCorePanel from './_components/loadouts/MechCorePanel.vue';
import MechActionsPanel from './_components/MechActionsPanel.vue';
import DeployButton from './_components/loadouts/_deployButton.vue';
import CombatActionsBlock from './_CombatActionsBlock.vue';
import { Deployable } from '@/classes/components/feature/deployable/Deployable';

const props = defineProps<{
  combatant: CombatantData
  encounterInstance: EncounterInstance;
}>();

provide(EncounterContextKey, {
  owner: computed(() => props.combatant),
  encounterInstance: computed(() => props.encounterInstance),
});

const { smAndDown: mobile } = useDisplay();

const xlColumns = computed(() => mobile.value ? 1 : props.encounterInstance.MaxMasonryColumns);
const mech = computed(() => props.combatant.actor.ActiveMech);

const aiSystems = computed(() => mech.value.MechLoadoutController.ActiveLoadout.AISystems);

function deploy(deployable: Deployable) {
  props.encounterInstance.Deploy(deployable, props.combatant);
}

function setMounted() { mech.value.CombatController.ToggleMounted(); }
</script>

<style scoped>
@import './encounter-panels.css';
</style>
