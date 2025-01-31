<template>
  <v-col cols="12" md="">
    <v-card variant="tonal">
      <v-card-text>
        <v-row align="center">
          <v-col cols="auto">
            <v-avatar size="80px">
              <v-img v-if="info.image" :src="info.image" />
              <span
                v-else
                class="text-white heading"
                :style="`font-size: ${mobile ? '12vw' : '3.5vw'}`">
                {{ info.name.split(' ')[0].substring(0, 1)
                }}{{ info.name.split(' ')[1].substring(0, 1) }}
              </span>
            </v-avatar>
          </v-col>
          <v-col>
            <div class="heading h2 mb-1" :style="`font-size: ${mobile ? '4vw' : '1.5vw'}`">
              {{ info.name }}
            </div>
            <a v-if="info.website" target="_blank" :href="`${info.website}`">
              <v-icon start color="primary" icon="mdi-web" />
              <span>Website</span>
            </a>
            <span v-if="info.twitter && info.website" class="mx-3">|</span>
            <a v-if="info.twitter" target="_blank" :href="`https://twitter.com/${info.twitter}`">
              <v-icon start color="primary" icon="mdi-twitter" />
              <span>@{{ info.twitter }}</span>
            </a>
            <span v-if="info.website && info.github" class="mx-3">|</span>
            <a v-if="info.github" target="_blank" :href="`https://github.com/${info.github}`">
              <v-icon start color="primary" icon="mdi-github" />
              <span>GitHub</span>
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
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none !important;
}
</style>
