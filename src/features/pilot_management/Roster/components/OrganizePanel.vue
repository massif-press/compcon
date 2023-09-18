<template>
  <div class="py-3">
    <v-row dense justify="end" align="end" class="px-5">
      <v-col class="text-caption"
        ><i
          >{{ allPilots - deletedPilots }}
          <span v-if="deletedPilots" class="text-error">({{ deletedPilots }})</span> pilots in
          {{ list.length }}
          <span v-if="deletedGroups" class="text-error">({{ deletedGroups }})</span> groups</i
        ></v-col
      >
      <v-col cols="auto">
        <v-menu offset-y>
          <template #activator="{ props }">
            <v-btn variant="tonal" color="accent" size="small" v-bind="props">Sort Groups</v-btn>
          </template>
          <v-list density="compact">
            <v-list-item>
              <v-btn
                size="x-small"
                icon
                class="mr-2"
                variant="plain"
                @click="sortOrgs('Name', 'asc')"
                ><v-icon size="x-large" icon="mdi-sort-alphabetical-ascending"
              /></v-btn>
              <v-btn
                size="x-small"
                icon
                class="mr-2"
                variant="plain"
                @click="sortOrgs('Name', 'desc')"
                ><v-icon size="x-large" icon="mdi-sort-alphabetical-descending" />
              </v-btn>
              Name
            </v-list-item>
            <v-list-item>
              <v-btn
                size="x-small"
                icon
                class="mr-2"
                variant="plain"
                @click="sortOrgs('PilotCount', 'asc')"
                ><v-icon size="x-large" icon="mdi-sort-numeric-ascending"
              /></v-btn>
              <v-btn
                size="x-small"
                icon
                class="mr-2"
                variant="plain"
                @click="sortOrgs('PilotCount', 'desc')"
                ><v-icon size="x-large" icon="mdi-sort-numeric-descending" />
              </v-btn>
              Pilot Count
            </v-list-item>
            <v-list-item>
              <v-btn
                size="x-small"
                icon
                class="mr-2"
                variant="plain"
                @click="sortOrgs('LicenseLevel', 'asc')"
                ><v-icon size="x-large" icon="mdi-sort-numeric-ascending"
              /></v-btn>
              <v-btn
                size="x-small"
                icon
                class="mr-2"
                variant="plain"
                @click="sortOrgs('LicenseLevel', 'desc')"
                ><v-icon size="x-large" icon="mdi-sort-numeric-descending" />
              </v-btn>
              Avg. License Level
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
      <v-col cols="auto"> </v-col>
    </v-row>
    <v-container>
      <sortable
        :list="list"
        :options="{
          group: 'groups',
          animation: 250,
          easing: 'cubic-bezier(1, 0, 0, 1)',
          handle: '.handle',
        }"
        item-key="ID"
        @end="moveGroup($event)"
      >
        <template #item="{ element, index }">
          <v-row dense>
            <v-col cols="auto">
              <v-icon size="40" icon="mdi-drag" class="handle pa-0 mr-n3" />
            </v-col>
            <v-col>
              <v-card class="draggable" variant="outlined" color="panel" :key="element.ID">
                <v-toolbar density="compact" class="px-3" color="primary">
                  <span
                    class="heading h3"
                    :class="element.deleted ? 'text-decoration-line-through text-error' : ''"
                    >{{ element.Name }}</span
                  >
                  <v-spacer />
                  <v-btn
                    v-if="element.ID !== 'no_group'"
                    icon
                    variant="plain"
                    :color="element.deleted ? 'accent' : 'error'"
                    @click="deleteGroup(element)"
                    ><v-icon :icon="element.deleted ? 'mdi-restore' : 'mdi-delete'"
                  /></v-btn>
                </v-toolbar>
                <v-row v-if="element.Pilots.length" justify="end">
                  <v-col cols="auto">
                    <v-menu offset-y>
                      <template #activator="{ props }">
                        <v-btn
                          variant="tonal"
                          class="rounded-t-0 rounded-e-0"
                          color="accent"
                          size="small"
                          v-bind="props"
                          >Sort Pilots</v-btn
                        >
                      </template>
                      <v-list density="compact">
                        <v-list-item>
                          <v-btn
                            size="x-small"
                            icon
                            class="mr-2"
                            variant="plain"
                            @click="sortPilots(element.ID, 'Name', 'asc')"
                            ><v-icon size="x-large" icon="mdi-sort-alphabetical-ascending"
                          /></v-btn>
                          <v-btn
                            size="x-small"
                            icon
                            class="mr-2"
                            variant="plain"
                            @click="sortPilots(element.ID, 'Name', 'desc')"
                            ><v-icon size="x-large" icon="mdi-sort-alphabetical-descending" />
                          </v-btn>
                          Name
                        </v-list-item>
                        <v-list-item>
                          <v-btn
                            size="x-small"
                            icon
                            class="mr-2"
                            variant="plain"
                            @click="sortPilots(element.ID, 'Callsign', 'asc')"
                            ><v-icon size="x-large" icon="mdi-sort-alphabetical-ascending"
                          /></v-btn>
                          <v-btn
                            size="x-small"
                            icon
                            class="mr-2"
                            variant="plain"
                            @click="sortPilots(element.ID, 'Callsign', 'desc')"
                            ><v-icon size="x-large" icon="mdi-sort-alphabetical-descending" />
                          </v-btn>
                          Callsign
                        </v-list-item>
                        <v-list-item>
                          <v-btn
                            size="x-small"
                            icon
                            class="mr-2"
                            variant="plain"
                            @click="sortPilots(element.ID, 'Level', 'asc')"
                            ><v-icon size="x-large" icon="mdi-sort-numeric-ascending"
                          /></v-btn>
                          <v-btn
                            size="x-small"
                            icon
                            class="mr-2"
                            variant="plain"
                            @click="sortPilots(element.ID, 'Level', 'desc')"
                            ><v-icon size="x-large" icon="mdi-sort-numeric-descending" />
                          </v-btn>
                          License Level
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-card-text class="pa-2">
                  <sortable
                    :id="element.ID"
                    :list="element.Pilots"
                    :options="{
                      group: 'pilots',
                      animation: 250,
                      easing: 'cubic-bezier(1, 0, 0, 1)',
                      handle: '.handle',
                    }"
                    :item-key="(item) => item"
                    @end="movePilot(element, $event)"
                  >
                    <template #item="{ element, index }">
                      <v-card variant="tonal" color="primary" class="my-1">
                        <v-row dense align="center" class="draggable text-text" :key="element">
                          <v-col cols="auto">
                            <v-icon size="large" icon="mdi-drag" class="handle" />
                          </v-col>
                          <v-col>
                            <span
                              class="heading"
                              :class="
                                element.deleted ? 'text-decoration-line-through text-error' : ''
                              "
                              >{{ pilot(element.id).Name }}<cc-slashes class="px-2" />{{
                                pilot(element.id).Callsign
                              }}
                              (LL {{ pilot(element.id).Level }})</span
                            >
                          </v-col>
                          <v-col cols="auto">
                            <v-btn
                              icon
                              variant="plain"
                              :color="element.deleted ? 'accent' : 'error'"
                              @click="
                                element.deleted = !element.deleted;
                                dirty = true;
                              "
                              ><v-icon :icon="element.deleted ? 'mdi-restore' : 'mdi-delete'"
                            /></v-btn>
                          </v-col>
                        </v-row>
                      </v-card>
                    </template>
                  </sortable>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </sortable>
    </v-container>
  </div>
  <v-divider />
  <v-card-actions>
    <v-btn variant="plain" @click="$emit('close')">Cancel</v-btn>
    <v-spacer />
    <v-btn
      color="accent"
      :prepend-icon="dirty ? 'mdi-content-save-alert-outline' : ''"
      @click="saveAll()"
      :disabled="!dirty"
      >Save</v-btn
    >
  </v-card-actions>
</template>

<script lang="ts">
import _ from 'lodash';
import { UserStore, PilotStore } from '@/stores';
import { Sortable } from 'sortablejs-vue3';
import { PilotGroup } from '../../store/PilotGroup';
import { group } from 'console';

const moveItemInArray = <T>(array: T[], from: number, to: number) => {
  const item = array.splice(from, 1)[0];
  array.splice(to, 0, item);
};

export default {
  name: 'organize-panel',
  components: {
    Sortable,
  },
  data: () => ({
    list: [] as any[],
    dirty: false,
  }),
  emits: ['close'],
  created() {
    this.list = PilotStore().PilotGroups.map((x, i) => ({
      ID: x.ID,
      Name: x.Name,
      deleted: x.SaveController.IsDeleted,
      index: i,
      Pilots: x.Pilots.map((y) => ({
        id: y.id,
        deleted: PilotStore().getPilotByID(y.id).SaveController.IsDeleted,
      })),
      PilotCount: x.Pilots.length,
      LicenseLevel:
        PilotStore()
          .getPilots(x.ID)
          .map((x) => x.LicenseLevel)
          .reduce((a, b) => a + b, 0) / x.Pilots.length,
    }));
  },
  computed: {
    deletedPilots() {
      return this.list.flatMap((x) => x.Pilots).filter((x) => x.deleted).length;
    },
    deletedGroups() {
      return this.list.filter((x) => x.deleted).length;
    },
    allPilots() {
      return this.list.flatMap((x) => x.Pilots).length;
    },
  },
  methods: {
    pilot(id: string) {
      return PilotStore().getPilotByID(id);
    },
    sortOrgs(prop: string, dir: 'asc' | 'desc') {
      this.list = _.orderBy(this.list, prop, dir);
      this.dirty = true;
    },
    sortPilots(groupID: string, prop: string, dir: 'asc' | 'desc') {
      const idx = this.list.findIndex((x) => x.ID === groupID);
      if (idx > -1) {
        const pilots = PilotStore().getPilots(groupID);
        this.list[idx].Pilots = _.orderBy(pilots, prop, dir).map((x, i) => ({
          id: x.ID,
          index: i,
        }));
      }
      this.dirty = true;
    },
    movePilot(group, event) {
      moveItemInArray(group.Pilots, event.oldIndex, event.newIndex);

      this.dirty = true;
    },
    moveGroup(event) {
      // TODO: move pilots in between groups

      moveItemInArray(this.list, event.oldIndex, event.newIndex);

      this.dirty = true;
    },
    deleteGroup(group) {
      group.deleted = !group.deleted;
      if (group.deleted) {
        group.Pilots.forEach((x) => (x.deleted = true));
      } else {
        group.Pilots.forEach((x) => (x.deleted = false));
      }
      this.dirty = true;
    },
    saveAll() {
      const store = PilotStore();
      this.list.forEach((group, index) => {
        const storedGroup = store.getGroupByID(group.ID);
        if (group.deleted) {
          storedGroup.SaveController.Delete();
          PilotStore().DeleteGroup(storedGroup, true);
          return;
        } else if (!group.deleted && storedGroup.SaveController.IsDeleted)
          storedGroup.SaveController.Restore();

        storedGroup.SortIndex = index;
        storedGroup.Pilots = group.Pilots.map((x, i) => ({ id: x.id, index: i }));
        group.Pilots.forEach((p) => {
          const storedPilot = PilotStore().getPilotByID(p.id);
          if (p.deleted) storedPilot.SaveController.Delete();
          else if (!p.deleted && storedPilot.SaveController.IsDeleted)
            storedPilot.SaveController.Restore();
        });
      });
      store.Reorder();
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.handle {
  cursor: move;
}
</style>
