<template>
  <cc-title>{{ text }}</cc-title>
  <span class="flavor-text" v-text="description" />
  <v-row density="compact">
    <v-col cols="auto" class="ml-auto mr-auto text-center">
      <v-btn
        color="secondary"
        :disabled="!mechSkills[val]"
        icon
        variant="plain"
        size="small"
        @click="$emit('remove')"
      >
        <v-icon size="x-large" icon="mdi-minus" />
      </v-btn>
      <v-icon v-if="filled" v-for="n in filled" color="primary" size="x-large" icon="mdi-hexagon" />
      <v-icon
        v-if="empty"
        v-for="n in empty"
        color="primary"
        size="x-large"
        icon="mdi-hexagon-outline"
      />
      <v-btn
        :disabled="!isMissingHASE"
        color="secondary"
        icon
        variant="plain"
        size="small"
        @click="$emit('add')"
      >
        <v-icon size="x-large" icon="mdi-plus" />
      </v-btn>
    </v-col>
  </v-row>
  <v-row density="compact" class="mt-n3 mb-6">
    <v-col cols="auto" class="ml-auto mr-auto text-center">
      <span v-for="b in bonuses" class="heading h3 px-4">
        {{ b.text }}
        <span class="text-accent"> +{{ b.value }} </span>
      </span>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { MechSkills } from '@/class';

type HaseBonusArray = {
  text: string;
  value: number;
}[];

export default {
  name: 'hase-skill-item',
  props: {
    val: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    bonuses: {
      type: Array as () => HaseBonusArray,
      required: true,
    },
    mechSkills: {
      type: MechSkills,
      required: true,
    },
    isMissingHASE: {
      type: Boolean,
    },
  },
  computed: {
    filled(): number {
      return this.mechSkills[this.val];
    },
    empty(): number {
      return 6 - this.filled;
    },
  },
  emits: ['add', 'remove'],
};
</script>
