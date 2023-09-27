<template>
  <div class="my-3">
    <section-header
      title="Reserves and Bonuses"
      label="Add Reserves and Bonuses"
      editable
      @edit="($refs as any).dtSelector.show()"
    />

    <cc-solo-dialog
      ref="dtSelector"
      icon="cc:barrage"
      no-confirm
      title="Edit Reserves and Bonuses"
      fullscreen
      no-pad
    >
      <reserve-selector :pilot="pilot" @close="($refs as any).dtSelector.hide()" />
    </cc-solo-dialog>
    <v-container>
      <no-data-block
        v-if="
          !pilot.ReservesController.Reserves.length &&
          !pilot.ReservesController.Organizations.length
        "
      />
      <v-row v-else>
        <cc-reserve-item
          v-for="(r, i) in pilot.ReservesController.Reserves"
          :reserve="r"
          @remove="pilot.ReservesController.RemoveReserve(i)"
        />
        <cc-org-item
          v-for="(o, i) in pilot.ReservesController.Organizations"
          :org="o"
          @remove="pilot.ReservesController.RemoveOrganization(i)"
        />
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
