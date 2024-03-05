<template>
  <v-dialog v-model="dialog">
    <v-card style="overflow-y: hidden">
      <v-toolbar density="compact" color="primary">
        <v-toolbar-title class="heading">SELECT LAYER</v-toolbar-title>
        <v-spacer />
        <v-btn icon color="white" @click="dialog = false"><v-icon large>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-card-text v-if="!hasLayerData" class="mt-n4">
        <v-container>
          <div style="min-height: 20vh; width: 700px; margin: auto" class="py-4">
            <div class="heading h2 mb-2 text-center pb-4">No Eidolon data found!</div>

            Eidolon data are included with the No Room for a Wallflower Campaign Book and are
            therefore not included with COMP/CON by default. You can find Eidolon data as additional
            downloadable content on the
            <a href="https://massif-press.itch.io/no-room-for-a-wallflower-act-1"
              >No Room for a Wallflower</a
            >
            Campaign Book page.<br /><br />
            If you have already downloaded the Eidolon data, you can import it into COMP/CON via the
            Content Manager available on the Main Menu or in the Options menu on the right side of
            the nav bar.
          </div>
        </v-container>
      </v-card-text>
      <panel-view v-else ref="view">
        <template #title>
          <v-row density="compact" align="center" class="mt-n8 mb-n6">
            <v-col cols="2" class="my-3">
              <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                density="compact"
                hide-details
                variant="outlined"
                clearable />
            </v-col>
            <v-col cols="2">
              <v-switch
                density="compact"
                hide-details
                v-model="allowDupes"
                label="Allow Duplicates" />
            </v-col>
            <v-col>
              <v-btn
                large
                block
                color="secondary-darken-1"
                :disabled="!selected"
                @click="AddLayer()">
                <v-icon start>mdi-edit</v-icon>
                <span v-if="selected">Add {{ selected.Name }} Layer</span>
                <span v-else>Select Eidolon Layer</span>
              </v-btn>
            </v-col>
          </v-row>
        </template>
        <template #left>
          <v-list
            style="width: 100%; overflow-y: scroll"
            lines="two"
            density="compact"
            class="bg-transparent mt-n5">
            <v-list-item
              v-for="item in layers"
              color="accent"
              :value="item"
              @click="selected = item">
              <template #title>
                <v-scroll-x-transition leave-absolute>
                  <v-icon v-if="selected === item" start>mdi-chevron-triple-right</v-icon>
                </v-scroll-x-transition>
                <span class="heading"> {{ item.Name }} </span>
              </template>
            </v-list-item>
          </v-list>
        </template>
        <template #right>
          <div v-if="selected">
            <v-row dense align="center" class="mt-n6 mb-n3">
              <v-col>
                <span class="heading mech">
                  {{ selected.Name }}
                </span>
              </v-col>
              <v-col v-if="selected.InLcp" cols="auto">
                <div class="heading h3 text-text">
                  {{ selected.LcpName }}
                </div>
              </v-col>
            </v-row>
            <cc-item-card :item="selected" />
          </div>

          <v-row v-else align="center" justify="center" style="width: 100%; height: 100%">
            <v-col cols="auto">
              <span class="heading h1 text-disabled text--lighten-2">select eidolon layer</span>
            </v-col>
          </v-row>
        </template>
      </panel-view>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import PanelView from '../../../_components/PanelView.vue';

export default {
  name: 'npc-class-selector',
  props: {
    item: { type: Object, required: true },
  },
  components: { PanelView },
  data: () => ({
    dialog: false,
    selected: null as any,
    search: '',
    grouping: null,
    allowDupes: false,
  }),
  watch: {
    selectedLayer() {
      (this.$refs.view as any).resetScroll();
    },
  },
  emits: ['add-layer'],
  computed: {
    hasLayerData() {
      return CompendiumStore().EidolonLayers.length > 0;
    },
    layers() {
      const layers = this.allowDupes
        ? CompendiumStore().EidolonLayers
        : CompendiumStore().EidolonLayers.filter(
            (x) => !this.item.Layers.some((y) => x.ID === y.ID)
          );

      if (this.search) {
        return layers.filter((x) => x.Name.toLowerCase().includes(this.search.toLowerCase()));
      }
      return layers;
    },
  },
  methods: {
    show() {
      this.dialog = true;
    },
    AddLayer() {
      this.item.AddLayer(this.selected.ID);
      this.$emit('add-layer');
      this.dialog = false;
    },
  },
};
</script>
