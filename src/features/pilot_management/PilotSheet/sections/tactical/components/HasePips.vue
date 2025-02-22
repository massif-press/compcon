<template>
  <span class="text-uppercase stat-text">{{ title }}</span>
  <span class="flavor-text text--disabled pl-2">({{ skillPoints || 0 }})</span>
  <v-tooltip :text="tooltip()">
    <template #activator="{ props }">
      <span v-bind="props">
        <v-icon
          v-if="filled"
          v-for="n in filled"
          color="secondary"
          size="large"
          icon="mdi-hexagon" />
        <v-icon
          v-if="empty"
          v-for="n in empty"
          color="secondary"
          size="large"
          icon="mdi-hexagon-outline" />
      </span>
    </template>
  </v-tooltip>
</template>

<script lang="ts">
export default {
  name: 'hase-pips',
  props: {
    title: {
      type: String,
      required: true,
    },
    skillPoints: {
      type: Number,
      required: true,
    },
  },
  computed: {
    filled(): number {
      return this.skillPoints;
    },
    empty(): number {
      return 6 - this.filled;
    },
  },
  methods: {
    //TODO: move into rules util class
    tooltip(): string {
      switch (this.title) {
        case 'hull':
          return `MECH HP <b>+${this.skillPoints * 2}</b><br>REPAIR CAPACITY <b>+${Math.floor(
            this.skillPoints / 2
          )}</b>`;
        case 'agility':
          return `EVASION <b>+${this.skillPoints}</b><br>SPEED <b>+${Math.floor(
            this.skillPoints / 2
          )}</b>`;
        case 'systems':
          return `E-DEFENSE <b>+${this.skillPoints}</b><br>TECH ATTACK <b>+${
            this.skillPoints
          }</b><br>SP <b>+${Math.floor(this.skillPoints / 2)}</b>`;
        case 'engineering':
          return `HEAT CAPACITY <b>+${
            this.skillPoints
          }</b><br>LIMITED SYSTEMS BONUS <b>+${Math.floor(this.skillPoints / 2)}</b>`;
        default:
          return '';
      }
    },
  },
};
</script>
