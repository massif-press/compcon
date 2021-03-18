<template>
  <div>
    <v-row
      no-gutters
      align="center"
      justify="center"
      :style="`min-height: ${small ? '100px' : '200px'}`"
    >
      <v-col>
        <div>
          <slot name="top" />
          <div
            v-if="item.Tags && item.Tags.length"
            cols="12"
            :class="`text-center ${small ? '' : 'pb-2 pt-2 my-1'}`"
          >
            <cc-tags :tags="item.Tags" small dense outlined color="accent" />
          </div>
        </div>
      </v-col>
    </v-row>
    <v-toolbar dense :color="hover ? 'primary lighten-1' : 'primary'" dark>
      <span>
        <div class="overline mb-n2">
          <span v-if="item.Source">{{ item.Source }}</span>
          <slot name="overline" />
        </div>
        <div
          :class="
            `d-inline ${small ? 'font-weight-bold' : 'heading h3'} ${
              item.IsExotic ? 'exotic--text' : ''
            }`
          "
          :style="
            `overflow: hidden; width: ${
              small ? '73vw' : '25vw'
            }; text-overflow: ellipsis; white-space: nowrap;`
          "
        >
          {{ item.Name }}
        </div>
      </span>
      <v-spacer />
      <v-btn icon large dark class="mr-2" @click.stop="$emit('equip', item)">
        <v-icon large>mdi-plus</v-icon>
      </v-btn>
    </v-toolbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'card-content-base',
  props: {
    item: { type: Object, required: true },
    small: { type: Boolean },
    hover: { type: Boolean },
  },
})
</script>

<style scoped>
.card-effect {
  height: 75px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;

  -webkit-line-clamp: 3;
}
</style>
