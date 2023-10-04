<template>
  <v-card>
    <v-row>
      <v-col cols="3" style="max-width: 325px !important">
        <v-list v-model="selectedLcp" density="compact" nav class="side-fixed" color="panel">
          <v-btn-toggle
            v-model="view"
            mandatory
            divided
            variant="plain"
            border
            color="primary"
            density="compact"
            style="width: 100%"
            class="mb-2"
          >
            <v-btn value="list" icon size="small" style="width: 33%"
              ><v-icon size="25" icon="mdi-view-list"
            /></v-btn>
            <v-btn value="table" icon size="small" style="width: 33%"
              ><v-icon size="25" icon="mdi-table"
            /></v-btn>
            <v-btn value="cards" icon size="small" style="width: 33%"
              ><v-icon size="25" icon="mdi-card-multiple-outline"
            /></v-btn>
          </v-btn-toggle>
          <v-select
            v-model="filter"
            :items="lcps"
            prepend-icon="mdi-filter"
            density="compact"
            hide-details
            variant="outlined"
            chips
            multiple
          >
            <template v-slot:prepend-item>
              <v-list-item title="Select All">
                <template v-slot:prepend>
                  <v-checkbox-btn />
                </template>
              </v-list-item>
              <v-divider />
            </template>
          </v-select>
          <v-divider class="mt-2" />

          <v-list-item
            :value="'all'"
            :active="selectedLcp === 'all'"
            color="accent"
            :subtitle="`&emsp;${items.length - hiddenItems.length} (${items.length}) ITEMS`"
            selectable
            class="pt-0"
            @click="selectedLcp = 'all'"
          >
            <template #title>
              <span class="text-button">
                <b>All Items</b>
              </span>
            </template>
          </v-list-item>
          <v-divider />

          <v-list-subheader class="mb-n2 ml-n2">// ACTIVE CONTENT PACKS</v-list-subheader>

          <v-list-group
            v-for="lcp in lcps"
            fluid
            :value="lcp"
            color="accent"
            selectable
            class="pt-0"
            @click="selectedLcp = lcp"
          >
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                :subtitle="`&emsp;${itemsByLcp[lcp].length - hiddenItemsByLcp(lcp).length} (${
                  itemsByLcp[lcp].length
                }) ITEMS`"
              >
                <template #title>
                  <span class="text-button">
                    <b>{{ lcp }}</b>
                  </span>
                </template></v-list-item
              >
            </template>

            <!-- TODO: subgroup by license -->

            <v-list-item
              v-for="item in itemsByLcp[lcp]"
              @click="scrollTo((item as CompendiumItem).ID)"
            >
              <template #title>
                <v-icon start class="ml-3" :icon="(item as CompendiumItem).Icon" />
                <span class="text-button">
                  {{ (item as CompendiumItem).Name }}
                </span>
              </template>
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-col>

      <v-col class="pl-6 pr-8">
        <v-container id="content" style="height: calc(100vh - 35px) !important; overflow-y: scroll">
          <v-alert
            v-show="!!$slots.header"
            variant="outlined"
            class="mt-n2 mb-3 py-1"
            style="border-color: rgb(var(--v-theme-primary))"
          >
            <slot name="header"> </slot>
          </v-alert>
          <v-row dense align="center" justify="space-between" class="mt-n2">
            <v-col cols="6">
              <v-text-field
                v-model="search"
                item-title="Name"
                prepend-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
                clearable
              />
            </v-col>

            <v-col cols="auto">
              <v-switch
                v-model="ignoreLimit"
                density="compact"
                hide-details
                class="ma-0 pa-0"
                color="accent"
                label="Ignore Restrictions"
              />
              <div class="text-caption text-disabled text-right">
                {{ activeHiddenItems.length }} HIDDEN ITEMS
              </div>
            </v-col>
          </v-row>
          <v-divider class="mt-1 mb-3" />
          <v-row v-if="view === 'list'">
            <v-col v-for="item in shownItems" :id="(item as CompendiumItem).ID" cols="12">
              <selector-list-item
                :item="(item as CompendiumItem)"
                :equipped="equipped"
                @equip="$emit('equip', $event)"
              />
            </v-col>
          </v-row>
          <selector-table
            v-else-if="view === 'table'"
            :headers="tableHeaders"
            :items="shownItems"
            :equipped="equipped"
            @equip="$emit('equip', $event)"
          />
          <v-row v-else-if="view === 'cards'">
            <selector-card-item
              v-for="item in shownItems"
              :item="(item as CompendiumItem)"
              :equipped="equipped"
              @equip="$emit('equip', $event)"
            />
          </v-row>
          <div style="height: 30px" />
        </v-container>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import _ from 'lodash';
import SelectorListItem from './components/_selectorListItem.vue';
import SelectorCardItem from './components/_selectorCardItem.vue';
import SelectorTable from './components/_selectorTable.vue';
import { CompendiumItem } from '@/class';

export default {
  name: 'cc-selector',
  components: { SelectorListItem, SelectorCardItem, SelectorTable },
  emits: ['equip'],
  props: {
    items: {
      type: Array,
      required: true,
    },
    hiddenItems: {
      type: Array,
      default: () => [],
    },
    itemType: {
      type: String,
      required: true,
    },
    equipped: {
      type: Object,
      required: false,
      default: null,
    },
    tableHeaders: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    search: '',
    view: 'list',
    featureSet: 'all',
    ignoreLimit: false,
    allowDupes: false,
    filter: [] as string[],
    selectedLcp: 'all',
  }),
  mounted() {
    this.filter = this.lcps;
  },
  computed: {
    itemsByLcp() {
      return _.groupBy(this.items, 'LcpName');
    },
    lcps() {
      return Object.keys(this.itemsByLcp);
    },
    availableItems() {
      if (this.selectedLcp === 'all') {
        return this.items;
      }
      return this.itemsByLcp[this.selectedLcp];
    },
    shownItems() {
      let shown = this.availableItems.filter((i: any) => !this.hiddenItems.includes(i.ID));
      if (this.search) {
        shown = shown.filter((i: any) => i.Name.toLowerCase().includes(this.search.toLowerCase()));
      }
      return shown;
    },
    activeHiddenItems() {
      let hidden = this.hiddenItemsByLcp(this.selectedLcp);

      if (this.search) {
        hidden = hidden.concat(
          this.availableItems
            .filter((i: any) => !this.hiddenItems.includes(i.ID))
            .filter((i: any) => !i.Name.toLowerCase().includes(this.search.toLowerCase()))
        );
      }
      return hidden;
    },
  },
  methods: {
    hiddenItemsByLcp(lcp: string) {
      if (lcp === 'all') {
        return this.items.filter((i: any) => this.hiddenItems.includes(i.ID));
      }
      return this.itemsByLcp[lcp].filter((i: any) => this.hiddenItems.includes(i.ID));
    },
    scrollTo(id: string): void {
      const el = document.getElementById(id);

      if (el) {
        const yOffset = -70;
        const mEl = document.getElementById('content');
        if (!mEl) return;
        const y = el.getBoundingClientRect().top + mEl.scrollTop + yOffset;
        mEl.scrollTo({ top: y, behavior: 'smooth' });
      }
    },
  },
};
</script>

<style scoped>
.side-fixed {
  height: calc(100vh - 64px);
  overflow-y: scroll;
  top: 64px;
  bottom: 0;
  /* padding-bottom: 35px; */
  position: fixed;
  width: 23vw;
  max-width: 325px !important;
}
</style>
