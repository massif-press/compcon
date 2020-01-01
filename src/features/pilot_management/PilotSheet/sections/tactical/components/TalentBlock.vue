<template>
  <div>
    <cc-title small color="pilot">
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
    <v-container>
      <no-data-block v-if="!pilot.Talents.length" />
      <cc-talent-item
        v-for="(t, i) in pilot.Talents"
        v-else
        :key="`t_${i}`"
        :available="pilot.MaxTalentPoints > pilot.CurrentTalentPoints"
        :talent="t.Talent"
        :rank="t.Rank"
        hide-locked
        color="pilot"
        item-color="secondary"
      />
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
