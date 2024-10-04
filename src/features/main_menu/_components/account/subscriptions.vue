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
  data: () => ({
    lcpHeaders: [
      { title: 'LCP', key: 'name' },
      { title: 'Latest Update', key: 'last_update' },
      { title: 'Version', key: 'version' },
      { title: 'Auto-Update', key: 'auto', width: '135px' },
    ],
    lcpItems: [
      {
        name: 'TEST LCP 1',
        last_update: '2021-01-01',
        version: '1.0',
        auto: true,
      },
    ],
  }),
};
</script>
