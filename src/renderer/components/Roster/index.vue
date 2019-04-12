<template>
  <div>
    <top-bar />
    <div class="wrapper">
      <v-fade-transition leave-absolute>
          <router-view class="pt-5 mt-2" />
      </v-fade-transition>
    </div>    
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { TopBar } from '@/components/UI'
  import { mapGetters } from 'vuex'

  export default Vue.extend({
    name: 'roster',
    components: { TopBar },
    computed: {
      ...mapGetters({ pilots: 'getAllPilots' }),
    },
    created() {
      this.$store.dispatch('setDatapath', Vue.prototype.userDataPath)
      this.$store.dispatch('loadAllPilots')
      this.$store.dispatch('loadData')
      this.$store.dispatch('loadBrews')
      this.$store.dispatch('buildLicenses')
    },
  })
</script>

<style scoped>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { 
    overflow: hidden;
  }

  .wrapper {
    display: flex;
    width: 100%;
  }
</style>

