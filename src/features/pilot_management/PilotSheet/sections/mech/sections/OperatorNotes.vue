<template>
  <div>
    <cc-title small :color="color" style="margin-left: -70px !important">
      <section-edit-icon label="Edit Operator Notes" @open-selector="show()" />
      Operator Notes
    </cc-title>
    <div class="my-2">
      <p
        v-if="mech.Notes"
        class="flavor-text text--text mx-2 preserve-linebreaks"
        v-html="mech.Notes"
      />
      <no-data-block v-else />
    </div>
    <cc-solo-dialog
      ref="dialog"
      icon="mdi-circle-edit-outline"
      color="primary"
      large
      title="Operator Notes"
      @confirm="mech.Notes = notes"
    >
      <cc-rte v-model="notes" />
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import SectionEditIcon from '../../components/SectionEditIcon.vue';
import NoDataBlock from '../../components/NoDataBlock.vue';

export default {
  name: 'notes-block',
  props: {
    mech: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
  data: () => ({
    notes: '',
  }),
  created() {
    this.notes = this.mech.Notes || '';
  },
  methods: {
    show() {
      this.notes = this.mech.Notes || '';
      (this.$refs.dialog as any).show();
    },
  },
};
</script>
