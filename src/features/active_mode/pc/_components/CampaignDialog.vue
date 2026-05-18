<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-toolbar density="compact">
        <v-toolbar-title>Set Campaign</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-combobox v-model="campaignName"
          :items="campaigns"
          label="Campaign"
          clearable
          hide-details
          :menu-props="{ retainFocus: false }" />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
        <v-spacer />
        <v-btn variant="text" color="accent" @click="confirm">Set</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
export default {
  name: 'CampaignDialog',
  props: {
    campaigns: { type: Array, default: () => [] },
  },
  emits: ['confirm'],
  data: () => ({
    dialog: false,
    campaignName: '',
  }),
  methods: {
    open(current?: string) {
      this.campaignName = current || '';
      this.dialog = true;
    },
    confirm() {
      this.$emit('confirm', this.campaignName);
      this.dialog = false;
    },
  },
};
</script>
