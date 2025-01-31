<template>
  <v-container :class="!mobile && 'px-12'">
    <lcp-subscriptions />
    <author-subscriptions />
  </v-container>
</template>

<script lang="ts">
import AuthorSubscriptions from './_components/authorSubscriptions.vue';
import LcpSubscriptions from './_components/lcpSubscriptions.vue';

export default {
  name: 'cloud-subscriptions',
  components: { LcpSubscriptions, AuthorSubscriptions },
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
  },
};
</script>
