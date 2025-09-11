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
      <v-menu :close-on-content-click="false" offset-y>
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

        <v-card>
          <v-card-text>
            <v-text-field
              v-model="customStatus"
              label="Custom Status Name"
              variant="outlined"
              dense
              hide-details />
            <v-btn color="primary" class="mt-2" @click="addCustomStatus(customStatus)">
              Add Custom Status
            </v-btn>
          </v-card-text>
        </v-card>
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
    addCustomStatus(name) {
      if (!name || !name.trim().length) return;
      this.controller.SetCustomStatus(name.trim());
      this.customStatus = '';
    },
  },
};
</script>
