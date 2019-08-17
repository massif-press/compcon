<template>
  <v-container fluid px-5>
    <h1 class="heading">MANUFACTURERS</h1>
    <v-tabs
      vertical
      background-color="primary"
      :slider-size="12"
      slider-color="active"
      icons-and-text
    >
      <v-tab v-for="m in manufacturers" :key="m.id" ripple>
        <v-icon large>cci-orbit</v-icon>
        {{ m.id }}
      </v-tab>
      <v-tab-item v-for="m in manufacturers" :key="m.id + 'desc'">
        <v-card flat class="px-3 py-3">
          <v-card-title class="heading mech pb-4">{{ m.name }}</v-card-title>
          <v-card-text class="mt-1 ml-2 pr-4 pt-0">
            <div class="border" style="float: right; margin-left: 20px">
              <v-img src="https://via.placeholder.com/450" />
            </div>
            <blockquote class="quote-block fluff-text grey--text text--darken-4" v-html="m.quote" />
            <v-divider class="ma-2" />
            <p class="body-text black--text" v-html="m.description" />
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'manufacturers',
  data: () => ({
    tabModel: 0,
    manufacturers: {},
  }),
  created() {
    this.manufacturers = this.$store.getters.getItemCollection('Manufacturers')
  },
})
</script>

<style scoped>
.quote-block {
  border-left: 10px solid var(--v-panel-base);
  padding-left: 6px;
  padding-top: 4px;
}
</style>