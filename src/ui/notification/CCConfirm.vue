<template>
  <v-dialog
    v-model="dialog"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
    @keydown.esc="cancel">
    <v-card flat tile>
      <v-toolbar dark :color="options.color" density="compact" flat>
        <v-toolbar-title class="text-white">{{ title }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text v-show="!!message" class="pa-4">{{ message }}</v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn color="accent darken-1" @click.native="agree">Yes</v-btn>
        <v-btn color="grey" @click.native="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
export default {
  name: 'GlobalConfirm',
  data: () => ({
    dialog: false,
    resolve: null as any,
    reject: null as any,
    message: '',
    title: '',
    options: {
      color: 'primary',
      width: 500,
      zIndex: 9999,
    },
  }),
  methods: {
    open(
      title: string,
      message: string,
      options: {
        color?: string;
        width?: number;
        zIndex?: number;
      } = {}
    ) {
      this.dialog = true;
      this.title = title;
      this.message = message;
      this.options = Object.assign({}, this.options, options);
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    agree() {
      this.resolve(true);
      this.dialog = false;
    },
    cancel() {
      this.resolve(false);
      this.dialog = false;
    },
  },
};
</script>
