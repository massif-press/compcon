<template>
  <v-row dense>
    <v-col cols="auto">
      <div class="text-cc-overline text-disabled mt-2">ACTIVE EFFECTS</div>
    </v-col>
    <!-- <v-spacer /> -->
    <!-- <v-col cols="auto">
      <v-btn-group flat tile density="compact" style="max-height: 24px !important">
        <v-tooltip location="top" text="Sort by duration">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              size="small"
              color="panel"
              height="24"
              @click="sortBy('duration')">
              <v-icon size="18" icon="mdi-timer-sand" />
            </v-btn>
          </template>
</v-tooltip>
<v-tooltip location="top" text="Sort by usage">
  <template #activator="{ props }">
            <v-btn v-bind="props" size="small" color="panel" height="24" @click="sortBy('usage')">
              <v-icon size="18" icon="mdi-reiterate" />
            </v-btn>
          </template>
</v-tooltip>
<v-tooltip location="top" text="Sort alphabetically">
  <template #activator="{ props }">
            <v-btn v-bind="props" size="small" color="panel" height="24" @click="sortBy()">
              <v-icon size="18" icon="mdi-sort-alphabetical-ascending" />
            </v-btn>
          </template>
</v-tooltip>
</v-btn-group>
</v-col>

<v-col cols="auto">
  <v-btn-toggle v-model="showTypes" flat tile multiple density="compact"
    style="max-height: 24px !important">
    <v-tooltip location="top" text="Passive effects">
      <template #activator="{ props }">
            <v-btn value="passive" v-bind="props" size="small" color="primary" height="24">
              <v-icon size="18" icon="cc:trait" />
            </v-btn>
          </template>
    </v-tooltip>
    <v-tooltip location="top" text="Damage-dealing effects">
      <template #activator="{ props }">
            <v-btn value="damage" v-bind="props" size="small" color="primary" height="24">
              <v-icon size="18" icon="cc:eclipse" />
            </v-btn>
          </template>
    </v-tooltip>
    <v-tooltip location="top" text="Status-dealing effects">
      <template #activator="{ props }">
            <v-btn value="status" v-bind="props" size="small" color="primary" height="24">
              <v-icon size="18" icon="cc:status_exposed" />
            </v-btn>
          </template>
    </v-tooltip>
    <v-tooltip location="top" text="Effects with saving throws">
      <template #activator="{ props }">
            <v-btn value="save" v-bind="props" size="small" color="primary" height="24">
              <v-icon size="18" icon="mdi-dice-d20" />
            </v-btn>
          </template>
    </v-tooltip>
    <v-tooltip location="top" text="Effects with Resistances/Immunities">
      <template #activator="{ props }">
            <v-btn value="resistance" v-bind="props" size="small" color="primary" height="24">
              <v-icon size="18" icon="mdi-shield-half-full" />
            </v-btn>
          </template>
    </v-tooltip>
    <v-tooltip location="top" text="Other effects">
      <template #activator="{ props }">
            <v-btn value="other" v-bind="props" size="small" color="primary" height="24">
              <v-icon size="18" icon="mdi-hexagon-multiple" />
            </v-btn>
          </template>
    </v-tooltip>
    <v-tooltip location="top" text="Special effects">
      <template #activator="{ props }">
            <v-btn value="special" v-bind="props" size="small" color="primary" height="24">
              <v-icon size="18" icon="mdi-star-four-points-circle" />
            </v-btn>
          </template>
    </v-tooltip>
  </v-btn-toggle>
</v-col> -->

    <v-col cols="auto">
      <v-btn-group flat
        tile
        density="compact"
        style="max-height: 24px !important">
        <!-- <v-tooltip location="top" text="Clean up expired effects">
          <template #activator="{ props }">
            <v-btn v-bind="props" size="small" icon>
              <v-icon size="16" icon="mdi-recycle" />
            </v-btn>
          </template>
        </v-tooltip>
        &emsp; -->
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
      cols="auto">
      <cc-active-effect-chip :key="`ae_${idx}_${ae.Name}`"
        :active-effect="ae"
        :owner="item"
        :encounter="encounter" />
    </v-col>
    <v-col cols="auto"
      v-if="hidden > 0">
      <v-chip size="x-small"
        class="pa-2"
        flat
        style="opacity: 0.75">
        +{{ hidden }} Hidden Effects
      </v-chip>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'active-effect-panel',
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
