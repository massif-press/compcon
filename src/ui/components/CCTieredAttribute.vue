<template>
  <v-col class="text-center" cols="6" sm="3" md="2">
    <div class="heading text-accent">{{ title.toUpperCase() }}</div>
    <div class="mt-n2">
      <span v-for="(v, i) in arr" :key="`tier-${i}`" class="heading h3 text-stark">
        <span v-html-safe="cleanValue(v)" />
        <span v-if="i + 1 < arr.length" class="text-disabled px-1">/</span>
      </span>
    </div>
  </v-col>
</template>

<script setup lang="ts">
defineOptions({ name: 'cc-tiered-attribute' })

const props = defineProps<{
  title: string
  arr: number[]
}>()

function cleanValue(v: any) {
      if (Array.isArray(v))
        return v
          .join(`<span class="text-caption px-1" style="opacity: 0.6">OR</span>`)
          .replace(/0\.5/g, '½');
      return v.toString().replaceAll('0.5', '½');
    }
</script>
