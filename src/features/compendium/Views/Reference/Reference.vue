<template>
  <div style="position: absolute; top: 0; left: 0; right: 0; height: 45px" class="bg-primary" />
  <cc-tabs v-model="tab" fixed-tabs bg-color="primary" density="compact">
    <template #tabs>
      <v-tab>Action Economy</v-tab>
      <v-tab>Actions</v-tab>
      <v-tab>Statuses & Conditions</v-tab>
      <v-tab>Damage Tables</v-tab>
    </template>
    <action-economy :is-modal="isModal" />
    <v-window-item>
      <actions :is-modal="isModal" />
    </v-window-item>
    <v-window-item>
      <statuses :is-modal="isModal" />
    </v-window-item>
    <v-window-item>
      <damage-tables :is-modal="isModal" />
    </v-window-item>
  </cc-tabs>
</template>

<script lang="ts">
import ActionEconomy from './qr_pages/ActionEconomy.vue';
import Actions from './qr_pages/Actions.vue';
import DamageTables from './qr_pages/DamageTables.vue';
import Statuses from './qr_pages/Statuses.vue';

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
    Actions,
    Statuses,
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
