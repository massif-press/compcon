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
    <cc-combat-action-chip :action="mech.CombatController.MeltdownAction"
      :owner="combatant"
      :encounter="encounterInstance" />

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
    :encounter-instance="encounterInstance"
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
      <mech-actions-panel :owner=combatant
        :controller="mech.CombatController"
        :encounter="encounterInstance"
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
                  <div v-if="item.Actions?.length"
                    class="mb-2 mt-1">
                    <cc-combat-action-chip v-for="a in item.Actions"
                      :key="a.ID"
                      :action="a"
                      :owner="combatant"
                      :encounter="encounterInstance" />
                  </div>
                  <div v-if="item.Deployables?.length"
                    class="mb-2">
                    <deploy-button v-for="d in item.Deployables"
                      :key="d.ID"
                      :deployable="d"
                      :actor="mech"
                      @deploy="deploy($event)" />
                  </div>
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
                  <div v-if="item.Actions?.length"
                    class="mb-2 mt-1">
                    <cc-combat-action-chip v-for="a in item.Actions"
                      :key="a.ID"
                      :action="a"
                      :owner="combatant"
                      :encounter="encounterInstance" />
                  </div>
                  <div v-if="item.Deployables?.length"
                    class="mb-2">
                    <deploy-button v-for="d in item.Deployables"
                      :key="d.ID"
                      :deployable="d"
                      :actor="mech"
                      @deploy="deploy($event)" />
                  </div>
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
                      <cc-combat-action-chip v-for="a in rank.Actions"
                        :key="a.ID"
                        :action="a"
                        :owner="combatant"
                        :encounter="encounterInstance" />
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
      :owner="combatant"
      :encounter-instance="encounterInstance"
      @deploy="deploy($event)" />

    <div class="text-cc-overline mt-4 text-disabled">Loadout</div>
    <mech-combat-loadout :encounter-instance="encounterInstance"
      :owner="combatant"
      :mech="mech"
      @deploy="deploy($event)" />
  </panel-base>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDisplay } from 'vuetify';
import { CompendiumStore } from '@/stores';
import PanelBase from './_PanelBase.vue';
import MechCombatLoadout from './_components/loadouts/MechCombatLoadout.vue';
import MechCorePanel from './_components/loadouts/MechCorePanel.vue';
import MechActionsPanel from './_components/MechActionsPanel.vue';
import DeployButton from './_components/loadouts/_deployButton.vue';
import { orderBy, sampleSize } from 'lodash-es';

const props = defineProps<{
  combatant: any;
  encounterInstance: any;
}>();

const { smAndDown: mobile } = useDisplay();

const usedActions = ref<string[]>([]);
const movement = ref(0);

const xlColumns = computed(() => mobile.value ? 1 : props.encounterInstance.MaxMasonryColumns);
const mech = computed(() => props.combatant.actor.ActiveMech);
const pilot = computed(() => props.combatant.actor);
const statuses = computed(() => orderBy(CompendiumStore().Statuses, 'StatusType'));
const randomTalents = computed(() => sampleSize(CompendiumStore().Talents, 3));
const applicableStatuses = computed(() => {
  const exclude = ['dangerzone', 'downandout', 'engaged', 'hidden', 'invisible'];
  return statuses.value.filter((s: any) => !exclude.includes(s.ID));
});
const aiSystems = computed(() => mech.value.MechLoadoutController.ActiveLoadout.AISystems);

function deploy(deployable: any) {
  props.encounterInstance.Deploy(deployable, props.combatant);
}

function getIcon(stat: string) {
  const icons: Record<string, string> = {
    structure: 'cc:structure', armor: 'mdi-shield-outline', hp: 'mdi-heart-outline',
    reactor: 'cc:reactor', heat: 'cc:heat', repair: 'cc:repair',
  };
  return icons[stat];
}

function addStatus(status: any) {
  const idx = pilot.value.statuses.indexOf(status);
  if (idx > -1) pilot.value.statuses.splice(idx, 1);
  else pilot.value.statuses.push(status);
}

function addCustomStatus(status: any) {
  const idx = pilot.value.special.indexOf(status.Name);
  if (idx > -1) { pilot.value.special.splice(idx, 1); return; }
  pilot.value.special.push(status.Name);
}

function addResistance(resist: any) {
  const vuln = pilot.value.vulnerabilities;
  const imm = pilot.value.immunities;
  const res = pilot.value.resistances;
  const vi = vuln.indexOf(resist.Name);
  if (vi > -1) { vuln.splice(vi, 1); return; }
  const ii = imm.indexOf(resist.Name);
  if (ii > -1) { imm.splice(ii, 1); vuln.push(resist.Name); return; }
  const ri = res.indexOf(resist.Name);
  if (ri > -1) { res.splice(ri, 1); imm.push(resist.Name); }
  else res.push(resist.Name);
}

function hasResistance(resist: any) { return pilot.value.resistances.includes(resist.Name); }
function hasImmunity(resist: any) { return pilot.value.immunities.includes(resist.Name); }
function hasVulnerability(resist: any) { return pilot.value.vulnerabilities.includes(resist.Name); }

function actionStatus(action: string) {
  if (action === 'full') return usedActions.value.includes('full') || usedActions.value.includes('quick');
  if (action === 'quick') return usedActions.value.includes('full') || usedActions.value.filter(x => x === 'quick').length === 2;
  if (action === 'protocol') return usedActions.value.length;
  if (action === 'move') return usedActions.value.includes('move') || movement.value === 0;
  return usedActions.value.includes(action);
}

function setAction(action: string) {
  if (action === 'quick') {
    if (usedActions.value.filter(x => x === 'quick').length === 2) {
      usedActions.value = usedActions.value.filter(x => x !== 'quick');
    } else {
      usedActions.value.push('quick');
    }
    return;
  }
  const idx = usedActions.value.indexOf(action);
  if (idx > -1) usedActions.value.splice(idx, 1);
  else usedActions.value.push(action);
}

function setMounted() { mech.value.CombatController.ToggleMounted(); }
function turnDiff(targetRound: number) { return targetRound - props.encounterInstance.Round; }
</script>

<style scoped>
.bg-stripes {
  background: repeating-linear-gradient(-45deg,
      rgba(249, 219, 78, 0.5),
      rgba(249, 219, 78, 0.5) 10px,
      rgba(100, 100, 100, 0.5) 10px,
      rgba(100, 100, 100, 0.5) 20px);
}
</style>
