<template>
  <div>
    <top-bar />
    <div class="wrapper">
      <v-fade-transition leave-absolute>
          <router-view />
      </v-fade-transition>
    </div>    
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import store from '../../store';
  import { mapGetters } from 'vuex'
  import { TopBar } from '@/features/_shared/topbar'

  export default Vue.extend({
    name: 'pilot_management',
    components: { TopBar },
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

