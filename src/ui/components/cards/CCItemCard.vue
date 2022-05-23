<template>
  <component
    :is="componentLoader"
    v-if="componentLoader"
    :item="item"
    :notes="notes"
    :smallTags="smallTags"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component({ name: 'cc-item-card' })
export default class CCItemCard extends Vue {
  @Prop({ type: Object, required: true })
  readonly item

  @Prop({ type: Boolean })
  readonly notes

  @Prop({ type: Boolean })
  readonly smallTags

  get componentLoader(): any {
    if (!this.item) {
      return null
    }
    return () => {
      try {
        const t = this.item.ItemType ? this.item.ItemType : `Npc${this.item.type}`
        return import(`./_${t}Card.vue`)
      } catch (error) {
        console.error(`Unable to load component ${this.item.ItemType}`)
        return null
      }
    }
  }
}
</script>
