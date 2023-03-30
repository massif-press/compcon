<template>
  <v-dialog width="90vw">
    <template v-slot:activator="{ props }">
      <v-btn
        :x-large="$vuetify.display.lgAndUp"
        variant="outlined"
        :color="pilotLicense.License.Manufacturer.GetColor($vuetify.theme.dark)"
        block
        v-bind="props"
      >
        <v-icon
          large
          :color="
            pilotLicense.License.Manufacturer.GetColor($vuetify.theme.dark)
          "
        >
          cc:rank_{{ pilotLicense.Rank }}
        </v-icon>
        <v-spacer />
        {{ pilotLicense.License.Source }}
        {{ pilotLicense.License.Name }}
        {{ 'I'.repeat(pilotLicense.Rank) }}
        <v-spacer />
        <cc-logo size="large" :source="pilotLicense.License.Manufacturer" />
      </v-btn>
    </template>
    <v-card>
      <v-card-text>
        <cc-license-panel
          :license="pilotLicense.License"
          ranked
          :rank="pilotLicense.Rank"
        />
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
  },
  data: () => ({
    color: 'primary',
  }),
};
</script>
