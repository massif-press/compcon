<template>
  <v-flex xs4>
    <v-card height="100%" :color="reserve.Used ? 'grey lighten-4' : ''">
      <v-toolbar dark flat dense :color="reserve.Used ? 'grey darken-1' : color">
        <v-toolbar-title class="minor-title">{{ reserve.Name }}</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-tooltip top>
            <v-btn flat icon slot="activator">
              <v-icon>mdi-information-outline</v-icon>
            </v-btn>
            <span>{{ reserve.Description }}</span>
          </v-tooltip>
          <v-tooltip top>
            <v-btn flat icon slot="activator" class="fadeSelect" @click="remove">
              <v-icon>delete</v-icon>
            </v-btn>
            <span>Delete Reserve</span>
          </v-tooltip>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text :class="`effect-text pa-2 ma-0 ${reserve.Used ? 'grey--text' : 'color'}`">
        <div v-if="reserve.Type === 'Narrative'">
          <v-text-field v-model.lazy="reserve.ResourceName" :label="reserve.ResourceLabel" />
          <v-textarea v-model.lazy="reserve.Note" auto-grow box rows="1" label="Details" />
        </div>
        <div v-else-if="reserve.Type === 'Mech'">
          <span class="effect-text">{{ reserve.Description }}</span>
        </div>
        <div v-else>
          <div
            v-if="reserve.ID === 'reserve_bombardment' || reserve.ID === 'reserve_extendedharness'"
          >
            <span class="effect-text">{{ reserve.Description }}</span>
            <v-spacer class="pb-4" />
          </div>
          <div v-else>
            <v-text-field v-model.lazy="reserve.ResourceName" :label="reserve.ResourceLabel" />
            <v-textarea v-model.lazy="reserve.Note" auto-grow box rows="1" label="Details" />
          </div>
        </div>
        <v-textarea
          v-model.lazy="reserve.ResourceCost"
          auto-grow
          box
          rows="1"
          label="Cost/Complications (if any)"
          clearable
        />
        <v-checkbox
          v-model="reserve.Used"
          label="Used"
          style="position:absolute; bottom: -18px; right: 8px;"
        />
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script lang="ts">
import Vue from 'vue'
import { ReserveType } from '@/class'
export default Vue.extend({
  name: 'dt-reserve',
  props: {
    reserve: Object,
  },
  computed: {
    color(): string {
      if (this.reserve.Type === ReserveType.Narrative) return 'teal darken-3'
      return this.reserve.Type === ReserveType.Tactical ? 'lime darken-4' : 'deep-orange darken-3'
    },
  },
  methods: {
    remove() {
      this.$emit('remove')
    },
  },
})
</script>
