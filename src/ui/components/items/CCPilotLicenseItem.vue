<template>
  <cc-modal
    shrink
    :title="`${pilotLicense.License.Source} ${pilotLicense.License.Name}`"
    :icon="`cc:rank_${pilotLicense.Rank}`"
    :color="pilotLicense.License.Manufacturer.Color">
    <template #activator="{ open }">
      <cc-button
        :size="mobile ? 'x-small' : 'small'"
        :prepend-icon="`cc:rank_${pilotLicense.Rank}`"
        color="panel"
        class="text-center"
        block
        @click="open">
        <span class="pr-2">
          {{ pilotLicense.License.Source }}
          {{ pilotLicense.License.Name }}
          {{ 'I'.repeat(pilotLicense.Rank) }}
        </span>
        <template #info>
          <v-icon
            size="x-large"
            :icon="pilotLicense.License.Manufacturer.Icon"
            :color="pilotLicense.License.Manufacturer.GetColor($vuetify.theme.current.dark)" />
        </template>
      </cc-button>
    </template>
    <v-card class="pb-2" flat>
      <v-card-text>
        <cc-license-panel :license="pilotLicense.License" ranked :rank="pilotLicense.Rank" />
      </v-card-text>
    </v-card>
  </cc-modal>
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
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>
