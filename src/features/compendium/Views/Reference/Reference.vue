<template>
  <div class="pt-5">
    <v-tabs v-model="tab" fixed-tabs bg-color="primary" density="compact">
      <v-tab value="0">Action Economy</v-tab>
      <v-tab value="1">Actions</v-tab>
      <v-tab value="2">Statuses & Conditions</v-tab>
      <v-tab value="3">Damage Tables</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item>
        <action-economy :is-modal="isModal" />
      </v-window-item>
      <v-window-item>
        <actions :is-modal="isModal" />
      </v-window-item>
      <v-window-item>
        <statuses :is-modal="isModal" />
      </v-window-item>
      <v-window-item>
        <damage-tables :is-modal="isModal" />
      </v-window-item>
    </v-window>
  </div>
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
