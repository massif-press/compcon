<template>
  <div>
    <section-header
      editable
      :title="`${type} Notes`"
      :tooltip="`Edit ${type} Notes`"
      @edit="show()"
    />
    <div class="my-2 px-10">
      <p
        v-if="item.Notes"
        v-html-safe="item.Notes"
        class="flavor-text text-text mx-2 preserve-linebreaks"
      />
      <no-data-block v-else class="mx-2" />
    </div>
    <cc-solo-dialog
      ref="dialog"
      icon="mdi-circle-edit-outline"
      color="primary"
      large
      :title="`${type} Notes`"
      @confirm="item.Notes = notes"
    >
      <quill-editor theme="snow" v-model:content="notes" content-type="html" />
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import SectionHeader from '../sections/components/SectionHeader.vue';
import NoDataBlock from '../sections/components/NoDataBlock.vue';

export default {
  name: 'notes-block',
  components: { NoDataBlock, SectionHeader },
  props: {
    item: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    notes: '',
  }),
  created() {
    this.notes = this.item.Notes || '';
  },
  methods: {
    show() {
      this.notes = this.item.Notes || '';
      (this.$refs.dialog as any).show();
    },
  },
};
</script>
