<template>
  <component :is="componentLoader" v-if="componentLoader" :item="item" />
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
    componentLoader() {
      if (!this.item) {
        return null
      }
      return () => {
        try {
          return import(`./_${this.item.ItemType}Card.vue`)
        } catch (error) {
          console.error(`Unable to load component ${this.item.ItemType}`)
          return null
        }
      }
    },
  },
}
</script>
