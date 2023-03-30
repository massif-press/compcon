<template>
  <v-row density="compact" class="mb-1">
    <!-- <v-col cols="auto">
      <cc-tooltip simple inline content="Feature In Development">
        <v-icon color="panel" class="mt-2">mdi-dice-multiple</v-icon>
      </cc-tooltip>
    </v-col> -->
    <v-col :class="$vuetify.display.mdAndUp ? 'pr-6' : ''">
      <v-btn
        variant="outlined"
        large
        block
        color="secondary"
        @click="$refs.dialog.show()"
      >
        <slot />
      </v-btn>
    </v-col>
    <cc-solo-dialog
      ref="dialog"
      icon="mdi-circle-edit-outline"
      color="primary"
      large
      :title="label"
      @confirm="save"
    >
      <cc-rte v-model="text" />
    </cc-solo-dialog>
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'text-entry-popup',

  props: {
    label: {
      type: String,
      required: true,
    },
    prepopulate: {
      type: String,
      required: false,
      default: '',
    },
  },
  data: () => ({
    text: '',
  }),
  mounted() {
    if (this.prepopulate) this.text = this.prepopulate;
  },
  methods: {
    save() {
      this.$emit('save', this.text);
    },
  },
};
</script>
