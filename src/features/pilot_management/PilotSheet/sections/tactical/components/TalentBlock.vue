<template>
  <div class="mb-4">
    <v-row no-gutters>
      <v-col cols="auto">
        <cc-title
          small
          color="pilot"
          class="pl-3"
          style="margin-left: -50px !important"
        >
          <section-edit-chip
            :highlight="!pilot.TalentsController.HasFullTalents"
            :current="pilot.TalentsController.CurrentTalentPoints"
            :max="pilot.TalentsController.MaxTalentPoints"
            :label="`Edit Pilot Talents (${pilot.TalentsController.CurrentTalentPoints}/${pilot.TalentsController.MaxTalentPoints})`"
            @open-selector="$refs.talentSelector.show()"
          />
          Talents
        </cc-title>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <v-btn-toggle v-model="ctype" mandatory>
          <v-btn value="full"><v-icon icon="mdi-view-stream" /></v-btn>
          <v-btn value="terse"><v-icon icon="mdi-view-list" /></v-btn>
          <v-btn value="small"><v-icon icon="mdi-view-comfy" /></v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <v-container class="px-0">
      <no-data-block v-if="!pilot.TalentsController.Talents.length" />
      <v-row v-else density="compact" justify="center">
        <cc-talent
          v-for="(t, i) in pilot.TalentsController.Talents"
          hide-locked
          :talent="t.Talent"
          :rank="t.Rank"
          :terse="ctype === 'terse'"
          :small="ctype === 'small'"
        />
      </v-row>
    </v-container>
    <cc-solo-dialog
      ref="talentSelector"
      icon="cc:trait"
      no-confirm
      title="Set Pilot Talents"
      fullscreen
    >
      <cc-talent-selector :pilot="pilot" />
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import SectionEditChip from '../../components/SectionEditChip.vue';
import NoDataBlock from '../../components/NoDataBlock.vue';

import { UserStore } from '@/stores';

export default {
  name: 'skill-block',
  components: { SectionEditChip, NoDataBlock },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  computed: {
    profile() {
      return UserStore().UserProfile;
    },
    ctype: {
      get: function (): string {
        return this.profile.GetView('talents');
      },
      set: function (newval: string) {
        this.profile.SetView('talents', newval);
      },
    },
  },
};
</script>
