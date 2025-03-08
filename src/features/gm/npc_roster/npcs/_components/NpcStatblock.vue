<template>
  <v-card-text>
    <div class="text-right mb-2">
      <cc-switch v-model="narrativeElements" label="Include Narrative Elements" />
    </div>

    <v-textarea
      :value="statblock"
      auto-grow
      readonly
      rows="20"
      hide-details
      variant="outlined"
      class="flavor-text" />
    <div class="text-right my-4">
      <cc-button prepend-icon="mdi-clipboard-text-outline" color="accent" @click="copy()">
        Copy to Clipboard
      </cc-button>
    </div>
  </v-card-text>
</template>

<script lang="ts">
import { Statblock } from '@/class';
import { Unit } from '@/classes/npc/unit/Unit';

export default {
  name: 'statblock-dialog',
  props: {
    item: {
      type: Unit,
      required: true,
    },
  },
  data: () => ({
    narrativeElements: false,
  }),
  computed: {
    statblock(): string {
      return Statblock.GenerateNPC(this.item, this.narrativeElements);
    },
  },

  methods: {
    copy() {
      navigator.clipboard
        .writeText(this.statblock)
        .then(() =>
          this.$notify({
            title: 'Statblock Copied to Clipboard',
            text: 'Copy Success',
            data: { icon: 'mdi-clipboard-text-outline' },
          })
        )
        .catch(() =>
          this.$notify({
            title: 'Error',
            text: 'Unable to copy statblock',
            data: { icon: 'mdi-clipboard-text-outline', color: 'error' },
          })
        );
    },
  },
};
</script>
