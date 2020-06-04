<template>
  <v-col xs="12" lg="6">
    <v-card outlined>
      <v-card-text class="pa-1">
        <v-row dense align="center">
          <v-col cols="auto" class="mr-2 ml-2">
            <v-avatar color="orange" size="62px">
              <v-img v-if="info.image" :src="info.image" />
              <span v-else class="white--text headline">{{ info.name.substring(0, 1) }}</span>
            </v-avatar>
          </v-col>
          <v-col>
            <div class="heading h2 mb-2 text--text">
              {{ info.name }}
            </div>
            <a v-if="info.website" v-extlink="`${info.website}`">
              <v-icon color="primary">mdi-web</v-icon>
              <span v-if="big">Website</span>
            </a>
            <span v-if="big" class="mx-3">|</span>
            <a v-if="info.twitter" v-extlink="`https://twitter.com/${info.twitter}`">
              <v-icon color="primary">mdi-twitter</v-icon>
              <span v-if="big">@{{ info.twitter }}</span>
            </a>
            <a v-if="info.github" v-extlink="`https://github.com/${info.github}`">
              <v-icon color="primary">mdi-github-circle</v-icon>
              <span v-if="big">{{ info.github }}</span>
            </a>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'dev-badge',
  props: {
    info: {
      type: Object,
      required: true,
    },
    big: { type: Boolean },
  },
})
</script>
