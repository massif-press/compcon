<template>
  <v-col class="text-center" style="min-width: 15vw">
    <div class="heading text-accent">{{ title.toUpperCase() }}</div>
    <div>
      <v-chip v-for="(v, i) in arr" class="ma-1" color="primary" variant="outlined">
        <v-badge inline :content="`T${i + 1}`" class="ml-n3" color="panel" style="opacity: 0.8" />
        <span class="heading h3 px-1 text-stark" v-html="cleanValue(v)" />
      </v-chip>
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
