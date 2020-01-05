<template>
  <div class="modalRoot">
    <v-tabs v-model="tabs" background-color="primary" class="clipped-large" dark>
      <!-- <v-tab>
        Preferences
      </v-tab> -->
      <v-tab>
        Extra Content
      </v-tab>
    </v-tabs>
    <v-card-text>
      <v-tabs-items v-model="tabs">
        <!-- <v-tab-item>
          <preferences />
        </v-tab-item> -->
        <v-tab-item>
          <extra-content />
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </div>
</template>

<script>
import Vue from 'vue'
// import Preferences from './Preferences.vue'
import ExtraContent from './ExtraContent/index.vue'

export default Vue.extend({
  name: 'options-page',
  components: {
    // Preferences,
    ExtraContent,
  },
  data: () => ({
    tabs: null,
  }),
})
</script>

<style scoped>
.modalRoot {
  min-height: 75vh;
}
</style>