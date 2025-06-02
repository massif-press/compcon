<template>
  <v-menu v-if="item.FromInstance" open-on-hover max-width="450px">
    <template #activator="{ props }">
      <v-icon
        v-bind="props"
        :color="color"
        size="18"
        :start="start"
        :end="end"
        icon="mdi-link-variant-off"
        class="mt-n1 fade-select border-lg" />
    </template>
    <v-card flat tile border>
      <v-toolbar density="compact" color="primary" class="px-2" height="40">
        <span class="text-cc-overline">Instanced Item</span>
      </v-toolbar>

      <v-card-text class="py-2">
        This item is part of the following Lancer Content Pack:

        <v-card
          variant="outlined"
          style="border-color: rgb(var(--v-theme-error))"
          class="pa-1 my-1">
          <v-row dense align="center">
            <v-col cols="auto">
              {{ brew.LcpName }}
            </v-col>
            <v-col cols="auto"><cc-slashes /></v-col>

            <v-col cols="auto">v.{{ brew.LcpVersion }}</v-col>
            <v-col v-if="brew.Website" cols="auto" class="ml-auto">
              <v-btn
                size="x-small"
                :href="brew.Website"
                target="_blank"
                rel="noopener noreferrer"
                variant="tonal"
                color="error">
                <v-icon icon="mdi-open-in-new" start />
                Download LCP
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
        <span class="text-caption">
          This item has been instanced as a unique object and once removed will not be available
          until the associated LCP is installed.
        </span>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
export default {
  name: 'cc-broken-reference',
  props: {
    item: {
      type: Object,
      required: true,
    },
    start: {
      type: Boolean,
      default: false,
    },
    end: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: '100%',
    },
    color: {
      type: String,
      default: '',
    },
  },
  computed: {
    brew() {
      return this.item.ItemData.brew;
    },
  },
};
</script>
