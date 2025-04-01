<template>
  <v-fade-transition leave-absolute>
    <div v-if="!editing" class="d-inline-block" key="str" style="position: relative">
      <span style="width: fit-content">
        <slot />
      </span>
      <v-btn
        v-if="!readonly"
        size="x-small"
        icon
        variant="plain"
        style="position: absolute; right: -30px; bottom: 0px"
        @click="edit">
        <v-icon size="15" icon="mdi-circle-edit-outline" />
      </v-btn>
    </div>
    <div v-else key="editname">
      <v-text-field
        v-model="newStr"
        :density="large ? 'comfortable' : 'compact'"
        :height="large ? '50px' : ''"
        :placeholder="placeholder"
        required
        hide-details
        autofocus
        :min-width="minWidth"
        @blur="submit()"
        @keyup.enter="submit()"
        @focus="$event.target.select()" />
    </div>
  </v-fade-transition>
</template>

<script lang="ts">
export default {
  name: 'cc-short-string-editor',
  props: {
    placeholder: { type: String, required: false },
    large: { type: Boolean },
    absolute: { type: Boolean },
    readonly: { type: Boolean },
    justify: { type: String, required: false, default: 'center' },
    maxWidth: { type: String, required: false },
    minWidth: { type: String, required: false },
  },
  data: () => ({
    newStr: '',
    editing: false,
  }),
  created() {
    if (this.placeholder) this.newStr = this.placeholder;
  },
  methods: {
    edit(): void {
      if (this.readonly) return;
      this.editing = true;
      if (this.$slots.default && this.$slots.default[0]) {
        let prev = '';
        if (this.$slots.default[0].text) prev = this.$slots.default[0].text.trim();
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
