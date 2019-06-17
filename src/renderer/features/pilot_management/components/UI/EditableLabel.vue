<template>
  <div>
    <slot name="label"></slot>
    <v-dialog width="600" v-model="dialog">
      <v-btn
        slot="activator"
        class="edit-btn ma-0 pa-0"
        right
        small
        flat
        icon
        :color="dark ? 'amber accent-3' : 'primary'"
      >
        <v-icon small>edit</v-icon>
      </v-btn>
      <v-card>
        <v-card-title class="headline" primary-title>
          Edit {{ description }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newLabel"
            :label="description"
            :placeholder="placeholder"
            type="text"
            clearable
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn flat @click="dialog = false">Cancel</v-btn>
          <v-spacer />
          <v-btn :disabled="!canSave" color="primary" flat @click="save()">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Pilot, Mech } from '@/class'

export default Vue.extend({
  name: 'editable-label',
  props: {
    pilot: Pilot,
    mech: Mech,
    attr: String,
    description: String,
    placeholder: String,
    dark: Boolean,
  },
  data: () => ({
    dialog: false,
    newLabel: '' as string,
  }),
  computed: {
    canSave(): boolean {
      return (this.newLabel &&
        this.newLabel.length &&
        this.newLabel !== '') as boolean
    },
  },
  methods: {
    save(attr: string) {
      if (this.pilot) this.$set(this.pilot, this.attr, this.newLabel)
      else this.$set(this.mech, this.attr, this.newLabel)
      this.$store.dispatch('saveData')
      this.dialog = false
      this.$emit('on-save')
    },
  },
})
</script>
