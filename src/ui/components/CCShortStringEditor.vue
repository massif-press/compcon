<template>
  <v-fade-transition leave-absolute>
    <div v-if="!editing" key="str" :class="{ 'd-inline': inline }">
      <slot />
      <v-icon small class="fadeSelect" @click="edit()">mdi-circle-edit-outline</v-icon>
    </div>
    <v-col v-else key="editname" :class="{ 'd-inline': inline }">
      <v-text-field
        v-model="newStr"
        :dense="!large"
        :height="large ? '50px' : ''"
        required
        hide-details
        autofocus
        :class="inline ? '' : `mx-0 my-0 mt-n4`"
        @blur="submit()"
        @keyup.enter="submit()"
        @focus="$event.target.select()"
      ></v-text-field>
    </v-col>
  </v-fade-transition>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-short-string-editor',
  props: {
    inline: {
      type: Boolean,
      required: false,
    },
    large: {
      type: Boolean,
    },
  },
  data: () => ({
    newStr: '',
    editing: false,
  }),
  methods: {
    edit() {
      this.editing = true
      this.newStr = this.$slots.default[0].text.trim()
    },
    submit() {
      if (this.newStr.length) this.$emit('set', this.newStr)
      this.editing = false
    },
  },
})
</script>

<style scoped>
.name.fade-transition-enter-active {
  position: relative;
  top: -2px;
}
.name.fade-transition-leave-active {
  position: relative;
  bottom: 1px;
}
.v-input {
  padding: 0 !important;
  margin: 0 !important;
  font-size: inherit !important;
  line-height: inherit !important;
  min-height: min-content !important;
}
.v-input input {
  max-height: fit-content !important;
}
.v-input__slot {
  margin-bottom: 0 !important;
  font-size: inherit !important;
  min-height: min-content !important;
  line-height: inherit !important;
}
.label {
  font-size: 1em;
  font-weight: bold;
}
</style>

<style>
.v-input input {
  max-height: fit-content !important;
}
</style>
