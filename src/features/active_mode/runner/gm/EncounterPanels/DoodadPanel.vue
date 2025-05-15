<template>
  doodad
  {{ doodad }}
</template>

<script>
export default {
  name: 'DoodadPanel',
  props: {
    doodad: {
      type: Object,
      required: true,
    },
  },
};
</script>
