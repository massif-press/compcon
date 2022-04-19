<template>
  <v-card
    tile
    outlined
    :style="`border-color: ${hexColor}`"
    class="light-panel"
    :height="fullHeight ? '100%' : ''"
  >
    <v-toolbar dense :color="item.Color" flat height="30px" class="white--text">
      <span class="heading">
        <item-menu v-if="showMenu" :item="item" />
        <cc-tooltip inline :content="item.FeatureType">
          <v-icon left dark>{{ item.Icon }}</v-icon>
        </cc-tooltip>
        {{ item.Name }}
      </span>
      <v-spacer />
      <div class="overline text-right white--text" style="line-height: 11px !important">
        {{ item.OriginString }}
        <cc-tooltip inline :content="item.LcpName">
          <v-icon small dark>cci-compendium</v-icon>
        </cc-tooltip>
      </div>
    </v-toolbar>
    <cc-item-card :item="item" dense small-tags />
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import ItemMenu from './npc/cards/_ItemMenu.vue'
import GetColorMixin from '@/mixins/getColor'

@Component({ name: 'cc-item-dense-card', components: { ItemMenu } })
export default class CCDenseItemCard extends Mixins(GetColorMixin) {
  @Prop({ type: Object, required: true })
  readonly item

  @Prop({ type: Boolean })
  readonly showMenu
  @Prop({ type: Boolean })
  readonly fullHeight

  get hexColor(): string {
    return this.getColor(this.item.Color, this.$vuetify)
  }
}
</script>
