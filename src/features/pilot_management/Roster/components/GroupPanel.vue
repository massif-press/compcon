<template>
  <div style="position: relative" class="top-element">
    <div class="light bg-primary" />
    <v-toolbar
      density="compact"
      class="mt-2 px-4 title-hover"
      height="48"
      style="position: relative; clip-path: polygon(16px 0, 100% 0, 100% 100%, 0 100%, 0 16px)"
      @click="setGroupExpand()">
      <v-avatar v-if="group.PortraitController.HasImage" size="36px" class="mr-2">
        <cc-img :src="group.Portrait" />
      </v-avatar>
      <v-menu location="left">
        <template v-slot:activator="{ props }">
          <v-icon
            v-bind="props"
            @click.stop
            icon="mdi-queue-first-in-last-out"
            start
            size="small"
            class="fade-select" />
        </template>
        <div
          class="bg-panel pa-1"
          style="display: grid; border: 1px solid rgb(var(--v-theme-primary)); border-radius: 4px">
          <v-btn icon size="x-small" color="primary" class="my-1" @click="move('top')">
            <v-icon size="large" icon="mdi-arrow-collapse-up" />
          </v-btn>
          <v-btn icon size="x-small" color="primary" class="my-1" @click="move('up')">
            <v-icon size="large" icon="mdi-arrow-up" />
          </v-btn>
          <v-btn icon size="x-small" color="primary" class="my-1" @click="move('down')">
            <v-icon size="large" icon="mdi-arrow-down" />
          </v-btn>
          <v-btn icon size="x-small" color="primary" class="my-1" @click="move('bottom')">
            <v-icon size="large" icon="mdi-arrow-collapse-down" />
          </v-btn>
        </div>
      </v-menu>
      <span class="heading h3">{{ group.Name }}</span>
      <span class="pl-4 text-caption">
        ({{ pilots.length }} Pilot{{ pilots.length === 1 ? '' : 's' }})
      </span>
      <v-spacer />
      <v-divider
        v-if="!mobile"
        vertical
        class="ts mx-4"
        style="transform: skew(-45deg); opacity: 1 !important" />
      <v-icon :icon="group.Expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
    </v-toolbar>
    <v-expand-transition>
      <v-card v-if="group.Expanded">
        <div class="pa-2">
          <v-row v-if="!noGroup" align="start">
            <v-col>
              {{ group.Description }}
              <v-expand-transition>
                <fieldset
                  v-if="group.Description || edit"
                  class="pa-1 my-1"
                  style="border-radius: 4px">
                  <legend class="text-overline px-2" style="line-height: 0">Description</legend>
                  <div class="py-1 px-2 flavor-text">
                    <quill-editor hide-details v-if="edit" v-model:content="group.Description" />
                    <div v-else v-html-safe="group.Description" />
                  </div>
                </fieldset>
              </v-expand-transition>
              <v-expand-transition>
                <fieldset v-if="group.History || edit" class="pa-1 my-4" style="border-radius: 4px">
                  <legend class="text-overline px-2" style="line-height: 0">History</legend>
                  <div class="py-1 px-2 flavor-text">
                    <quill-editor hide-details v-if="edit" v-model:content="group.History" />
                    <div v-else v-html-safe="group.History" />
                  </div>
                </fieldset>
              </v-expand-transition>
            </v-col>
            <v-col v-if="group.PortraitController.CloudImage || edit" cols="3" class="text-right">
              <cc-img :src="group.Portrait" />
              <div v-if="edit" class="text-center">
                <cc-button
                  size="small"
                  color="secondary"
                  @click="($refs.imageSelector as any).open()">
                  <div v-if="!group.Portrait">
                    <v-icon start>mdi-plus</v-icon>
                    Add group emblem
                  </div>
                  <div v-else>
                    <v-icon start>mdi-circle-edit-outline</v-icon>
                    Edit group emblem
                  </div>
                </cc-button>
                <cc-image-selector ref="imageSelector" :item="group" type="emblem" />
              </div>
            </v-col>
          </v-row>
          <v-card-text
            class="py-0"
            :class="[rosterView.includes('card') ? 'text-center' : '', mobile ? 'px-0' : 'px-2']">
            <component
              v-for="pilot in pilots"
              :is="pilotCardType"
              :pilot="pilot"
              :small="rosterView === 'small-cards'"
              @goTo="toPilotSheet($event)" />
          </v-card-text>
          <v-expand-transition>
            <v-row v-if="edit" class="pa-1">
              <v-col cols="auto">
                <cc-button
                  color="primary"
                  size="small"
                  prepend-icon="mdi-export"
                  @click="exportGroup()">
                  Export Group
                </cc-button>
              </v-col>
              <v-spacer />
              <v-col cols="auto">
                <v-dialog v-model="deleteDialog" width="auto">
                  <template v-slot:activator="{ props }">
                    <cc-button color="error" size="small" prepend-icon="mdi-delete" v-bind="props">
                      Delete Group
                    </cc-button>
                  </template>

                  <v-card>
                    <v-card-text>
                      <v-alert
                        color="warning"
                        variant="outlined"
                        prominent
                        icon="mdi-alert"
                        width="500px">
                        <p class="text-text">
                          This will delete {{ group.Name }}
                          <span v-if="pilots.length">
                            <span v-if="deletePilotsToggle">
                              and delete all pilots assigned to the group.
                            </span>
                            <span v-else>
                              <br />
                              All pilots assigned to this group will be moved to the "No Group"
                              section
                            </span>
                          </span>
                        </p>
                      </v-alert>
                      <v-row v-if="pilots.length" justify="end">
                        <v-col cols="auto">
                          <v-switch
                            v-model="deletePilotsToggle"
                            inset
                            color="error"
                            label="Delete pilots"
                            density="compact"
                            hide-details />
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-divider />
                    <v-card-actions>
                      <v-btn color="accent" variant="plain" @click="deleteDialog = false">
                        Dismiss
                      </v-btn>
                      <v-spacer />
                      <v-btn
                        v-if="!noGroup"
                        color="error"
                        variant="tonal"
                        prepend-icon="mdi-delete"
                        @click="deleteGroup()">
                        Delete Group
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
          </v-expand-transition>
        </div>

        <v-divider />
        <v-row justify="space-between" align="center" class="py-2 px-4 text-center" :dense="mobile">
          <v-col cols="12" sm="auto" v-if="!noGroup">
            <v-tooltip :text="edit ? 'Finish Editing' : 'Edit Group Information'">
              <template #activator="{ props }">
                <cc-button
                  v-if="mobile"
                  :prepend-icon="edit ? 'mdi-pencil-off' : 'mdi-pencil'"
                  color="primary"
                  size="x-small"
                  block
                  @click="edit = !edit"
                  v-bind="props">
                  Edit Group
                </cc-button>
                <cc-button
                  v-else
                  :icon="edit ? 'mdi-pencil-off' : 'mdi-pencil'"
                  color="primary"
                  size="small"
                  variant="outlined"
                  @click="edit = !edit"
                  v-bind="props" />
              </template>
            </v-tooltip>
          </v-col>

          <v-col cols="auto" v-if="transferrable.length" :order="mobile ? 1 : ''">
            <cc-button
              color="primary"
              :size="mobile ? 'x-small' : 'small'"
              :stacked="!mobile"
              :block="mobile"
              prepend-icon="mdi-transfer"
              :disabled="!transferrable.length">
              {{ mobile ? 'Transfer' : 'Transfer Pilots' }}
              <v-menu activator="parent">
                <v-list max-height="400px">
                  <v-list-item
                    v-for="pilot in transferrable"
                    :title="pilot.Name"
                    @click="transferPilot(pilot as Pilot)" />
                </v-list>
              </v-menu>
            </cc-button>
          </v-col>

          <v-col cols="12" md="" class="text-left">
            <cc-button
              color="success"
              block
              prepend-icon="mdi-plus"
              @click="$router.push({ name: 'new', params: { groupID: group.ID } })">
              Create New Pilot
              <template #info>
                <v-icon size="small" icon="cc:pilot" />
              </template>
              <template #subtitle>
                <div
                  class="text-cc-overline"
                  style="font-size: max(8px, calc(8px + 0.2vw)) !important">
                  <span v-if="group.ID === 'no_group'">Add a new pilot to the roster</span>
                  <span v-else>Add a new pilot to {{ group.Name }}</span>
                </div>
              </template>
            </cc-button>
          </v-col>

          <v-col cols="auto">
            <v-menu offset-y>
              <template #activator="{ props }">
                <cc-button
                  color="primary"
                  :size="mobile ? 'x-small' : 'small'"
                  :stacked="!mobile"
                  :block="mobile"
                  prepend-icon="mdi-dots-vertical"
                  @click="props.onClick($event)">
                  Import
                </cc-button>
              </template>
              <v-card tile border>
                <v-card-text>
                  <cc-modal title="Import" icon="mdi-import">
                    <template #activator="{ open }">
                      <cc-button
                        color="primary"
                        size="small"
                        block
                        prepend-icon="mdi-import"
                        @click="open">
                        File Import
                      </cc-button>
                    </template>
                    <template #default="{ close }">
                      <file-import :group-id="group.ID" />
                    </template>
                  </cc-modal>
                  <br />
                  <share-code-dialog import-type="pilot" block-btn />
                </v-card-text>
              </v-card>
            </v-menu>
          </v-col>
        </v-row>
      </v-card>
    </v-expand-transition>
  </div>
</template>

<script lang="ts">
import { PilotStore, UserStore } from '@/stores';
import PilotCard from './PilotCard.vue';
import PilotListItem from './PilotListItem.vue';
import { Pilot, PilotGroup } from '@/class';
import { saveFile } from '@/io/Data';
import _ from 'lodash';
import FileImport from './add_panels/FileImport.vue';
import ShareCodeDialog from '@/features/main_menu/_components/account/_components/data_viewer/shareCodeDialog.vue';

export default {
  name: 'group-panel',
  props: {
    group: {
      type: Object,
      required: true,
    },
  },
  components: { PilotCard, PilotListItem, FileImport, ShareCodeDialog },
  data: () => ({
    edit: false,
    deleteDialog: false,
    deletePilotsToggle: false,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    noGroup(): boolean {
      return this.group.ID === 'no_group';
    },
    pilots(): Pilot[] {
      return _.orderBy(PilotStore().getPilots(this.group.ID), 'SortIndex', 'asc');
    },
    profile() {
      return UserStore().User;
    },
    rosterView(): string {
      if (!this.profile || !this.profile.View) return 'list';
      return this.profile.View('roster', 'list');
    },
    pilotCardType(): string {
      switch (this.rosterView) {
        case 'cards':
        case 'small-cards':
          return 'pilot-card';
        case 'list':
        default:
          return 'pilot-list-item';
      }
    },
    transferrable() {
      return PilotStore().Pilots.filter(
        (pilot) => !this.group.Pilots.map((x) => x.id).includes(pilot.ID)
      );
    },
  },
  methods: {
    toPilotSheet(pilotId: string) {
      this.$router.push({ name: 'pilot_sheet_redirect', params: { pilotID: pilotId } });
    },
    transferPilot(pilot: Pilot) {
      PilotStore().TransferPilot(pilot, this.group.ID);
    },
    deleteGroup() {
      PilotStore().DeleteGroup(this.group as PilotGroup, this.deletePilotsToggle);
      this.deleteDialog = false;
    },
    setGroupExpand() {
      this.group.Expanded = !this.group.Expanded;
      PilotStore().SaveGroupData();
    },
    exportGroup() {
      const pilots = PilotStore().getPilots(this.group.ID);

      const exportObj = {
        groupData: PilotGroup.Serialize(this.group as PilotGroup),
        pilotData: pilots.map((x) => Pilot.Serialize(x)),
      };

      saveFile(
        this.group.Name.toUpperCase().replace(/\W/g, '') + '.json',
        JSON.stringify(exportObj),
        'Pilot Group'
      );
    },
    move(direction: 'top' | 'up' | 'down' | 'bottom') {
      PilotStore().ReorderGroup(this.group as PilotGroup, direction);
    },
  },
};
</script>

<style scoped>
.title-hover {
  background-color: rgb(var(--v-theme-primary));
  color: white;

  transition: background-color 0.3s ease-in-out;
}
.title-hover:hover {
  cursor: pointer;
  background-color: rgb(var(--v-theme-active));
}
.light {
  position: absolute;
  width: 13.5px;
  height: 13.5px;
  clip-path: polygon(0 50%, 50% 0, 100% 0, 0% 100%);
  transition: filter 0.2s ease-in-out;
}
.top-element:hover .light {
  filter: brightness(2) saturate(200%) hue-rotate(20deg);
}
</style>
