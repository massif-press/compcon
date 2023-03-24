<template>
  <v-data-table
    v-resize="onResize"
    :headers="shownHeaders"
    :items="items"
    item-key="ID"
    :height="tableHeight"
    hide-default-footer
    disable-pagination
    class="elevation-0 flavor-text background"
    calculate-widths
    fixed-header
    multi-sort
    show-select
    single-select
  >
    <template v-slot:[`item.data-table-select`]="{ item }">
      <v-hover v-if="$vuetify.display.smAndDown" v-slot="{ hover }">
        <div
          block
          :class="`font-weight-bold ${hover ? 'accent--text' : ''}`"
          dark
          @click="$refs[`modal_${item.ID}`].show()"
        >
          {{ item.Name }}
        </div>
      </v-hover>
      <v-btn
        v-else
        x-small
        fab
        color="primary"
        dark
        @click="$refs[`modal_${item.ID}`].show()"
      >
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
      <cc-solo-dialog
        :ref="`modal_${item.ID}`"
        :title="`${item.Source} ${item.Name}`"
        large
      >
        <cc-item-card :item="item" />
      </cc-solo-dialog>
    </template>
    <template v-slot:[`item.Name`]="{ item }">
      <span class="stat-text">{{ item.Name }}</span>
    </template>
    <template v-slot:[`item.SizeInt`]="{ item }">
      <span class="stat-text">{{ item.Size }}</span>
    </template>
    <!-- <template v-slot:[`item.Damage[0].Max`]="{ item }">
      <cc-damage-element small :damage="item.Damage" />
    </template>
    <template v-slot:[`item.Range[0].Max`]="{ item }">
      <cc-range-element small :range="item.Range" />
    </template> -->
  </v-data-table>
</template>

<script lang="ts">
export default {
  name: 'compendium-table-view',
  props: {
    headers: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    itemType: '',
    tableHeight: 500,
  }),
  computed: {
    shownHeaders(): any[] {
      const hide = ['weapon', 'system', 'item', 'license level'];
      return this.$vuetify.display.smAndDown
        ? this.headers.filter((x) => !hide.includes(x.text.toLowerCase()))
        : this.headers;
    },
  },
  mounted(): void {
    this.onResize();
  },
  methods: {
    onResize(): void {
      this.tableHeight = window.innerHeight - 160;
    },
  },
};
</script>

<style scoped>
tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05) !important;
}
</style>
