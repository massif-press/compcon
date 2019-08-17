<template>
  <component :is="component" :item="item" v-if="component" />
</template>

<script>
export default {
  name: 'cc-item-card',
  props: ['item', 'type'],
  data() {
    return {
      component: null,
    }
  },
  computed: {
    loader() {
      if (!this.item) {
        return null
      }
      return () => import(`./CC${this.item.ItemType}Card.vue`)
    },
  },
  mounted() {
    this.loader()
      .then(() => {
        this.component = () => this.loader()
      })
      .catch(() => {
        console.error(`Unable to load component ${this.item.ItemType}`)
      })
  },
}
</script>