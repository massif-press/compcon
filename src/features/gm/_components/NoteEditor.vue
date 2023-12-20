<template>
  <div>
    <v-card
      v-if="item[noteProperty] && item[noteProperty].length > 0"
      variant="tonal"
      color="panel"
      class="mb-2"
    >
      <v-card-text class="pa-2">
        <p
          v-html-safe="item[noteProperty]"
          class="flavor-text text-text mx-2 preserve-linebreaks"
        />
      </v-card-text>
    </v-card>
    <cc-solo-dialog
      ref="dialog"
      icon="mdi-circle-edit-outline"
      color="primary"
      large
      :title="title"
      @confirm="item[noteProperty] = notes"
    >
      <v-container>
        <quill-editor theme="snow" v-model:content="notes" content-type="html" />
      </v-container>
    </cc-solo-dialog>
    <div :class="left ? 'text-left' : 'text-right'">
      <v-btn color="accent" variant="outlined" size="small" @click="show()">
        <v-icon start icon="mdi-pencil-outline" />
        Edit {{ title }}
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'notes-block',
  props: {
    item: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    noteProperty: {
      type: String,
      default: 'Notes',
    },
    left: { type: Boolean },
  },
  data: () => ({
    notes: '',
  }),
  created() {
    this.notes = this.item[this.noteProperty] || '';
  },
  methods: {
    show() {
      this.notes = this.item[this.noteProperty] || '';
      (this.$refs.dialog as any).show();
    },
  },
};
</script>
