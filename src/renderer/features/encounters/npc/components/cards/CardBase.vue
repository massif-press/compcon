<template>
  <v-card flat tile class="my-1">
    <v-card-title :class="`${item.Feature.Color} sliced`" style="max-height:15px; line-height: 0">
      <div
        :class="`heading flavor-text white--text ${readonly ? 'mt-n1' : 'mt-n2'}`"
        style="font-size:20px; line-height: 0"
      >
        <v-menu v-if="!readonly" offset-x left>
          <template v-slot:activator="{ on }">
            <v-btn icon small dark class="fadeSelect mt-n1" v-on="on">
              <v-icon>mdi-settings</v-icon>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item :disabled="item.Tier === 3" @click="item.Tier++">
              <v-list-item-icon class="ma-0 mr-2 mt-3">
                <v-icon>mdi-arrow-up-thick</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Upgrade Tier</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :disabled="item.Tier === 1" @click="item.Tier--">
              <v-list-item-icon class="ma-0 mr-2 mt-2">
                <v-icon>mdi-arrow-down-thick</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Downgrade Tier</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
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
            <v-list-item @click="$emit('remove-feature', $event)">
              <v-list-item-icon class="ma-0 mr-2 mt-2">
                <v-icon color="error">mdi-delete</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Remove {{ item.Feature.FeatureType }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
        <span v-if="readonly">
          {{ item.Feature.Name }}
        </span>
        <span v-else>{{ item.Name }} (T{{ item.Tier }})</span>
        <span class="caption">//{{ item.Feature.Origin }}</span>
      </div>
    </v-card-title>
    <v-card-text
      class="pa-1 text--text"
      :style="`border: 1px solid var(--v-${item.Feature.Color}-base)`"
    >
      <p
        v-if="item.Description"
        class="flavor-text px-2 grey lighten-2 mb-1"
        v-html="item.Description"
      />
      <slot />
    </v-card-text>
    <v-dialog v-if="!readonly" v-model="cn_dialog" width="40vw">
      <v-card tile>
        <v-text-field
          v-model="item.Name"
          :label="`Set custom name for ${item.Feature.Name}`"
          outlined
          autofocus
          hide-details
          class="pa-2"
          @keyup.enter="cn_dialog = false"
        />
      </v-card>
    </v-dialog>
    <v-dialog v-if="!readonly" v-model="cd_dialog" width="50vw">
      <v-card tile>
        <v-card-text>
          <v-textarea
            v-model="item.Description"
            :label="`Set custom description for ${item.Feature.Name}`"
            outlined
            autofocus
            hide-details
            no-resize
            class="pa-1 pt-5 mt-2"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'npc-item-card-base',
  props: {
    item: {
      type: Object,
      required: true,
    },
    readonly: {
      type: Boolean,
    },
  },
  data: () => ({
    cn_dialog: false,
    cd_dialog: false,
  }),
})
</script>
