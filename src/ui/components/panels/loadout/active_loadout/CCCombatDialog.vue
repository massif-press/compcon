<template>
  <component :is="component" v-if="component" ref="c" :mech="mech" />
</template>

<script lang="ts">
import Vue from 'vue'

function toTitleCase(str): string {
  str = str.toLowerCase().split(' ')
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1)
  }
  return str.join('')
}

export default Vue.extend({
  name: 'cc-combat-dialog',
  props: {
    action: {
      type: Object,
      required: true,
    },
    mech: {
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
      if (!this.action) {
        return null
      }
      const name = toTitleCase(this.action.Name)
      return () => import(`./dialogs/_${name}Dialog.vue`)
    },
  },
  mounted() {
    this.loader()
      .then(() => {
        this.component = () => this.loader()
      })
      .catch(() => {
        console.error(`Unable to load component ./dialogs/_${toTitleCase(this.action.Name)}Dialog`)
      })
  },
  methods: {
    show() {
      this.$refs.c.show()
    },
  },
})
</script>
