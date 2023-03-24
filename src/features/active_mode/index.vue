<template>
  <div class="wrapper">
    <router-view />
  </div>
</template>

<script lang="ts">
export default {
  name: 'encounter-toolkit',
};
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
  width: 100%;
  margin-top: 48px;
}
</style>
