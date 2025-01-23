<!-- TODO: REMOVE -->
<template>
  <edit-button :dark="dark" @save="save()">
    <v-text-field
      v-model="newString"
      :label="label"
      :placeholder="placeholder"
      variant="outlined"
      hide-details
      autofocus
      @focus="$event.target.select()" />
  </edit-button>
</template>

<script lang="ts">
import EditButton from './subcomponents/_EditButton.vue';

export default {
  name: 'CCStringEdit',
  components: { EditButton },
  props: {
    label: {
      type: String,
      required: false,
      default: '',
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
      if (this.newString) this.$emit('save', this.newString);
      this.newString = '';
    },
  },
};
</script>
