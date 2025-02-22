<template>
  <div class="mb-4">
    <section-header title="Talents">
      <cc-modal v-if="!pilot.IsRemote" title="Set Pilot Talents" icon="cc:trait">
        <template #activator="{ open }">
          <section-edit-chip
            v-if="!pilot.IsRemote"
            :highlight="!pilot.TalentsController.HasFullTalents"
            :current="pilot.TalentsController.CurrentTalentPoints"
            :max="pilot.TalentsController.MaxTalentPoints"
            :label="`Edit Pilot Talents (${pilot.TalentsController.CurrentTalentPoints}/${pilot.TalentsController.MaxTalentPoints})`"
            @open-selector="open" />
        </template>
        <talent-selector :pilot="pilot" />
      </cc-modal>
    </section-header>

    <v-container class="px-0">
      <no-data-block v-if="!pilot.TalentsController.Talents.length" />
      <cc-talent
        v-for="t in pilot.TalentsController.Talents"
        hide-locked
        :talent="t.Talent"
        :rank="t.Rank"
        :terse="view === 'terse'"
        :small="view === 'small'"
        in-column
        hide-change />
    </v-container>
  </div>
</template>

<script lang="ts">
import SectionHeader from '../../components/SectionHeader.vue';
import SectionEditChip from '../../components/SectionEditChip.vue';
import NoDataBlock from '../../components/NoDataBlock.vue';
import TalentSelector from '@/features/pilot_management/_components/selectors/TalentSelector.vue';
import { Pilot } from '@/class';

import { UserStore } from '@/stores';

export default {
  name: 'skill-block',
  components: { SectionHeader, SectionEditChip, NoDataBlock, TalentSelector },
  props: {
    pilot: {
      type: Object as () => Pilot,
      required: true,
    },
  },
  data: () => ({
    view: 'full',
  }),
};
</script>
