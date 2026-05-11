<template>
  <div style="position: relative"
    class="top-element"
    @dragenter.prevent="onDragEnter"
    @dragleave="onDragLeave">
    <div class="light bg-primary" />
    <v-toolbar density="compact"
      :class="['mt-2', 'title-hover', { 'title-drag-active': dropActive }, { 'pl-4': mobile && !noGroup }]"
      height="48"
      style="position: relative; clip-path: polygon(16px 0, 100% 0, 100% 100%, 0 100%, 0 16px)"
      @click="setGroupExpand()"
      @dragover.prevent
      @drop.prevent="onDropOnTitle">
      <v-icon v-if="!noGroup && (!mobile || dragModeActive)"
        icon="mdi-drag"
        class="group-drag-handle mr-1 ml-2"
        aria-label="Drag to reorder group"
        tabindex="0"
        style="cursor: move; opacity: 0.5; transition: opacity 0.2s"
        @click.stop />
      <v-avatar v-if="group.PortraitController.HasImage"
        size="30px"
        class="mr-2">
        <cc-img :src="group.Portrait" />
      </v-avatar>
      <div v-else-if="noGroup"
        class="mr-2"
        style="width: 30px; height: 30px;" />

      <span class="heading h3">{{ group.Name }}</span>
      <v-btn v-if="mobile"
        :icon="edit ? 'mdi-pencil-off' : 'mdi-pencil'"
        size="x-small"
        v-bind="props"
        @click.stop="edit = !edit" />
      <span class="pl-4 text-caption">
        ({{ pilots.length }} Pilot{{ pilots.length === 1 ? '' : 's' }})
      </span>
      <v-spacer />
      <v-divider v-if="!mobile"
        vertical
        class="ts mx-4"
        style="transform: skew(-45deg); opacity: 1 !important" />
      <v-icon :icon="group.Expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
    </v-toolbar>
    <v-expand-transition>
      <v-card v-if="group.Expanded"
        style="overflow: visible">
        <div class="pa-2">
          <v-row v-if="!noGroup"
            align="start">
            <v-col cols="12"
              md=""
              :order="mobile ? 1 : 0">
              <v-expand-transition>
                <cc-text-field v-if="edit"
                  v-model="group.Name"
                  label="Group Name"
                  variant="outlined"
                  color="primary"
                  density="compact"
                  hide-details
                  class="mb-2" />
              </v-expand-transition>
              <v-expand-transition>

                <fieldset v-if="group.Description || edit"
                  class="py-1 px-2 my-1"
                  style="border-radius: 4px">
                  <legend class="text-overline px-2"
                    style="line-height: 0">Description</legend>
                  <div class="py-1 px-2 flavor-text">
                    <cc-text-editor-inline v-if="edit"
                      :original="group.Description"
                      @save="group.Description = $event" />
                    <div v-else
                      v-html-safe="group.Description" />
                  </div>
                </fieldset>
              </v-expand-transition>
              <v-expand-transition>
                <fieldset v-if="group.History || edit"
                  class="py-1 px-2 my-4"
                  style="border-radius: 4px">
                  <legend class="text-overline px-2"
                    style="line-height: 0">History</legend>
                  <div class="py-1 px-2 flavor-text">
                    <cc-text-editor-inline v-if="edit"
                      :original="group.History"
                      @save="group.History = $event" />
                    <div v-else
                      v-html-safe="group.History" />
                  </div>
                </fieldset>
              </v-expand-transition>
              <cc-button v-if="mobile && edit"
                prepend-icon="mdi-pencil-circle-outline"
                block
                size="x-small"
                color="primary"
                @click="edit = false">
                Finish Editing
              </cc-button>
            </v-col>
            <v-col v-if="group.PortraitController.CloudImage || edit"
              cols="12"
              md="3"
              :order="mobile ? 0 : 1"
              :class="!mobile ? 'mb-2' : ''"
              class="text-right pa-3">
              <div class="d-flex justify-center">
                <cc-img :src="group.Portrait"
                  :max-width="mobile ? 200 : ''" />
              </div>
              <div v-if="edit"
                class="text-right mb-2">
                <cc-modal title="Set Group Emblem"
                  icon="mdi-image">
                  <template #activator="{ open }">
                    <div class="d-flex justify-center">
                      <cc-button size="small"
                        color="secondary"
                        @click="open">
                        <div v-if="!group.Portrait">
                          <v-icon start>mdi-plus</v-icon>
                          Add group emblem
                        </div>
                        <div v-else>
                          <v-icon start>mdi-circle-edit-outline</v-icon>
                          Edit group emblem
                        </div>
                      </cc-button>
                    </div>
                  </template>
                  <cc-image-selector ref="imageSelector"
                    :item="group"
                    type="emblem" />
                </cc-modal>
              </div>
            </v-col>
          </v-row>
          <v-card-text class="py-0"
            style="overflow:visible"
            :class="[rosterView.includes('card') ? 'text-center' : '', mobile ? 'px-0' : 'px-2']">
            <sortable :key="groupSortableKey"
              :list="filteredPilots"
              item-key="ID"
              :class="rosterView === 'cards' ? 'd-flex flex-wrap' : ''"
              :options="sortableOptions"
              @start="startDragScroll"
              @end="onPilotReorder"
              @add="onPilotAdded">
              <template #item="{ element }">
                <div :data-pilot-id="element.ID"
                  @pointerdown="mobile ? onPointerDown() : undefined"
                  @pointerup="mobile ? onPointerUp() : undefined"
                  @pointercancel="mobile ? onPointerCancel() : undefined">
                  <component :is="pilotCardType"
                    :pilot="element"
                    @go-to="toPilotSheet(element.ID)" />
                </div>
              </template>
            </sortable>
          </v-card-text>
          <v-expand-transition>
            <v-row v-if="edit"
              class="pa-1">
              <v-spacer />
              <v-col cols="auto">
                <v-dialog v-model="deleteDialog"
                  width="auto">
                  <template #activator="{ props }">
                    <cc-button color="error"
                      size="small"
                      prepend-icon="mdi-delete"
                      v-bind="props">Delete Group
                    </cc-button>
                  </template>

                  <v-card tile>
                    <v-card-text>
                      <cc-alert color="error"
                        icon="mdi-alert"
                        :title="`Delete ${group.Name}?`">
                        <div v-if="pilots.length"
                          class="pa-1">
                          <span v-if="deletePilotsToggle">
                            All pilots assigned to this group will be permanently deleted.
                          </span>
                          <span v-else>
                            All pilots assigned to this group will be moved to the "No Group"
                            section
                          </span>
                        </div>
                      </cc-alert>
                      <v-row v-if="pilots.length"
                        justify="end">
                        <v-col cols="auto">
                          <cc-switch v-model="deletePilotsToggle"
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
                      <v-btn color="accent"
                        variant="plain"
                        tile
                        @click="deleteDialog = false">
                        Dismiss
                      </v-btn>
                      <v-spacer />
                      <cc-button v-if="!noGroup"
                        color="error"
                        variant="tonal"
                        prepend-icon="mdi-delete"
                        @click="deleteGroup()">
                        Delete Group
                      </cc-button>
                    </v-card-actions>

                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
          </v-expand-transition>
        </div>
        <v-slide-y-reverse-transition>
          <div v-if="!dragModeActive">
            <v-divider />
            <v-row justify="space-between"
              align="center"
              class="py-2 px-4 text-center"
              :dense="mobile">
              <v-col v-if="!noGroup"
                cols="12"
                sm="auto">
                <v-tooltip :text="edit ? 'Finish Editing' : 'Edit Group Information'">
                  <template #activator="{ props }">
                    <cc-button v-if="!mobile"
                      :icon="edit ? 'mdi-pencil-off' : 'mdi-pencil'"
                      color="primary"
                      size="small"
                      variant="outlined"
                      v-bind="props"
                      @click="edit = !edit" />
                  </template>
                </v-tooltip>
              </v-col>

              <v-col v-if="transferrable.length"
                cols="auto"
                :order="mobile ? 1 : ''">
                <cc-button color="primary"
                  :size="mobile ? 'x-small' : 'small'"
                  :stacked="!mobile"
                  prepend-icon="mdi-transfer"
                  :disabled="!transferrable.length">
                  {{ mobile ? 'Transfer' : 'Transfer Pilots' }}
                  <v-menu activator="parent"
                    :close-on-content-click="false">
                    <v-card flat
                      tile
                      border>
                      <v-text-field v-model="search"
                        variant="outlined"
                        density="compact"
                        clearable
                        hide-details
                        prepend-inner-icon="mdi-magnify" />
                      <v-divider class="mt-2" />
                      <v-list max-height="400px"
                        density="compact">
                        <v-list-item v-for="pilot in transferrable"
                          :key="`transfer_${pilot.ID}`"
                          :title="pilot.Callsign"
                          :subtitle="pilot.Name"
                          slim
                          @click="transferPilot(pilot as Pilot)" />
                      </v-list>
                    </v-card>
                  </v-menu>
                </cc-button>
              </v-col>

              <v-col cols="12"
                md=""
                class="text-left">
                <cc-button color="success"
                  block
                  prepend-icon="mdi-plus"
                  @click="$router.push({ name: 'new', params: { groupID: group.ID } })">
                  Create New Pilot
                  <template #info>
                    <v-icon size="small"
                      icon="cc:pilot" />
                  </template>
                  <template #subtitle>
                    <div class="text-cc-overline"
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
                    <cc-button color="primary"
                      :size="mobile ? 'x-small' : 'small'"
                      :stacked="!mobile"
                      prepend-icon="mdi-dots-vertical"
                      @click="props.onClick($event)">
                      Import
                    </cc-button>
                  </template>
                  <v-card tile
                    border>
                    <v-card-text>
                      <cc-modal title="Import"
                        icon="mdi-import"
                        max-width="900">
                        <template #activator="{ open }">
                          <cc-button color="primary"
                            size="small"
                            block
                            prepend-icon="mdi-import"
                            @click="open">
                            File Import
                          </cc-button>
                        </template>
                        <template #default="{ close }">
                          <file-import :group-id="group.ID"
                            @done="close" />
                        </template>
                      </cc-modal>
                      <br />
                      <share-code-dialog import-type="pilot"
                        block-btn />
                    </v-card-text>
                  </v-card>
                </v-menu>
              </v-col>
              <cc-button color="primary"
                :size="mobile ? 'x-small' : 'small'"
                :stacked="!mobile"
                prepend-icon="mdi-export"
                @click="exportGroup()">
                Export
              </cc-button>
            </v-row>
          </div>
        </v-slide-y-reverse-transition>
      </v-card>
    </v-expand-transition>
  </div>
</template>

<script lang="ts">
import { Sortable } from 'sortablejs-vue3';
import { PilotStore, UserStore } from '@/stores';
import PilotCard from './PilotCard.vue';
import PilotListItem from './PilotListItem.vue';
import { Pilot, PilotGroup } from '@/class';
import { saveFile } from '@/io/Data';
import FileImport from './add_panels/FileImport.vue';
import ShareCodeDialog from '@/shared/ShareCodeDialog.vue';
import { useMobile } from '@/mixins/useMobile';
import { useRosterDragMode } from '@/mixins/useRosterDragMode';
import { startDragScroll, stopDragScroll } from '@/mixins/useScrollOnDrag';


export default {
  name: 'GroupPanel',
  components: { Sortable, PilotCard, PilotListItem, FileImport, ShareCodeDialog },
  mixins: [useMobile],
  props: {
    group: {
      type: Object,
      required: true,
    },
    rosterSearch: {
      type: String,
      default: '',
    },
    transferKey: {
      type: Number,
      default: 0,
    },
    dragModeActive: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['pilot-transferred'],
  setup() {
    return useRosterDragMode(600);
  },
  data: () => ({
    edit: false,
    deleteDialog: false,
    deletePilotsToggle: false,
    search: '',
    dropActive: false,
  }),
  computed: {
    noGroup(): boolean {
      return this.group.ID === 'no_group';
    },
    groupSortableKey(): string {
      return `${this.group.ID}-${this.transferKey}-${this.dragModeActive}`;
    },
    sortableOptions() {
      const needsHandle = !this.mobile || !this.dragModeActive;
      return {
        animation: 250,
        easing: 'cubic-bezier(1, 0, 0, 1)',
        handle: needsHandle ? '.drag-handle' : undefined,
        group: { name: 'pilots', pull: true, put: ['pilots'] },
        scroll: false,
        disabled: !!this.rosterSearch,
      };
    },
    pilots(): Pilot[] {
      const store = PilotStore();
      return (this.group.Pilots as any[])
        .map((pi: any) => store.getPilotByID(pi.id))
        .filter((p: any): p is Pilot => !!p && !p.SaveController.IsDeleted);
    },
    filteredPilots(): Pilot[] {
      if (!this.rosterSearch) return this.pilots;
      const s = this.rosterSearch.toLowerCase();
      return this.pilots.filter(
        (p) => p.Name.toLowerCase().includes(s) || p.Callsign.toLowerCase().includes(s)
      );
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
          return 'pilot-card';
        case 'list':
        default:
          return 'pilot-list-item';
      }
    },
    transferrable() {
      return PilotStore().Pilots.filter(
        (pilot) =>
          !pilot.SaveController.IsDeleted && !this.group.Pilots.map((x) => x.id).includes(pilot.ID) && (!this.search || (pilot.Name + pilot.Callsign).toLowerCase().includes(this.search.toLowerCase()))
      );
    },
  },
  watch: {
    rosterSearch(val: string) {
      this.group.Expanded = val ? this.filteredPilots.length > 0 : true;
    },
  },
  methods: {
    startDragScroll,
    toPilotSheet(pilotID: string) {
      this.$router.push({ name: 'pilot_sheet_redirect', params: { pilotID } });
    },
    onPilotReorder(event: any) {
      stopDragScroll();
      this.dropActive = false;
      if (event.from !== event.to) return;
      if (event.oldIndex === event.newIndex) return;
      if (this.rosterSearch) return;

      const fromPilot = this.filteredPilots[event.oldIndex];
      const toPilot = this.filteredPilots[event.newIndex];
      if (!fromPilot || !toPilot) return;

      const fromIdx = this.group.Pilots.findIndex((p: any) => p.id === fromPilot.ID);
      const toIdx = this.group.Pilots.findIndex((p: any) => p.id === toPilot.ID);
      if (fromIdx === -1 || toIdx === -1) return;

      PilotStore().movePilotIndex(this.group as PilotGroup, fromIdx, toIdx);
      PilotStore().SaveGroupData();
    },
    onDropOnTitle() {
      if (!this.dropActive) return;
      const dragEl = document.querySelector('[data-pilot-id].sortable-chosen') ||
        document.querySelector('[data-pilot-id].sortable-ghost');
      const pilotId = (dragEl as HTMLElement)?.dataset?.pilotId;
      if (!pilotId) return;
      if (this.group.Pilots.some((p: any) => p.id === pilotId)) {
        this.dropActive = false;
        return;
      }
      const pilot = PilotStore().getPilotByID(pilotId) as any;
      if (!pilot) return;
      PilotStore().TransferPilot(pilot, this.group.ID);
      this.$emit('pilot-transferred');
      this.dropActive = false;
    },
    onDragEnter() {
      if (document.querySelector('.sortable-chosen .group-drag-handle')) return;
      this.dropActive = true;
    },
    onDragLeave(event: DragEvent) {
      const el = this.$el as HTMLElement;
      if (el.contains(event.relatedTarget as Node)) return;
      this.dropActive = false;
    },
    async onPilotAdded(event: any) {
      stopDragScroll();
      this.dropActive = false;
      const pilotId = event.item.dataset.pilotId;
      if (!pilotId) return;
      const pilot = PilotStore().getPilotByID(pilotId) as any;
      if (!pilot) return;
      await PilotStore().TransferPilot(pilot, this.group.ID);
      this.$emit('pilot-transferred');
    },
    async transferPilot(pilot: Pilot) {
      await PilotStore().TransferPilot(pilot, this.group.ID);
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
        JSON.stringify(exportObj, null, 2) as any,
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

.title-drag-active {
  background-color: rgb(var(--v-theme-success)) !important;
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

.top-element:hover .group-drag-handle {
  opacity: 1;
}
</style>
