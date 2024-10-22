<template>
  <v-container class="px-12">
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
};
</script>
