<template>
  <cc-sidebar-view>
    <v-list-item
      v-for="(e, i) in bonds"
      slot="sidebar"
      link
      @click="
        $vuetify.goTo(`#e_${e.ID}`, {
          duration: 150,
          easing: 'easeInOutQuad',
          offset: 25,
          container: '.v-dialog--active',
        })
      "
    >
      <v-list-item-title class="heading h3 ml-2">{{
        e.Name
      }}</v-list-item-title>
    </v-list-item>
    <v-container>
      <cc-bond-info
        v-for="(e, i) in bonds"
        :id="`e_${e.ID}`"
        :bond="e"
        class="my-4"
      >
        <div slot="button" class="px-8">
          <v-btn
            color="accent"
            x-large
            block
            class="mt-2 mb-4"
            @click="$emit('set', e)"
          >
            <b>Select {{ e.Name }}</b>
          </v-btn>
        </div>
      </cc-bond-info>
    </v-container>
  </cc-sidebar-view>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';

export default {
  name: 'bond-selector',
  computed: {
    bonds() {
      return CompendiumStore().Bonds;
    },
  },
};
</script>
