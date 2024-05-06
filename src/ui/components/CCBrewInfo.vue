<template>
  <v-menu offset-y open-on-hover max-width="600px">
    <template v-slot:activator="{ props }">
      <v-icon
        v-if="controller.Brews.length"
        v-bind="props"
        icon="cc:compendium"
        class="fade-select"
        :color="color" />
    </template>
    <v-card>
      <v-toolbar density="compact" color="indigo" height="20px">
        <v-toolbar-title class="text-caption">Required Content Packs</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="py-2">
        <v-row v-for="b in controller.Brews" dense align="center">
          <v-col cols="auto">
            <v-icon v-if="b.Status === 'MISSING'" color="error" icon="mdi-alert-rhombus" />
            <v-icon
              v-else-if="b.Status === 'OFF'"
              color="secondary"
              icon="mdi-power-plug-off-outline" />
            <v-icon
              v-else-if="b.Status === 'OLD'"
              color="secondary"
              icon="mdi-clock-alert-outline" />
            <v-icon v-else color="success" icon="mdi-check-bold" />
          </v-col>
          <v-col cols="auto">
            {{ b.LcpName }}
          </v-col>
          <v-col cols="auto"><cc-slashes /></v-col>

          <v-col cols="auto">
            {{ b.LcpVersion }}
          </v-col>
          <v-col v-if="b.Status === 'MISSING' && b.Website" cols="auto" class="ml-6">
            <v-btn
              size="x-small"
              :href="b.Website"
              target="_blank"
              rel="noopener noreferrer"
              color="error">
              <v-icon icon="mdi-open-in-new" start />
              Download LCP
            </v-btn>
          </v-col>
          <v-col v-else-if="b.Status === 'OLD' && b.Website" cols="auto" class="ml-6">
            <v-btn
              size="x-small"
              :href="b.Website"
              target="_blank"
              rel="noopener noreferrer"
              color="secondary">
              <v-icon icon="mdi-open-in-new" start />
              Update LCP
            </v-btn>
          </v-col>
          <v-col v-else-if="b.Status === 'OFF'" cols="auto" class="ml-6 text-disabled">
            <i>LCP installed but disabled</i>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
export default {
  name: 'cc-brew-info',
  props: {
    controller: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      default: 'accent',
      required: false,
    },
  },
};
</script>
