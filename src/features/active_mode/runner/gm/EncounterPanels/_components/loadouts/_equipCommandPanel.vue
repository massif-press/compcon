<template>
  <v-row no-gutters class="bg-panel" align="center" justify="space-between">
    <v-col>
      <v-btn
        flat
        tile
        block
        height="32"
        size="small"
        :color="item.Destroyed ? '' : item.Used ? 'success' : 'primary'"
        :disabled="item.Destroyed"
        @click="use()">
        {{ item.Used ? 'Unmark' : 'Mark' }} Used
      </v-btn>
    </v-col>
    <v-col class="px-2">
      <v-icon
        v-for="n in item.MaxUses"
        :key="n"
        :icon="n > item.Uses ? 'mdi-hexagon-outline' : 'mdi-hexagon'"
        :disabled="item.Destroyed"
        @click="setUses(n)"
        class="mr-1" />
    </v-col>
    <v-col v-if="item.MaxUses" cols="auto">
      <v-tooltip location="top" text="Reset Uses">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            size="x-small"
            tile
            variant="text"
            :disabled="item.Destroyed"
            @click="item.Uses = 0">
            <v-icon icon="mdi-reload" />
          </v-btn>
        </template>
      </v-tooltip>
    </v-col>
    <v-col cols="auto">
      <v-tooltip location="top" text="Toggle Destroyed">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            size="x-small"
            tile
            variant="text"
            :class="item.Destroyed ? 'bg-success' : 'bg-primary'"
            @click="item.Destroyed = !item.Destroyed">
            <v-icon :icon="item.Destroyed ? 'mdi-wrench' : 'mdi-cube-off'" />
          </v-btn>
        </template>
      </v-tooltip>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'EquipCommandPanel',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    setUses(n) {
      if (this.item.Uses === 1 && n === 1) {
        this.item.Uses = 0;
      } else if (this.item.MaxUses && n <= this.item.MaxUses) {
        this.item.Uses = n;
      }
    },
    use() {
      if (!this.item.Used && this.item.Uses < this.item.MaxUses) {
        this.item.Uses++;
      } else if (this.item.Used && this.item.Uses > 0) {
        this.item.Uses--;
      }
      this.item.Used = !this.item.Used;
    },
  },
};
</script>
