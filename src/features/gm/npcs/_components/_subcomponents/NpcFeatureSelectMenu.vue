<template>
  <div>
    <v-btn size="x-large" block color="primary" @click="dialog = true"
      >Set NPC Features</v-btn
    >
    <v-row no-gutters justify="end">
      <v-col cols="auto">
        <v-btn
          x-small
          variant="outlined"
          class="fade-select mt-1"
          @click="npc.NpcFeatureController.ResetFeatures()"
        >
          Reset Features
        </v-btn>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" fullscreen style="overflow-y: hidden">
      <v-card>
        <v-toolbar
          flat
          tile
          density="compact"
          color="blue-grey darken-4"
          class="text-white"
        >
          Set NPC Features
          <v-spacer />
          <cc-tooltip
            v-for="(alert, i) in npc.NpcTemplateController
              .TemplateFeatureAlerts"
            :title="alert.severity"
            :content="alert.message"
          >
            <v-icon end :color="alert.severity">mdi-alert</v-icon>
          </cc-tooltip>
          <v-spacer />
          <v-btn icon dark @click="dialog = false"
            ><v-icon icon="mdi-close"
          /></v-btn>
        </v-toolbar>
        <v-row no-gutters>
          <v-col cols="3" style="max-width: 325px !important">
            <v-list
              density="compact"
              nav
              class="side-fixed mt-n1"
              color="panel"
            >
              <v-list-item
                color="accent"
                selectable
                @click="featureSet = 'all'"
              >
                <v-list-item-icon>
                  <v-icon icon="cc:npc_feature" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="text-button">
                    <b>All Available Features</b>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                color="accent"
                selectable
                @click="featureSet = 'assigned'"
              >
                <v-list-item-icon>
                  <v-icon icon="cc:npc_feature" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="text-button">
                    <b>All Assigned Features</b>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider />
              <v-list-item
                color="accent"
                @click="featureSet = npc.NpcClassController.Class.ID"
              >
                <v-list-item-icon>
                  <v-icon v-text="npc.NpcClassController.Class.RoleIcon" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="text-button">
                    <b>{{ npc.NpcClassController.Class.Name }}</b>
                    Features
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                v-for="t in npc.Templates"
                color="accent"
                @click="featureSet = t.ID"
              >
                <v-list-item-icon>
                  <v-icon v-text="'cc:npc_template'" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="text-button">
                    <b class="pr-1">{{ t.Name }}</b>
                    <span class="text--secondary">Features</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider />

              <v-list-group no-action color="accent">
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title class="heading h6"
                      >Classes</v-list-item-title
                    >
                  </v-list-item-content>
                </template>

                <v-list-item
                  v-for="c in allClasses"
                  color="accent"
                  class="pl-6"
                  @click="featureSet = c.ID"
                >
                  <v-list-item-icon>
                    <v-icon :icon="c.Icon" />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="text-button">
                      <b class="pr-1">{{ c.Name }}</b>
                      <span class="text--secondary">Features</span>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>

              <v-list-group no-action color="accent">
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title class="heading h6"
                      >Templates</v-list-item-title
                    >
                  </v-list-item-content>
                </template>

                <v-list-item
                  v-for="t in allTemplates"
                  color="accent"
                  class="pl-6"
                  @click="featureSet = t.ID"
                >
                  <v-list-item-icon>
                    <v-icon v-text="'cc:npc_template'" />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="text-button">
                      <b class="pr-1">{{ t.Name }}</b>
                      <span class="text--secondary">Features</span>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
            </v-list>
            <div style="height: 20px" />
          </v-col>

          <v-col class="pl-6 pr-8">
            <v-container
              style="height: calc(100vh - 35px) !important; overflow-y: scroll"
            >
              <v-row density="compact" align="start" class="mt-n3">
                <v-col>
                  <span class="heading h3"
                    >{{ currentSelection }} Features</span
                  >
                </v-col>
                <v-col cols="auto">
                  <v-switch
                    v-if="featureSet === 'all'"
                    v-model="ignoreLimit"
                    inset
                    density="compact"
                    hide-details
                    class="ma-0"
                    label="Ignore Limit"
                  />
                  <v-switch
                    v-else
                    v-model="allowDupes"
                    inset
                    density="compact"
                    hide-details
                    class="ma-0"
                    label="Allow Duplicates"
                  />
                </v-col>
              </v-row>
              <v-divider class="mt-2 mb-4" />
              <v-row>
                <v-col v-for="(f, i) in shownFeatures" xl="6" lg="6" cols="12">
                  <cc-dense-card
                    :item="f"
                    :style="`height: calc(100% - ${
                      allowDupes && hasItem(f) ? '70' : '35'
                    }px)!important`"
                  />
                  <v-btn
                    v-if="!hasItem(f) || allowDupes"
                    color="accent"
                    block
                    variant="outlined"
                    tile
                    @click="npc.NpcFeatureController.AddFeature(f)"
                  >
                    <v-icon start>mdi-plus</v-icon>
                    Add {{ f.Name }}
                  </v-btn>
                  <v-btn
                    v-if="hasItem(f)"
                    color="warning darken-1"
                    class="text-white"
                    block
                    variant="outlined"
                    tile
                    @click="npc.NpcFeatureController.RemoveFeature(f)"
                  >
                    <v-icon start>mdi-minus</v-icon>
                    Remove {{ f.Name }}
                  </v-btn>
                </v-col>
                <v-col v-if="!shownFeatures.length" cols="12">
                  <v-alert
                    v-if="featureSet === 'all'"
                    variant="outlined"
                    class="text-center"
                  >
                    No NPC Feature selections remaining
                    <br />
                    <span class="caption text--secondary">
                      Additional features beyond the reccommended guidelines can
                      be added by toggling the "Ignore Limit" option above
                    </span>
                  </v-alert>
                  <v-alert
                    v-else-if="featureSet === 'assigned'"
                    variant="outlined"
                    class="text-center"
                  >
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
import { CompendiumStore } from '@/stores';

export default {
  name: 'npc-feature-select-menu',
  props: {
    npc: { type: Object, required: true },
  },
  data: () => ({
    dialog: false,
    featureSet: 'all',
    ignoreLimit: false,
    allowDupes: false,
  }),
  computed: {
    currentSelection() {
      switch (this.featureSet) {
        case 'all':
          return 'All Available';
        case 'assigned':
          return 'All Assigned';
        default:
          const selClass = this.allClasses.find(
            (x) => x.ID === this.featureSet
          );
          const selTemp = this.allTemplates.find(
            (x) => x.ID === this.featureSet
          );
          return selClass ? selClass.Name : selTemp.Name;
      }
    },
    shownFeatures() {
      if (this.featureSet === 'all') {
        if (
          this.npc.NpcTemplateController.TemplateFeatureAlerts.length ||
          this.ignoreLimit
        )
          return this.npc.NpcFeatureController.AvailableFeatures;
        else return [];
      }

      if (this.featureSet === 'assigned')
        return this.npc.Items.map((x) => x.Feature);

      return CompendiumStore().NpcFeatures.filter(
        (x) => x.Origin.ID === this.featureSet
      );
    },
    allClasses() {
      return CompendiumStore().NpcClasses.map((x) => ({
        Name: x.Name,
        ID: x.ID,
        Icon: x.RoleIcon,
      }));
    },
    allTemplates() {
      return CompendiumStore().NpcTemplates.map((x) => ({
        Name: x.Name,
        ID: x.ID,
      }));
    },
  },
  methods: {
    hasItem(feature) {
      return this.npc.NpcFeatureController.SelectedFeatures.some(
        (y) => y.ID === feature.ID
      );
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
</style>
