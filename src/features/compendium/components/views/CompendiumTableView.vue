<template>
  <v-data-table
    :headers="headers"
    :items="items"
    hover
    items-per-page="-1"
    @click:row="openDialog($event)"
  />
  <!-- <template #[`item.Frame`]="{ item }">
      <b class="stat-text" v-text="item.Name" />
    </template> -->
  <!-- <template #[`item.SizeInt`]="{ item }">
      <span class="stat-text">{{ item.Size }}</span>
    </template> -->
  <!-- <template #[`item.Damage[0].Max`]="{ item }">
      <cc-damage-element small :damage="item.Damage" />
    </template>
    <template #[`item.Range[0].Max`]="{ item }">
      <cc-range-element small :range="item.Range" />
    </template> -->
  <!-- </v-data-table> -->
  <!-- <cc-solo-dialog
    v-model="dialog"
    :title="`${selectedItem?.Source || ''} ${selectedItem?.Name || ''}`"
    large
  >
    <cc-item-card :item="selectedItem.value" />
  </cc-solo-dialog> -->
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
    dialog: false,
    selectedItem: null as any,
  }),
  computed: {
    // shownHeaders(): any[] {
    //   const hide = ['weapon', 'system', 'item', 'license level'];
    //   return this.$vuetify.display.smAndDown
    //     ? this.headers.filter((x: any) => !hide.includes(x.text.toLowerCase()))
    //     : this.headers;
    // },
  },
  methods: {
    openDialog(evt: any) {
      console.log(evt);
      // this.selectedItem = item;
      // this.dialog = true;
    },
  },
};
</script>
