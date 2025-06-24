<template>
  <div>
    <div class="text-cc-overline text-disabled">Statuses / Conditions</div>
    <v-row dense>
      <v-col v-for="status in statuses.filter((x) => x.StatusType === 'Status')" :key="status.ID">
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
        v-for="status in statuses.filter((x) => x.StatusType === 'Condition')"
        :key="status.ID">
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

    <div class="text-right">
      <v-menu>
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            size="x-small"
            color="accent"
            class="mt-1"
            flat
            tile
            block
            variant="text"
            prepend-icon="mdi-plus">
            Add Special Status
          </v-btn>
        </template>
        <v-list density="compact" slim>
          <v-list-item
            v-for="status in specialStatuses"
            :active="special.includes(status.Name)"
            active-color="accent"
            :key="status.ID"
            @click="addSpecialStatus(status)">
            <v-list-item-title>{{ status.Name }}</v-list-item-title>
          </v-list-item>
          <v-divider />
          <v-list-item title="Add Custom" @click="" />
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { CompendiumStore } from '@/stores';

export default {
  name: 'StatusConditionSelector',
  props: {
    controller: {
      type: Object,
      required: true,
    },
  },
  computed: {
    statuses() {
      return _.orderBy(CompendiumStore().Statuses, 'StatusType');
    },
    applicableStatuses() {
      const exclude = [`dangerzone`, `downandout`, `engaged`, `hidden`, `invisible`];
      return this.statuses.filter((s) => !exclude.includes(s.ID));
    },
  },
  methods: {
    setStatus(status) {
      this.controller.SetStatus(status);
    },
  },
};
</script>
