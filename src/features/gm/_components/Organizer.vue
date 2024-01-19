<template>
  <v-card-text>
    <v-row>
      <v-col>
        <v-row>
          <v-col>
            <v-row align="center" dense>
              <v-col cols="1"><v-divider /></v-col>
              <v-col cols="auto">
                <div class="heading h3">
                  <v-btn-toggle v-model="shownTypes" density="compact" multiple>
                    <v-btn v-for="t in allTypes" size="small" :value="t">{{ t }}</v-btn>
                  </v-btn-toggle>
                </div>
              </v-col>
              <v-col><v-divider /></v-col>
              <v-col cols="auto"> {{ items.length }} items </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-table>
          <thead class="heading">
            <tr>
              <th width="1px">
                <v-btn
                  icon
                  flat
                  size="small"
                  :value="selected.length === items.length"
                  hide-details
                  @click="
                    selected.length ? (selected = []) : (selected = items.map((x: any) => x.ID))
                  ">
                  <v-icon
                    size="x-large"
                    :icon="
                      selected.length === items.length
                        ? 'mdi-checkbox-outline'
                        : selected.length > 0
                          ? 'mdi-minus-box-outline'
                          : 'mdi-checkbox-blank-outline'
                    " />
                </v-btn>
              </th>
              <th>Name</th>
              <th v-if="items.length && (items[0] as any).StatController" width="35%">Stats</th>
              <th>GM Labels</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items">
              <td>
                <v-checkbox v-model="selected" multiple :value="(item as any).ID" hide-details />
              </td>
              <td
                :class="
                  item.SaveController.IsDeleted ? 'text-error text-decoration-line-through' : ''
                ">
                {{ (item as any).Name }}
              </td>
              <th v-if="(item as any).StatController">
                <cc-split-chip
                  v-for="label in (item as IStatContainer).StatController.DisplayKeys"
                  :label="{
                    title: label.title,
                    value: (item as IStatContainer).StatController.MaxStats[label.key],
                  }"
                  class="mr-1 mb-1" />
              </th>
              <td>
                <cc-split-chip
                  v-for="label in (item as any).NarrativeController.Labels"
                  :label="label"
                  class="mr-1 mb-1" />
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-row dense justify="end">
          <v-col cols="auto">
            <v-checkbox density="compact" label="Show Deleted" v-model="showDeleted" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="auto" style="width: 350px">
        <div>
          <b class="text-accent">{{ selected.length }}</b> selected
        </div>
        <v-list>
          <v-list-item
            title="Set Stat"
            subtitle="Add, set, or delete a stat value"
            prepend-icon="mdi-plus"
            :disabled="!selected.length"
            @click="addStatDialog = true" />
          <v-list-item
            title="Set GM Label"
            subtitle="Add, set, or delete a GM Label"
            prepend-icon="mdi-plus"
            :disabled="!selected.length"
            @click="addLabelDialog = true" />
          <v-list-item
            :title="selected.length < 2 ? 'Print' : 'Print Multiple'"
            subtitle="Generate item printables"
            prepend-icon="mdi-printer"
            :disabled="!selected.length"
            @click="printDialog = true" />
          <v-list-item
            :title="selected.length < 2 ? 'Export' : 'Export Collection'"
            :subtitle="
              selected.length < 2 ? 'Export item JSON' : 'Generate a multi-item export package'
            "
            prepend-icon="mdi-upload"
            :disabled="!selected.length"
            @click="exportAsJson()" />
          <v-list-item
            :title="selected.length < 2 ? 'Delete' : 'Delete Multiple'"
            :subtitle="
              selected.length < 2 ? 'Mark item as Deleted' : 'Mark multiple items as Deleted'
            "
            prepend-icon="mdi-delete"
            :disabled="!selected.length"
            @click="deleteItems()" />
          <v-list-item
            v-if="showDeleted"
            :title="selected.length < 2 ? 'Restore' : 'Restore Multiple'"
            :subtitle="
              selected.length < 2
                ? 'Remove Deleted status from item'
                : 'Remove Deleted status from items'
            "
            prepend-icon="mdi-file-restore-outline"
            :disabled="!selected.length"
            @click="deleteItems(true)" />
        </v-list>
      </v-col>
    </v-row>
  </v-card-text>
  <v-dialog v-model="addStatDialog" max-width="500px">
    <v-card>
      <v-toolbar density="compact"
        ><v-toolbar-title>Set Stat</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="addStatDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-tabs v-model="statTab" grow density="compact">
        <v-tab value="set">Set</v-tab>
        <v-tab value="delete">Delete</v-tab>
      </v-tabs>
      <v-card-text>
        <v-window v-model="statTab">
          <v-window-item value="set">
            <div class="text-caption">
              This will add <b>or overwrite</b> the stat value for all selected items.
            </div>
            <v-row class="mt-2">
              <v-col>
                <v-select
                  v-model="addKvp.key"
                  :items="allStats"
                  item-text="title"
                  item-value="key"
                  label="Stat"
                  :rules="[(v) => !!v || 'required']" />
              </v-col>
              <v-col>
                <v-text-field
                  v-model="addKvp.value"
                  label="Value"
                  type="number"
                  :rules="[(v) => !!v || 'required']" />
              </v-col>
            </v-row>
          </v-window-item>
          <v-window-item value="delete">
            <div class="text-caption">
              This will <b>delete</b> the stat value for all selected items.
            </div>
            <v-row class="mt-2">
              <v-col>
                <v-select
                  v-model="addKvp.key"
                  :items="selectedStats"
                  item-text="title"
                  item-value="key"
                  label="Stat"
                  :rules="[(v) => !!v || 'required']" />
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn text @click="addStatDialog = false">Cancel</v-btn>
        <v-spacer />
        <v-btn
          variant="tonal"
          :color="statTab === 'set' ? 'accent' : 'error'"
          :disabled="!addKvp.key || !addKvp.value"
          @click="setData('stat', statTab)"
          >{{ statTab }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="addLabelDialog" max-width="500px">
    <v-card>
      <v-toolbar density="compact"
        ><v-toolbar-title>Set Label</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="addLabelDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-tabs v-model="labelTab" grow density="compact">
        <v-tab value="set">Set</v-tab>
        <v-tab value="delete">Delete</v-tab>
      </v-tabs>
      <v-card-text>
        <v-window v-model="labelTab">
          <v-window-item value="set">
            <div class="text-caption">
              This will add <b>or overwrite</b> the label value for all selected items.
            </div>
            <v-row class="mt-2">
              <v-col>
                <v-combobox
                  v-model="addKvp.key"
                  :items="allLabels"
                  item-text="title"
                  item-value="key"
                  label="Label"
                  :rules="[(v) => !!v || 'required']" />
              </v-col>
              <v-col>
                <v-text-field v-model="addKvp.value" label="Value" type="number" />
              </v-col>
            </v-row>
          </v-window-item>
          <v-window-item value="delete">
            <div class="text-caption">
              This will <b>delete</b> the label value for all selected items.
            </div>
            <v-row class="mt-2">
              <v-col>
                <v-select
                  v-model="addKvp.key"
                  :items="selectedLabels"
                  item-text="title"
                  item-value="key"
                  label="Label"
                  :rules="[(v) => !!v || 'required']" />
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn text @click="addLabelDialog = false">Cancel</v-btn>
        <v-spacer />
        <v-btn
          variant="tonal"
          :color="labelTab === 'set' ? 'accent' : 'error'"
          :disabled="!addKvp.key"
          @click="setData('label', labelTab)"
          >{{ labelTab }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { IStatContainer } from '@/classes/components/combat/stats/IStatContainer';
import { StatController } from '@/classes/components/combat/stats/StatController';
import _ from 'lodash';
import { NarrativeStore } from '../store/narrative_store';
import { NpcStore } from '../store/npc_store';

export default {
  name: 'Organizer',
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    selected: [] as any[],
    addKvp: {
      key: '',
      value: '',
    },
    addStatDialog: false,
    statTab: 'set' as 'set' | 'delete',
    addLabelDialog: false,
    labelTab: 'set' as 'set' | 'delete',
    printDialog: false,
    deleteDialog: false,
    shownTypes: [] as string[],
    allTypes: [] as string[],
    showDeleted: false,
  }),
  mounted: function () {
    this.allTypes =
      this.type === 'npc' ? ['unit', 'doodad', 'eidolon'] : ['character', 'location', 'faction'];
    this.shownTypes = this.allTypes;
  },
  computed: {
    items() {
      if (this.type === 'npc')
        return NpcStore().Npcs.filter(
          (x: any) =>
            this.shownTypes.includes(x.ItemType.toLowerCase()) &&
            (this.showDeleted || !x.SaveController.IsDeleted)
        );

      return NarrativeStore().CollectionItems.filter(
        (x: any) =>
          this.shownTypes.includes(x.ItemType.toLowerCase()) &&
          (this.showDeleted || !x.SaveController.IsDeleted)
      );
    },
    allStats() {
      return StatController.CoreStats;
    },
    allLabels() {
      return NarrativeStore().getAllLabels;
    },
    selectedStats() {
      return this.getSelectedData('stat');
    },
    selectedLabels() {
      return this.getSelectedData('label');
    },
  },
  methods: {
    getSelectedData(prop: 'stat' | 'label') {
      return _.uniqBy(
        this.items
          .filter((x: any) => this.selected.includes(x.ID))
          .flatMap((x: any) => {
            if (prop === 'stat') return (x as IStatContainer).StatController.DisplayKeys;
            if (prop === 'label') return (x as any).NarrativeController.Labels;
          }),
        prop === 'stat' ? 'key' : 'title'
      );
    },
    setData(prop: 'stat' | 'label', op: 'set' | 'delete') {
      this.selected.forEach((id) => {
        const item = this.items.find((x: any) => x.ID === id) as any;
        if (item) {
          if (prop === 'stat') {
            if (op === 'set') {
              item.StatController.setMax(this.addKvp.key, this.addKvp.value);
            }
            if (op === 'delete') {
              item.StatController.RemoveStat(this.addKvp.key);
            }
          }
          if (prop === 'label') {
            if (op === 'set') {
              item.NarrativeController.Labels.push({
                title: this.addKvp.key,
                value: this.addKvp.value,
              });
            }
            if (op === 'delete') {
              item.NarrativeController.Labels = item.NarrativeController.Labels.filter(
                (x: any) => x.title !== this.addKvp.key
              );
            }
          }
        }
      });
      this.addKvp = {
        key: '',
        value: '',
      };
      this.addLabelDialog = this.addStatDialog = false;
      NarrativeStore().SaveItemData();
      NpcStore().SaveNpcData();
    },
    exportAsJson() {
      let json = '';
      let filename = '';
      if (this.selected.length === 1) {
        const item = this.items.find((x: any) => x.ID === this.selected[0]);
        if (item) {
          json = JSON.stringify((item as any).Serialize());
          filename = (item as any).Name + '.json';
        }
      } else {
        const data = this.items.filter((x: any) => this.selected.includes(x.ID));
        json = JSON.stringify({
          type: 'collection',
          item_count: data.length,
          data: data.map((x: any) => x.Serialize()),
        });
        filename = `GM_export_${new Date().toLocaleDateString().replaceAll('/', '-')}.json`;
      }
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
    },
    deleteItems(undelete: boolean = false) {
      this.selected.forEach((id) => {
        const item = this.items.find((x: any) => x.ID === id) as any;
        if (item) {
          if (undelete) item.SaveController.Restore();
          else item.SaveController.Delete();
        }
      });
      this.selected = [];
      NarrativeStore().SaveItemData();
      NpcStore().SaveNpcData();
    },
  },
};
</script>
