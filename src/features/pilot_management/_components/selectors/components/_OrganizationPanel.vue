<template>
  <v-row justify="center">
    <v-col>
      <cc-titled-panel
        title="New Organization"
        icon="mdi-account-group"
        color="reserve--organization darken-2"
      >
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="orgName"
              color="accent"
              label="Name"
              variant="outlined"
              hide-details
            />
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="orgType"
              label="Type"
              color="accent"
              :items="orgTypes"
              variant="outlined"
              hide-details
            />
          </v-col>
        </v-row>
        <v-textarea
          v-model="orgDetails"
          label="Purpose, goal, and organization details"
          color="accent"
          auto-grow
          rows="2"
          filled
          hide-details
          class="mt-2"
        />
        <br />
        <span class="heading h4">Start with:</span>
        <v-row justify="center" class="mx-4 py-1">
          <v-col class="text-center">
            <v-btn
              v-if="!orgStart"
              block
              variant="outlined"
              color="secondary"
              @click="orgStart = 'efficiency'"
            >
              Efficiency
              <cc-tooltip
                simple
                inline
                content="How directly effective your organization is at what it does (a military
                organization with high efficiency would be good at combat, for example).
                <br />Efficiency can be used to perform activities related to your organization’s
                purpose (science, military, etc). You can use these advantages as
                <strong>reserves.</strong>"
              >
                <v-icon size="small" end>mdi-help-circle-outline</v-icon>
              </cc-tooltip>
            </v-btn>
            <div v-else>
              <span class="heading h3">+ {{ orgStart === 'efficiency' ? '2' : '0' }}</span>
              <br />
              <span>Organization Efficiency</span>
            </div>
          </v-col>
          <v-divider v-show="$vuetify.display.mdAndUp" vertical class="mx-5" />
          <v-col cols="12" md="" class="text-center">
            <v-btn
              v-if="!orgStart"
              block
              variant="outlined"
              color="secondary"
              @click="orgStart = 'influence'"
            >
              Influence
              <cc-tooltip
                simple
                inline
                content="Influence is your organization’s size, reach, wealth, and reputation.
                Influence be used to acquire assets, create opportunities, or sway public
                opinion."
              >
                <v-icon size="small" end>mdi-help-circle-outline</v-icon>
              </cc-tooltip>
            </v-btn>
            <div v-else>
              <span class="heading h3">+ {{ orgStart === 'influence' ? '2' : '0' }}</span>
              <br />
              <span>Organization Influence</span>
            </div>
          </v-col>
        </v-row>
        <br />
        <v-btn
          block
          tile
          large
          class="mb-2 mt-n2"
          color="primary"
          :disabled="!orgName || !orgType || !orgStart"
          @click="add()"
        >
          <v-icon start>mdi-plus</v-icon>
          Add Organization
        </v-btn>
      </cc-titled-panel>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Organization, OrgType } from '@/class';

export default {
  name: 'custom-reserve-panel',
  data: () => ({
    orgName: '',
    orgType: '' as any,
    orgStart: '',
    orgDetails: '',
  }),
  computed: {
    orgTypes() {
      return Object.keys(OrgType)
        .map((k) => OrgType[k as string])
        .sort() as OrgType[];
    },
  },
  methods: {
    add() {
      const o = new Organization({
        name: this.orgName,
        purpose: this.orgType,
        efficiency: this.orgStart === 'efficiency' ? 2 : 0,
        influence: this.orgStart === 'influence' ? 2 : 0,
        description: this.orgDetails,
        actions: '',
      });
      this.clear();
      this.$emit('add', o);
    },
    clear() {
      this.orgName = '';
      this.orgType = '';
      this.orgStart = '';
      this.orgDetails = '';
    },
  },
};
</script>
