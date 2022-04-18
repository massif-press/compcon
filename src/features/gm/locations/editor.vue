<template>
  <editor-base :item="location" :new="id === 'new'" @exit="$router.push('/gm/locations')">
    <v-row dense align="center">
      <v-col cols="12">
        <v-text-field v-model="location.Name" label="Name" />
      </v-col>
      <v-col cols="12">
        <v-textarea
          v-model="location.Description"
          label="Description"
          hint="A brief description of this location"
          outlined
          auto-grow
          rows="3"
        />
      </v-col>
    </v-row>
  </editor-base>
</template>

<script lang="ts">
import { Location } from '@/classes/campaign/Location'
import Vue from 'vue'
import EditorBase from '../_components/EditorBase.vue'

export default Vue.extend({
  name: 'location-editor',
  components: { EditorBase },
  props: {
    id: { type: String, required: true },
  },
  data: () => ({
    location: null,
  }),
  created() {
    this.mountLocation()
  },
  watch: {
    id() {
      this.mountLocation()
    },
  },
  methods: {
    mountLocation() {
      if (this.id === 'new') this.location = new Location()
      else this.location = this.$store.getters['location/getLocations'].find(x => x.ID === this.id)
    },
  },
})
</script>
