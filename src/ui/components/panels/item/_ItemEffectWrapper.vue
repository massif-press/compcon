<template>
  <component
    :is="component"
    v-if="effect && component"
    :effect="effect"
    :inset="inset"
    :transparent="transparent"
    :print="print"
    :limited-bonus="limitedBonus"
  />
</template>

<script>
export default {
  name: 'cc-item-action-wrapper',
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
    print: {
      type: Boolean,
    },
    limitedBonus: {
      type: Number,
      required: false,
      default: 0,
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
    if (this.effect) {
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
    }
  },
}
</script>
