<template>
  <cc-alert icon="mdi-link-variant-off" class="mt-2" title="Missing License Data">
    <p class="text-cc-overline text-disabled mb-2">
      The following {{ type }} are not present in the compendium:
    </p>
    <v-row v-for="item in items" class="mr-3" dense>
      <v-col>
        <div class="heading h3">
          <v-icon v-if="item.Icon" class="mt-n1">{{ item.Icon }}</v-icon>
          <span v-if="item.Source" class="text-disabled">{{ item.Source }}</span>
          {{ item.Name }}
        </div>
      </v-col>
      <v-col v-if="brew(item) && brew(item).Website" cols="auto">
        <v-btn
          size="x-small"
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
      <v-col cols="auto">
        <v-btn icon flat tile variant="text" size="20" color="error" @click="$emit('remove', item)">
          <v-icon size="15" icon="mdi-delete" />
        </v-btn>
      </v-col>
    </v-row>
  </cc-alert>
</template>

<script>
export default {
  name: 'MissingItemAlert',
  props: {
    type: {
      type: String,
      required: true,
      default: 'items',
    },
    items: {
      type: Array,
      required: true,
    },
  },
  methods: {
    brew(item) {
      if (item.Brew) {
        return item.Brew;
      }
      return item.ItemData.brew;
    },
  },
};
</script>
