<template>
  <div class="text-caption my-1">TEMPLATES</div>
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
    <v-col cols="auto" :class="item.NpcTemplateController.Templates.length ? 'ml-auto' : ''">
      <v-btn color="accent" variant="tonal" @click="dialog = true"
        >{{ item.NpcTemplateController.Templates.length ? 'Edit' : 'Assign' }} NPC Templates</v-btn
      >
    </v-col>
  </v-row>

  <v-dialog v-model="dialog">
    <v-card>
      <v-toolbar density="compact" color="primary">
        <v-toolbar-title class="heading">SELECT TEMPLATE</v-toolbar-title>
        <v-spacer />
        <v-btn icon color="white" @click="dialog = false"><v-icon large>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-card-text v-if="!templates.length" class="mt-n4">
        <v-container>
          <div style="min-height: 20vh; width: 700px; margin: auto" class="py-4">
            <div class="heading h2 mb-2 text-center pb-4">No NPC Template data found!</div>

            NPC data are included with the paid version of the LANCER Core Book and are therefore
            not included with COMP/CON by default. You can find NPC Class, Template, and Feature
            data as additional downloadable content on the
            <a href="https://massif-press.itch.io/corebook-pdf" target="_blank"
              >LANCER: Core Book itch.io page</a
            >.<br /><br />
            If you have already downloaded the NPC data, you can import it into COMP/CON via the
            Content Manager available on the Main Menu or in the Options menu on the right side of
            the nav bar.
            <br />
            <br />
            If you purchased a physical copy of the LANCER Core Book, but have not received
            instructions on how to redeem your copy of the digital version and its associated
            assets, including core NPC data, please contact Massif Press at
            <a href="mailto:massifpress@gmail.com">massifpress@gmail.com</a>.
          </div>
        </v-container>
      </v-card-text>
      <panel-view v-else ref="view">
        <template #title>
          <v-row density="compact" align="center" class="mt-n8 mb-n6">
            <v-col cols="4" class="my-3">
              <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                density="compact"
                hide-details
                variant="outlined"
                clearable />
            </v-col>
            <v-col>
              <v-btn
                v-if="isAssigned(selected)"
                large
                block
                variant="tonal"
                color="error"
                @click="item.NpcTemplateController.RemoveTemplate(selected)">
                <v-icon start>mdi-minus</v-icon>
                Remove Template
              </v-btn>

              <v-btn v-else-if="templateConflict(selected).length" large block disabled>
                <v-icon start icon="mdi-cancel" />
                Cannot assign (conflicts with {{ templateConflict(selected) }})
              </v-btn>

              <v-btn
                v-else
                large
                block
                variant="tonal"
                color="secondary"
                @click="item.NpcTemplateController.AddTemplate(selected)">
                <v-icon start>mdi-plus</v-icon>
                Assign Template
              </v-btn>
            </v-col>
          </v-row>
        </template>
        <template #left>
          <v-list style="width: 100%; overflow-y: scroll" class="bg-transparent mt-n5">
            <v-list-item
              v-for="item in templates"
              color="accent"
              :class="isAssigned(item) ? 'bg-primary rounded-sm' : ''"
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
          <v-container v-if="selected">
            <v-row dense align="center" class="mt-n8">
              <v-col cols="auto">
                <span class="heading mech">
                  {{ selected.Name }}
                </span>
              </v-col>
              <v-col v-if="selected.InLcp" class="ml-auto">
                <div class="heading h3 text-text">
                  {{ selected.LcpName }}
                </div>
              </v-col>
            </v-row>
            <cc-item-card :item="selected" />
          </v-container>
          <v-row v-else align="center" justify="center" style="width: 100%; height: 100%">
            <v-col cols="auto">
              <span class="heading h1 text-disabled text--lighten-2">select npc template</span>
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
  name: 'npc-template-selector',
  components: { PanelView },
  props: {
    item: { type: Object, required: true },
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
  },
};
</script>
