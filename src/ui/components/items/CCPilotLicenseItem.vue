<template>
  <v-dialog v-model="dialog" width="90vw">
    <template #activator="{ props }">
      <v-btn
        variant="outlined"
        :prepend-icon="`cc:rank_${pilotLicense.Rank}`"
        :color="pilotLicense.License.Manufacturer.GetColor($vuetify.theme.current.dark)"
        block
        v-bind="props"
      >
        <span class="pr-2">
          {{ pilotLicense.License.Source }}
          {{ pilotLicense.License.Name }}
          {{ 'I'.repeat(pilotLicense.Rank) }}
        </span>
        <v-icon
          size="x-large"
          :icon="pilotLicense.License.Manufacturer.Icon"
          :color="pilotLicense.License.Manufacturer.GetColor($vuetify.theme.current.dark)"
        />
      </v-btn>
    </template>
    <v-card class="pb-2">
      <v-toolbar
        density="compact"
        flat
        :color="pilotLicense.License.Manufacturer.GetColor($vuetify.theme.current.dark)"
      >
        <v-icon size="large" :icon="`cc:rank_${pilotLicense.Rank}`" class="ml-3" />
        <v-toolbar-title class="heading h3">
          {{ pilotLicense.License.Source }}
          {{ pilotLicense.License.Name }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon size="large" variant="plain" @click="dialog = false">
          <v-icon icon="mdi-close" />
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <cc-license-panel :license="pilotLicense.License" ranked :rank="pilotLicense.Rank" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
export default {
  name: 'cc-pilot-license-item',
  props: {
    pilotLicense: {
      type: Object,
      required: true,
    },
    title: { type: Boolean },
  },
  emits: ['close'],
  data: () => ({
    dialog: false,
    color: 'primary',
  }),
};
</script>
