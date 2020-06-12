<template>
  <component :is="componentLoader" v-if="componentLoader" :item="item" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component({ name: 'cc-item-card', })
export default class CCItemCard extends Vue {
  @Prop({ type: Object, required: true})
  readonly item

  get componentLoader() {
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
  }
}
</script>
