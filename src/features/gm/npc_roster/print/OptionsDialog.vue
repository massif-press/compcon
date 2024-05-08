<template>
  <cc-solo-dialog
    ref="dialog"
    icon="mdi-printer"
    large
    title="Print Options"
    @confirm="$emit('set', options)">
    <v-card-text class="flavor-text">
      <v-card flat tile>
        <fieldset class="pa-2">
          <legend class="clipped-small heading h3">General Print Options&emsp;</legend>
          <v-row v-if="options.layout.title !== 'Cards'">
            <v-col>
              <print-option-select
                v-model="options.paper"
                mandatory
                title="Paper"
                :items="paperOptions" />
            </v-col>
            <v-col>
              <print-option-select
                v-model="options.orientation"
                mandatory
                title="Orientation"
                :items="orientationOptions" />
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col>
              <print-option-select
                v-model="options.paper"
                mandatory
                title="Paper"
                :items="paperOptions" />
            </v-col>
          </v-row>
        </fieldset>
      </v-card>
      <v-scroll-y-transition>
        <v-card v-if="includeOptions.length > 0" flat tile>
          <fieldset class="pa-2">
            <legend class="clipped-small heading h3">Options&emsp;</legend>
            <print-option-select v-model="options.include" multiple widen :items="includeOptions" />
          </fieldset>
        </v-card>
      </v-scroll-y-transition>
      <v-card flat tile>
        <fieldset class="pa-2">
          <legend>Extras</legend>
          <print-option-select v-model="options.extras" multiple :items="extraOptions" />
        </fieldset>
      </v-card>
    </v-card-text>
  </cc-solo-dialog>
</template>

<script lang="ts">
import PrintOptionSelect from './PrintOptionSelect.vue';

export default {
  name: 'print-options-dialog',
  components: { PrintOptionSelect },
  watch: {
    options: {
      handler() {
        this.$emit('set', this.options);
      },
      deep: true,
    },
  },
  data: () => ({
    options: {
      layout: { title: 'Standard', icon: 'mdi-book-open' },
      orientation: { title: 'Portrait', icon: 'mdi-file' },
      paper: { title: 'Letter', icon: 'mdi-text-box-check-outline' },
      include: [],
      extras: [],
      card: [],
    },
    orientationOptions: [
      { title: 'Portrait', icon: 'mdi-file' },
      { title: 'Landscape', icon: 'mdi-note' },
    ],
    paperOptions: [
      { title: 'Letter', icon: 'mdi-text-box-check-outline' },
      { title: 'A4', icon: 'mdi-file-star-four-points-outline' },
    ],
  }),
  mounted() {
    this.$emit('set', this.options);
  },
  methods: {
    show() {
      (this.$refs.dialog as any).show();
    },
    hide() {
      (this.$refs.dialog as any).hide();
    },
  },
  computed: {
    includeOptions() {
      switch (this.options.layout.title) {
        case 'Minimal':
          return [];
        default:
          return [
            { title: 'Include Image' },
            { title: 'GM Summary' },
            { title: 'Additional Detail' },
            { title: 'Clocks' },
            { title: 'Tables' },
            { title: 'GM Notes' },
            { title: 'PC Scan Detail' },
            { title: 'Append Lined Section' },
            { title: 'Append Unlined Section' },
          ];
      }
    },
    extraOptions() {
      switch (this.options.layout.title) {
        default:
          return [{ title: 'Relevant Tag Reference' }];
      }
    },
  },
};
</script>

<style scoped>
fieldset {
  border-color: rgb(var(--v-theme-primary));
  border-radius: 2px;
  margin-bottom: 12px;
  padding: 4px;
}

legend {
  background-color: rgb(var(--v-theme-primary));
  color: #fff;
  padding: 3px 6px;
}
</style>
