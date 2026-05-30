<template>
  <cloud-management @set-state="$emit('set-state', $event)" />
</template>

<script setup lang="ts">
import CloudManagement from '../account/index.vue';
import * as _ from 'lodash-es';

defineOptions({ name: 'auth-signed-in' })
</script>
