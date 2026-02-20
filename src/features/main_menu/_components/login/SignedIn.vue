<template>
  <cloud-management @set-state="$emit('set-state', $event)" />
</template>

<script lang="ts">
import CloudManagement from '../account/index.vue';
import * as _ from 'lodash-es';

export default {
  name: 'auth-signed-in',
  components: { CloudManagement },
};
</script>
