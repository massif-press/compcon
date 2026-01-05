<template>
  <div>
    <div class="text-cc-overline text-disabled">Statuses / Conditions</div>
    <v-row dense>
      <v-col
        v-for="status in applicableStatuses.filter((x) => x.StatusType === 'Status')"
        :key="`${isPilot}_${status.ID}`">
        <v-tooltip :open-delay="400" location="top" max-width="300">
          <template #activator="{ props }">
            <v-card
              v-bind="props"
              :color="
                controller.Statuses.some((s) => s.status.ID === status.ID) ? 'primary' : 'panel'
              "
              class="px-2 py-1 text-center"
              flat
              tile
              @click="setStatus(status)">
              <v-icon :icon="status.Icon" size="35" />
            </v-card>
          </template>
          <div class="heading h3">{{ status.Name }}</div>
          {{ status.Terse || status.Effects }}
        </v-tooltip>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col
        v-for="status in applicableStatuses.filter((x) => x.StatusType === 'Condition')"
        :key="`${isPilot}_${status.ID}`">
        <v-tooltip :open-delay="400" location="top" max-width="300">
          <template #activator="{ props }">
            <v-card
              v-bind="props"
              :color="
                controller.Statuses.some((s) => s.status.ID === status.ID) ? 'primary' : 'panel'
              "
              class="px-2 py-1 text-center"
              flat
              tile
              @click="setStatus(status)">
              <v-icon :icon="status.Icon" size="35" />
            </v-card>
          </template>
          <div class="heading h3">{{ status.Name }}</div>
          <v-card
            v-if="appliedStatus(status)"
            flat
            tile
            class="pa-1 text-center text-cc-overline"
            color="primary">
            {{ appliedStatus(status) }}
          </v-card>
          {{ status.Terse || status.Effects }}
        </v-tooltip>
      </v-col>
    </v-row>

    <v-scroll-y-reverse-transition>
      <div v-if="special.length" class="my-1">
        <v-card
          v-for="cs in special"
          :key="cs.ID"
          flat
          tile
          border
          style="border-color: rgb(var(--v-theme-exotic))">
          <div class="heading h3 bg-exotic px-2 py-1">
            <v-icon icon="mdi-star-four-points-circle-outline" />
            {{ cs.status.Attribute }}
          </div>
          <v-row no-gutters align="center">
            <v-col>
              <div class="text-cc-overline pl-4 py-1">
                {{ cs.status.Detail }}
              </div>
            </v-col>
            <v-col cols="auto">
              <v-btn
                flat
                tile
                size="x-small"
                @click="controller.RemoveCustomStatus(cs.status.Attribute)">
                <v-icon icon="mdi-close" size="22" />
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </v-scroll-y-reverse-transition>

    <div class="top-element">
      <v-row no-gutters justify="end">
        <v-col cols="auto">
          <v-menu :close-on-content-click="false" offset-y>
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                size="x-small"
                color="exotic"
                class="mt-1"
                flat
                tile
                block
                prepend-icon="mdi-plus">
                Add Custom Status
              </v-btn>
            </template>

            <v-card>
              <v-card-text>
                <v-text-field
                  v-model="customStatus"
                  label="Custom Status Name"
                  variant="outlined"
                  dense
                  hide-details />
                <v-btn
                  flat
                  tile
                  color="primary"
                  class="mt-2"
                  @click="addCustomStatus(customStatus)">
                  Add Custom Status
                </v-btn>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { CompendiumStore } from '@/stores';
import { EffectDurationText } from '@/classes/components/feature/active_effects/EffectDuration';
import BaseTargetSelector from '@/ui/components/chips/_activeeffect/_shared/BaseTargetSelector.vue';

export default {
  name: 'StatusConditionSelector',
  props: {
    controller: {
      type: Object,
      required: true,
    },
    encounter: {
      type: Object,
      required: true,
    },
  },
  components: {
    BaseTargetSelector,
  },
  data: () => ({
    customInflict: '',
    statusesToInflict: [],
    selectedTargets: [],
  }),
  computed: {
    isPilot() {
      return this.controller.Parent.ItemType === 'Pilot';
    },
    filteredTargets() {
      return this.targets.filter((t) => !this.selectedTargets.includes(t));
    },
    statuses() {
      return _.orderBy(CompendiumStore().Statuses, 'StatusType');
    },
    applicableStatuses() {
      let exclude = [];
      if (this.isPilot) {
        exclude = [`dangerzone`, 'shut-down'];
      } else exclude = [`dangerzone`, `downandout`];
      return this.statuses.filter((s) => !exclude.includes(s.ID));
    },
    special() {
      return this.controller.CustomStatuses;
    },
    targets() {
      let out = [];

      const target = self.side === 'enemy' ? 'ally' : 'enemy';

      out = [...this.encounter.Combatants]
        .filter(
          (c) =>
            c.actor.CombatController.ActiveActor.ID !== this.owner.CombatController.ActiveActor.ID
        )
        .sort((a, b) => {
          if (a.side === target && b.side !== target) {
            return -1;
          } else if (a.side !== target && b.side === target) {
            return 1;
          } else {
            return a.actor.CombatController.CombatName.localeCompare(
              b.actor.CombatController.CombatName
            );
          }
        });
      return out;
    },
  },
  methods: {
    setStatus(status) {
      this.controller.SetStatus(status);
    },
    addCustomStatus(name) {
      if (!name || !name.trim().length) return;
      this.controller.SetCustomStatus(name.trim());
      this.customStatus = '';
    },
    setInflictStatus(status) {
      const idx = this.statusesToInflict.indexOf(status.ID);
      if (idx >= 0) {
        this.statusesToInflict.splice(idx, 1);
      } else {
        this.statusesToInflict.push(status.ID);
      }
    },
    appliedStatus(status) {
      const applied = this.controller.Statuses.find((s) => s.status.ID === status.ID);
      if (!applied || applied.expires) return null;
      return applied.expires?.Text || '';
    },
  },
};
</script>

<style scoped>
::v-deep(.short .v-field__input) {
  min-height: 28px !important;
  padding: 4px !important;
  padding-left: 8px !important;
}

::v-deep(.short .v-field) {
  height: 28px !important;
}
</style>
