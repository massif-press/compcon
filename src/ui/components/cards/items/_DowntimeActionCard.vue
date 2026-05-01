<template>
  <i v-html-safe="item.Terse"
    class="text-accent" />
  <br />
  <p v-html-safe="item.Detail"
    class="my-1" />

  <v-table v-if="item.Table">
    <thead>
      <tr>
        <th class="text-center">
          <v-icon v-for="(n, index) in diceQuantity"
            :key="`dice-${index}`"
            size="35"
            :icon="diceIcon" />
        </th>
        <th class="text-overline">Result</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(result, index) in item.Table.results"
        :key="`result-${index}`">
        <td v-if="result.min === result.max"
          class="text-center">{{ result.min }}</td>
        <td v-else
          class="text-center">{{ result.min }}&ndash;{{ result.max }}</td>
        <td v-html-safe="result.text"
          class="text-text" />
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts">
export default {
  name: 'CcDowntimeActionCard',
  props: {
    item: {
      type: Object,
      required: true,
    },
    notes: { type: Boolean },
    smallTags: { type: Boolean },
    dense: { type: Boolean },
    charts: { type: Boolean },
    collapseActions: { type: Boolean },
    tier: { type: Number },
  },
  computed: {
    diceQuantity(): number {
      if (!this.item.Table) return 0;
      return this.item.Table.die.split('d')[0] || 1;
    },
    diceIcon(): string {
      if (!this.item.Table) return 'mdi-dice-d6';
      return `mdi-dice-d${this.item.Table.die.split('d')[1]}`;
    },
  },
};
</script>
