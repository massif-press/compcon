<template>
  <component ref="c" :is="component" v-if="component" @set-filters="$emit('set-filters', $event)" />
</template>

<script>
export default {
  name: 'cc-item-filter',
  props: ['itemType'],
  data() {
    return {
      component: null,
    }
  },
  computed: {
    loader() {
      if (!this.itemType) {
        return null
      }
      return () => import(`./_${this.itemType}Filter.vue`)
    },
  },
  methods: {
    clear() {
      this.$refs.c.clear()
    },
  },
  mounted() {
    this.loader()
      .then(() => {
        this.component = () => this.loader()
      })
      .catch(() => {
        console.error(`Unable to load component ${this.itemType}`)
      })
  },
}
</script>
