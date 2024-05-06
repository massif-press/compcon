<template>
  <cc-sidebar-view>
    <template #sidebar>
      <v-list-item v-for="e in array" link @click="scrollTo(e)">
        <template #title>
          <b v-text="(e as any)[nameKey]" class="heading" />
        </template>
      </v-list-item>
    </template>
    <h1 v-if="title" class="heading mb-3 mt-2">{{ title }}</h1>
    <div id="content" :style="isModal ? `height: calc(100vh - 100px); overflow-y: scroll` : ''">
      <div v-for="e in array" :id="`e_${(e as any)[nameKey].replace(/\W/g, '')}`" class="my-5">
        <cc-titled-panel
          :icon="icon || ''"
          :title="(e as any)[nameKey]"
          density="compact"
          :clickable="selectable"
          @click="selectable ? $emit('selected', (e as any).Name) : ''">
          <h3
            v-if="subKey && (!subConditional || (e as any)[subConditional])"
            v-html-safe="(e as any)[subKey]"
            class="heading mb-2" />
          <p v-html-safe="(e as any)[descriptionKey]" class="body-text mb-1" />
        </cc-titled-panel>
      </div>
    </div>
  </cc-sidebar-view>
</template>

<script lang="ts">
import scrollTo from '@/util/scrollTo';

export default {
  name: 'sidebar-array-view',
  props: {
    title: {
      type: String,
      required: false,
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
    selectable: {
      type: Boolean,
      required: false,
      default: false,
    },
    isModal: {
      type: Boolean,
    },
  },
  emits: ['selected'],
  methods: {
    scrollTo(e: any): void {
      console.log(e);
      const el = document.getElementById(`e_${(e as any)[this.nameKey].replace(/\W/g, '')}`);
      console.log(el);
      if (el) scrollTo(el, this.isModal);
    },
  },
};
</script>
