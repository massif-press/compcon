<template>
  <v-container>
    <v-row dense>
      <v-col>
        <v-text-field
          v-model="search"
          placeholder="Search"
          density="compact"
          hide-details
          prepend-inner-icon="mdi-magnify"
          clearable />
      </v-col>
      <v-col cols="auto" align-self="center" class="mx-4">
        <v-row dense align="center">
          <v-col cols="auto"
            ><v-switch v-model="labelHeaders" color="primary" hide-details density="compact" inset
          /></v-col>
          <v-col cols="auto">
            <v-tooltip location="bottom">
              <template #activator="{ props }">
                <v-icon v-bind="props" icon="mdi-label" />
              </template>
              <span>Show GM label headers</span>
            </v-tooltip></v-col
          >
        </v-row>
      </v-col>
      <v-col cols="auto">
        <gm-collection-filter
          :items="npcs"
          :filters="filters"
          @add-filter="filters.push($event)"
          @remove-filter="filters.splice(filters.indexOf($event), 1)"
          @set-filters="filters = $event" />
      </v-col>
    </v-row>

    <v-tabs v-model="tab" grow bg-color="primary" class="mt-2">
      <v-tab>NPCS</v-tab>
      <v-tab>DOODADS</v-tab>
      <v-tab>EIDOLONS</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item>
        <v-card>
          <v-data-table
            hover
            fixed-header
            :items="units"
            :headers="unitHeaders"
            item-value="ID"
            items-per-page="50">
            <template #[`item.Select`]="{ item }">
              <v-tooltip location="top">
                <template #activator="{ props }">
                  <v-badge
                    :color="itemCount(item) ? 'primary' : 'transparent'"
                    :content="itemCount(item) || ''">
                    <v-btn
                      v-bind="props"
                      variant="tonal"
                      color="secondary"
                      @click.stop="$emit('select', item)">
                      <v-icon icon="mdi-plus" size="x-large" />
                    </v-btn>
                  </v-badge>
                </template>
                <span>Add to Encounter</span>
              </v-tooltip>
            </template>
            <template #[`item.NpcClassController.Class.Role`]="{ item }">
              <v-tooltip location="top">
                <template #activator="{ props }">
                  <v-icon v-bind="props" :icon="roleIcon(item.NpcClassController.Class.Role)" />
                </template>
                <span>{{ item.NpcClassController.Class.Role }}</span>
              </v-tooltip>
            </template>
            <template #[`item.Tag`]="{ item }">
              <v-tooltip location="top">
                <template #activator="{ props }">
                  <v-icon v-bind="props" :icon="tagIcon(item.Tag)" />
                </template>
                <span>{{ item.Tag }}</span>
              </v-tooltip>
            </template>
            <template #[`item.NpcClassController.Tier`]="{ item }">
              <v-tooltip location="top">
                <template #activator="{ props }">
                  <v-icon v-bind="props" :icon="`cc:npc_tier_${item.NpcClassController.Tier}`" />
                </template>
                <span>Tier {{ item.NpcClassController.Tier }}</span>
              </v-tooltip>
            </template>
            <template #[`item.Templates`]="{ item }">
              {{ item.NpcTemplateController.Templates.map((x) => x.Name).join(', ') }}
            </template>
            <template #[`item.Features`]="{ item }">
              <cc-item-chip
                v-for="f in item.NpcFeatureController.Features"
                :item="f"
                :tier="item.NpcClassController.Tier"
                size="x-small"
                variant="elevated"
                class="ma-1" />
            </template>
            <template #[`item.View`]="{ item }">
              <v-btn
                icon
                @click.stop="view(item, 'UnitEditor')"
                color="accent"
                size="small"
                variant="text">
                <v-icon icon="mdi-magnify" />
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-window-item>
      <v-window-item>
        <v-card>
          <v-data-table
            hover
            fixed-header
            :items="doodads"
            :headers="doodadHeaders"
            item-value="ID"
            items-per-page="50">
            <template #[`item.Select`]="{ item }">
              <v-tooltip location="top">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    variant="tonal"
                    color="secondary"
                    @click.stop="$emit('select', item)">
                    <v-icon icon="mdi-plus" size="x-large" />
                  </v-btn>
                </template>
                <span>Select {{ item.Name }}</span>
              </v-tooltip>
            </template>
            <template #[`item.View`]="{ item }">
              <v-btn
                icon
                @click.stop="view(item, 'DoodadEditor')"
                color="accent"
                size="small"
                variant="text">
                <v-icon icon="mdi-magnify" />
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-window-item>
      <v-window-item>
        <v-card>
          <v-data-table
            hover
            fixed-header
            :items="eidolons"
            :headers="eidolonHeaders"
            item-value="ID"
            items-per-page="50">
            <template #[`item.Select`]="{ item }">
              <v-tooltip location="top">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    variant="tonal"
                    color="secondary"
                    @click.stop="$emit('select', item)">
                    <v-icon icon="mdi-plus" size="x-large" />
                  </v-btn>
                </template>
                <span>Select {{ item.Name }}</span>
              </v-tooltip>
            </template>
            <template #[`item.Layers`]="{ item }">
              <v-chip
                v-for="l in item.Layers"
                size="small"
                label
                prepend-icon="mdi-layers"
                class="mx-1 my-1"
                >{{ l.Layer.Name }}</v-chip
              >
            </template>
            <template #[`item.View`]="{ item }">
              <v-btn
                icon
                @click.stop="view(item, 'EidolonEditor')"
                color="accent"
                size="small"
                variant="text">
                <v-icon icon="mdi-magnify" />
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-window-item>
    </v-window>
  </v-container>
  <v-dialog v-if="selected" v-model="viewDialog">
    <v-card>
      <v-toolbar :title="(selected as any).Name" density="compact">
        <v-spacer />
        <v-btn icon @click="viewDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <component :is="componentType" :item="selected" :readonly="true" />
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { NpcStore } from '@/stores';
import npcTags from '@/assets/npc_tags.json';
import UnitEditor from '@/features/gm/npc_roster/npcs/editor.vue';
import DoodadEditor from '@/features/gm/npc_roster/doodads/editor.vue';
import EidolonEditor from '@/features/gm/npc_roster/eidolons/editor.vue';
import GmCollectionFilter from '@/features/gm/_views/_components/GMCollectionFilter.vue';
import { Npc } from '@/classes/npc/Npc';
import _ from 'lodash';

export default {
  name: 'combatant-selector-table-view',
  components: { UnitEditor, DoodadEditor, EidolonEditor, GmCollectionFilter },
  emits: ['select'],
  props: {
    encounter: { type: Object, required: true },
  },
  data: () => ({
    selected: null,
    viewDialog: false,
    componentType: 'unit',
    itemTypes: ['unit', 'doodad', 'eidolon'],
    tab: 0,
    search: '',
    filters: [] as any[],
    labelHeaders: false,
  }),
  computed: {
    npcs() {
      return NpcStore().Npcs.filter((x) => !x.SaveController.IsDeleted);
    },

    units() {
      return this.filterItems(NpcStore().getUnits);
    },
    doodads() {
      return this.filterItems(NpcStore().getDoodads);
    },
    eidolons() {
      return this.filterItems(NpcStore().getEidolons);
    },
    folders() {
      return NpcStore().getFolders;
    },
    unitHeaders() {
      return this.prepHeaders(
        [
          { title: 'Role', key: 'NpcClassController.Class.Role' },
          { title: 'Tag', key: 'Tag' },
          { title: 'Tier', key: 'NpcClassController.Tier' },
          { title: 'Class', key: 'NpcClassController.Class.Name' },
          {
            title: 'Templates',
            key: 'Templates',
            sortable: false,
            align: 'center',
          },
          { title: 'Features', key: 'Features', sortable: false, align: 'center' },
        ],
        this.units
      );
    },
    doodadHeaders() {
      return this.prepHeaders([], this.doodads);
    },
    eidolonHeaders() {
      return this.prepHeaders(
        [
          { title: 'Tier', key: 'Tier', width: '1px' },
          { title: 'Layers', key: 'Layers' },
          { title: 'Class', key: 'Class', width: '1px' },
        ],
        this.eidolons
      );
    },
    tags() {
      return npcTags;
    },
  },
  methods: {
    addUnit() {
      throw new Error('Method not implemented.');
    },
    prepHeaders(headers: any[], items: any[]) {
      return [
        { key: 'Select', sortable: false, width: '1px' },
        { title: 'Name', key: 'Name' },
        ...headers,
        ...this.getLabels(items),
        { title: 'Folder', key: 'FolderController.Folder', align: 'end' },
        { key: 'View', sortable: false, width: '1px' },
      ];
    },
    getLabels(items: any[]) {
      if (!this.labelHeaders) return [];
      const allLabels = _.uniq(
        items
          .map((x) => x.NarrativeController.Labels)
          .flat()
          .map((x) => x.title)
      );
      return allLabels.map((x) => ({ title: x, key: `NarrativeController.LabelDictionary.${x}` }));
    },
    roleIcon(role: string): string {
      if (!role) return '';
      if (role.toLowerCase() === 'biological') return 'mdi-heart-pulse';
      return `cc:role_${role.toLowerCase()}`;
    },
    tagIcon(t: string) {
      if (!t) return 'mdi-tag-outline';
      const tag = this.tags.find((x) => x.name.toLowerCase() === t.toLowerCase());
      if (!tag) return 'mdi-tag-outline';
      return tag.icon;
    },
    view(item, type) {
      this.selected = item;
      this.componentType = type;
      this.viewDialog = true;
    },
    filterItems(items: Npc[]) {
      let out = items;

      if (this.filters.length) {
        out = out.filter((x: any) => {
          if (x.StatController) {
            const stats = x.StatController.DisplayKeys.map((x: any) => x.title);
            if (this.filters.some((f) => stats.some((s) => s === f))) return false;
          }
          if (x.NarrativeController) {
            const labels = x.NarrativeController.Labels.map((x: any) => x.title);
            if (this.filters.some((f) => labels.some((s) => s === f))) return false;
          }
          return true;
        });
      }
      return out.filter((x) => !x.SaveController.IsDeleted);
    },
    itemCount(item) {
      return this.encounter.Combatants.filter((x) => x.npc.ID === item.ID).length;
    },
  },
};
</script>
