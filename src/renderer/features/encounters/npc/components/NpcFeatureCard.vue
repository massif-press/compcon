<template>
  <component :is="component" v-if="component" :item="item" readonly />
</template>

<script>
export default {
  name: 'npc-feature-card',
  props: {
    feature: {
      type: Object,
      required: true,
    },
    tier: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      component: null,
    }
  },
  computed: {
    item() {
      return {
        Feature: this.feature,
        Tier: this.tier,
      }
    },
    loader() {
      if (!this.feature) {
        return null
      }
      return () => import(`./cards/${this.feature.FeatureType}Card.vue`)
    },
  },
  mounted() {
    this.loader()
      .then(() => {
        this.component = () => this.loader()
      })
      .catch(() => {
        console.error(`Unable to load component ${this.feature.FeatureType}`)
      })
  },
}
</script>
