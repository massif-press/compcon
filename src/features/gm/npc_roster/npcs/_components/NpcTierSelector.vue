<template>
  <v-row dense align="center" :class="readonly ? 'pb-4' : ''">
    <v-col cols="1"><v-divider /></v-col>
    <v-col cols="auto">
      <div v-if="readonly">
        <v-icon start>cc:rank_{{ item.NpcClassController.Tier }}</v-icon>
      </div>
      <v-btn
        v-else
        v-for="i in 3"
        @click="updateTier(i)"
        :variant="item.NpcClassController.Tier === i ? 'tonal' : 'text'"
        :color="item.NpcClassController.Tier === i ? 'accent' : ''"
        class="mx-1">
        <v-icon start>cc:rank_{{ i }}</v-icon>
        Tier {{ i }}
      </v-btn>
    </v-col>
    <v-col><v-divider /></v-col>
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
      this.changed = Object.keys(this.item.NpcClassController.ChangedStats);
      if (this.changed.length > 0) {
        this.stagedTier = tier;
        this.showConfirmation = true;
      } else {
        this.item.NpcClassController.Tier = tier;
      }
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
