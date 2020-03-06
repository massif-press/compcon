<template>
  <component
    :is="component"
    v-if="component"
    :effect="effect"
    :inset="inset"
    :transparent="transparent"
    class="mb-1"
  />
</template>

<script>
export default {
  name: 'cc-item-effect-panel-base',
  props: {
    effect: {
      type: Object,
      required: false,
      default: null,
    },
    inset: {
      type: Boolean,
    },
    transparent: {
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
      if (!this.effect) {
        return () => null
      }
      return () => import(`./effects/_Item${this.effect.EffectType}Effect.vue`)
    },
  },
  mounted() {
    this.loader()
      .then(() => {
        this.component = () => this.loader()
      })
      .catch(() => {
        console.error(
          this.effect,
          `Unable to load component: ${this.effect.EffectType || 'generic'} item effect panel`
        )
      })
  },
}
</script>

<style>
.item-panel-inset {
  border: 1px solid;
  border-color: var(--v-primary-base) !important;
  border-radius: 3px;
  background-color: var(--v-light-panel-base) !important;
  width: 96%;
}
</style>
