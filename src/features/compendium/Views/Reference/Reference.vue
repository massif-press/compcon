<template>
  <v-container>
    <h1 class="heading h1 ml-5">Quick Reference</h1>
    <v-tabs v-model="tab" fixed-tabs color="accent">
      <v-tab value="0">Action Economy</v-tab>
      <v-tab value="1">Damage Tables</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item>
        <action-economy :is-modal="isModal" />
      </v-window-item>
      <v-window-item>
        <damage-tables :is-modal="isModal" />
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script lang="ts">
import ActionEconomy from './qr_pages/ActionEconomy.vue';
import DamageTables from './qr_pages/DamageTables.vue';

export default {
  name: 'reference',
  props: {
    isModal: {
      type: Boolean,
    },
    preScroll: {
      type: String,
      default: '',
    },
  },
  components: {
    ActionEconomy,
    DamageTables,
  },
  mounted() {
    if (this.preScroll) {
      this.$nextTick(() => {
        const el = document.getElementById(this.preScroll);
        if (el) {
          el.scrollIntoView();
        }
      });
    }
  },
  data: () => ({
    tab: '0',
  }),
};
</script>
