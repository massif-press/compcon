<template>
  <div>
    <section-header
      editable
      title="Pilot Biography"
      tooltip="Edit Pilot Biography"
      @edit="show()"
    />
    <div class="my-2 px-10">
      <p
        v-if="pilot.History"
        v-html-safe="pilot.History"
        class="flavor-text text-text mx-2 preserve-linebreaks"
      />
      <no-data-block v-else class="mx-2" />
    </div>
    <cc-solo-dialog
      ref="dialog"
      icon="mdi-circle-edit-outline"
      color="primary"
      large
      title="Pilot Biography"
      @confirm="pilot.History = history"
    >
      <quill-editor theme="snow" v-model:content="history" content-type="html" />
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import SectionHeader from '../../components/SectionHeader.vue';
import NoDataBlock from '../../components/NoDataBlock.vue';
import { Pilot } from '@/class';

export default {
  name: 'history-block',
  components: { NoDataBlock, SectionHeader },
  props: {
    pilot: {
      type: Pilot,
      required: true,
    },
  },
  data: () => ({
    history: '',
  }),
  created() {
    this.history = this.pilot.History || '';
  },
  methods: {
    show() {
      this.history = this.pilot.History || '';
      (this.$refs.dialog as any).show();
    },
  },
};
</script>
