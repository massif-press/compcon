<template>
  <component
    :is="component"
    v-if="component"
    :item="item"
    :active="active"
    @remove-feature="$emit('remove-feature', $event)"
    @add-reaction="$emit('add-reaction', $event)"
    @recalc="$emit('recalc')"
  />
</template>

<script>
export default {
  name: 'cc-npc-item-card',
  props: {
    item: {
      type: Object,
      required: true,
    },
    active: {
      type: Boolean,
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
      return () => import(`./cards/_${this.item.Feature.FeatureType}Card.vue`)
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
