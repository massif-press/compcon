<template>
  <div v-if="readonly && item.NpcTemplateController.Templates.length === 0" class="mb-6">
    <v-card flat>
      <div class="text-disabled text-caption pl-2">
        <i>No Templates</i>
      </div>
    </v-card>
  </div>
  <v-row align="center">
    <v-col v-if="item.NpcTemplateController.Templates.length" cols="auto" dense align="center">
      <cc-chip v-for="t in item.NpcTemplateController.Templates" size="large" class="mr-4">
        <v-tooltip :text="t.Description || t.Tactics" max-width="350px">
          <template #activator="{ props }">
            <span v-bind="props" class="heading h4 pr-2">
              <v-icon icon="cc:npc_template" class="mt-n1" />
              {{ t.Name }}
            </span>
          </template>
        </v-tooltip>
      </cc-chip>
    </v-col>
    <v-col
      v-if="!readonly"
      cols="auto"
      :class="item.NpcTemplateController.Templates.length ? 'ml-auto' : ''">
      <cc-button color="primary" size="small" @click="dialog = true">
        {{ item.NpcTemplateController.Templates.length ? 'Edit' : 'Assign' }} NPC Templates
      </cc-button>
    </v-col>
  </v-row>

  <cc-solo-modal v-model="dialog" title="select template" icon="cc:npc_template">
    <v-card-text v-if="!templates.length">
      <v-container class="mt-n4">
        <cc-missing-gm-lcp-text />
      </v-container>
    </v-card-text>
    <v-layout v-else style="height: 90vh; overflow-y: scroll">
      <v-navigation-drawer class="pa-2">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          hide-details
          variant="outlined"
          clearable />
        <v-list density="compact" slim>
          <v-list-item
            v-for="item in templates"
            :color="selected === item ? '' : 'accent'"
            :class="isAssigned(item) ? 'bg-primary' : ''"
            :value="item"
            @click="selected = item">
            <template #title>
              <span class="heading">{{ item.Name }}</span>
            </template>
            <template #append>
              <v-tooltip v-if="isAssigned(item)" location="top">
                <template #activator="{ props }">
                  <cc-button
                    v-bind="props"
                    size="small"
                    variant="outlined"
                    icon="mdi-minus"
                    color="error"
                    @click="removeTemplate(item)" />
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
                  <cc-button
                    v-bind="props"
                    size="small"
                    variant="outlined"
                    icon="mdi-plus"
                    color="secondary"
                    @click="addTemplate(item)" />
                </template>
                Assign Template
              </v-tooltip>
            </template>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main class="py-3">
        <v-container v-if="selected" class="py-2 px-6">
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
          <cc-button
            v-if="isAssigned(selected)"
            size="small"
            block
            color="error"
            @click="removeTemplate(selected)">
            <v-icon start>mdi-minus</v-icon>
            Remove Template
          </cc-button>

          <cc-button v-else-if="templateConflict(selected).length" size="small" block disabled>
            <v-icon start icon="mdi-cancel" />
            Cannot assign (conflicts with {{ templateConflict(selected) }})
          </cc-button>

          <cc-button v-else size="small" block color="secondary" @click="addTemplate(selected)">
            <v-icon start>mdi-plus</v-icon>
            Assign Template
          </cc-button>
        </v-container>
        <v-row v-else align="center" justify="center" style="width: 100%; height: 100%">
          <v-col cols="auto">
            <span class="heading h1 text-disabled text--lighten-2">select npc template</span>
          </v-col>
        </v-row>
      </v-main>
    </v-layout>
  </cc-solo-modal>
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
