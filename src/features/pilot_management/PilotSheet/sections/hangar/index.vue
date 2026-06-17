<template>
  <div>
    <div class="heading h1">{{ $t('pm.sheet.mechHangar') }}</div>
    <v-btn-toggle id="viewToggle"
      :value="view"
      mandatory
      style="height: 30px"
      flat
      tile
      class="mb-4">
      <v-btn icon
        value="cards"
        @click="profile.SetView('hangar', 'cards')">
        <v-icon color="accent">mdi-view-grid</v-icon>
      </v-btn>
      <v-btn icon
        value="list"
        @click="profile.SetView('hangar', 'list')">
        <v-icon color="accent">mdi-view-list</v-icon>
      </v-btn>
    </v-btn-toggle>
    <mech-sort />
    <v-container class="mt-2">
      <v-row v-if="view === 'cards'"
        justify="center">
        <mech-card v-for="m in sortedMechs"
          :key="`mechcard_${m.ID}`"
          :mech="m"
          @delete="pilot.RemoveMech($event)"
          @copy="pilot.CloneMech($event)"
          @go="toMechSheet($event)" />
      </v-row>
      <mech-list-item-mobile v-for="m in sortedMechs"
        v-else-if="view === 'list' && mobile"
        :key="`mechlistm_${m.ID}`"
        :mech="m"
        @delete="pilot.RemoveMech($event)"
        @copy="pilot.CloneMech($event)"
        @go="toMechSheet($event)" />
      <mech-list-item v-for="m in sortedMechs"
        v-else-if="view === 'list'"
        :key="`mechlist_${m.ID}`"
        :mech="m"
        @delete="pilot.RemoveMech($event)"
        @copy="pilot.CloneMech($event)"
        @go="toMechSheet($event)" />
    </v-container>
    <cc-modal v-if="!pilot.IsRemote"
      icon="cc:frame"
      :title="$t('pm.titles.addNewMech')"
      clip>
      <template #activator="{ open }">
        <cc-button color="primary"
          class="mx-6"
          block
          prepend-icon="cc:frame"
          append-icon="mdi-plus"
          @click="open">
          {{ $t('pm.sheet.addNewMech') }}
        </cc-button>
      </template>
      <template #default="{ close }">
        <new-mech-menu :pilot="pilot"
          @close="close" />
      </template>
    </cc-modal>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import MechCard from './components/MechCard.vue'
import MechListItem from './components/MechListItem.vue'
import MechListItemMobile from './components/MechListItemMobile.vue'
import NewMechMenu from './components/NewMechMenu.vue'
import MechSort from './components/MechSort.vue'
import { UserStore } from '@/stores'
import type { Pilot } from '@/classes/pilot/Pilot'

const props = defineProps<{
  pilot: Pilot
}>()

const { smAndDown: mobile, xs: portrait } = useDisplay()

import { useRouter } from 'vue-router'

const router = useRouter()

const profile = computed(() => UserStore().User)
const view = computed(() => profile.value.View('hangar', 'cards'))
const sortedMechs = computed(() => {
  const sort = profile.value.View('hangarSort', 'Created')
  const asc = profile.value.View('hangarAsc', false)
  const mechs = [...(props.pilot as any).Mechs]
  if (sort === 'Name') {
    mechs.sort((a, b) => a.Name.localeCompare(b.Name))
  } else if (sort === 'Source') {
    mechs.sort((a, b) => a.Frame.Source.localeCompare(b.Frame.Source))
  } else if (sort === 'Created') {
    mechs.sort((a, b) => a.Created - b.Created)
  }
  return asc ? mechs : mechs.reverse()
})

function toMechSheet(mech) {
  router.push({ name: 'mech-sheet', params: { mechID: mech.ID } })
}
</script>

<style scoped>
#viewToggle {
  z-index: 4;
}
</style>
