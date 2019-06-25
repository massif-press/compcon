<template>
  <v-textarea
    v-model="note"
    @change="update"
    rows="1"
    auto-grow
    solo
    hide-details
    :dark="!light"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'

export default Vue.extend({
  name: 'item-note',
  props: {
    content: String,
    light: Boolean,
  },
  data: () => ({
    note: '',
  }),
  methods: {
    update(val: string) {
      this.$emit('update', val)
    },
  },
  created() {
    if (this.content) this.note = this.content
  },
})
</script>
