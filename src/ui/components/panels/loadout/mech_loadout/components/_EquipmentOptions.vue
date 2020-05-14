<template>
  <span v-if="item">
    <v-menu offset-y top @click.stop>
      <template v-slot:activator="{ on: menu }">
        <v-btn dark small class="ml-n3 mt-n1 ml-0 fadeSelect" icon v-on="menu" @click.stop>
          <v-icon small>mdi-settings</v-icon>
        </v-btn>
      </template>
      <v-list dense>
        <div v-if="!item.IsIntegrated">
          <v-list-item @click="$emit('swap')">
            <v-list-item-icon class="ma-0 mr-2 mt-2">
              <v-icon>mdi-swap-vertical-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Change Item</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider />
        </div>
        <v-list-item v-if="item.CanSetDamage" @click="$refs.damageTypeDialog.show()">
          <v-list-item-icon class="ma-0 mr-2 mt-2">
            <v-icon>cci-variable</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Select Damage Type</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="item.CanSetUses" @click="$refs.maxUseDialog.show()">
          <v-list-item-icon class="ma-0 mr-2 mt-2">
            <v-icon>mdi-dice-6</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Set Max Uses</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="!item.Destroyed && !item.IsIndestructible" @click="item.Destroy()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon>mdi-image-broken-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Mark as Destroyed</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-else-if="!item.IsIndestructible" @click="item.Repair()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon>mdi-wrench</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Mark as Repaired</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <div v-if="item.IsLoading">
          <v-list-item v-if="item.Loaded" @click="item.Loaded = false">
            <v-list-item-icon class="ma-0 mr-2 mt-3">
              <v-icon>mdi-progress-download</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Mark as Unloaded</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-else @click="item.Loaded = true">
            <v-list-item-icon class="ma-0 mr-2 mt-3">
              <v-icon>mdi-progress-upload</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Mark as Loaded</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
        <div v-if="item.IsAI">
          <v-list-item v-if="!item.IsCascading" @click="item.Unshackle()">
            <v-list-item-icon class="ma-0 mr-2 mt-3">
              <v-icon>mdi-link-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Mark as Cascading</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-else @click="item.Shackle()">
            <v-list-item-icon class="ma-0 mr-2 mt-3">
              <v-icon>mdi-link-variant-off</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Clear Cascading Status</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
        <v-divider />
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
        <div v-if="!item.IsIntegrated">
          <v-divider />
          <v-list-item @click="$emit('remove')">
            <v-list-item-icon class="ma-0 mr-2 mt-2">
              <v-icon color="error">mdi-delete</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Remove Item</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>
    </v-menu>
    <cc-string-edit-dialog
      v-if="item"
      ref="cName"
      :placeholder="item.Name"
      label="Custom Item Name"
      @save="item.Name = $event"
      @reset="item.Name = ''"
    />
    <cc-string-edit-dialog
      v-if="item"
      ref="cDesc"
      :placeholder="item.Description"
      label="Custom Item Description"
      @save="item.Description = $event"
      @reset="item.Description = ''"
    />
    <cc-damage-type-picker
      v-if="item"
      ref="damageTypeDialog"
      :allowed-types="['Explosive', 'Energy', 'Kinetic']"
      @select="item.DamageTypeOverride = $event"
    />
    <cc-string-edit-dialog
      v-if="item"
      ref="maxUseDialog"
      number
      label="Set Maximum Uses"
      @save="item.MaxUseOverride = $event"
    />
  </span>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'equipment-options-menu',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
})
</script>
