<template>
  <div>
    <section-header title="Special Equipment" />
    <cc-solo-dialog
      ref="specialSelector"
      icon="mdi-star-circle-outline"
      no-confirm
      title="Manage Special Equipment"
      fullscreen
    >
      <equipment-selector :pilot="pilot" @select="addItem($event)" />
    </cc-solo-dialog>
    <cc-solo-dialog
      ref="exoticSelector"
      icon="mdi-star-circle-outline"
      no-confirm
      title="Manage Exotic Equipment"
      fullscreen
    >
      <equipment-selector :pilot="pilot" exotic @select="addItem($event)" />
    </cc-solo-dialog>
    <v-container>
      <no-data-block v-if="!pilot.SpecialEquipment.length" />
      <v-row v-else density="compact" justify="space-around">
        <v-col v-for="i in pilot.SpecialEquipment" cols="12" md="4" class="text-center">
          <cc-item-modal :item="i" style="display: inline-block" />
          <v-btn icon small variant="plain" style="display: inline-block" @click="removeItem(i)">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-col>
      </v-row>

      <v-row class="my-1">
        <v-col>
          <v-btn
            color="accent"
            variant="outlined"
            block
            @click="($refs as any).specialSelector.show()"
            >Add Standard Equipment</v-btn
          >
        </v-col>
        <v-col>
          <v-btn
            color="accent"
            variant="outlined"
            block
            @click="($refs as any).exoticSelector.show()"
            >Add Exotic Equipment</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import SectionHeader from '../../components/SectionHeader.vue';
import NoDataBlock from '../../components/NoDataBlock.vue';
import EquipmentSelector from '../../../../_components/selectors/EquipmentSelector.vue';

export default {
  name: 'special-block',
  components: { SectionHeader, NoDataBlock, EquipmentSelector },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  methods: {
    addItem(item) {
      this.pilot.AddSpecialEquipment(item);
      (this.$refs.specialSelector as any).hide();
      (this.$refs.exoticSelector as any).hide();
    },
    removeItem(item) {
      this.pilot.RemoveSpecialEquipment(item);
    },
  },
};
</script>
