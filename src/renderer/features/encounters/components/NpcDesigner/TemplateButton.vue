<template>
  <v-chip
    class="system-chip"
    v-ripple="!disabled"
    label
    outline
    color="template"
    @click="closable ? $emit('close') : $emit('add')"
  >
    <v-icon left small size="24" color="template" v-if="closable" v-html="'mdi-minus'" />
    <v-icon left small size="24" v-if="addable && !disabled" v-html="'mdi-plus'" color="template" />
    {{ template.name }}
  </v-chip>
</template>

<script lang="ts">
import Vue from 'vue'
import NPCTemplate from '../../logic/interfaces/NPCTemplate'

export default Vue.extend({
  props: {
    template: { type: Object, required: true },
    closable: { type: Boolean, default: false },
    addable: { type: Boolean, default: false },
    disabled: { type: [Array, Boolean], default: false },
  },
})
</script>

<style scoped>
.v-chip.system-chip {
  padding: 0.1em 0.5em;
  text-transform: uppercase;
  font-size: 0.85em;
}
.v-chip.system-chip * {
  cursor: pointer !important;
}
.v-chip.system-chip:focus {
  box-shadow: none !important;
}
.v-chip.system-chip:focus::after {
  display: none;
}

.v-chip .rightbtn:hover {
  opacity: 0.7 !important;
}
.v-chip.template-disabled {
  opacity: 0.5 !important;
}
</style>
