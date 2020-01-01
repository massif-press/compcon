<template>
  <component :is="component" v-if="component" ref="c" @set-filters="$emit('set-filters', $event)" />
</template>

<script>
export default {
  name: 'cc-item-filter',
  props: {
    itemType: {
      type: String,
      required: true,
    },
  },
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
  mounted() {
    this.loader()
      .then(() => {
        this.component = () => this.loader()
      })
      .catch(() => {
        console.error(`Unable to load component ${this.itemType}`)
      })
  },
  methods: {
    clear() {
      this.$refs.c.clear()
    },
  },
}
</script>
