<template>
  <v-container fluid>
    <v-row density="compact" align="start">
      <single cols="7" label="BOND" height="30" />
      <v-spacer />
      <v-divider vertical class="mx-2" />
      <v-spacer />
      <single cols="2" label="XP" height="30" />
      <single cols="2" label="STRESS" height="30" />
    </v-row>
    <v-row density="compact" align="start">
      <single cols="6" label="MAJOR IDEAL" height="20" />
      <single cols="6" label="MINOR IDEAL" height="20" />
    </v-row>
    <v-divider class="mt-3 mb-1" />
    <v-row density="compact" align="start">
      <single cols="12" label="MINOR BURDEN" height="50" />
      <single cols="12" label="MINOR BURDEN" height="50" />
      <single cols="12" label="MAJOR BURDEN" height="50" />
    </v-row>
    <v-divider />
    <span class="overline">BOND POWERS</span>
    <v-row no-gutters align="start">
      <single v-for="n in 8" cols="6" label="POWER" height="100" />
      <single cols="6" label="VETERAN POWER" height="100" />
      <single cols="6" label="MASTER POWER" height="100" />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Single from './blanks/Single.vue';

export default {
  name: 'bonds-blank-view',
  components: { Single },
};
</script>

<style scoped>
.no-height {
  line-height: 0;
}

.icon-overlap {
  position: absolute;
  top: -5px;
  left: 1px;
  width: 100%;
  width: -webkit-fill-available;
  width: -moz-available;
  text-align: center;
}

.p-stat {
  font-size: 34px;
}

fieldset {
  padding: 0 4px;
  height: 100%;
  border-radius: 3px;
  border-color: rgb(var(--v-theme-grey-lighten2));
}
</style>
