<template>
  <v-col xs6>
    <v-card height="100%">
      <v-toolbar dark flat dense color="deep-purple">
        <v-toolbar-title class="minor-title">{{ org.Name }}</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-tooltip top>
            <v-btn flat icon slot="activator" class="fadeSelect" @click="remove">
              <v-icon>delete</v-icon>
            </v-btn>
            <span>Delete Organization</span>
          </v-tooltip>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text :class="`effect-text pa-2 ma-0 ${org.Used ? 'grey--text' : 'color'}`">
        <v-select
          v-model="org.Purpose"
          label="Organization Type"
          :items="orgTypes"
          outline
          hide-details
        />
        <v-text-field v-model="org.Name" label="Organization Name" />
        <v-textarea
          v-model="org.Description"
          auto-grow
          rows="1"
          label="Purpose, goal, and orginaztion details"
          box
        />
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
import { OrgType } from '@/class'
export default Vue.extend({
  name: 'dt-organization',
  props: {
    org: Object,
  },
  computed: {
    orgTypes() {
      return Object.keys(OrgType)
        .map(k => OrgType[k as any])
        .sort() as OrgType[]
    },
  },
  methods: {
    remove() {
      this.$emit('remove')
    },
  },
})
</script>
