<template>
  <component
    :is="component"
    v-if="action && component"
    :action="action"
    :inset="inset"
    :transparent="transparent"
    :print="print"
  />
</template>

<script>
export default {
  name: 'cc-item-action-wrapper',
  props: {
    action: {
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
  },
  data() {
    return {
      component: null,
    }
  },
  computed: {
    loader() {
      if (!this.action) {
        return () => null
      }
      const n = this.action.activation.replace(/\s+/g, '')
      return () => import(`./actions/_Item${n}Action.vue`)
    },
  },
  mounted() {
    if (this.action) {
      this.loader()
        .then(() => {
          this.component = () => this.loader()
        })
        .catch(() => {
          console.error(
            this.action,
            `Unable to load component: ${this.action.activation || 'generic'} item action panel`
          )
        })
    }
  },
}
</script>
