<template>
  deployable
  {{ deployable }}
</template>

<script>
export default {
  name: 'DeployablePanel',
  props: {
    deployable: {
      type: Object,
      required: true,
    },
  },
};
</script>
