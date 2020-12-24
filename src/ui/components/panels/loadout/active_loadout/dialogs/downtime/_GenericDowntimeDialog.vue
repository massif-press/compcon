<template>
  <p class="body-text text--text" v-html="action.Detail" />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'item-action-dialog',
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
      this.$refs.base.show()
    },
  },
})
</script>

<style scoped>
table {
  text-align: center;
}

th {
  font-weight: bolder;
}
</style>
