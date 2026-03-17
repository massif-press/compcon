<template>
  <cc-alert icon="mdi-link-variant-off"
    class="mt-2"
    title="Missing License Data">
    <p class="text-cc-overline text-disabled mb-2">
      The following {{ type }} are not present in the compendium:
    </p>
    <v-row v-for="(item, index) in itemArr"
      :key="`missing-${type}-${index}`"
      class="mr-3">
      <v-col cols="auto">
        <div class="heading h3">
          <v-icon v-if="item.Icon"
            class="mt-n1 mr-2">{{ item.Icon }}</v-icon>
          <span v-if="item.Source"
            class="text-disabled">{{ item.Source }}</span>
          {{ item.Name }}
        </div>
      </v-col>
      <v-col v-if="brew(item) && brew(item).Website"
        cols="auto">
        <v-btn size="x-small"
          color="accent"
          flat
          tile
          variant="tonal"
          prepend-icon="mdi-open-in-new"
          :href="brew(item).Website"
          target="_blank"
          rel="noopener noreferrer">
          Download {{ brew(item).LcpName }}
        </v-btn>
      </v-col>
      <v-col cols="auto"
        class="ml-auto">
        <v-btn icon
          flat
          tile
          variant="text"
          size="20"
          color="error"
          @click="$emit('remove', item)">
          <v-icon size="15"
            icon="mdi-delete" />
        </v-btn>
      </v-col>
    </v-row>
  </cc-alert>
</template>

<script lang="ts">
export default {
  name: 'MissingItemAlert',
  props: {
    type: {
      type: String,
      required: false,
      default: 'items',
    },
    items: {
      type: Array as () => any[],
      required: true,
    },
  },
  computed: {
    itemArr() {
      if (!this.items) return [];
      if (this.items[0].Stub) {
        return this.items.map((i) => i.Stub);
      }
      return this.items;
    },
  },
  methods: {
    brew(item: any) {
      if (item.Brew) {
        return item.Brew;
      }
      if (item.Stub) {
        return item.Stub.Brew;
      }
      return item.ItemData.brew;
    },
  },
};
</script>
