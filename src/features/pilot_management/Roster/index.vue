<template>
  <v-container class="pb-12"
    :class="mobile && 'mt-2'">
    <div v-if="mobile && dragModeActive"
      style="position: fixed; top: 0; left: 0; right: 0; z-index: 1000"
      class="bg-success d-flex justify-center align-center pa-2">
      <cc-button size="small"
        color="success"
        prepend-icon="mdi-check"
        @click="exitDragMode">
        {{ $t('pm.roster.doneReordering') }}
      </cc-button>
    </div>
    <v-row align="center">
      <v-col cols="12"
        md="auto">
        <div>
          <div class="heading h1"
            style="line-height: 0">{{ $t('common.pilotRoster') }} <span v-if="rosterSearch"
              class="text-caption text-italic text-disabled">
              <br v-if="mobile" />
              {{ hiddenPilotCount }} {{ hiddenPilotCount === 1 ? $t('pm.roster.pilotLower') : $t('pm.roster.pilotsLower') }} {{ $t('pm.roster.hidden') }}
            </span></div>
        </div>

      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <v-btn-toggle v-model="rosterView"
          mandatory
          tile>
          <v-btn icon
            class="pa-0"
            value="list"
            @click="profile.SetView('roster', 'list')">
            <v-icon color="accent">mdi-view-list</v-icon>
          </v-btn>
          <v-btn icon
            class="pa-0"
            value="cards"
            @click="profile.SetView('roster', 'cards')">
            <v-icon color="accent">mdi-view-grid</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <div class="my-3">
      <sortable :key="groupSortableKey"
        :list="pilotGroups"
        item-key="ID"
        :options="groupSortableOptions"
        @start="startDragScroll"
        @end="onGroupReorder">
        <template #item="{ element }">
          <group-panel :group="element"
            :roster-search="rosterSearch"
            :transfer-key="rosterTransferKey"
            :drag-mode-active="dragModeActive"
            @pilot-transferred="rosterTransferKey++" />
        </template>
      </sortable>
      <group-panel v-if="noGroup"
        :group="noGroup"
        :roster-search="rosterSearch"
        :transfer-key="rosterTransferKey"
        :drag-mode-active="dragModeActive"
        @pilot-transferred="rosterTransferKey++" />
    </div>
    <v-divider />
    <v-footer app
      density="compact"
      class="border-t">
      <cc-modal :title="$t('common.organize')"
        icon="mdi-queue-first-in-last-out">
        <template #activator="{ open }">
          <cc-button size="small"
            color="primary"
            @click="open">
            <v-icon start
              icon="mdi-queue-first-in-last-out" />
            {{ $t('common.organize') }}
          </cc-button>
        </template>
        <organizer type="pilot" />
      </cc-modal>
      <v-spacer />

      <cc-text-field v-if="!mobile"
        v-model="rosterSearch"
        density="compact"
        variant="outlined"
        color="primary"
        bg-color="background"
        hide-details
        clearable
        icon="mdi-magnify"
        style="min-width: 300px; max-width: 350px; " />

      <v-menu v-else
        :close-on-content-click="false"
        location="top">
        <template #activator="{ props }">
          <v-btn icon
            size="small"
            v-bind="props">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </template>
        <v-card min-width="260px">
          <v-card-text class="pa-2">
            <v-text-field v-model="rosterSearch"
              density="compact"
              variant="outlined"
              hide-details
              clearable
              autofocus
              prepend-inner-icon="mdi-magnify"
              :placeholder="$t('pm.fields.nameOrCallsign')" />
          </v-card-text>
        </v-card>
      </v-menu>
      <v-spacer />

      <v-menu offset-y>
        <template #activator="{ props }">
          <cc-button color="primary"
            size="small"
            prepend-icon="mdi-plus"
            @click="props.onClick($event)">
            {{ $t('pm.roster.addGroup') }}
          </cc-button>
        </template>
        <v-card tile
          border>
          <v-card-text>
            <cc-modal :title="$t('pm.titles.createPilotGroup')"
              icon="mdi-account-group">
              <template #activator="{ open }">
                <cc-button color="primary"
                  size="small"
                  block
                  prepend-icon="mdi-plus"
                  @click="open">
                  {{ $t('mainMenu.publishing.addNew') }}
                </cc-button>
              </template>
              <template #default="{ close }">
                <group-menu @close="close" />
              </template>
            </cc-modal>
            <cc-modal :title="$t('common.import')"
              icon="mdi-import"
              max-width="900">
              <template #activator="{ open }">
                <cc-button color="primary"
                  size="small"
                  block
                  prepend-icon="mdi-import"
                  @click="open">
                  {{ $t('common.fileImport') }}
                </cc-button>
              </template>
              <template #default="{ close }">
                <group-file-import @done="close" />
              </template>
            </cc-modal>

            <group-share-dialog block-btn />

          </v-card-text>
        </v-card>
      </v-menu>

    </v-footer>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { Sortable } from 'sortablejs-vue3';
import Organizer from './components/Organizer.vue';
import GroupPanel from './components/GroupPanel.vue';
import GroupMenu from './components/GroupMenu.vue';
import { UserStore, PilotStore, PilotGroupStore } from '@/stores';
import { useDragMode } from '@/composables/useDragMode';
import { startDragScroll, stopDragScroll } from '@/composables/useScrollOnDrag';
import GroupFileImport from './components/add_panels/GroupFileImport.vue';
import GroupShareDialog from './components/GroupShareDialog.vue';

const mobile = useDisplay().smAndDown

const { dragModeActive, exitDragMode } = useDragMode(600, { shared: true })

// const sortParams = ref(null)
// const newGroupMenu = ref(false)
// const newGroupName = ref('')
const rosterView = ref('list')
const rosterSearch = ref('')
const rosterTransferKey = ref(0)

const profile = computed(() => UserStore().User)

rosterView.value = profile.value.View('roster', 'list')

const groupSortableOptions = computed(() => ({
  animation: 250,
  easing: 'cubic-bezier(1, 0, 0, 1)',
  handle: '.group-drag-handle',
  group: { name: 'groups', pull: false, put: false },
  scroll: false,
}))

const pilotGroups = computed(() =>
  PilotGroupStore().getPilotGroups().filter((g: any) => g.ID !== 'no_group')
)

const groupSortableKey = computed<string>(() => `groups-${dragModeActive.value}`)

const noGroup = computed(() =>
  PilotGroupStore().getPilotGroups().find((g: any) => g.ID === 'no_group') ?? null
)

const hiddenPilotCount = computed(() => {
  if (!rosterSearch.value) return 0
  const s = rosterSearch.value.toLowerCase()
  const all = PilotStore().Pilots.filter((p: any) => !p.SaveController.IsDeleted)
  const matching = all.filter((p: any) =>
    p.Name.toLowerCase().includes(s) || p.Callsign.toLowerCase().includes(s)
  )
  return all.length - matching.length
})

function onGroupReorder(event: any) {
  stopDragScroll()
  if (event.oldIndex === event.newIndex) return
  const group = pilotGroups.value[event.oldIndex] as any
  PilotGroupStore().ReorderGroupByIndex(group, event.newIndex)
}
</script>
