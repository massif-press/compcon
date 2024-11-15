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
              <v-col cols="auto">{{ items.length }} items</v-col>
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
                  :value="selected.length === contentItems.length"
                  hide-details
                  @click="
                    selected.length
                      ? (selected = [])
                      : (selected = contentItems.map((x: any) => x.ID))
                  ">
                  <v-icon
                    size="x-large"
                    :icon="
                      selected.length === contentItems.length
                        ? 'mdi-checkbox-outline'
                        : selected.length > 0
                          ? 'mdi-minus-box-outline'
                          : 'mdi-checkbox-blank-outline'
                    " />
                </v-btn>
              </th>
              <th>Name</th>
              <th>Folder</th>
              <th>GM Labels</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in contentItems">
              <td>
                <v-checkbox v-model="selected" multiple :value="(item as any).ID" hide-details />
              </td>
              <td
                :class="
                  item.SaveController.IsDeleted ? 'text-error text-decoration-line-through' : ''
                ">
                {{ (item as any).Name }}
              </td>
              <th>
                <v-chip
                  v-if="(item as any).FolderController.Folder"
                  size="x-small"
                  label
                  prepend-icon="mdi-folder">
                  {{ (item as any).FolderController.Folder }}
                </v-chip>
              </th>
              <td>
                <cc-split-chip
                  v-for="label in (item as any).NarrativeController.Labels"
                  :label="label"
                  class="mr-1 mb-1" />
              </td>
            </tr>

            <tr v-for="item in missingContentItems">
              <td>
                <cc-missing-content-hover :item="item" />
              </td>
              <td class="text-disabled">
                {{ (item as any).Name }}
              </td>
              <td />
              <td>
                <v-btn
                  size="x-small"
                  color="error"
                  variant="tonal"
                  prepend-icon="mdi-delete"
                  @click="deleteItemPermanent(item)">
                  Delete Non-loadable Item
                </v-btn>
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
          <b class="text-accent">{{ selected.length }}</b>
          selected
        </div>
        <v-list>
          <v-list-item
            title="Set Folder"
            subtitle="Set item folder"
            prepend-icon="mdi-folder"
            :disabled="!selected.length"
            @click="setFolderDialog = true" />
          <v-list-item
            title="Set GM Label"
            subtitle="Add, set, or delete a GM Label"
            prepend-icon="mdi-label"
            :disabled="!selected.length"
            @click="addLabelDialog = true" />
          <v-list-item
            :title="selected.length < 2 ? 'Print' : 'Print Multiple'"
            subtitle="Generate item printables"
            prepend-icon="mdi-printer"
            :disabled="!selected.length"
            @click="routePrint()" />
          <v-list-item
            :title="selected.length < 2 ? 'Export' : 'Export Collection'"
            :subtitle="
              selected.length < 2 ? 'Export item JSON' : 'Generate a multi-item export package'
            "
            prepend-icon="mdi-upload"
            :disabled="!selected.length"
            @click="exportItems()" />
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
          <v-list-item
            v-if="showDeleted && !showDeleteConfirm"
            title="Delete Permanently"
            variant="elevated"
            elevation="0"
            subtitle="Delete these items permanently"
            prepend-icon="mdi-delete-forever-outline"
            base-color="warning"
            :disabled="!selected.length"
            @click="showDeleteConfirm = true" />
          <v-divider v-if="showDeleteConfirm" />
          <v-list-item
            v-if="showDeleteConfirm"
            title="Confirm Permanent Deletion"
            subtitle="This action cannot be undone"
            prepend-icon="mdi-exclamation-thick"
            :disabled="!selected.length"
            @click="deleteItemsPermanent()"
            base-color="error" />
          <v-list-item
            v-if="showDeleteConfirm"
            title="Cancel Permanent Deletion"
            prepend-icon="mdi-cancel"
            @click="showDeleteConfirm = false"
            base-color="accent" />
        </v-list>
      </v-col>
    </v-row>
  </v-card-text>
  <v-dialog v-model="setFolderDialog" max-width="500px">
    <v-card>
      <v-toolbar density="compact">
        <v-toolbar-title>Set Folder</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="setFolderDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-combobox
          v-model="stagedFolderName"
          :items="allFolders"
          label="Folder"
          outlined
          dense
          clearable
          hide-details />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn variant="text" @click="setFolderDialog = false">Cancel</v-btn>
        <v-spacer />
        <v-btn variant="text" @click="setFolder" color="accent">Set</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="addLabelDialog" max-width="500px">
    <v-card>
      <v-toolbar density="compact">
        <v-toolbar-title>Set Label</v-toolbar-title>
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
              This will add
              <b>or overwrite</b>
              the label value for all selected items.
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
              This will
              <b>delete</b>
              the label value for all selected items.
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
        <v-btn variant="text" @click="addLabelDialog = false">Cancel</v-btn>
        <v-spacer />
        <v-btn
          variant="tonal"
          :color="labelTab === 'set' ? 'accent' : 'error'"
          :disabled="!addKvp.key"
          @click="setData('label', labelTab)">
          {{ labelTab }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { IStatContainer } from '@/classes/components/combat/stats/IStatContainer';
import _ from 'lodash';
import { NarrativeStore } from '../store/narrative_store';
import { NpcStore } from '../store/npc_store';
import exportAsJson from '@/util/jsonExport';
import { EncounterStore } from '@/stores';
import { DeleteItemPermanent, GenerateExportCollection } from '@/io/Importer';

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
    statTab: 'set' as 'set' | 'delete',
    addLabelDialog: false,
    labelTab: 'set' as 'set' | 'delete',
    printDialog: false,
    deleteDialog: false,
    shownTypes: [] as string[],
    allTypes: [] as string[],
    showDeleted: false,
    setFolderDialog: false,
    stagedFolderName: '',
    showDeleteConfirm: false,
  }),
  mounted: function () {
    if (this.type === 'npc') {
      this.allTypes = ['unit', 'doodad', 'eidolon'];
    } else if (this.type === 'narrative') {
      this.allTypes = ['character', 'location', 'faction'];
    } else if (this.type === 'encounter') {
      this.allTypes = ['encounter'];
    }

    this.shownTypes = this.allTypes;
  },
  computed: {
    items() {
      let items = [] as any[];
      if (this.type === 'npc')
        items = NpcStore().Npcs.filter(
          (x: any) =>
            this.shownTypes.includes(x.ItemType.toLowerCase()) &&
            (this.showDeleted || !x.SaveController.IsDeleted)
        );
      else if (this.type === 'narrative')
        items = NarrativeStore().CollectionItems.filter(
          (x: any) =>
            this.shownTypes.includes(x.ItemType.toLowerCase()) &&
            (this.showDeleted || !x.SaveController.IsDeleted)
        );
      else if (this.type === 'encounter')
        items = EncounterStore().Encounters.filter(
          (x: any) =>
            this.shownTypes.includes(x.ItemType.toLowerCase()) &&
            (this.showDeleted || !x.SaveController.IsDeleted)
        );

      items = items.sort((a: any, b: any) => a.Name.localeCompare(b.Name));

      return items;
    },
    contentItems() {
      return this.items.filter((x: any) => !x.BrewController || !x.BrewController.IsUnableToLoad);
    },
    missingContentItems() {
      return this.items.filter((x: any) => x.BrewController && x.BrewController.IsUnableToLoad);
    },
    allFolders() {
      return NpcStore().getFolders.concat(NarrativeStore().getFolders);
    },
    allLabels() {
      return NarrativeStore().getAllLabels;
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
      this.addLabelDialog = this.setFolderDialog = false;
      NarrativeStore().SaveItemData();
      NpcStore().SaveNpcData();
    },
    setFolder() {
      this.selected.forEach((id) => {
        const item = this.items.find((x: any) => x.ID === id) as any;
        if (item) {
          item.FolderController.Folder = this.stagedFolderName;
        }
      });
      this.stagedFolderName = '';
      this.setFolderDialog = false;
      NarrativeStore().SaveItemData();
      NpcStore().SaveNpcData();
    },
    exportItems() {
      const json = GenerateExportCollection(
        this.selected.map((x) => this.items.find((y) => y.ID === x)),
        this.type
      );

      let filename =
        this.selected.length === 1
          ? this.items.find((x: any) => x.ID === this.selected[0]).Name
          : `GM_export_${new Date().toLocaleDateString().replaceAll('/', '-')}.json`;

      exportAsJson(json, filename);
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
      EncounterStore().SaveEncounterData();
    },
    async deleteItemsPermanent() {
      const promises = [] as Promise<any>[];
      this.selected.forEach((id) => {
        promises.push(this.deleteItemPermanent(this.items.find((x: any) => x.ID === id)));
      });
      await Promise.all(promises);

      this.selected = [];
      this.showDeleteConfirm = false;
    },
    async deleteItemPermanent(item: any) {
      await DeleteItemPermanent(item);
    },
    routePrint() {
      if (this.type === 'narrative')
        this.$router.push(`/gm/print/narrative/${JSON.stringify(this.selected)}`);
      else this.$router.push(`/gm/print/${JSON.stringify(this.selected)}`);
    },
  },
};
</script>
