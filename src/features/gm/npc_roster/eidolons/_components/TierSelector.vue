<template>
  <div class="text-overline mt-3">EIDOLON TIER</div>
  <v-row dense align="center">
    <v-col cols="auto">
      <v-btn
        v-for="i in 3"
        @click="updateTier(i)"
        :variant="item.Tier === i ? 'tonal' : 'text'"
        :color="item.Tier === i ? 'accent' : ''"
        class="mx-1">
        <v-icon start>cc:rank_1</v-icon>
        Tier {{ i }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'layer-tier-selector',
  props: { item: { type: Object, required: true } },
  data: () => ({
    showConfirmation: false,
    changed: [] as string[],
    stagedTier: 0,
  }),
  emits: ['update'],
  methods: {
    confirm() {
      this.showConfirmation = false;
      this.$emit('update');
    },
    cancel() {
      this.changed = [];
      this.stagedTier = 0;
      this.showConfirmation = false;
    },
    updateTier(tier: number) {
      this.item.Tier = tier;
    },
    overwrite() {
      this.item.Tier = this.stagedTier;
      this.stagedTier = 0;
      this.changed = [];
      this.confirm();
    },
  },
};
</script>
