<template>
  <v-card-text>
    <v-row>
      <v-col>
        <v-row align="center" dense>
          <v-col><v-divider /></v-col>
          <v-col cols="auto">{{ items.length }} items</v-col>
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
              <th>Callsign</th>
              <th>License Level</th>
              <th>Group</th>
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
              <th>
                {{ item.Callsign }}
              </th>
              <th>
                {{ item.Level }}
              </th>
              <th>
                <v-chip size="small" label prepend-icon="mdi-account-group">
                  {{ getPilotGroup(item) }}
                </v-chip>
              </th>
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
            title="Set Group"
            subtitle="Set pilot group"
            prepend-icon="mdi-account-group"
            :disabled="!selected.length"
            @click="setGroupDialog = true" />
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
  <v-dialog v-model="setGroupDialog" max-width="500px">
    <v-card>
      <v-toolbar density="compact">
        <v-toolbar-title>Set Group</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="setGroupDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-select
          v-model="stagedGroup"
          :items="allGroups"
          label="Pilot Group"
          item-title="Name"
          return-object
          variant="outlined"
          density="compact"
          clearable
          hide-details />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn variant="text" @click="setGroupDialog = false">Cancel</v-btn>
        <v-spacer />
        <v-btn variant="text" @click="setGroup" color="accent">Set</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import _ from 'lodash';
import { PilotStore } from '../../store';
import exportAsJson from '@/util/jsonExport';
import { PilotGroup } from '../../store/PilotGroup';

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
    printDialog: false,
    deleteDialog: false,
    showDeleted: false,
    setGroupDialog: false,
    stagedGroup: null,
    showDeleteConfirm: false,
  }),
  computed: {
    items() {
      return PilotStore().Pilots.filter(
        (x: any) => this.showDeleted || !x.SaveController.IsDeleted
      );
    },
    allGroups() {
      return PilotStore().PilotGroups;
    },
  },
  methods: {
    setGroup() {
      this.selected.forEach((id) => {
        const item = this.items.find((x: any) => x.ID === id) as any;
        if (item && this.stagedGroup) {
          PilotStore().TransferPilot(item, (this.stagedGroup as PilotGroup).ID);
        }
      });
      this.stagedGroup = null;
      this.setGroupDialog = false;
      PilotStore().SaveGroupData();
      PilotStore().SavePilotData();
    },
    exportItems() {
      let json = {} as any;
      let filename = '';
      if (this.selected.length === 1) {
        const item = this.items.find((x: any) => x.ID === this.selected[0]);
        if (item) {
          json = (item as any).Serialize();
          filename = (item as any).Name + '.json';
        }
      } else {
        const data = this.items.filter((x: any) => this.selected.includes(x.ID));
        json = {
          type: `pilot_collection`,
          item_count: data.length,
          data: data.map((x: any) => x.Serialize()),
        };
        filename = `roster_export_${new Date().toLocaleDateString().replaceAll('/', '-')}.json`;
      }

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
      PilotStore().SavePilotData();
      PilotStore().SaveGroupData();
    },
    async deleteItemsPermanent() {
      const promises = [] as Promise<any>[];
      this.selected.forEach((id) => {
        const item = this.items.find((x: any) => x.ID === id) as any;
        if (item && item.SaveController.IsDeleted) {
          promises.push(PilotStore().DeletePilotPermanent(item));
        }
      });
      await Promise.all(promises);

      this.selected = [];
      this.showDeleteConfirm = false;
    },
    getPilotGroup(item: any) {
      const group = PilotStore().PilotGroups.find((x) => x.Pilots.some((y) => y.id === item.ID));
      return group ? group.Name : 'None';
    },
  },
};
</script>
