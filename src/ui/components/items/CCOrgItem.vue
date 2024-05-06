<template>
  <v-col cols="4">
    <v-dialog v-model="dialog" width="60vw">
      <template #activator="{ props }">
        <v-btn size="large" block variant="outlined" color="stark" v-bind="props">
          <v-icon start color="stark">mdi-account-multiple</v-icon>
          {{ org.Name }}
        </v-btn>
      </template>
      <cc-titled-panel :title="org.Name" icon="mdi-account-multiple" color="primary">
        <template #items>
          <v-btn icon variant="plain" color="error" @click="remove()">
            <v-icon icon="mdi-delete" />
          </v-btn>
          <v-btn icon variant="plain" dark @click="dialog = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </template>
        <v-row class="mb-1">
          <v-col cols="6">
            <v-text-field
              v-model="org.Name"
              label="Organization Name"
              variant="outlined"
              hide-details />
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="org.Purpose"
              label="Organization Type"
              :items="orgTypes"
              variant="outlined"
              hide-details />
          </v-col>
        </v-row>
        <v-textarea
          v-model="org.Description"
          label="Purpose, goal, and organization details"
          auto-grow
          rows="2"
          filled
          hide-details />
        <br />
        <v-row dense justify="space-around">
          <v-col cols="auto">
            <v-btn
              icon
              variant="plain"
              :disabled="org.Efficiency === 0"
              @click="org.Efficiency -= 2">
              <v-icon size="large" color="accent" icon="mdi-minus" />
            </v-btn>
          </v-col>
          <v-col class="text-center" cols="auto">
            <div>
              <span class="heading h2 text-accent">+ {{ org.Efficiency }}</span>
              <br />
              <span>
                Organization Efficiency
                <cc-tooltip
                  simple
                  inline
                  content="How directly effective your organization is at what it does (a military
                organization with high efficiency would be good at combat, for example).
                <br />Efficiency can be used to perform activities related to your organization’s
                purpose (science, military, etc). You can use these advantages as
                <strong>reserves.</strong>">
                  <v-icon size="small">mdi-help-circle-outline</v-icon>
                </cc-tooltip>
              </span>
            </div>
          </v-col>
          <v-col cols="auto">
            <v-btn
              icon
              variant="plain"
              :disabled="org.Efficiency === 6"
              @click="org.Efficiency += 2">
              <v-icon size="large" color="accent" icon="mdi-plus" />
            </v-btn>
          </v-col>
          <v-col cols="1" />
          <v-col cols="auto">
            <v-btn icon variant="plain" :disabled="org.Influence === 0" @click="org.Influence -= 2">
              <v-icon size="large" color="accent" icon="mdi-minus" />
            </v-btn>
          </v-col>
          <v-col class="text-center" cols="auto">
            <div>
              <span class="heading h2 text-accent">+ {{ org.Influence }}</span>
              <br />
              <span>
                Organization Influence
                <cc-tooltip
                  simple
                  inline
                  content="Influence is your organization’s size, reach, wealth, and reputation.
                Influence be used to acquire assets, create opportunities, or sway public
                opinion.">
                  <v-icon size="small">mdi-help-circle-outline</v-icon>
                </cc-tooltip>
              </span>
            </div>
          </v-col>
          <v-col cols="auto">
            <v-btn icon variant="plain" :disabled="org.Influence === 6" @click="org.Influence += 2">
              <v-icon size="large" color="accent" icon="mdi-plus" />
            </v-btn>
          </v-col>
        </v-row>
      </cc-titled-panel>
    </v-dialog>
  </v-col>
</template>

<script lang="ts">
import { OrgType } from '@/class';

export default {
  name: 'cc-org-item',
  props: {
    org: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
  }),
  computed: {
    orgTypes() {
      return Object.keys(OrgType)
        .map((k) => OrgType[k as string])
        .sort() as OrgType[];
    },
  },
  methods: {
    remove() {
      this.$emit('remove');
      this.dialog = false;
    },
  },
};
</script>
