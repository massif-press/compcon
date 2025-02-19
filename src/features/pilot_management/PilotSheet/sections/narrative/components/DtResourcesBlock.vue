<template>
  <div class="my-3">
    <cc-modal title="Add Reserves and Bonuses" icon="cc:barrage">
      <template #activator="{ open }">
        <section-header
          title="Reserves and Bonuses"
          label="Add Reserves and Bonuses"
          :editable="!pilot.IsRemote"
          @edit="open" />
      </template>
      <template #default="{ close }">
        <reserve-selector :pilot="pilot" @close="close" />
      </template>
    </cc-modal>

    <v-container>
      <no-data-block
        v-if="
          !pilot.ReservesController.Reserves.length &&
          !pilot.ReservesController.Organizations.length
        " />
      <v-row v-else>
        <v-col cols="12" md="6" lg="4" v-for="(r, i) in pilot.ReservesController.Reserves">
          <cc-reserve-item :reserve="r" @remove="pilot.ReservesController.RemoveReserve(i)" />
        </v-col>
        <v-col cols="12" md="6" lg="4" v-for="(o, i) in pilot.ReservesController.Organizations">
          <cc-org-item :org="o" @remove="pilot.ReservesController.RemoveOrganization(i)" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import SectionHeader from '../../components/SectionHeader.vue';
import NoDataBlock from '../../components/NoDataBlock.vue';
import ReserveSelector from '@/features/pilot_management/_components/selectors/ReserveSelector.vue';

export default {
  name: 'dt-resources-block',
  components: { SectionHeader, NoDataBlock, ReserveSelector },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
};
</script>
