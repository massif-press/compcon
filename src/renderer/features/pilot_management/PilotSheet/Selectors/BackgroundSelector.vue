<template>
  <v-container fluid style="background-color: white">
    <v-layout v-for="bg in backgrounds" :key="bg.id">
      <v-flex>
        <v-card>
          <v-toolbar
            :color="isSelected(bg.id) ? 'primary' : ''"
            dense
            :dark="isSelected(bg.id)"
            flat
          >
            <v-btn
              v-if="!isSelected(bg.id)"
              fab
              bottom
              right
              absolute
              @click="onSelect(bg)"
              style="right: 50px"
              color="primary"
            >
              <v-icon>add</v-icon>
            </v-btn>
            <v-toolbar-title class="headline" dense>
              {{ bg.name }}
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pl-3 pr-3 pt-3 pb-2 m-0">
            <span class="subheading grey--text ml-3 mr-3">
              <b>Example Triggers: {{ bg.triggers }}</b>
            </span>
            <v-divider class="mt-2 mb-2" />
            <p class="fluff-text ml-3 mr-3">{{ bg.description }}</p>
          </v-card-text>
        </v-card>
        <br />
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex>
        <v-card>
          <v-toolbar dense flat>
            <v-btn
              fab
              bottom
              right
              absolute
              @click="customBgDialog = true"
              style="right: 50px"
              color="primary"
            >
              <v-icon>add</v-icon>
            </v-btn>
            <v-dialog width="450" v-model="customBgDialog">
              <v-card>
                <v-card-text class="mb-0 pb-0">
                  <v-text-field
                    v-model="customBg"
                    box
                    label="Enter Custom Pilot Background"
                  />
                </v-card-text>
                <v-divider />
                <v-card-actions>
                  <v-btn flat color="primary" @click="customBgDialog = false">
                    Cancel
                  </v-btn>
                  <v-spacer />
                  <v-btn
                    color="success"
                    :disabled="!customBg.length"
                    @click="onCustom"
                  >
                    Confirm
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-toolbar-title class="headline">
              Custom Pilot Background
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pl-3 pr-3 pt-0 pb-2 m-0">
            <p>&emsp;</p>
          </v-card-text>
        </v-card>
        <br />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Background } from '@/class'

export default Vue.extend({
  name: 'background-selector',
  props: {
    pilot: Object,
  },
  data: () => ({
    backgrounds: [],
    customBgDialog: false,
    customBg: '',
  }),
  methods: {
    isSelected(bgID: string): boolean {
      return this.pilot.Background && this.pilot.Background.id === bgID
    },
    onSelect(bg: Background) {
      this.pilot.Background = bg
      this.$emit('close')
    },
    onCustom() {
      this.customBgDialog = false
      const newBg = {
        id: 'custom_bg',
        name: this.customBg,
        description: '',
        triggers: '',
      }
      this.pilot.Background = new Background(newBg)
      this.$emit('close')
    },
  },
  created() {
    this.backgrounds = this.$store.getters.getItemCollection('Backgrounds')
  },
})
</script>

<style scoped>
.sidebar {
  /* position: fixed; */
  top: 60px;
  left: 15px;
  width: 16.6vw;
  height: 90vh;
  overflow-y: scroll;
}

.customActive {
  color: #0091ea;
  border-left: 5px solid #178ce6;
  padding-left: 5px;
  transition: all 0.5s;
}

.highlight {
  background-color: #0091ea;
}

.menu {
  display: contents;
}

.menu a {
  color: #424242;
}
</style>
