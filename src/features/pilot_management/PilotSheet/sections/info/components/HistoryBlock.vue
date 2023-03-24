<template>
  <div>
    <cc-title
      small
      color="pilot"
      class="pl-3"
      style="margin-left: -70px !important"
    >
      <section-edit-icon label="Edit Pilot Biography" @open-selector="show()" />
      Pilot Biography
    </cc-title>
    <div class="my-2">
      <p
        v-if="pilot.History"
        v-html-safe="pilot.History"
        class="flavor-text text--text mx-2 preserve-linebreaks"
      />
      <no-data-block v-else />
    </div>
    <cc-solo-dialog
      ref="dialog"
      icon="mdi-circle-edit-outline"
      color="primary"
      large
      title="Pilot Biography"
      @confirm="pilot.History = history"
    >
      <cc-rte v-model="history" />
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import SectionEditIcon from '../../components/SectionEditIcon.vue';
import NoDataBlock from '../../components/NoDataBlock.vue';

export default {
  name: 'history-block',
  components: { SectionEditIcon, NoDataBlock },
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
