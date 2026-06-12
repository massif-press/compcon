<template>
  <div v-if="pilot">
    <pilot-header :pilot="pilot" />
    <div :style="`padding-top: ${mdAndDown ? '75px' : '100px'}`">
      <narrative-view v-if="page < 2"
        :pilot="pilot" />
      <bonds-view v-else-if="page === 2"
        :pilot="pilot" />
      <tactical-view v-else-if="page === 3"
        :pilot="pilot" />
      <mech-hangar-view v-else-if="page === 4"
        :pilot="pilot" />
      <mobile-options-view v-else-if="page === 5"
        :pilot="pilot" />
    </div>
    <pilot-nav :pilot="pilot"
      :selected="page"
      @to="page = $event" />
    <v-spacer style="min-height: 80px" />
  </div>
  <div v-else>
    <h1 style="margin-top: 50px; text-align: center">{{ $t('pm.sheet.errorINVALIDPILOT') }}</h1>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useDisplay } from 'vuetify'
import PilotHeader from './components/PilotHeader.vue';
import { PilotStore } from '../store';
import PilotNav from './components/PilotNav.vue';
import NarrativeView from './sections/narrative/index.vue';
import TacticalView from './sections/tactical/index.vue';
import MechHangarView from './sections/hangar/index.vue';
import BondsView from './sections/bonds/index.vue';
import { UserStore } from '@/stores';
import MobileOptionsView from './MobileOptions.vue';

const { mdAndDown } = useDisplay()

defineOptions({ name: 'PilotSheet' })

const props = defineProps<{
  pilotID: string
}>()

const page = ref(0)


const pilot = computed(() => {
      return PilotStore().getPilotByID(props.pilotID);
    })

onMounted(() => {
page.value = parseInt(UserStore().User.View('pilotSheetPage', 1));
    if (pilot.value) document.title = `${pilot.value.Callsign} (${pilot.value.Name})`;
})
</script>
