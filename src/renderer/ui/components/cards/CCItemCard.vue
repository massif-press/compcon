<template>
  <component :is="component" v-if="component" :item="item" />
</template>

<script>
export default {
  name: 'cc-item-card',
  props: {
    item: {
      type: Object,
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
      if (!this.item) {
        return null
      }
      return () => import(`./_${this.item.ItemType}Card.vue`)
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
