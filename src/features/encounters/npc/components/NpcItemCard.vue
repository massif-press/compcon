<template>
  <component
    :is="component"
    v-if="component"
    :item="item"
    @remove-feature="$emit('remove-feature', $event)"
  />
</template>

<script>
export default {
  name: 'npc-item-card',
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
      return () => import(`./cards/${this.item.Feature.FeatureType}Card.vue`)
    },
  },
  mounted() {
    this.loader()
      .then(() => {
        this.component = () => this.loader()
      })
      .catch(() => {
        console.error(`Unable to load component ${this.item.Feature.FeatureType}`)
      })
  },
}
</script>
