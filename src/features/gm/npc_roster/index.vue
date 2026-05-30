<template>
  <div style="position: absolute; top: 0; right: 0; left: 0; height: 50px"
    class="bg-primary" />
  <v-tabs v-model="tab"
    grow
    slider-color="secondary"
    :height="mobile ? '24px' : '28px'"
    density="compact"
    mandatory
    bg-color="primary">
    <v-tab selected-class="bg-accent">
      <b>NPCs</b>
    </v-tab>
    <v-tab selected-class="bg-accent">
      <b>Doodads</b>
    </v-tab>
    <v-tab selected-class="bg-accent">
      <b>Eidolons</b>
    </v-tab>
  </v-tabs>

  <v-window v-model="tab">
    <v-window-item>
      <npc-index :id="id"
        @open-import="importModal = true"
        @open-organizer="orgModal = true" />
    </v-window-item>
    <v-window-item>
      <doodad-index :id="id"
        @open-import="importModal = true"
        @open-organizer="orgModal = true" />
    </v-window-item>
    <v-window-item>
      <eidolon-index :id="id"
        @open-import="importModal = true"
        @open-organizer="orgModal = true" />
    </v-window-item>
  </v-window>

  <cc-solo-modal v-model="importModal"
    icon="mdi-download-multiple"
    title="Import"
    shrink>
    <importer @complete="importModal = false" />
  </cc-solo-modal>

  <cc-solo-modal v-model="orgModal"
    icon="mdi-queue-first-in-last-out"
    shrink
    title="Organize">
    <organizer type="npc" />
  </cc-solo-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NpcIndex from './npcs/index.vue';
import DoodadIndex from './doodads/index.vue';
import EidolonIndex from './eidolons/index.vue';
import Organizer from '../_components/Organizer.vue';
import Importer from '../_components/NpcImporter.vue';
import { useMobile } from '@/composables/useMobile';

defineOptions({ name: 'NpcRoster' })

const { mobile, portrait } = useMobile()

const props = defineProps<{
  type?: string
  id?: string
}>()

const tab = ref(0)
const importModal = ref(false)
const shareModal = ref(false)
const orgModal = ref(false)

if (props.type) {
      tab.value = ['npc', 'doodad', 'eidolon'].indexOf(props.type);
    }

if (props.type) {
      tab.value = ['npc', 'doodad', 'eidolon'].indexOf(props.type);
    }
</script>
