<template>
  <div>
    <section-header title="Mech Skills">
      <cc-modal title="Set Pilot Mech Skills"
        icon="cc:frame"
        shrink>
        <template #activator="{ open }">
          <section-edit-chip v-if="!pilot.IsRemote"
            :highlight="!pilot.MechSkillsController.HasFullHASE"
            :current="pilot.MechSkillsController.CurrentHASEPoints"
            :max="pilot.MechSkillsController.MaxHASEPoints"
            :label="`Edit Pilot Mech Skills (${pilot.MechSkillsController.CurrentHASEPoints}/${pilot.MechSkillsController.MaxHASEPoints})`"
            @open-selector="open" />
        </template>
        <mech-skills-selector :pilot="<Pilot>pilot" />
      </cc-modal>
    </section-header>

    <v-row class="mt-1 mb-5"
      justify="space-around">
      <v-col class="mx-2"
        style="min-width: 400px">
        <cc-tickbar label="hull"
          :size="mobile ? 'small' : 'default'"
          readonly
          icon="mdi-alpha-h-box-outline"
          v-model="pilot.MechSkillsController.Hull" />
      </v-col>
      <v-col class="mx-2"
        style="min-width: 400px">
        <cc-tickbar label="agility"
          :size="mobile ? 'small' : 'default'"
          readonly
          icon="mdi-alpha-a-box-outline"
          v-model="pilot.MechSkillsController.Agi" />
      </v-col>
      <v-col class="mx-2"
        style="min-width: 400px">
        <cc-tickbar label="systems"
          :size="mobile ? 'small' : 'default'"
          readonly
          icon="mdi-alpha-s-box-outline"
          v-model="pilot.MechSkillsController.Sys" />
      </v-col>
      <v-col class="mx-2"
        style="min-width: 400px">
        <cc-tickbar label="engineering"
          :size="mobile ? 'small' : 'default'"
          readonly
          icon="mdi-alpha-e-box-outline"
          v-model="pilot.MechSkillsController.Eng" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import SectionHeader from '../../components/SectionHeader.vue';
import SectionEditChip from '../../components/SectionEditChip.vue';
import MechSkillsSelector from '@/features/pilot_management/_components/selectors/MechSkillsSelector.vue';
import HasePips from './HasePips.vue';
import { Pilot } from '@/class';
import { useMobile } from '@/mixins/useMobile';


export default {
  mixins: [useMobile],
  name: 'skill-block',
  components: { SectionHeader, SectionEditChip, HasePips, MechSkillsSelector },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
};
</script>
