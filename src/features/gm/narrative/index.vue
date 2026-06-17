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
    <v-tab v-for="itemType in itemTypes"
      :key="itemType"
      selected-class="bg-accent">
      <b>{{ $t('gm.narrative.itemTypePlural', { type: itemType }) }}</b>
    </v-tab>
  </v-tabs>

  <v-window v-model="tab">
    <v-window-item v-for="itemType in itemTypes"
      :key="itemType">
      <narrative-collection :id="id"
        :item-type="itemType"
        @open-import="importModal = true"
        @open-organizer="orgModal = true" />
    </v-window-item>
  </v-window>

  <cc-modal v-model="importModal"
    icon="mdi-download-multiple"
    :title="$t('common.import')"
    shrink>
    <importer @complete="($refs as any).import.hide()" />
  </cc-modal>

  <cc-modal v-model="orgModal"
    icon="mdi-queue-first-in-last-out"
    shrink
    :title="$t('common.organize')">
    <organizer type="narrative" />
  </cc-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NarrativeCollection from './_components/narrativeCollection.vue';
import Organizer from '../_components/Organizer.vue';
import Importer from '../_components/NpcImporter.vue';
import ShareCodeDialog from '@/shared/ShareCodeDialog.vue';
import { useDisplay } from 'vuetify';

defineOptions({ name: 'NarrativeRoster' })

const { smAndDown: mobile, xs: portrait } = useDisplay()

const props = defineProps<{
  type?: string
  id?: string
}>()

const tab = ref(0)
const importModal = ref(false)
const orgModal = ref(false)
const itemTypes = ref(['Character', 'Location', 'Faction'])
const view = ref('collection')

if (props.type) {
      tab.value = ['character', 'location', 'faction'].indexOf(props.type);
    }

if (props.type) {
      tab.value = ['character', 'location', 'faction'].indexOf(props.type);
    }
</script>
