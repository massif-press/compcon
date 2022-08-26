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
      TODO: generator w/description, clocks, etc etc
      <v-row dense align="center">
        <v-col cols="auto">
          <v-menu offset-y right>
            <template v-slot:activator="{ on }">
              <v-btn icon color="secondary" class="fadeSelect" v-on="on">
                <v-icon>mdi-dice-multiple</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-list dense>
                <v-list-item @click="''">Line</v-list-item>
                <v-list-item @click="''">System</v-list-item>
                <v-list-item @click="''">Planet</v-list-item>
                <v-list-item @click="''">Area</v-list-item>
                <v-list-item @click="''">Large Settlement</v-list-item>
                <v-list-item @click="''">Small Settlement</v-list-item>
                <v-list-item @click="''">Small Settlement</v-list-item>
                <v-list-item @click="''">Station</v-list-item>
                <v-list-item @click="''">Gate</v-list-item>
                <v-list-item @click="''">Gate</v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </v-col>
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
