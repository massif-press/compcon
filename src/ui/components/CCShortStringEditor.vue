<template>
  <v-fade-transition leave-absolute>
    <div v-if="!editing" key="str" :class="{ 'd-inline': inline }">
      <slot />
      <v-icon
        :dark="before || dark"
        small
        :right="right"
        :lefft="left"
        :class="`fadeSelect ${before ? 'mt-n12' : ''}`"
        @click="edit()"
      >
        mdi-circle-edit-outline
      </v-icon>
    </div>
    <div v-else key="editname" :class="{ 'd-inline': inline }">
      <v-text-field
        v-model="newStr"
        :dense="!large"
        :height="large ? '50px' : ''"
        :placeholder="placeholder"
        required
        hide-details
        autofocus
        :class="inline ? '' : `d-inline mx-0 my-0 mt-n4`"
        @blur="submit()"
        @keyup.enter="submit()"
        @focus="$event.target.select()"
      />
    </div>
  </v-fade-transition>
</template>

<script lang="ts">
export default {
  name: 'cc-short-string-editor',
  props: {
    placeholder: { type: String, required: false },
    inline: { type: Boolean },
    large: { type: Boolean },
    before: { type: Boolean },
    dark: { type: Boolean },
    right: { type: Boolean },
    left: { type: Boolean },
  },
  data: () => ({
    newStr: '',
    editing: false,
  }),
  mounted() {
    if (this.placeholder) this.newStr = this.placeholder;
  },
  methods: {
    edit(): void {
      this.editing = true;
      if (this.$slots.default && this.$slots.default[0]) {
        let prev = '';
        if (this.$slots.default[0].text)
          prev = this.$slots.default[0].text.trim();
        else if (this.$slots.default[0].children[0].text)
          prev = this.$slots.default[0].children[0].text.trim();
        this.newStr = prev;
      }
    },
    submit(): void {
      this.$emit('set', this.newStr);
      this.editing = false;
    },
  },
};
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
