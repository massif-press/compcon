<template>
  <v-dialog v-model="dialog" width="35vw">
    <v-card tile>
      <v-text-field
        v-model="newString"
        :label="label"
        :placeholder="placeholder"
        :type="number ? 'number' : 'text'"
        variant="outlined"
        hide-details
        autofocus
        class="pa-4"
        @focus="$event.target.select()"
        @keyup.enter="confirm()"
      />
      <v-divider />
      <v-card-actions>
        <v-btn small text @click="dialog = false">Cancel</v-btn>
        <v-spacer />
        <v-btn v-if="!number" small text color="primary" @click="reset()"
          >Reset</v-btn
        >
        <v-btn small text color="success darken-1" @click="confirm()"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import EditButton from './subcomponents/_EditButton.vue';

export default {
  name: 'CCStringEditDialog',
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
    confirm() {
      this.save();
      this.dialog = false;
    },
    reset() {
      this.$emit('reset');
      this.dialog = false;
    },
    show() {
      this.dialog = true;
    },
    hide() {
      this.dialog = false;
    },
  },
};
</script>
