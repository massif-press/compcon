<template>
  <editor-base
    :item="location"
    show-description
    :isNew="!!newLocation"
    @exit="$emit('exit')"
    @add-new="saveAsNew($event)"
    @save="save()"
    @delete="deleteItem()"
    @copy="dupe()"
  >
    <v-container slot="builder">
      <v-row dense align="center">
        <v-col>
          <v-text-field v-model="location.Name" label="Name" />
        </v-col>
      </v-row>
    </v-container>
  </editor-base>
</template>

<script lang="ts">
import Vue from 'vue'
import EditorBase from '../_components/EditorBase.vue'
import { getModule } from 'vuex-module-decorators'
import { LocationStore } from '@/store'
import { Location } from '@/classes/campaign/Location'

export default Vue.extend({
  name: 'location-editor',
  components: { EditorBase },
  props: {
    id: { type: String, required: true },
  },
  data: () => ({
    newLocation: null,
  }),
  computed: {
    location() {
      if (this.id === 'new') {
        if (!this.newLocation) this.newLocation = new Location()
        return this.newLocation
      }
      return getModule(LocationStore, this.$store).Locations.find(x => x.ID === this.id)
    },
  },
  methods: {
    exit() {
      this.$set(this, 'newLocation', null)
      this.$emit('exit')
    },
    saveAsNew() {
      const store = getModule(LocationStore, this.$store)
      store.addLocation(this.location)
      this.exit()
    },
    save() {
      const store = getModule(LocationStore, this.$store)
      // TODO: check for and ask to update instances on save
      store.saveLocationData()
      this.$emit('exit')
    },
    deleteItem() {
      this.location.SaveController.delete()
      this.$emit('exit')
    },
    dupe() {
      const store = getModule(LocationStore, this.$store)
      const dupe = Location.Deserialize(Location.Serialize(this.location))
      dupe.RenewID()
      store.addLocation(dupe)
      this.$emit('exit')
    },
  },
})
</script>
