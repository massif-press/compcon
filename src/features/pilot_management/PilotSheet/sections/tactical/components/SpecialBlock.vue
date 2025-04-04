<template>
  <div>
    <section-header title="Special Equipment" class="mb-4" />
    <no-data-block v-if="!pilot.SpecialEquipment.length" />
    <v-card v-else flat tile border>
      <v-row density="compact" justify="space-around">
        <v-col v-for="i in pilot.SpecialEquipment" cols="12" md="6" lg="4" class="text-center">
          <v-chip tile class="ma-2">
            <cc-item-modal :item="i" />
            <cc-button
              v-if="!pilot.IsRemote"
              icon="mdi-delete"
              size="small"
              color="error"
              variant="text"
              style="display: inline-block"
              @click="removeItem(i)"></cc-button>
          </v-chip>
        </v-col>
      </v-row>
    </v-card>

    <v-row class="mt-1 mb-5" v-if="!pilot.IsRemote">
      <v-col>
        <cc-modal title="Add Standard Equipment" icon="mdi-star-circle-outline">
          <template #activator="{ open }">
            <cc-button
              v-if="!pilot.IsRemote"
              size="x-small"
              color="primary"
              block
              prepend-icon="mdi-plus"
              @click="open">
              Add Equipment
            </cc-button>
          </template>
          <template #default="{ close }">
            "
            <equipment-selector :pilot="pilot" @equip="addItem($event, close)" />
          </template>
        </cc-modal>
      </v-col>
      <v-col>
        <cc-modal title="Add Exotic Equipment" icon="mdi-star-circle-outline">
          <template #activator="{ open }">
            <cc-button size="x-small" color="exotic" block prepend-icon="mdi-plus" @click="open">
              Add Exotic Equipment
            </cc-button>
          </template>
          <template #default="{ close }">
            "
            <equipment-selector :pilot="pilot" exotic @equip="addItem($event, close)" />
          </template>
        </cc-modal>
      </v-col>
    </v-row>
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
    addItem(item, close) {
      this.pilot.AddSpecialEquipment(item);
      close();
    },
    removeItem(item) {
      this.pilot.RemoveSpecialEquipment(item);
    },
  },
};
</script>
