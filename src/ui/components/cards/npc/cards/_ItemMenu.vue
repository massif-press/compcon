<template>
  <span>
    <v-menu offset-x left>
      <template v-slot:activator="{ on }">
        <v-icon icon dark class="fadeSelect" v-on="on">mdi-settings</v-icon>
      </template>
      <v-list dense>
        <v-list-item :disabled="item.Tier === 3" @click="upgradeTier()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon>mdi-arrow-up-thick</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Upgrade Tier</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :disabled="item.Tier === 1" @click="downgradeTier()">
          <v-list-item-icon class="ma-0 mr-2 mt-2">
            <v-icon>mdi-arrow-down-thick</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Downgrade Tier</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="$refs.cName.show()">
          <v-list-item-icon class="ma-0 mr-2 mt-2">
            <v-icon>mdi-circle-edit-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Set Custom Name</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="$refs.cDesc.show()">
          <v-list-item-icon class="ma-0 mr-2 mt-2">
            <v-icon>mdi-circle-edit-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Set Custom Description</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <div>
          <v-divider />
          <v-list-item @click="$emit('remove-feature', $event)">
            <v-list-item-icon class="ma-0 mr-2 mt-2">
              <v-icon color="error">mdi-delete</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Remove {{ item.Feature.FeatureType }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>
    </v-menu>
    <cc-string-edit-dialog
      ref="cName"
      :placeholder="item.Feature.Name"
      label="Custom Item Name"
      @save="item.Name = $event"
      @reset="item.Name = item.Feature.Name"
    />
    <cc-string-edit-dialog
      ref="cDesc"
      :placeholder="item.Feature.Description"
      label="Custom Item Description"
      @save="item.Description = $event"
      @reset="item.Description = ''"
    />
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'npc-item-menu',
  props: {
    item: { type: Object, required: true },
  },
  methods: {
    upgradeTier() {
      this.item.Tier++
      this.$emit('recalc')
    },
    downgradeTier() {
      this.item.Tier--
      this.$emit('recalc')
    },
  },
})
</script>
