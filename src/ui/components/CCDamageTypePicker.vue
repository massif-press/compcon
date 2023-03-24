<template>
  <v-dialog v-model="dialog" width="35vw">
    <v-card tile class="text-center">
      <v-card-text>
        <span class="heading h2">Select Damage Type</span>
        <v-row>
          <v-col v-for="t in availableTypes" :key="`${t} Damage`">
            <div class="clip-icon">
              <cc-tooltip simple inline :content="t">
                <v-btn
                  x-large
                  icon
                  :color="`damage--${t.toLowerCase()}`"
                  @click="select(t)"
                >
                  <v-icon size="60px">cc:{{ t.toLowerCase() }}</v-icon>
                </v-btn>
              </cc-tooltip>
            </div>
          </v-col>
        </v-row>
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
      availableTypes: [],
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
