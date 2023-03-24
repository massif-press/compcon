<template>
  <div>
    <div class="ma-3">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'pilot-management',
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
</style>
