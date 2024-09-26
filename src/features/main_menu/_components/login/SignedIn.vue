<template>
  <cloud-management @set-state="$emit('set-state', $event)" />
</template>

<script lang="ts">
import CloudManagement from '../account/index.vue';
import _ from 'lodash';

export default {
  name: 'auth-signed-in',
  components: { CloudManagement },
};
</script>
