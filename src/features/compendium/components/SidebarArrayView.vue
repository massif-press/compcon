<template>
  <cc-sidebar-view>
    <template #sidebar>
      <v-list-item v-for="e in array" link @click="scrollTo(e)">
        <v-list-item-title>{{ (e as any)[nameKey] }}</v-list-item-title>
      </v-list-item>
    </template>
    <h1 class="heading mb-3 mt-2">{{ title }}</h1>
    <cc-titled-panel
      v-for="e in array"
      :id="`e_${(e as any)[nameKey].replace(/\W/g, '')}`"
      :icon="icon || ''"
      :title="(e as any)[nameKey]"
      class="my-5"
      density="compact"
    >
      <h3
        v-if="subKey && (!subConditional || (e as any)[subConditional])"
        v-html-safe="(e as any)[subKey]"
        class="heading mb-2"
      />
      <p v-html-safe="(e as any)[descriptionKey]" class="body-text mb-1" />
    </cc-titled-panel>
  </cc-sidebar-view>
</template>

<script lang="ts">
export default {
  name: 'sidebar-array-view',
  props: {
    title: {
      type: String,
      required: true,
    },
    array: {
      type: Array,
      required: true,
    },
    nameKey: {
      type: String,
      required: false,
      default: 'Name',
    },
    descriptionKey: {
      type: String,
      required: false,
      default: 'Description',
    },
    subKey: {
      type: String,
      required: false,
      default: '',
    },
    subConditional: {
      type: String,
      required: false,
      default: '',
    },
    icon: {
      type: String,
      required: false,
      default: '',
    },
  },
  methods: {
    scrollTo(e: any): void {
      const el = document.getElementById(`e_${(e as any)[this.nameKey].replace(/\W/g, '')}`);
      if (el) {
        const yOffset = -60;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    },
  },
};
</script>
