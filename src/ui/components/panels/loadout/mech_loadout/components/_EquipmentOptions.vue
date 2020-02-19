<template>
  <span v-if="item">
    <v-menu offset-y top @click.stop>
      <template v-slot:activator="{ on: menu }">
        <v-btn dark small class="ml-n3 mt-n1 ml-0 fadeSelect" icon v-on="menu" @click.stop>
          <v-icon small>mdi-settings</v-icon>
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item @click="$emit('swap')">
          <v-list-item-icon class="ma-0 mr-2 mt-2">
            <v-icon>mdi-swap-vertical-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Change Item</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item v-if="!item.Destroyed" @click="item.Destroy()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon>mdi-image-broken-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Mark as Destroyed</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-else @click="item.Repair()">
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
        <v-list-item @click="cn_dialog = true">
          <v-list-item-icon class="ma-0 mr-2 mt-2">
            <v-icon>mdi-circle-edit-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Set Custom Name</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="cd_dialog = true">
          <v-list-item-icon class="ma-0 mr-2 mt-2">
            <v-icon>mdi-circle-edit-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Set Custom Description</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item @click="$emit('remove')">
          <v-list-item-icon class="ma-0 mr-2 mt-2">
            <v-icon color="error">mdi-delete</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Remove Item</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-dialog v-if="item" v-model="cn_dialog" width="40vw">
      <v-card tile>
        <v-text-field
          v-model="item.Name"
          :label="`Set custom name for ${item.Name}`"
          outlined
          autofocus
          hide-details
          class="pa-2"
          @keyup.enter="cn_dialog = false"
        />
      </v-card>
    </v-dialog>
    <v-dialog v-if="item" v-model="cd_dialog" width="50vw">
      <v-card tile>
        <v-card-text>
          <v-textarea
            v-model="item.Description"
            :label="`Set custom description for ${item.Name}`"
            outlined
            autofocus
            hide-details
            no-resize
            class="pa-1 pt-5 mt-2"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
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
  data: () => ({
    cn_dialog: false,
    cd_dialog: false,
  }),
})
</script>
