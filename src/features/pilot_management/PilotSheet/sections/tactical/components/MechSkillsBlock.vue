<template>
  <div>
    <section-header :title="$t('pm.level.mechSkills')">
      <cc-dialog :title="$t('pm.titles.setPilotMechSkills')"
        icon="cc:frame"
        fullscreen :close-on-click="false" major max-width="90vw">
        <template #activator="{ open }">
          <section-edit-chip v-if="!pilot.IsRemote"
            :highlight="!pilot.MechSkillsController.HasFullHASE"
            :current="pilot.MechSkillsController.CurrentHASEPoints"
            :max="pilot.MechSkillsController.MaxHASEPoints"
            :label="`Edit Pilot Mech Skills (${pilot.MechSkillsController.CurrentHASEPoints}/${pilot.MechSkillsController.MaxHASEPoints})`"
            @open-selector="open" />
        </template>
        <mech-skills-selector :pilot="pilot" />
      </cc-dialog>
    </section-header>

    <v-row class="mt-1 mb-5"
      justify="space-around">
      <v-col class="mx-2"
        style="min-width: 400px">
        <cc-tickbar v-model="pilot.MechSkillsController.Hull"
          label="hull"
          :size="mobile ? 'small' : 'default'"
          readonly
          icon="mdi-alpha-h-box-outline" />
      </v-col>
      <v-col class="mx-2"
        style="min-width: 400px">
        <cc-tickbar v-model="pilot.MechSkillsController.Agi"
          label="agility"
          :size="mobile ? 'small' : 'default'"
          readonly
          icon="mdi-alpha-a-box-outline" />
      </v-col>
      <v-col class="mx-2"
        style="min-width: 400px">
        <cc-tickbar v-model="pilot.MechSkillsController.Sys"
          label="systems"
          :size="mobile ? 'small' : 'default'"
          readonly
          icon="mdi-alpha-s-box-outline" />
      </v-col>
      <v-col class="mx-2"
        style="min-width: 400px">
        <cc-tickbar v-model="pilot.MechSkillsController.Eng"
          label="engineering"
          :size="mobile ? 'small' : 'default'"
          readonly
          icon="mdi-alpha-e-box-outline" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import SectionHeader from '../../components/SectionHeader.vue';
import SectionEditChip from '../../components/SectionEditChip.vue';
import MechSkillsSelector from '@/features/pilot_management/_components/selectors/MechSkillsSelector.vue';
import { useDisplay } from 'vuetify';
import type { Pilot } from '@/classes/pilot/Pilot'

defineProps<{ pilot: Pilot }>();

const { smAndDown: mobile } = useDisplay();
</script>
