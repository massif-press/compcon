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

    <div class="top-element">
      <v-row no-gutters>
        <v-col>
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
        </v-col>
        <v-col class="ml-2">
          <cc-dialog
            :close-on-click="false"
            title="Inflict Status"
            icon="mdi-rhombus-outline"
            max-width="1200px">
            <template #activator="{ open }">
              <v-btn
                size="x-small"
                color="primary"
                class="mt-1"
                flat
                tile
                block
                prepend-icon="mdi-plus-circle-outline"
                @click="open">
                Inflict Status
              </v-btn>
            </template>

            <v-card flat tile>
              <v-card-text>
                <v-row>
                  <v-col cols="4">
                    <v-card
                      v-for="status in statuses"
                      :key="status.ID"
                      class="px-2 py-1 text-center"
                      flat
                      tile
                      :color="statusesToInflict.includes(status.ID) ? 'primary' : 'panel'"
                      border
                      @click="setInflictStatus(status)">
                      <v-tooltip
                        :text="status.Terse || status.Effects"
                        location="top"
                        max-width="300">
                        <template #activator="{ props }">
                          <v-row dense v-bind="props" align="center">
                            <v-col cols="auto">
                              <v-icon :icon="status.Icon" size="26" />
                            </v-col>
                            <v-col>
                              <b>{{ status.Name }}</b>
                            </v-col>
                          </v-row>
                        </template>
                      </v-tooltip>
                    </v-card>

                    <div class="text-cc-overline text-disabled mt-2">Custom Status</div>
                    <v-text-field
                      v-model="customStatus"
                      variant="outlined"
                      dense
                      flat
                      tile
                      hide-details />
                    <v-btn size="x-small" color="primary" block flat tile prepend-icon="mdi-plus">
                      Add Additional Custom Status
                    </v-btn>
                  </v-col>
                  <v-col>
                    <div class="text-cc-overline text-disabled">Target</div>
                    <v-select
                      value="T1 Pirate Cataphract Mech #2"
                      v-model="inflictTargets"
                      variant="outlined"
                      dense
                      flat
                      tile
                      hide-details />
                    <v-row no-gutters>
                      <v-col>
                        <v-btn
                          size="x-small"
                          color="primary"
                          block
                          flat
                          tile
                          prepend-icon="mdi-plus">
                          Add Target
                        </v-btn>
                      </v-col>
                      <v-col class="ml-2" cols="auto">
                        <v-btn
                          size="x-small"
                          variant="text"
                          flat
                          tile
                          prepend-icon="mdi-checkbox-blank-outline">
                          Allow Allies
                        </v-btn>
                      </v-col>
                    </v-row>

                    <div class="text-cc-overline text-disabled mt-2">Duration</div>
                    <v-select
                      value="Until Dismissed"
                      v-model="duration"
                      variant="outlined"
                      dense
                      flat
                      tile
                      hide-details />

                    <v-row class="mt-2">
                      <v-col>
                        <div class="text-cc-overline">Save</div>
                        <v-btn color="success" flat tile size="small">Enabled</v-btn>
                      </v-col>
                      <v-col>
                        <div class="text-cc-overline">Save Stat</div>
                        <v-select
                          value="Hull"
                          class="short"
                          v-model="duration"
                          variant="outlined"
                          dense
                          flat
                          tile
                          hide-details />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="4">
                        <div class="text-cc-overline">Target</div>
                      </v-col>
                      <v-col cols="2">
                        <div class="text-cc-overline">Save</div>
                      </v-col>
                      <v-col>
                        <div class="text-cc-overline">Roll</div>
                      </v-col>
                    </v-row>
                    <v-divider />
                    <v-row>
                      <v-col cols="4">
                        <b>T1 Pirate Cataphract Mech #2</b>
                      </v-col>
                      <v-col cols="2">
                        <b>11</b>
                      </v-col>
                      <v-col>
                        <v-row dense>
                          <v-col>
                            <v-text-field
                              value="3"
                              class="short"
                              variant="outlined"
                              dense
                              flat
                              tile
                              hide-details />
                          </v-col>
                          <v-col cols="auto">
                            <v-btn icon size="x-small" variant="text" flat tile>
                              <v-icon size="30" icon="mdi-dice-d20" />
                            </v-btn>
                          </v-col>
                          <v-col cols="auto">
                            <v-icon size="30" icon="mdi-alert-rhombus" color="error" />
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-divider class="my-2" />
                <div class="text-cc-overline text-disabled mt-2">Summary</div>
                <cc-alert>
                  Assign
                  <b class="text-secondary">Lock On</b>
                  and
                  <b class="text-secondary">Stunned</b>
                  to
                  <b class="text-enemy">T1 Pirate Cataphract Mech #2</b>
                  until dismissed.
                </cc-alert>

                <div class="d-flex justify-end mt-2 mr-4">
                  <cc-button>Cancel</cc-button>
                  <v-spacer />
                  <cc-button color="primary">
                    <div class="px-6">Confirm</div>
                  </cc-button>
                </div>
              </v-card-text>
            </v-card>
          </cc-dialog>
        </v-col>
      </v-row>
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
  data: () => ({
    customInflict: '',
    statusesToInflict: [],
    inflictTargets: [],
  }),
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
    setInflictStatus(status) {
      const idx = this.statusesToInflict.indexOf(status.ID);
      if (idx >= 0) {
        this.statusesToInflict.splice(idx, 1);
      } else {
        this.statusesToInflict.push(status.ID);
      }
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
