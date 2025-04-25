<template>
  <v-row dense align="center" class="heading h3 mb-1" :class="readonly ? 'pb-4' : ''">
    <v-col cols="auto" style="margin-bottom: -2px">Tier</v-col>
    <v-col cols="auto">
      <v-btn
        v-for="i in 3"
        @click="updateTier(i)"
        flat
        tile
        size="small"
        icon
        variant="tonal"
        :color="item.NpcClassController.Tier === i ? 'accent' : ''">
        <span class="heading h3">{{ i }}</span>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'npc-tier-selector',
  props: { item: { type: Object, required: true }, readonly: { type: Boolean, default: false } },
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
      this.item.NpcClassController.Tier = tier;
    },
    overwrite() {
      this.item.NpcClassController.Tier = this.stagedTier;
      this.stagedTier = 0;
      this.changed = [];
      this.confirm();
    },
  },
};
</script>
