<template>
  <i v-html="item.Terse" class="text-accent" />
  <br />
  <p v-html="item.Detail" class="my-1" />

  <v-table v-if="item.Table">
    <thead>
      <tr>
        <th class="text-center">
          <v-icon v-for="n in diceQuantity" size="35" :icon="diceIcon" />
        </th>
        <th class="text-overline">Result</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="result in item.Table.results">
        <td v-if="result.min === result.max" class="text-center">{{ result.min }}</td>
        <td v-else class="text-center">{{ result.min }}&ndash;{{ result.max }}</td>
        <td v-html="result.text" class="text-text" />
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts">
export default {
  name: 'cc-downtime-action-card',
  props: {
    item: {
      type: Object,
      required: true,
    },
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
