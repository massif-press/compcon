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
    <v-dialog v-model="showConfirmation">
      <cc-confirmation
        cancellable
        :content="`The following stats have been changed from their default values:<br><br> ${changed.join(
          ', '
        )}<br><br>Changing NPC tier will overwrite these values with the tier default. Continue?`"
        @confirm="overwrite()"
        @cancel="cancel()" />
    </v-dialog>
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
      // this.changed = Object.keys(this.item.ChangedStats);
      // if (this.changed.length > 0) {
      //   this.stagedTier = tier;
      //   this.showConfirmation = true;
      // } else {
      //   this.item.Tier = tier;
      // }
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
