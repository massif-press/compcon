<template>
  <div>
    <!-- <cc-logo source="gms" />
    <cc-logo source="ips-n" />
    <cc-logo source="ssc" />
    <cc-logo source="horus" />
    <cc-logo source="ha" />-->
    <skill-block :pilot="pilot" />
    <cc-title small>
      <section-edit-icon label="Edit Pilot Downtime Resources" />Downtime Resources
    </cc-title>
    <cc-title small>
      <section-edit-icon label="Edit Pilot Organizations" />Organizations
    </cc-title>
    <cc-title small>
      <span class="ml-7">&emsp;</span> Gear Loadouts
    </cc-title>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SectionEditIcon from '../components/SectionEditIcon.vue'
import SkillBlock from './components/SkillBlock.vue'

export default Vue.extend({
  name: 'narrative-view',
  components: { SkillBlock, SectionEditIcon },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
})
</script>