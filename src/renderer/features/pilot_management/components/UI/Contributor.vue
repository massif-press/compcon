<template>
  <v-tooltip top>
    <span slot="activator">{{ label }}</span>
    <span class="effect-text" v-html="tooltip()" />
  </v-tooltip>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'contributor',
    props: {
      label: String,
      value: [Number, String],
      contributors: Array,
      reverse: Boolean,
    },
    methods: {
      tooltip(): string {
        const vm = this as any
        const title = vm.reverse
          ? `${vm.label} ${vm.value}`
          : `${vm.value} ${vm.label}`
        return `<h2 style="text-align:center">${title}
              </h2><hr>${vm.contributors.join('<br>')}`
      },
    },
  })
</script>
