<template>
  <div>
    <cc-title
      small
      color="pilot"
      class="pl-3"
      style="margin-left: -70px !important"
    >
      <section-edit-icon
        label="Edit Pilot Appearance"
        @open-selector="show()"
      />
      Pilot Appearance
    </cc-title>
    <div class="my-2">
      <p
        v-if="pilot.TextAppearance"
        v-html-safe="pilot.TextAppearance"
        class="flavor-text text--text mx-2 preserve-linebreaks"
      />
      <no-data-block v-else />
    </div>
    <cc-solo-dialog
      ref="dialog"
      icon="mdi-circle-edit-outline"
      color="primary"
      large
      title="Pilot Appearance"
      @confirm="pilot.TextAppearance = appearance"
    >
      <cc-rte v-model="appearance" />
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import SectionEditIcon from '../../components/SectionEditIcon.vue';
import NoDataBlock from '../../components/NoDataBlock.vue';

export default {
  name: 'appearance-block',
  components: { SectionEditIcon, NoDataBlock },
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
