<template>
  <div>
    <v-btn size="x-large" block color="primary" class="mt-1" @click="dialog = true"
      >Set NPC Features</v-btn
    >
    <v-row no-gutters justify="end">
      <v-col cols="auto">
        <v-btn
          size="x-small"
          color="error"
          variant="outlined"
          class="fade-select mt-1"
          @click="npc.NpcFeatureController.ResetFeatures()">
          Reset Features
        </v-btn>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" fullscreen style="overflow-y: hidden">
      <v-card style="overflow-y: hidden">
        <v-toolbar flat tile density="compact" color="blue-grey-darken-3" class="text-white">
          <v-toolbar-title
            >Set NPC Features

            <npc-feature-alerts
              :template-controller="npc.NpcTemplateController"
              hide-complete
              class="d-inline ml-12" />
          </v-toolbar-title>

          <v-spacer />
          <v-btn icon dark @click="dialog = false"><v-icon icon="mdi-close" /></v-btn>
        </v-toolbar>
        <v-row no-gutters>
          <v-col cols="3" style="max-width: 325px !important">
            <v-list density="compact" nav class="side-fixed mt-n1" color="panel">
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

              <v-list-subheader class="mb-n4">SELECTED CLASS</v-list-subheader>
              <v-list-item
                color="accent"
                :prepend-icon="npc.NpcClassController.Class.Icon"
                @click="featureSet = npc.NpcClassController.Class.ID">
                <template #title>
                  <span class="text-button">{{ npc.NpcClassController.Class.Name }} Features</span>
                </template>
              </v-list-item>
              <v-list-subheader class="mb-n4"
                >SELECTED TEMPLATE{{
                  npc.NpcTemplateController.Templates.length > 1 ? 'S' : ''
                }}</v-list-subheader
              >
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
                    </template></v-list-item
                  >
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
                    </template></v-list-item
                  >
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
          </v-col>

          <v-col class="pl-6">
            <v-container style="height: calc(100vh - 35px) !important; overflow-y: scroll">
              <v-row dense align="start" class="mt-n3">
                <v-col>
                  <span class="heading h3">{{ currentSelection }} Features</span>
                </v-col>
                <v-col cols="auto">
                  <v-switch
                    v-if="featureSet === 'all'"
                    v-model="ignoreLimit"
                    inset
                    density="compact"
                    hide-details
                    class="ma-0"
                    label="Ignore Limit" />
                  <v-switch
                    v-else
                    v-model="allowDupes"
                    inset
                    density="compact"
                    hide-details
                    class="ma-0"
                    label="Allow Duplicates" />
                </v-col>
              </v-row>
              <npc-feature-alerts
                :template-controller="npc.NpcTemplateController"
                expanded
                hide-complete />

              <v-divider class="mt-2 mb-4" />
              <div v-if="featureSet === 'all' || featureSet === 'assigned'" align="center">
                <v-btn-toggle density="compact" multiple v-model="shownOrigins">
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
              <v-row>
                <v-col v-for="f in shownFeatures" xl="6" lg="6" cols="12">
                  <cc-dense-card :item="f" />
                  <div class="button-border">
                    <v-btn
                      v-if="!hasItem(f) || allowDupes"
                      color="accent"
                      block
                      variant="tonal"
                      tile
                      @click="npc.NpcFeatureController.AddFeature(f)">
                      <v-icon start>mdi-plus</v-icon>
                      Add {{ f.Name }}
                    </v-btn>
                    <v-btn
                      v-if="hasItem(f)"
                      color="warning darken-1"
                      class="text-white"
                      block
                      variant="tonal"
                      tile
                      @click="npc.NpcFeatureController.RemoveFeature(f)">
                      <v-icon start>mdi-minus</v-icon>
                      Remove {{ f.Name }}
                    </v-btn>
                  </div>
                </v-col>
                <v-col v-if="!shownFeatures.length" cols="12" class="my-6">
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
                      Additional features beyond the recommended guidelines can be added by toggling
                      the "Ignore Limit" option above
                    </span>
                  </v-alert>
                  <v-alert
                    v-else-if="featureSet === 'assigned'"
                    variant="outlined"
                    class="text-center">
                    No NPC Features assigned
                  </v-alert>
                  <v-alert v-else variant="outlined" class="text-center">
                    No NPC Features could be found for this selection
                  </v-alert>
                </v-col>
              </v-row>
              <div style="height: 30px" />
            </v-container>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
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
    shownOrigins: [] as string[],
  }),
  mounted() {
    this.shownOrigins = this.availableOrigins.map((x: any) => x.ID);
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
          return selClass ? selClass.Name : selTemp!.Name;
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
          let out = [] as NpcFeature[];
          this.npc.NpcTemplateController.FeatureRequirements.forEach((x) => {
            if (x.complete && x.optional_complete) return;
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

<style scoped>
.side-fixed {
  height: calc(100vh - 45px);
  overflow-y: scroll;
  top: 51.5px;
  bottom: 0;
  /* padding-bottom: 35px; */
  position: fixed;
  width: 23vw;
  max-width: 325px !important;
}

.button-border {
  border-bottom: 1px solid white;
  border-left: 1px solid white;
  border-right: 1px solid white;
  margin-left: 12px;
  margin-right: 12px;
  margin-top: -13px;
}
</style>
