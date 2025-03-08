<template>
  <div>
    <cc-button block color="primary" class="mt-2" @click="dialog = true">
      Set NPC Features
    </cc-button>
    <v-row no-gutters justify="end">
      <v-col cols="auto">
        <cc-button
          size="small"
          color="error"
          class="mt-2"
          @click="npc.NpcFeatureController.ResetFeatures()">
          Reset Features
        </cc-button>
      </v-col>
    </v-row>
    <cc-solo-modal v-model="dialog" title="Set NPC Features" icon="cc:npc_feature">
      <template #toolbar-items>
        <npc-feature-alerts
          :template-controller="npc.NpcTemplateController"
          hide-complete
          class="d-inline" />
      </template>
      <v-layout style="position: relative">
        <div
          style="position: absolute; z-index: 999"
          :style="`left: ${showNav ? '352' : '3'}px; top: 6px`">
          <cc-button
            :icon="showNav ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'"
            size="small"
            color="primary"
            @click="showNav = !showNav" />
        </div>
        <v-navigation-drawer v-model="showNav" class="mt-2" width="350">
          <v-list density="compact" slim nav class="side-fixed mt-n1" color="panel">
            <v-list-item
              color="accent"
              selectable
              prepend-icon="cc:npc_feature"
              @click="featureSet = 'all'">
              <template #title>
                <b class="text-button">All Available Features</b>
              </template>
            </v-list-item>
            <v-list-item
              color="accent"
              selectable
              prepend-icon="cc:npc_feature"
              @click="featureSet = 'assigned'">
              <template #title>
                <b class="text-button">All Assigned Features</b>
              </template>
            </v-list-item>
            <v-divider />

            <v-list-subheader class="mb-n3">SELECTED CLASS</v-list-subheader>
            <v-list-item
              color="accent"
              :prepend-icon="npc.NpcClassController.Class.Icon"
              @click="featureSet = npc.NpcClassController.Class.ID">
              <template #title>
                <span class="text-button">{{ npc.NpcClassController.Class.Name }} Features</span>
              </template>
            </v-list-item>
            <v-list-subheader class="mb-n3">
              SELECTED TEMPLATE{{ npc.NpcTemplateController.Templates.length > 1 ? 'S' : '' }}
            </v-list-subheader>
            <v-list-item
              v-for="t in npc.NpcTemplateController.Templates"
              prepend-icon="cc:npc_template"
              color="accent"
              @click="featureSet = t.ID">
              <template #title>
                <span class="text-button">{{ t.Name }} Features</span>
              </template>
            </v-list-item>
            <v-divider />

            <v-list-group no-action color="accent">
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props">
                  <template #title>
                    <span class="text-button">
                      <b>Other NPC Classes</b>
                    </span>
                  </template>
                </v-list-item>
              </template>

              <v-list-item
                v-for="c in allClasses"
                color="accent"
                class="ml-n8"
                :prepend-icon="c.Icon"
                @click="featureSet = c.ID">
                <template #title>
                  <span class="text-button">{{ c.Name }} Features</span>
                </template>
              </v-list-item>
            </v-list-group>

            <v-list-group no-action color="accent">
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props">
                  <template #title>
                    <span class="text-button">
                      <b>Other NPC Templates</b>
                    </span>
                  </template>
                </v-list-item>
              </template>

              <v-list-item
                v-for="t in allTemplates"
                color="accent"
                class="ml-n8"
                prepend-icon="cc:npc_template"
                @click="featureSet = t.ID">
                <template #title>
                  <span class="text-button">{{ t.Name }} Features</span>
                </template>
              </v-list-item>
            </v-list-group>
          </v-list>
          <div style="height: 20px" />
        </v-navigation-drawer>

        <v-main style="height: calc(100vh - 35px) !important; overflow-y: scroll">
          <v-container class="px-10 py-4">
            <v-row dense align="start" class="mt-n3">
              <v-col>
                <span class="heading h3">{{ currentSelection }} Features</span>
              </v-col>
              <v-col cols="auto">
                <cc-switch v-if="featureSet === 'all'" v-model="ignoreLimit" label="Ignore Limit" />
                <cc-switch v-else v-model="allowDupes" label="Allow Duplicates" />
              </v-col>
            </v-row>
            <npc-feature-alerts
              :template-controller="npc.NpcTemplateController"
              expanded
              hide-complete />

            <v-divider class="mt-2 mb-4" />
            <div v-if="featureSet === 'all' || featureSet === 'assigned'" align="center">
              <v-btn-toggle
                density="compact"
                class="mb-4"
                multiple
                flat
                tile
                size="small"
                v-model="shownOrigins">
                <v-btn
                  v-for="o in availableOrigins"
                  :key="o.ID"
                  color="accent"
                  variant="tonal"
                  :value="o.ID">
                  {{ o.Name }}
                </v-btn>
              </v-btn-toggle>
            </div>

            <masonry-wall
              :items="shownFeatures"
              :column-width="400"
              :gap="14"
              :min-columns="1"
              :max-columns="2">
              <template #default="{ item }">
                <cc-dense-card :item="item" />
                <div class="mt-n2">
                  <cc-button
                    v-if="!hasItem(item) || allowDupes"
                    color="secondary"
                    block
                    size="x-small"
                    prepend-icon="mdi-plus"
                    @click="npc.NpcFeatureController.AddFeature(item)">
                    Add {{ item.Name }}
                  </cc-button>
                  <cc-button
                    v-if="hasItem(item)"
                    color="warning"
                    block
                    size="x-small"
                    prepend-icon="mdi-minus"
                    @click="npc.NpcFeatureController.RemoveFeature(item)">
                    Remove {{ item.Name }}
                  </cc-button>
                </div>
              </template>
            </masonry-wall>

            <div v-if="!shownFeatures.length" class="my-6">
              <v-alert
                v-if="
                  featureSet === 'all' &&
                  !npc.NpcTemplateController.FeatureRequirements.some(
                    (x) => !x.complete || !x.optional_complete
                  )
                "
                variant="outlined"
                class="text-center">
                No NPC Feature selections remaining
                <br />
                <span class="caption text--secondary">
                  Additional features beyond the recommended guidelines can be added by toggling the
                  "Ignore Limit" option above
                </span>
              </v-alert>
              <v-alert v-else-if="featureSet === 'assigned'" variant="outlined" class="text-center">
                No NPC Features assigned
              </v-alert>
              <v-alert v-else variant="outlined" class="text-center">
                No NPC Features could be found for this selection
              </v-alert>
            </div>

            <div style="height: 30px" />
          </v-container>
        </v-main>
      </v-layout>
    </cc-solo-modal>
  </div>
</template>

<script>
import _ from 'lodash';
import { CompendiumStore } from '@/stores';
import NpcFeatureAlerts from './NpcFeatureAlerts.vue';
import { NpcFeature } from '@/classes/npc/feature/NpcFeature';

export default {
  name: 'npc-feature-select-menu',
  components: {
    NpcFeatureAlerts,
  },
  props: {
    npc: { type: Object, required: true },
  },
  data: () => ({
    dialog: false,
    featureSet: 'all',
    ignoreLimit: false,
    allowDupes: false,
    shownOrigins: [],
    showNav: true,
  }),
  created() {
    this.shownOrigins = this.availableOrigins.map((x) => x.ID);
  },
  watch: {
    dialog(val) {
      if (val) {
        this.shownOrigins = this.availableOrigins.map((x) => x.ID);
      }
    },
  },
  computed: {
    currentSelection() {
      switch (this.featureSet) {
        case 'all':
          return 'All Available';
        case 'assigned':
          return 'All Assigned';
        default:
          const selClass = this.allClasses.find((x) => x.ID === this.featureSet);
          const selTemp = this.allTemplates.find((x) => x.ID === this.featureSet);
          return selClass ? selClass.Name : selTemp.Name;
      }
    },
    featureOrigins() {
      return _.uniqBy(this.shownFeatures, 'Origin.ID').map((x) => x.Origin);
    },
    availableOrigins() {
      return _.uniq(this.npc.NpcFeatureController.AvailableFeatures.map((x) => x.Origin));
    },
    shownFeatures() {
      if (this.featureSet === 'all') {
        const selectionsRemaining = this.npc.NpcTemplateController.FeatureRequirements.some(
          (x) => !x.complete || !x.optional_complete
        );

        if (selectionsRemaining || this.ignoreLimit) {
          let out = [];
          this.npc.NpcTemplateController.FeatureRequirements.forEach((x) => {
            if (x.complete && x.optional_complete && !this.ignoreLimit) return;
            out = out.concat(
              this.npc.NpcFeatureController.AvailableFeatures.filter(
                (y) => y.Origin.ID === x.source_id
              )
            );
          });

          out = out.filter((x) => this.shownOrigins.includes(x.Origin.ID));

          return _.orderBy(out, 'EffectLength');
        } else return [];
      }

      if (this.featureSet === 'assigned')
        return _.orderBy(this.npc.NpcFeatureController.Features, 'EffectLength');

      return _.orderBy(
        CompendiumStore().NpcFeatures.filter((x) => x.Origin.ID === this.featureSet),
        'EffectLength'
      );
    },
    allClasses() {
      return CompendiumStore().NpcClasses;
    },
    allTemplates() {
      return CompendiumStore().NpcTemplates;
    },
  },
  methods: {
    hasItem(feature) {
      return this.npc.NpcFeatureController.Features.some((y) => y.ID === feature.ID);
    },
  },
};
</script>
