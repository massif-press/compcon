<template>
  <edit-button :dark="dark" @save="save()">
    <v-text-field
      v-model="newString"
      :label="label"
      :placeholder="placeholder"
      outlined
      hide-details
      autofocus
      @focus="$event.target.select()"
    />
  </edit-button>
</template>

<script lang="ts">
import Vue from 'vue'
import EditButton from './subcomponents/_EditButton.vue'

export default Vue.extend({
  name: 'cc-string-edit',
  components: { EditButton },
  props: {
    label: {
      type: String,
      required: false,
      default: ' ',
    },
    placeholder: {
      type: String,
      required: true,
    },
    dark: {
      type: Boolean,
      required: false,
    },
  },
  data: () => ({
    newString: '',
  }),
  methods: {
    save() {
      if (this.newString) this.$emit(this.newString)
      this.newString = ''
    },
  },
})
</script>
