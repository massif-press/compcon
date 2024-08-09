<template>
  <v-col class="text-center" style="min-width: 15vw">
    <div class="heading text-accent">{{ title.toUpperCase() }}</div>
    <div class="mb-n2 mt-n1">
      <span v-for="(v, i) in arr" class="text-caption text-disabled">
        T{{ i }}{{ i + 1 < arr.length ? ' /' : '' }}
      </span>
    </div>
    <div>
      <span v-for="(v, i) in arr" class="heading h3 text-stark">
        {{ cleanValue(v) }}
        <span v-if="i + 1 < arr.length" class="text-disabled pr-1">/</span>
      </span>
    </div>
  </v-col>
</template>

<script lang="ts">
export default {
  name: 'cc-tiered-attribute',
  props: {
    title: { type: String, required: true },
    arr: { type: Array, required: true },
  },
  methods: {
    cleanValue(v: any) {
      if (Array.isArray(v))
        return v
          .join(`<span class="text-caption px-1" style="opacity: 0.6">OR</span>`)
          .replace(/0\.5/g, '½');
      return v.toString().replaceAll('0.5', '½');
    },
  },
};
</script>
