<template>
  <div class="pt-3">
    <div class="caption mb-1">TEMPLATES</div>
    <v-chip
      v-for="t in item.NpcTemplateController.Templates"
      cols="auto"
      variant="outlined"
      label
      class="mr-2"
    >
      <cc-tooltip :content="t.Description">
        {{ t.Name }}
      </cc-tooltip>
    </v-chip>
    <v-btn small color="accent" tile variant="outlined" @click="dialog = true"
      >Set NPC Templates</v-btn
    >

    <v-dialog v-model="dialog">
      <v-card>
        <v-toolbar density="compact" color="primary" flat>
          <span class="heading h6 text-white">Select Template</span>
          <v-spacer />
          <v-btn icon color="white" @click="dialog = false"
            ><v-icon large>mdi-close</v-icon></v-btn
          >
        </v-toolbar>

        <panel-view no-border>
          <template slot="left">
            <v-row density="compact">
              <v-col>
                <v-text-field
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  density="compact"
                  hide-details
                  variant="outlined"
                  clearable
                />
              </v-col>
            </v-row>
            <v-divider class="my-2" />
            <v-row
              density="compact"
              style="max-height: calc(100% - 145px); overflow-y: scroll"
            >
              <v-data-table
                density="compact"
                :items="templates"
                :search="search"
                :headers="headers"
                hide-default-footer
                hide-default-header
                no-results-text="No NPC Templates Found"
                class="transparent"
                style="min-width: 100%"
                disable-pagination
              >
                <template v-slot:[`item.Name`]="{ item }">
                  <v-btn
                    block
                    tile
                    :outlined="!isAssigned(item)"
                    :color="isAssigned(item) ? 'primary' : ''"
                    class="my-1"
                    @click="selected = item"
                  >
                    <v-icon v-if="isAssigned(item)" left>mdi-check</v-icon>
                    {{ item.Name }}
                    <v-scroll-x-transition leave-absolute>
                      <v-icon v-if="selected === item" right
                        >mdi-chevron-triple-right</v-icon
                      >
                    </v-scroll-x-transition>
                  </v-btn>
                </template>
              </v-data-table>
            </v-row>
          </template>
          <template slot="right">
            <v-container v-if="selected" class="mt-n6">
              <v-row no-gutters align="center">
                <v-col class="heading h1 text-text">{{ selected.Name }}</v-col>
                <v-col cols="auto">
                  <v-btn
                    v-if="isAssigned(selected)"
                    variant="outlined"
                    @click="item.NpcTemplateController.RemoveTemplate(selected)"
                  >
                    <v-icon start>mdi-minus</v-icon>
                    Remove Template
                  </v-btn>
                  <v-btn
                    v-else
                    variant="outlined"
                    @click="item.NpcTemplateController.AddTemplate(selected)"
                  >
                    <v-icon start>mdi-plus</v-icon>
                    Assign Template
                  </v-btn>
                </v-col>
              </v-row>

              <div v-if="selected.InLcp" class="heading h3 text-text">
                {{ selected.LcpName }}
              </div>
              <p class="flavor-text mb-0" v-html-safe="selected.Description" />

              <v-alert
                v-show="selected.ClassFeatureSelectionInfo"
                density="compact"
                color="panel"
                class="text-center ma-0"
                v-html="selected.ClassFeatureSelectionInfo"
              />

              <v-expansion-panels :value="[0, 1]" class="mt-2" multiple>
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <span class="heading h3">
                      <b class="text-accent">Base</b>
                      Features
                      <span class="caption"
                        >({{ selected.BaseFeatures.length }})</span
                      >
                    </span>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <cc-dense-card
                      v-for="b in selected.BaseFeatures"
                      :item="b"
                      class="my-1"
                    />
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel v-if="selected.OptionalFeatures.length">
                  <v-expansion-panel-header>
                    <v-row no-gutters align="centter">
                      <v-col align-self="center">
                        <div class="heading h3">
                          <b class="text-accent">Optional</b>
                          Features
                          <span class="caption"
                            >({{ selected.OptionalFeatures.length }})</span
                          >
                        </div>
                      </v-col>
                      <v-col align-self="center">
                        <v-alert
                          v-show="selected.FeatureSelectionInfo"
                          density="compact"
                          color="panel"
                          class="text-center ma-0"
                          v-html="selected.FeatureSelectionInfo"
                        />
                        <v-alert
                          v-show="selected.Caveat"
                          density="compact"
                          color="panel"
                          class="text-center mb-0 mt-1"
                          v-html="selected.Caveat"
                        />
                      </v-col>
                    </v-row>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <cc-dense-card
                      v-for="f in selected.OptionalFeatures"
                      :item="f"
                      class="my-1"
                    />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-container>
            <v-row
              v-else
              align="center"
              justify="center"
              style="width: 100%; height: 100%"
            >
              <v-col cols="auto">
                <span class="heading h1 text-subtle text--lighten-2"
                  >select npc template</span
                >
              </v-col>
            </v-row>
          </template>
        </panel-view>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import PanelView from '../../_components/PanelView.vue';

export default {
  name: 'npc-template-selector',
  components: { PanelView },
  props: {
    item: { type: Object, required: true },
  },
  data: () => ({
    dialog: false,
    templates: [],
    selected: null,
    search: '',
    grouping: null,
    headers: [{ text: 'Name', value: 'Name', align: 'left' }],
    classes: [],
  }),
  created() {
    // const compendium =CompendiumStore();
    // this.templates = compendium.NpcTemplates;
  },
  methods: {
    isAssigned(t) {
      return this.item.NpcTemplateController.Templates.some(
        (x) => x.ID === t.ID
      );
    },
  },
};
</script>
