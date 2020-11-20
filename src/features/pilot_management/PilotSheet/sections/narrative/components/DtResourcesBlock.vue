<template>
  <div class="my-3">
    <cc-title small color="pilot">
      <section-edit-icon label="Add Downtime Reserves" @open-selector="$refs.dtSelector.show()" />
      Downtime Reserves
    </cc-title>
    <cc-solo-dialog
      ref="dtSelector"
      icon="cci-barrage"
      no-confirm
      title="Edit Downtime Resources"
      fullscreen
      no-pad
    >
      <cc-reserve-selector :pilot="pilot" @close="$refs.dtSelector.hide()" />
    </cc-solo-dialog>
    <v-container>
      <no-data-block v-if="!pilot.Reserves.length && !pilot.Organizations.length" />
      <v-row v-else>
        <cc-reserve-item
          v-for="(r, i) in pilot.Reserves"
          :key="`r_${i}`"
          :reserve="r"
          @remove="pilot.RemoveReserve(i)"
        />
        <cc-org-item
          v-for="(o, i) in pilot.Organizations"
          :key="`o_${i}`"
          :org="o"
          @remove="pilot.RemoveOrganization(i)"
        />
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SectionEditIcon from '../../components/SectionEditIcon.vue'
import NoDataBlock from '../../components/NoDataBlock.vue'

export default Vue.extend({
  name: 'dt-resources-block',
  components: { SectionEditIcon, NoDataBlock },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
})
</script>
