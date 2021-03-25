<template>
  <div>
    <cc-title small color="pilot" class="pl-3" style="margin-left: -50px!important">
      <span class="pl-12">Special Equipment</span>
    </cc-title>
    <cc-solo-dialog
      ref="specialSelector"
      icon="mdi-star-circle-outline"
      no-confirm
      title="Manage Special Equipment"
      fullscreen
    >
      <cc-equipment-selector :pilot="pilot" @select="addItem($event)" />
    </cc-solo-dialog>
    <cc-solo-dialog
      ref="exoticSelector"
      icon="mdi-star-circle-outline"
      no-confirm
      title="Manage Exotic Equipment"
      fullscreen
    >
      <cc-exotic-selector :pilot="pilot" @select="addItem($event)" />
    </cc-solo-dialog>
    <v-container>
      <v-row dense class="mb-2">
        <v-col>
          <v-btn tile block @click="$refs.specialSelector.show()">Add Standard Equipment</v-btn>
        </v-col>
        <v-col>
          <v-btn tile block @click="$refs.exoticSelector.show()">Add Exotic Equipment</v-btn>
        </v-col>
      </v-row>
      <no-data-block v-if="!pilot.SpecialEquipment.length" />
      <v-row v-else dense justify="space-around">
        <v-col
          v-for="i in pilot.SpecialEquipment"
          :key="`special_${i.ID}`"
          cols="12"
          md="4"
          class="text-center"
        >
          <cc-item-modal :item="i" style="display: inline-block" />
          <v-btn icon small class="fadeSelect" style="display: inline-block" @click="removeItem(i)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import NoDataBlock from '../../components/NoDataBlock.vue'

export default Vue.extend({
  name: 'special-block',
  components: { NoDataBlock },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  methods: {
    addItem(item) {
      this.pilot.AddSpecialEquipment(item)
      this.$refs.specialSelector.hide()
      this.$refs.exoticSelector.hide()
    },
    removeItem(item) {
      this.pilot.RemoveSpecialEquipment(item)
    },
  },
})
</script>
