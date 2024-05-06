<template>
  <div class="mb-4">
    <v-row no-gutters>
      <v-col cols="auto">
        <section-header title="Talents">
          <section-edit-chip
            :highlight="!pilot.TalentsController.HasFullTalents"
            :current="pilot.TalentsController.CurrentTalentPoints"
            :max="pilot.TalentsController.MaxTalentPoints"
            :label="`Edit Pilot Talents (${pilot.TalentsController.CurrentTalentPoints}/${pilot.TalentsController.MaxTalentPoints})`"
            @open-selector="($refs as any).talentSelector.show()" />
        </section-header>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <v-btn-toggle v-model="view" mandatory>
          <v-btn value="full"><v-icon icon="mdi-view-stream" /></v-btn>
          <v-btn value="terse"><v-icon icon="mdi-view-list" /></v-btn>
          <v-btn value="small"><v-icon icon="mdi-view-comfy" /></v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

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
    <cc-solo-dialog
      ref="talentSelector"
      icon="cc:trait"
      no-confirm
      title="Set Pilot Talents"
      fullscreen>
      <talent-selector :pilot="pilot" modal />
    </cc-solo-dialog>
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
    view: 'terse',
  }),
  mounted() {
    const user = UserStore().User;
    if (!user || !user.View) return;
    this.view = user.View('talentBlockStyle', 'terse');
  },
  watch: {
    view(val) {
      if (!val) return;
      UserStore().User.SetView('talentBlockStyle', val);
    },
  },
};
</script>
