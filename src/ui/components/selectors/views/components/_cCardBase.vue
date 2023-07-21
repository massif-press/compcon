<template>
  <div :style="equipped ? 'opacity: 0.3' : ''">
    <v-row align="center" justify="center" :style="`min-height: ${small ? '100px' : '200px'}`">
      <v-col>
        <div>
          <slot name="top" />
          <div
            v-if="item.Tags && item.Tags.length"
            cols="12"
            :class="`text-center ${small ? '' : 'pb-2 pt-2 my-1'}`"
          >
            <cc-tags :tags="item.Tags" small density="compact" variant="outlined" color="accent" />
          </div>
        </div>
      </v-col>
    </v-row>
    <v-toolbar density="compact" :color="hover ? 'primary lighten-1' : 'primary'" dark>
      <span class="pl-2">
        <div class="text-overline">
          <span v-if="item.Source">{{ item.Source }}&nbsp;</span>
          <slot name="overline" />
        </div>
        <div
          :class="`d-inline ${small ? 'font-weight-bold' : 'heading h3'} ${
            item.IsExotic ? 'text-exotic' : ''
          }`"
          :style="`overflow: hidden; width: ${
            small ? '73vw' : '25vw'
          }; text-overflow: ellipsis; white-space: nowrap;`"
        >
          {{ item.Name }}
        </div>
      </span>
      <v-spacer />
      <v-btn
        icon
        variant="plain"
        class="mr-2"
        :disabled="equipped"
        @click.stop="$emit('equip', item)"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-toolbar>
  </div>
</template>

<script lang="ts">
export default {
  name: 'card-content-base',
  props: {
    item: { type: Object, required: true },
    small: { type: Boolean },
    hover: { type: Boolean },
    equipped: { type: Boolean },
  },
  emits: ['equip'],
};
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
