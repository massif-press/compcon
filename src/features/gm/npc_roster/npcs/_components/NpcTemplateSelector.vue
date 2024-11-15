<template>
  <div class="text-caption my-1">TEMPLATES</div>
  <div v-if="readonly && item.NpcTemplateController.Templates.length === 0" class="mb-6">
    <v-card flat>
      <div class="text-disabled text-caption pl-2">
        <i>No Templates</i>
      </div>
    </v-card>
  </div>
  <v-row>
    <v-col v-if="item.NpcTemplateController.Templates.length" cols="auto" dense align="center">
      <v-chip
        v-for="t in item.NpcTemplateController.Templates"
        variant="outlined"
        label
        class="mr-4">
        <cc-tooltip :content="t.Description || t.Tactics">
          <v-icon icon="cc:npc_template" class="mt-n1 ml-n1" />
          {{ t.Name }}
        </cc-tooltip>
      </v-chip>
    </v-col>
    <v-col
      v-if="!readonly"
      cols="auto"
      :class="item.NpcTemplateController.Templates.length ? 'ml-auto' : ''">
      <v-btn color="accent" variant="tonal" @click="dialog = true">
        {{ item.NpcTemplateController.Templates.length ? 'Edit' : 'Assign' }} NPC Templates
      </v-btn>
    </v-col>
  </v-row>

  <v-dialog v-model="dialog" height="95vh">
    <v-card height="95vh">
      <v-toolbar density="compact" color="primary">
        <v-toolbar-title class="heading">SELECT TEMPLATE</v-toolbar-title>
        <v-spacer />
        <v-btn icon color="white" @click="dialog = false"><v-icon large>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-card-text v-if="!templates.length" class="mt-n4">
        <v-container>
          <cc-missing-gm-lcp-text />
        </v-container>
      </v-card-text>
      <v-layout>
        <v-navigation-drawer class="pa-2">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            density="compact"
            hide-details
            variant="outlined"
            clearable />
          <v-list>
            <v-list-item
              v-for="item in templates"
              :color="selected === item ? '' : 'accent'"
              :class="isAssigned(item) ? 'bg-primary rounded-sm' : ''"
              :value="item"
              @click="selected = item">
              <template #title>
                <v-scroll-x-transition leave-absolute>
                  <v-icon v-if="selected === item" start>mdi-chevron-triple-right</v-icon>
                </v-scroll-x-transition>
                <span class="heading">{{ item.Name }}</span>
              </template>
              <template #append>
                <v-tooltip v-if="isAssigned(item)" location="top">
                  <template #activator="{ props }">
                    <v-icon
                      v-bind="props"
                      size="large"
                      color="error"
                      icon="mdi-minus-box"
                      @click="removeTemplate(item)"></v-icon>
                  </template>
                  Remove Template
                </v-tooltip>

                <v-icon
                  v-else-if="templateConflict(item).length"
                  icon="mdi-cancel"
                  size="large"
                  disabled></v-icon>

                <v-tooltip v-else>
                  <template #activator="{ props }">
                    <v-icon
                      v-bind="props"
                      size="large"
                      icon="mdi-plus-box"
                      color="secondary"
                      @click="addTemplate(item)"></v-icon>
                  </template>
                  Assign Template
                </v-tooltip>
              </template>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
        <v-main style="overflow-y: scroll">
          <v-container v-if="selected">
            <v-row dense align="center" class="mt-n8">
              <v-col cols="auto">
                <span class="heading mech">
                  {{ selected.Name }}
                </span>
              </v-col>
              <v-col v-if="selected.InLcp" cols="auto" class="ml-auto">
                <div class="heading h3 text-text">
                  {{ selected.LcpName }}
                </div>
              </v-col>
            </v-row>
            <cc-item-card :item="selected" />
            <v-btn
              v-if="isAssigned(selected)"
              size="large"
              block
              color="error"
              @click="removeTemplate(selected)">
              <v-icon start>mdi-minus</v-icon>
              Remove Template
            </v-btn>

            <v-btn v-else-if="templateConflict(selected).length" size="large" block disabled>
              <v-icon start icon="mdi-cancel" />
              Cannot assign (conflicts with {{ templateConflict(selected) }})
            </v-btn>

            <v-btn v-else size="large" block color="secondary" @click="addTemplate(selected)">
              <v-icon start>mdi-plus</v-icon>
              Assign Template
            </v-btn>
          </v-container>
          <v-row v-else align="center" justify="center" style="width: 100%; height: 100%">
            <v-col cols="auto">
              <span class="heading h1 text-disabled text--lighten-2">select npc template</span>
            </v-col>
          </v-row>
        </v-main>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import PanelView from '../../../_components/PanelView.vue';

export default {
  name: 'npc-template-selector',
  components: { PanelView },
  props: {
    item: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
  },
  data: () => ({
    dialog: false,
    selected: null as any,
    search: '',
  }),
  computed: {
    templates() {
      return CompendiumStore().NpcTemplates;
    },
  },
  methods: {
    templateConflict(t) {
      if (!t) return '';
      return this.item.NpcTemplateController.Templates.filter((x) =>
        x.ProhibitTemplates.includes(t.ID)
      )
        .map((x) => x.Name)
        .join(', ');
    },
    isAssigned(t) {
      if (!t) return false;
      return this.item.NpcTemplateController.Templates.some((x) => x.ID === t.ID);
    },
    addTemplate(t) {
      if (!t) return;
      this.item.NpcTemplateController.AddTemplate(t);
    },
    removeTemplate(t) {
      if (!t) return;
      this.item.NpcTemplateController.RemoveTemplate(t);
    },
  },
};
</script>
