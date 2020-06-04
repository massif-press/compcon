<template>
  <cc-sidebar-view>
    <v-list-item
      v-for="(e, i) in array"
      slot="sidebar"
      :key="`${i}_sidebar'`"
      link
      @click="
        $vuetify.goTo(`#e_${e[nameKey].replace(/\W/g, '')}`, {
          duration: 150,
          easing: 'easeInOutQuad',
          offset: 25,
        })
      "
    >
      <v-list-item-title class="heading h3 ml-2">{{ e[nameKey] }}</v-list-item-title>
    </v-list-item>
    <h1 v-resize-text="{ maxFontSize: '36pt' }" class="heading mb-3 ml-5">{{ title }}</h1>
    <cc-titled-panel
      v-for="(e, i) in array"
      :id="`e_${e[nameKey].replace(/\W/g, '')}`"
      :key="`${e[nameKey].replace(/\W/g, '')}_${i}`"
      :icon="icon || ''"
      :title="e[nameKey]"
      class="my-2"
      dense
    >
      <h3 v-if="subKey" class="heading mb-2" v-html="e[subKey]" />
      <p class="body-text" v-html="e[descriptionKey]" />
    </cc-titled-panel>
  </cc-sidebar-view>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
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
    icon: {
      type: String,
      required: false,
      default: '',
    },
  },
})
</script>
