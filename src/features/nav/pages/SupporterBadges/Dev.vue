<template>
  <v-col :cols="cols">
    <v-card outlined>
      <v-card-text class="pa-1">
        <v-row align="center">
          <v-col cols="auto" class="mr-2 ml-2">
            <v-avatar color="orange" size="80px">
              <v-img v-if="info.image" :src="info.image" />
              <span v-else class="white--text headline">{{
                info.name.substring(0, 1)
              }}</span>
            </v-avatar>
          </v-col>
          <v-col>
            <div class="heading h2 mb-2 text--text">
              {{ info.name }}
            </div>
            <a v-if="info.website" target="_blank" :href="`${info.website}`">
              <v-icon color="primary">mdi-web</v-icon>
              <span>Website</span>
            </a>
            <span v-if="info.website" class="mx-3">|</span>
            <a
              v-if="info.twitter"
              target="_blank"
              :href="`https://twitter.com/${info.twitter}`"
            >
              <v-icon color="primary">mdi-twitter</v-icon>
              <span>@{{ info.twitter }}</span>
            </a>
            <a
              v-if="info.github"
              target="_blank"
              :href="`https://github.com/${info.github}`"
            >
              <v-icon color="primary">mdi-github-circle</v-icon>
              <span>{{ info.github }}</span>
            </a>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts">
export default {
  name: 'dev-badge',
  props: {
    info: {
      type: Object,
      required: true,
    },
    cols: { type: Number, default: 6 },
  },
};
</script>

<style scoped>
a {
  text-decoration: none !important;
}
</style>
