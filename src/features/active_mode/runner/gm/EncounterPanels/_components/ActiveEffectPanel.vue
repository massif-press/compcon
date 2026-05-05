<template>
  <v-row dense>
    <v-col cols="auto">
      <div class="text-cc-overline text-disabled mt-2">ACTIVE EFFECTS</div>
    </v-col>

    <v-col cols="auto">
      <v-btn-group flat
        tile
        density="compact"
        style="max-height: 24px !important">
        <v-tooltip location="top"
          :text="`${hideUsed ? 'Hiding' : 'Showing'} used/expired effects`">
          <template #activator="{ props }">
            <v-btn v-bind="props"
              size="small"
              icon
              @click="hideUsed = !hideUsed">
              <v-icon :color="hideUsed ? 'primary' : ''"
                size="18"
                icon="mdi-eye-off" />
            </v-btn>
          </template>
        </v-tooltip>
      </v-btn-group>
    </v-col>
  </v-row>

  <v-row no-gutters
    class="mt-2">
    <v-col v-for="(ae, idx) in sortedActiveEffects"
      :key="`ae_${idx}_${ae.Name}`"
      cols="auto">
      <cc-active-effect-chip :active-effect="ae"
        :owner="item"
        :encounter="encounter" />
    </v-col>
    <v-col v-if="hidden > 0"
      cols="auto">
      <v-chip size="x-small"
        class="pa-2"
        flat
        style="opacity: 0.75">
        +{{ hidden }} Hidden Effects
      </v-chip>
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'ActiveEffectPanel',
  props: {
    item: {
      type: Object,
      required: true,
    },
    encounter: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    sortMode: '',
    sortDir: 'asc',
    hideUsed: true,
    showTypes: ['passive', 'damage', 'status', 'save', 'resistance', 'other', 'special'],
  }),
  computed: {
    sortedActiveEffects() {
      let out = this.item.CombatController.SortedActiveEffects(this.sortMode, this.sortDir);
      if (this.hideUsed) {
        out = out.filter((ae) => !ae.Applied);
      }

      return out;
    },
    hidden() {
      return this.item.CombatController.ActiveEffects.length - this.sortedActiveEffects.length;
    },
  },
  methods: {
    sortBy(criteria) {
      if (this.sortMode === criteria) {
        this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortDir = 'asc';
      }
      this.sortMode = criteria || '';
    },
  },
};
</script>

<style scoped></style>
