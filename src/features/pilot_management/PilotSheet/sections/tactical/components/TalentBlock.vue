<template>
  <div>
    <cc-title small color="pilot" class="pl-3" style="margin-left: -50px!important">
      <section-edit-chip
        :highlight="!pilot.HasFullTalents"
        :current="pilot.CurrentTalentPoints"
        :max="pilot.MaxTalentPoints"
        :label="`Edit Pilot Talents (${pilot.CurrentTalentPoints}/${pilot.MaxTalentPoints})`"
        @open-selector="$refs.talentSelector.show()"
      />
      Talents
    </cc-title>
    <cc-solo-dialog
      ref="talentSelector"
      icon="cci-trait"
      no-confirm
      title="Set Pilot Talents"
      fullscreen
    >
      <cc-talent-selector :pilot="pilot" />
    </cc-solo-dialog>
    <v-container class="px-0">
      <no-data-block v-if="!pilot.Talents.length" />
      <v-row v-else dense justify="center">
        <v-col v-for="(t, i) in pilot.Talents" :key="`t_${i}`" cols="12" lg="6" xl="4">
          <cc-talent-item
            :available="pilot.MaxTalentPoints > pilot.CurrentTalentPoints"
            :talent="t.Talent"
            :rank="t.Rank"
            hide-locked
            action-buttons
            color="pilot"
            item-color="secondary"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SectionEditChip from '../../components/SectionEditChip.vue'
import NoDataBlock from '../../components/NoDataBlock.vue'

export default Vue.extend({
  name: 'skill-block',
  components: { SectionEditChip, NoDataBlock },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
})
</script>
