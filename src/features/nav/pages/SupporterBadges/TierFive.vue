<template>
  <v-col cols="12">
    <v-card color="primary">
      <v-card-text class="pa-1">
        <v-row dense>
          <v-col cols="auto" class="mr-2 ml-2">
            <v-avatar color="pilot" size="90px">
              <v-img v-if="info.image" :src="info.image" />
              <v-icon v-else dark size="80">cci-orbital</v-icon>
            </v-avatar>
          </v-col>
          <v-col>
            <div class="heading h2 mb-2 text--text">
              {{ info.name }}
            </div>
            <p
              v-if="info.blurb"
              class="ma-1 pa-2 pl-3 light-panel flavor-text text--text"
              style="border-radius: 4px"
              v-html="info.blurb"
            />
            <div class="text-right mr-3">
              <a v-if="info.website" v-extlink="`${info.website}`">
                <v-icon color="primary">mdi-web</v-icon>
                <span>Website</span>
              </a>
              <a v-if="info.twitter" v-extlink="`https://twitter.com/${info.twitter}`">
                <v-icon color="primary">mdi-twitter</v-icon>
                <span>@{{ info.twitter }}</span>
              </a>
              <a v-if="info.github" v-extlink="`https://github.com/${info.github}`">
                <v-icon color="primary">mdi-github-circle</v-icon>
                <span>{{ info.github }}</span>
              </a>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 't5-badge',
  props: {
    info: {
      type: Object,
      required: true,
    },
  },
})
</script>
