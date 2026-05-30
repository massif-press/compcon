<template>
  <v-container :class="!mobile && 'px-12'">
    <lcp-subscriptions />
    <author-subscriptions />
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import AuthorSubscriptions from './_components/authorSubscriptions.vue';
import LcpSubscriptions from './_components/lcpSubscriptions.vue';

const _display = useDisplay()

defineOptions({ name: 'cloud-subscriptions' })

const mobile = computed(() => {
      return _display.mdAndDown.value;
    })
</script>
