<template>
  <p class="body-text text-text" v-html="action.Detail" />
</template>

<script lang="ts">
export default {
  name: 'downtime-dialog',
  props: {
    used: { type: Boolean },
    mech: {
      type: Object,
      required: true,
    },
    action: {
      type: Object,
      required: true,
    },
  },
  methods: {
    show(): void {
      (this.$refs.base as any).show();
    },
  },
};
</script>

<style scoped>
table {
  text-align: center;
}

th {
  font-weight: bolder;
}
</style>
