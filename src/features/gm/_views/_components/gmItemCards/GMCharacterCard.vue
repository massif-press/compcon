<template>
  <v-hover v-slot="{ hover }" style="cursor: pointer">
    <v-card :elevation="hover ? 12 : 0" :outlined="!hover" @click="$emit('open', item.ID)">
      <v-img :aspect-ratio="1" :src="item.Image">
        <v-fade-transition>
          <div
            v-if="hover"
            class="d-flex text-center primary darken-2 v-card--reveal white--text"
            style="height: 100%"
          >
            <v-container>
              <v-row no-gutters v-if="item.Pronouns" class="overline">
                <v-col>{{ item.Pronouns }}</v-col>
              </v-row>
              <v-row no-gutters v-if="item.Alias" :class="big ? 'heading h2' : 'heading h3'">
                <v-col>"{{ item.Alias }}"</v-col>
              </v-row>
              <v-row v-if="item.Alias && item.Title" dense align="center">
                <v-col><v-divider dark /></v-col>
                <v-col cols="auto">
                  <v-icon x- small dark style="opacity: 0.4">mdi-rhombus-outline</v-icon>
                </v-col>
                <v-col><v-divider dark /></v-col>
              </v-row>
              <v-row dense>
                <v-col :class="big ? 'heading h3' : 'font-weight-bold'">{{ item.Title }}</v-col>
              </v-row>
            </v-container>
          </div>
        </v-fade-transition>
      </v-img>
      <v-card-text class="py-2 text-center" style="position: relative">
        <div
          :class="`${big ? 'heading h2' : 'body-text font-weight-bold'} ${
            hover ? 'primary--text' : ''
          }`"
        >
          {{ item.Name }}
        </div>
        <div v-if="big" class="body-text" :class="hover ? 'primary--text' : ''"></div>
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'gm-character-card',
  props: {
    item: { type: Object, required: true },
    big: { type: Boolean },
  },
})
</script>
