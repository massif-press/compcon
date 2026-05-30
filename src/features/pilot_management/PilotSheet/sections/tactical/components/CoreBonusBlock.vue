<template>
  <div>
    <section-header title="CORE Bonuses">
      <cc-modal title="Set Pilot CORE Bonuses" icon="cc:corebonus">
        <template #activator="{ open }">
          <section-edit-chip
            v-if="!pilot.IsRemote"
            :highlight="!pilot.CoreBonusController.HasCBs"
            :current="pilot.CoreBonusController.CurrentCBPoints"
            :max="pilot.CoreBonusController.MaxCBPoints"
            :label="`Edit Pilot CORE Bonuses (${pilot.CoreBonusController.CurrentCBPoints}/${pilot.CoreBonusController.MaxCBPoints})`"
            @open-selector="open" />
        </template>
        <core-bonus-selector :pilot="pilot" />
      </cc-modal>
    </section-header>

    <v-container class="px-0">
      <no-data-block v-if="!pilot.CoreBonusController.CoreBonuses.length" />

      <cc-core-bonus-item
        v-for="item in pilot.CoreBonusController.CoreBonuses"
        :key="item.ID"
        :bonus="item"
        terse />
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import SectionHeader from '../../components/SectionHeader.vue';
import SectionEditChip from '../../components/SectionEditChip.vue';
import NoDataBlock from '../../components/NoDataBlock.vue';
import CoreBonusSelector from '@/features/pilot_management/_components/selectors/CoreBonusSelector.vue';

const _display = useDisplay()

defineOptions({ name: 'skill-block' })

const props = defineProps<{
  pilot: object
}>()

const widescreen = computed(() => {
      return _display.lgAndUp.value;
    })
</script>
