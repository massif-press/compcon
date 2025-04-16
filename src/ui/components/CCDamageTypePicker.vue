<template>
  <v-dialog v-model="dialog" width="35vw">
    <v-card tile class="text-center">
      <v-card-text>
        <span class="heading h2">Select Damage Type</span>
        <cc-button
          v-for="t in availableTypes"
          block
          size="small"
          class="mb-2"
          :prepend-icon="`cc:${t.toLowerCase()}`"
          :color="`damage--${t.toLowerCase()}`"
          @click="select(t)">
          {{ t }}
        </cc-button>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { DamageType } from '@/class';

export default {
  name: 'cc-damage-type-picker',
  props: {
    allowedTypes: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data: () => {
    return {
      dialog: false,
      availableTypes: [] as string[],
      selected: '',
    };
  },
  methods: {
    damageTypes(): string[] {
      return Object.keys(DamageType)
        .map((k) => DamageType[k as any])
        .sort() as string[];
    },
    show(): void {
      this.dialog = true;
    },
    hide(): void {
      this.dialog = false;
    },
    select(t: string): void {
      this.$emit('select', t);
      this.hide();
    },
  },
  created(): void {
    this.availableTypes = this.allowedTypes.length
      ? this.damageTypes().filter((x) => this.allowedTypes.includes(x))
      : this.damageTypes().filter((x) => x !== 'Variable');
  },
};
</script>
