<template>
  <div>
    <section-header
      editable
      title="Pilot Appearance"
      tooltip="Edit Pilot Appearance"
      @edit="show()"
    />
    <div class="my-2 px-10">
      <p
        v-if="pilot.TextAppearance"
        v-html-safe="pilot.TextAppearance"
        class="flavor-text text-text mx-2 preserve-linebreaks"
      />
      <no-data-block v-else class="mx-2" />
    </div>
    <cc-solo-dialog
      ref="dialog"
      icon="mdi-circle-edit-outline"
      color="primary"
      large
      title="Pilot Appearance"
      @confirm="pilot.TextAppearance = appearance"
    >
      <quill-editor theme="snow" v-model:content="appearance" content-type="html" />
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import SectionHeader from '../../components/SectionHeader.vue';
import NoDataBlock from '../../components/NoDataBlock.vue';
import { Pilot } from '@/class';

export default {
  name: 'appearance-block',
  components: { SectionHeader, NoDataBlock },
  props: {
    pilot: {
      type: Pilot,
      required: true,
    },
  },
  data: () => ({
    appearance: '',
  }),

  created() {
    // this.$vuetify.lang.current = 'en'
    this.appearance = this.pilot.TextAppearance || '';
  },
  methods: {
    show() {
      this.appearance = this.pilot.TextAppearance || '';
      (this.$refs.dialog as any).show();
    },
  },
};
</script>
