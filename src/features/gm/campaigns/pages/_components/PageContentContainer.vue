<template>
  <v-row align="start">
    <v-col>
      <cc-rollable-table
        v-if="item.ItemType === 'RollableTable'"
        :table="item"
        no-delete
      />
      <cc-clock v-else-if="item.ItemType === 'Clock'" :clock="item" no-delete />
      <text-editor v-else :item="item" />
    </v-col>
    <v-col cols="auto" class="fade-select">
      <cc-tooltip left content="Move Up">
        <v-btn icon small @click="$emit('move-up')"
          ><v-icon icon="mdi-arrow-up"
        /></v-btn>
      </cc-tooltip>
      <cc-tooltip left content="Move Down">
        <v-btn icon small @click="$emit('move-down')"
          ><v-icon icon="mdi-arrow-down"
        /></v-btn>
      </cc-tooltip>
      <cc-tooltip left content="Delete Item">
        <v-menu offset-x left>
          <template v-slot:activator="{ props }">
            <v-btn small icon v-bind="props">
              <v-icon icon="mdi-delete" />
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              Do you want to delete this item? This action cannot be undone.
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn small color="error" @click="$emit('delete-item')"
                >Confirm Deletion</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-menu>
      </cc-tooltip>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import TextEditor from './TextEditor.vue';

export default {
  name: 'campaign-page-content-container',
  components: { TextEditor },
  props: { item: { type: Object, required: true } },
};
</script>
